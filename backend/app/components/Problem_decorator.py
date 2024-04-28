import os
from flask import current_app

from pandas import pandas as pd

class ProblemDecorator:
    def __init__(self):
        self.df = pd.read_csv(current_app.open_resource('resources/problem-dataset-with-11-cluster.csv')).set_index('name')

    def getProblemInfo(self, probId):
        problem = {}
        try:
            row = self.df.loc[probId]
            problem['difficultyLevel'] = row['difficulty']
            problem['acceptanceRate'] = row['acceptance-rate']
            problem['submissions'] = row['submissions']
            problem['problemId'] = probId
            return problem
        except:
            problem['difficultyLevel'] = "Solvable"
            problem['acceptanceRate'] = "Unknown"
            problem['submissions'] = "Unknown"
            problem['problemId'] = probId
            return problem
