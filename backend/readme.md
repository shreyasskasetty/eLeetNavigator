
# Backend Setup Guide

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️  [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 📖 [Contributor Guide](#contributor-guide)
## <a name="introduction">🤖 Introduction</a>

eLeet Navigator is a personalized recommendation system that recommends leet code challenges
based on the user’s profile(ex: history, problem statistics, etc. ) and preferences.



![Flask](https://img.shields.io/badge/-Flask-black?style=for-the-badge&logo=flask&logoColor=white&color=000000)
![Python](https://img.shields.io/badge/-Python-black?style=for-the-badge&logo=python&logoColor=yellow&color=3776AB)

## <a name="tech-stack">⚙️ Tech Stack</a>
 - Flask

## <a name="features">🔋 Features</a>





## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Pre-requisites**
Make sure you have MongoDb Compass and MongoDB Community downloaded in your machine. Additionally, the server should be up and running.

**Cloning the Repository**

```bash
git clone https://github.com/shreyasskasetty/eLeetNavigator.git
cd eLeetNavigator
cd backend
```
**Set up development ENV variables**
1. Download the required python libraries. The libraries are listed in a `requirements.txt` file.
```bash
pip install -r requirements. txt
```
2. Open python interpreter and run `import secrets`. Run the following command to get a secret key: `secrets.token_hex(20)`
3. Export the secret key using the following command:
```bash
export SECRET_KEY='<secret_key>'
``` 


**Start the Flask project in Development Mode**
Run the below command to start the server

```bash
python run.py
```


## <a name="contributor-guide">📖 Contributor Guide</a>

### Project Structure
```plaintext
.
├── app
│   ├── __init__.py
│   ├── models
│   │   ├── mongodb_models.py
│   │   └── postgres_models.py
│   ├── routes
│   │   ├── auth.py
│   │   └── user.py
│   ├── services
│   │   └── auth_service.py
│   ├── templates
│   │   ├── login.html
│   │   ├── profile.html
│   │   └── register.html
│   └── utilities
├── config.py
├── constants.py
├── readme.md
├── requirements.txt
└── run.py
```
