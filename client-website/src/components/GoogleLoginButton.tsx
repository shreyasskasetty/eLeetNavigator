import { GoogleLogin } from '@react-oauth/google';
import api from '../api/api'
import { useDispatch } from 'react-redux';
import { setSignedIn, setUserInfo } from '../features/user/userSlice';
import { setIsLoading } from '../features/ui/commonSlice';
import { showAlert } from '../features/ui/notificationSlice';
import { AppDispatch } from '../store';
import { useNavigate } from 'react-router-dom';
import { setOpen } from '../features/ui/modalSlice';

const GoogleLoginButton = () => {
    // const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const onSuccess = async (res: any) => {
        console.log(res);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${res.credential}`
        };

        dispatch(setIsLoading(false));
        await api.login(headers)
        .then(response => {
            console.log('Data posted successfully:', response.data);
            console.log("dispatching action setSignedIn")
            dispatch(setSignedIn(true));
            dispatch(setUserInfo({
               ...response.data
            }))
            dispatch(setIsLoading(true));
            dispatch(showAlert({ severity: 'success', message: 'Login Successful', duration: 3000 }))
            if(response.data.new_user){
                navigate("/username")
            }
            else{
                navigate("/dashboard")
            }
            dispatch(setOpen(false))
        })
        .catch(error => {
            dispatch(showAlert({ severity: 'error', message: `Login Failed. ${error.message}`, duration: 3000 }))
            console.error('Error during the API call:', error.message);
            dispatch(setOpen(false))
        })
    }

    return (
        <div>
            <GoogleLogin
                useOneTap
                onSuccess={onSuccess}
                onError={() => {
                    console.log("Login Failed");
                }}
            />
        </div>
    );
}

export default GoogleLoginButton;
