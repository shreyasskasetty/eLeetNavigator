import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {Box} from '@mui/material';
import { useSelector } from 'react-redux';
import api
 from '../api/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { showAlert } from '../features/ui/notificationSlice';
function UsernameForm() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const user_id =  useSelector((state: any)=>state.user.userInfo.user_id)
  const handleChange = (event: any) => {
    setUsername(event.target.value);
  };
  const dispatch: AppDispatch = useDispatch();
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log('Username:', username);
    const formData = { 'username': username , 'user_id' : user_id };
    console.log(formData)
    try {
        api.addUserName(formData).then((res)=>{
            if(res.status === 200){
              navigate('/dashboard');
            }
            dispatch(showAlert({ severity: 'success', message: 'Username submitted successfully', duration: 3000 }));
        }).catch((error: any)=>{
            console.log(error)
            dispatch(showAlert({ severity: 'success', message: error.message, duration: 3000 }));
        })

    } catch (error) {
        console.error('Error submitting form:', error);
    }
  };

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <TextField
        label="LeetCode Username"
        variant="outlined"
        value={username}
        onChange={handleChange}
        required
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Next
      </Button>
    </Box>
  );
}

export default UsernameForm;
