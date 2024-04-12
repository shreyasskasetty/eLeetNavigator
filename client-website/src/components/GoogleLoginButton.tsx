import { GoogleLogin } from '@react-oauth/google';
import api from '../api/api'

const GoogleLoginButton = () => {
    const onSuccess = async (res: any) => {
        console.log(res);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${res.credential}`
        };

        await api.login(headers)
        .then(response => {
            console.log('Data posted successfully:', response.data);
            localStorage.setItem('userId', JSON.stringify(response.data));
            window.location.href = "/dashboard"
        })
        .catch(error => {
            console.error('Error during the API call:', error.message);
        });
    }

    return (
        <div>
            <GoogleLogin
                onSuccess={onSuccess}
                onError={() => {
                    console.log("Login Failed");
                }}
            />
        </div>
    );
}

export default GoogleLoginButton;
