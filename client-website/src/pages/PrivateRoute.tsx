import { Navigate } from "react-router-dom";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import api from '../api/api'
import { CircularProgress } from '@mui/material';
import {Box, Input, InputLabel, Button } from '@mui/material';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setNewUser] = useState(false);
  const [userName, setUserName] = useState('');

  function storeUserInfo(userId: String, userName: String){
     const eLeetDataUI = {
      userId : userId,
      userName: userName
     } 
     localStorage.setItem("eLeetDataUI", JSON.stringify(eLeetDataUI));
  }
  async function authenticate()
  {
    setIsLoading(true);
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
      setIsAuthenticated(response.userId)
      setIsLoading(false);
      storeUserInfo(response.userId, user_name)
    }).catch((error: any)=>{
      setIsLoading(false);
      console.log(error)
      setIsAuthenticated('')
    })
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault(); // Prevent the default form submit behavior
      const formData = { 'userName': userName , 'userId' : isAuthenticated };

      try {
          const response = await api.addUserName(formData)
          console.log(response)
          if(response.status == 200)
          {
            storeUserInfo(isAuthenticated, userName)
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

  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}

export default PrivateRoute;