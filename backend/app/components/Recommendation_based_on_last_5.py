from app.components.Recommendation_Interface import RecommendationService
from app.models.recommendation_model import Recommendation
from flask import current_app

from pandas import pandas as pd

class BasedOnLastNProblems(RecommendationService):
    def __init__(self, last_n = 6):
        self.df = pd.read_csv(current_app.open_resource('resources/content-similarity.csv')).set_index('Unnamed: 0')
        self.n = last_n

    def has_solved_before(self, prob_id, user_history):
        history = [element for element in user_history if element.problem_id == prob_id]
        if not history:
            return False
        
        print(history[0].problem_id)
        return any(element.accepted for element in history[0].problem_log)

    def get_nlargest(self, prob_ids, user_info ,limit):
        if len(prob_ids) == 0:
            return []
        i = 0
        count = 0
        while i < len(prob_ids):
            if prob_ids[i] in self.df:
                average_cos_sim = self.df[prob_ids[i]]
                count = 1
                break
            i += 1

        if count == 0:
            return []
        
        for j in range(i, len(prob_ids)):
            if prob_ids[j] in self.df:
                average_cos_sim += self.df[prob_ids[j]]
                count += 1
            
        average_cos_sim /= count

        largest_list = average_cos_sim.nlargest(100)
        result_list = []
        for index, _ in largest_list.items():
            if len(result_list) >= limit:
                break
            if index in prob_ids:
                continue
            
            if self.has_solved_before(index, user_info.history):
                continue

            result_list.append(index)
        return result_list
    
    def get_latest_n_prob_id(self, user_info)->str:
        if not user_info or len(user_info.history) == 0:
            return None
    
        most_recent_history = sorted(user_info.history, key=lambda x: x.last_update, reverse=True)
        max_size = min(self.n, len(most_recent_history))
        return [prob.problem_id for prob in most_recent_history[:max_size]]


    def get_recommendation(self, user_info: str, limit=10)->Recommendation:
        latest_n_prob_id = self.get_latest_n_prob_id(user_info)
        print("Max Prob is: ", latest_n_prob_id)
        recom_list = self.get_nlargest(latest_n_prob_id, user_info, limit)
        if not recom_list:
            return None
        return Recommendation(f"Problems similar to last {self.n - 1} solved problems", recom_list)

