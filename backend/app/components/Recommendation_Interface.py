from abc import ABC, abstractmethod
from app.models.recommendation_model import Recommendation

class RecommendationService(ABC):
    @abstractmethod
    def get_recommendation(self, username: str)->Recommendation:
        pass