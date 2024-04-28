import { GoogleLogin } from '@react-oauth/google';
import api from '../api/api'
import { useDispatch } from 'react-redux';
import { setSignedIn, setUserInfo } from '../features/user/userSlice';
import { setIsLoading } from '../features/ui/commonSlice';

const GoogleLoginButton = () => {
    // const navigate = useNavigate();
    const dispatch = useDispatch();
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
            if(response.data.new_user){
                window.location.href = "/username"
            }
            else{
                window.location.href = "/dashboard"
            }
        })
        .catch(error => {
            console.error('Error during the API call:', error.message);
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
