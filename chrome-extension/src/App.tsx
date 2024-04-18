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
      const headers: any= {
        Cookie: 'session=eyJ1c2VyX2lkIjoiMTE1Nzk3NTMxMjUwOTUyNzkyMDIyIn0.ZiBPoA.TrLHo1iHmfidzVJmBaiiTaK3ADM'
      }
      setIsLoading(true);
      api.getCurrentUser(headers).then((res)=>{
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
