from app.components.Recommendation_Interface import RecommendationService
from app.models.recommendation_model import Recommendation
from flask import current_app

from pandas import pandas as pd

class PopularityRecommendation(RecommendationService):
    def __init__(self, last_n = 6):
        self.df = pd.read_csv(current_app.open_resource('resources/problem-dataset-with-11-cluster.csv')).set_index('name')
        self.n = last_n

    def has_solved_before(self, prob_id, user_history):
        history = [element for element in user_history if element.problem_id == prob_id]
        if not history:
            return False
        
        print(history[0].problem_id)
        return any(element.accepted for element in history[0].problem_log)
    
    def predict(self, seqs):
        suggest = None

        for prob in seqs:
            if prob not in self.df.index: continue 
            
            cluster_no = self.df['cluster']
            if suggest is None:
                suggest = abs(self.df[self.df['cluster'] == cluster_no]['difficulty_score'] - self.df.loc[prob]['difficulty_score'])
            else:
                # suggest = suggest.append(abs(self.df[self.df['cluster'] == cluster_no]['difficulty_score'] - self.df.loc[prob]['difficulty_score']))
                suggest = pd.concat([suggest,abs(self.df[self.df['cluster'] == cluster_no]['difficulty_score'] - self.df.loc[prob]['difficulty_score'])])
                
        if suggest is None:
            return []
        
        suggest = suggest.sort_values()
        return suggest.index.values

    def get_nlargest(self, prob_ids, user_info ,limit):
        if len(prob_ids) == 0:
            return []
        
        next_suggestion = self.predict(prob_ids)
        results = []
        if len(next_suggestion) == 0:
            return results
        
        for prob in next_suggestion:
            if prob in prob_ids: continue
            if self.has_solved_before(prob, user_info.history): continue
            if len(results) >= limit: break

            results.append(prob)

        return results
    
    def get_latest_n_prob_id(self, user_info)->str:
        if not user_info or len(user_info.history) == 0:
            return None
    
        most_recent_history = sorted(user_info.history, key=lambda x: x.last_update, reverse=True)
        max_size = min(self.n, len(most_recent_history))
        return [prob.problem_id for prob in most_recent_history[:max_size]]
    def get_topic_cluster(self, latest_n_prob_id):
        topic_cluster = {}
        for prob in latest_n_prob_id:
            try:
                cluster = self.df.loc[prob]['cluster']
                if cluster not in topic_cluster:
                    topic_cluster[cluster] = 0
                topic_cluster[cluster] += 1
            except:
                pass
        maxCount = -1
        maxKey = None
        for key in topic_cluster:
            if topic_cluster[key] > maxCount:
                maxKey = key
                maxCount = topic_cluster[key]
        
        return maxKey
    def get_popular_problems(self, topic_cluster):
        dataframe = self.df[self.df['cluster'] == topic_cluster]['pop_cluster']
        dataframe = dataframe.sort_values()
        return dataframe.index.values
    
    def get_unsolved_problems(self, popular_problems, prob_ids, user_info, limit):
        results = []
        if len(popular_problems) == 0:
            return results
        
        for prob in popular_problems:
            if prob in prob_ids: continue
            if self.has_solved_before(prob, user_info.history): continue
            if len(results) >= limit: break

            results.append(prob)

        return results

    def get_recommendation(self, user_info: str, limit=10)->Recommendation:
        latest_n_prob_id = self.get_latest_n_prob_id(user_info)
        topic_cluster = self.get_topic_cluster(latest_n_prob_id)
        if topic_cluster is None:
            return None
        popular_problems = self.get_popular_problems(topic_cluster)
        recom_list = self.get_unsolved_problems(popular_problems, latest_n_prob_id, user_info, limit)
        print("Popularity Based", recom_list)
        if not recom_list:
            return None
        return Recommendation(f"Hot Picks for you 😉 ", recom_list)

