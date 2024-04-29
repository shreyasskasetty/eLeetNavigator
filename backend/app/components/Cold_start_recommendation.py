import os
from app.components.Recommendation_Interface import RecommendationService
from app.models.recommendation_model import Recommendation

from pandas import pandas as pd

class ColdStartRecommendation(RecommendationService):


    def get_recommendation(self, user_info: str, limit=10)->Recommendation:
        recom_list = ['two-sum' , 'merge-sorted-array', 'trapping-rain-water', 'number-of-islands', 'longest-palindromic-substring', 'longest-common-prefix']
        return Recommendation(f"Popular problems you might be interested to solve", recom_list)

