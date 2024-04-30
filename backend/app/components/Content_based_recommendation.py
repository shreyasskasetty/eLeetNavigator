import os
from app.components.Recommendation_Interface import RecommendationService
from app.models.recommendation_model import Recommendation
from app.utilities.utils import to_title_case

from flask import current_app

from pandas import pandas as pd

class ContentBased(RecommendationService):
    def __init__(self):
        self.df = pd.read_csv(current_app.open_resource('resources/content-similarity.csv')).set_index('Unnamed: 0')
        pass

    def has_solved_before(self, prob_id, user_history):
        history = [element for element in user_history if element.problem_id == prob_id]
        if not history:
            return False
        
        return any(element.accepted for element in history[0].problem_log)

    def get_nlargest(self, prob_id , user_info ,limit):
        largest_list = self.df[prob_id].nlargest(100)
        result_list = []
        for index, _ in largest_list.items():
            if len(result_list) >= limit:
                break
            if prob_id == index:
                continue
            
            if self.has_solved_before(index, user_info.history):
                continue

            result_list.append(index)
        return result_list
    
    def get_latest_prob_id(self, user_info)->str:
        if not user_info or len(user_info.history) == 0:
            return None
    
        solved_problems = [prob for prob in user_info.history if 
                           any(log.accepted for log in prob.problem_log)]
        if not solved_problems:
            return None
        most_recent_history = max(solved_problems, key=lambda x: x.last_update)
        return most_recent_history.problem_id


    def get_recommendation(self, user_info: str, limit=10)->Recommendation:
        latest_prob_id = self.get_latest_prob_id(user_info)
        print("Content Based", latest_prob_id)
        if not latest_prob_id:
            return None
        recom_list = self.get_nlargest(latest_prob_id, user_info, limit)
        if not recom_list:
            return None
        return Recommendation(f"Problems similar to {to_title_case(latest_prob_id)}", recom_list)

