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
  const [currentUser, setCurrentUser] = useState(null)

  //  function fetchCurrentUserFromStorage(){
  //   // chrome.storage.local.get(['eLeetCurrentUser'], function(result) {
  //   //   console.log('Current user data from storage:', result);
  //   // });

  //   const message = {
  //     type : "eLeetCurrentUser"
  //   }
  //   chrome.runtime.sendMessage(message, (response)=>{
  //     console.log("response at the front end.")
  //     console.log(response);
  //   })
  // }

  function getCurrentUserFromBackend(){
    api.getCurrentUser().then((res)=>{
      console.log("Current User" , res);
      setIsLoading(false);
      setIsLoggedIn(true);
      setCurrentUser(res.data)
    }).catch((error:any) =>{
      setIsLoading(false);
      console.log(error)
    });
  }

  useEffect(() => {
    setIsLoading(true);
    getCurrentUserFromBackend();
    //fetchCurrentUserFromStorage();
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
      <div style={{display:'flex', flex:1, flexDirection:'column'}}>
        <Navbar />
        <BottomNavbar currentUser={currentUser}/>
      </div>

    </>
  )
}

export default App
