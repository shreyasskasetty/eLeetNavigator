
class Recommendation:
    def __init__(self, title:str, recommendation_list) -> None:
        self.title = title
        self.recommendation_list = recommendation_list
    
    def getDict(self):
        map = {}
        map['title'] =self.title
        map['list'] = self.recommendation_list
        return map