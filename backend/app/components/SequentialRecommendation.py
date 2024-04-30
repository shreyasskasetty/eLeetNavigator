from app.components.Recommendation_Interface import RecommendationService
from app.models.recommendation_model import Recommendation
from recbole.model.sequential_recommender import SASRec
from flask import current_app
import torch
from recbole.config import Config
from recbole.data import create_dataset
from pandas import pandas as pd
import numpy as np


config_dict = {  # Ensure this path is accessible from the script's run location
    'dataset': 'processed_user_problems_with_features',
    'data_path': 'app/resources/dataset',
    'USER_ID_FIELD': 'user_id',  # Ensure these fields are named as they appear in your data files
    'ITEM_ID_FIELD': 'item_id',
    'TIME_FIELD': 'timestamp',
    'MAX_ITEM_LIST_LENGTH': 15,  # Adjust based on your maximum sequence length
    'epochs': 10,
    'learning_rate': 1e-3,
    'train_batch_size': 128,
    'eval_batch_size': 256,
    'state': 'INFO',
    'show_progress': True,
    'eval_at_step': 10, 
    'save_dataset': True,
    'load_col': {
        'inter': ['user_id', 'item_id', 'timestamp'],
    },
    'train_neg_sample_args': None
}


class SequentialRecommendation(RecommendationService):
    def __init__(self, last_n = 6):
        config = Config(model='SASRec', config_dict=config_dict)
        with current_app.app_context():
            self.dataset = create_dataset(config)
            self.model = SASRec(config, self.dataset).to(config['device'])
            checkpoint = torch.load('app/resources/SASRec-Apr-29-2024_19-18-19.pth')
        
        self.model.load_state_dict(checkpoint['state_dict'])
        self.model.eval()
        self.item_list = np.loadtxt('app/resources/sasrec_item_list.txt', dtype=str)
        self.n = last_n

    def recommend_based_on_sequence(self, item_sequence, user_id, top_k):
        self.model.eval()  # Set model to evaluation mode

        # Convert item IDs in the sequence to the model's internal indices
        sequence = []
        for item in item_sequence:
            if item in self.item_list:
                sequence.append(item)

        if not sequence:
            return []
        sequence = sequence[::-1]
        print('sas rec', sequence)
        item_indices = [self.dataset.token2id(self.dataset.iid_field, item) for item in sequence]

        # Create a batch where the sequence is repeated (batch size of 1)
        sequence_tensor = torch.tensor([item_indices], dtype=torch.long, device=self.model.device)

        # Prepare user tensor if the model uses it
        user_tensor = torch.tensor([self.dataset.token2id(self.dataset.uid_field, user_id)], dtype=torch.long, device=self.model.device)

        with torch.no_grad():
            interaction = {
                'user_id': user_tensor,
                'item_seq': sequence_tensor,
                'item_length': torch.tensor([len(item_indices)], dtype=torch.long, device=self.model.device),
                'item_id_list': sequence_tensor  # Assuming this is the expected key
            }
            scores = self.model.full_sort_predict(interaction)

        # Get top-k items
        _, topk_indices = torch.topk(scores, k=top_k, largest=True, sorted=True)
        topk_indices = topk_indices.cpu().numpy().flatten()

        # Convert indices back to item IDs
        topk_item_ids = [self.dataset.id2token(self.dataset.iid_field, idx) for idx in topk_indices]

        return topk_item_ids
    
    def get_latest_n_prob_id(self, user_info)->str:
        if not user_info or len(user_info.history) == 0:
            return None
    
        most_recent_history = sorted(user_info.history, key=lambda x: x.last_update, reverse=True)
        max_size = min(self.n, len(most_recent_history))
        return [prob.problem_id for prob in most_recent_history[:max_size]]


    def get_recommendation(self, user_info: str, limit=10)->Recommendation:
        latest_n_prob_id = self.get_latest_n_prob_id(user_info)
        # recom_list = self.get_nlargest(latest_n_prob_id, user_info, limit)
        recom_list = self.recommend_based_on_sequence(latest_n_prob_id, user_info.username, 3)
        if not recom_list:
            return None
        return Recommendation(f"Next challenge for you", recom_list[-2:])

