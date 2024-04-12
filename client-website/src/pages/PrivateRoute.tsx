import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from '../api/api'
import { CircularProgress } from '@mui/material';
import {Box } from '@mui/material';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(()=>{ 
      setIsLoading(true);
      api.getCurrentUser().then((res)=>{
        console.log(res.data)
        setIsAuthenticated(true)
        setIsLoading(false);
      }).catch((error: any)=>{
        setIsLoading(false);
        console.log(error)
        setIsAuthenticated(false)
      })
      
  },[])


  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}

export default PrivateRoute;