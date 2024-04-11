from flask_mongoengine import MongoEngine
from datetime import datetime
from mongoengine import Document, EmbeddedDocument, fields

db = MongoEngine()

class User(db.Document):
    username = db.StringField(required=True, unique=True)
    email = db.StringField(required=True, unique=True)
    password = db.StringField(required=True)

class Language(EmbeddedDocument):
    language = fields.StringField(required=True)
    count = fields.IntField(required=True)

class Skill(EmbeddedDocument):
    skill_type = fields.StringField(required=True, db_field='skill-type')
    count = fields.IntField(required=True)

class SolvedProblem(EmbeddedDocument):
    type = fields.StringField(required=True)
    count = fields.IntField(required=True)
    beats = fields.FloatField(required=True)

class ProblemLog(EmbeddedDocument):
    runtime = fields.FloatField(required=False)
    memory = fields.FloatField(required=False)
    language = fields.StringField(required=True)
    timestamp = fields.DateTimeField(required=True)
    time_beats = fields.FloatField(required=False)
    memory_beats = fields.FloatField(required=False)
    accepted = fields.BooleanField(required=False, default=False)
    def __repr__(self):
        return f"ProblemLog(runtime={self.runtime}, memory={self.memory}, language='{self.language}', timestamp={self.timestamp}, time_beats={self.time_beats}, memory_beats={self.memory_beats}, accepted={self.accepted})"


class History(EmbeddedDocument):
    problem_id = fields.StringField(required=True)
    problem_log = fields.ListField(fields.EmbeddedDocumentField(ProblemLog))
    last_update = fields.DateTimeField(required=False, default=datetime.now())

    def __repr__(self):
        problem_logs_str = ', '.join([repr(log) for log in self.problem_log])
        return f"History(problem_id='{self.problem_id}', problem_log=[{problem_logs_str}], last_update={self.last_update})"

class Skills(EmbeddedDocument):
    advance = fields.ListField(fields.EmbeddedDocumentField(Skill))
    intermediate = fields.ListField(fields.EmbeddedDocumentField(Skill))
    fundamental = fields.ListField(fields.EmbeddedDocumentField(Skill))

class UserInfo(Document):
    username = fields.StringField(required=True)
    emailId = fields.EmailField(required=True)
    rank = fields.IntField(required=True)
    streak = fields.IntField(required=True)
    languages = fields.ListField(fields.EmbeddedDocumentField(Language))
    skills = fields.EmbeddedDocumentField(Skills)
    solved_problems = fields.ListField(fields.EmbeddedDocumentField(SolvedProblem))
    history = fields.ListField(fields.EmbeddedDocumentField(History))

    meta = {'collection': 'UserInfo'}