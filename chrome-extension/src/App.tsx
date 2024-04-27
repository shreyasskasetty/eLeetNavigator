import { useEffect, useState } from 'react';
import './App.css'
import Navbar from './components/Navbar';
import BottomNavbar from './components/BottomNavbar';
import api from './apis/api';
import CircularProgress from '@mui/material/CircularProgress';
import Welcome from './pages/Welcome';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      setIsLoading(true);
      api.getCurrentUser().then((res)=>{
        console.log(res);
        setIsLoading(false);
        setIsLoggedIn(true);
      }).catch((error:any) =>{
        setIsLoading(false);
        console.log(error)
      });
  }, []);

  if(isLoading){
    return(
      <div className='eln-progress-circle'>
        <CircularProgress />
      </div>
    );
  }
  if(!isLoggedIn){
    return (
      //   <div className="centered-container">
      //       <a href="http://localhost:3001/" className="login-link">Please login to eLeetNavigator</a>
      //  </div>
      <Welcome />
    )
  }
  return (
    <>
      <div>
        <Navbar />
        <BottomNavbar/>
      </div>

    </>
  )
}

export default App
