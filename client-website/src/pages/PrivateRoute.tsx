import { Navigate } from "react-router-dom";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import api from '../api/api'
import { CircularProgress } from '@mui/material';
import {Box, Input, InputLabel, Button } from '@mui/material';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setNewUser] = useState(false);
  const [userName, setUserName] = useState('');

  async function authenticate()
  {
    setIsLoading(true);
    if(!userId)
    {
      api.getCurrentUser().then((res)=>{
        const response = res.data
        if(!response)
        {
          // Login Failed.
          return
        }
        console.log(response)
        localStorage.setItem("user" , response)
        const new_user = response?.new_user
        const user_info_exists = response?.user_info_exists
        const user_name = response?.user_name
        if (new_user)
        {
          setNewUser(new_user)
        }
  
        if(user_name)
        {
          setUserName(user_name)
        }
        setUserId(response.user_id)
        setIsLoading(false);
      }).catch((error: any)=>{
        setIsLoading(false);
        console.log(error)
        setUserId('')
      })
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault(); // Prevent the default form submit behavior
      const formData = { 'userName': userName , 'userId' : userId };

      try {
          const response = await api.addUserName(formData)
          console.log(response)
          if(response.status == 200)
          {
            console.log("User Name successfully updated")
            setNewUser(false)
            setUserName(userName)
          }
          else{
            // Do Something for error
          }
      } catch (error) {
          console.error('Error submitting form:', error);
      }
  };

  useEffect(()=>{
    authenticate() 
  },[])


  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if(isNewUser)
  {
    return(
      <Box bgcolor={'white'}>
        <InputLabel>LeetCode User Name</InputLabel>
        <Input onChange={handleInputChange} value={userName}></Input>
        <Button variant="outlined" color="primary" onClick={handleSubmit}>Submit</Button>
      </Box>
    )
  }

  return userId ? <>{children}</> : <Navigate to="/" />;
}

export default PrivateRoute;