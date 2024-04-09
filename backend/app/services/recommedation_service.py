from app.models.recommendation_model import Recommendation
from app.services.user_info_service import get_user_info_exists

from flask import current_app

def get_recommendation(username: str, limit=10):
    if not username:
        return "Invalid UserName", 400
    
    exist, user_info = get_user_info_exists(username)
    if not exist:
        return "Username doesn't exist in our records", 400
        
    results = []
    recom_list = current_app.config["recom_list"]
    for rl in recom_list:
        recom = rl.get_recommendation(user_info)
        if recom:
            results.append(recom.getDict())

    return results, 200