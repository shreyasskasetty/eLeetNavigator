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
    attempts = fields.IntField(required=True)
    runtime = fields.IntField(required=True)
    memory = fields.IntField(required=True)
    language = fields.StringField(required=True)
    timestamp = fields.DateTimeField(required=True)
    time_beats = fields.FloatField(required=True)
    memory_beats = fields.FloatField(required=True)
    accepted = fields.BooleanField(required=False, default=False)

class History(EmbeddedDocument):
    problem_id = fields.StringField(required=True)
    problem_log = fields.ListField(fields.EmbeddedDocumentField(ProblemLog))
    last_update = fields.DateTimeField(required=False, default=datetime.now())

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
    solved_problems = fields.ListField(fields.EmbeddedDocumentField(SolvedProblem), db_field='solved-problems')
    history = fields.ListField(fields.EmbeddedDocumentField(History))

    meta = {'collection': 'UserInfo'}