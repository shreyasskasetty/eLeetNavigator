from flask import Blueprint, request, render_template, redirect, url_for, flash, session
from app.services.auth_service import authenticate_user, logout_user, register_user

# Create a Blueprint for authentication
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Extract login credentials from request
        username = request.form.get('username')
        password = request.form.get('password')
        
        # Authenticate user
        if authenticate_user(username, password):
            return redirect(url_for('user.profile'))  # Assuming there's a profile view in user routes
        else:
            flash('Invalid username or password')
    return render_template('login.html')

@auth_bp.route('/logout')
def logout():
    logout_user()  # Implement the logic to log out the user
    return redirect(url_for('auth.login'))

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if 'user_id' in session:
        # Redirect to profile if already logged in
        return redirect(url_for('user.profile'))

    if request.method == 'POST':
        # Extract registration details from request
        username = request.form.get('username')
        password = request.form.get('password')
        email = request.form.get('email')  # Assuming email is part of the registration form

        # Register user
        success, message = register_user(username, password, email)
        if success:
            flash('Registration successful. Please log in.', 'success')
            return redirect(url_for('auth.login'))
        else:
            flash(message, 'error')

    return render_template('register.html')