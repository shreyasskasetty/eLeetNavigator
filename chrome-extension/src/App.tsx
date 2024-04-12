import { useEffect, useState } from 'react';
import './App.css'
import Navbar from './components/Navbar';
import BottomNavbar from './components/BottomNavbar';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    chrome.runtime.sendMessage({ type: "checkLogin" }, (response) => {
      console.log(response.loggedIn);
      setIsLoggedIn(response.loggedIn);
    });
  }, []);

  if(!isLoggedIn){
    return (
      <div>
        Please login to <a href="http://localhost:3001/">eLeetNavigator</a>
      </div >
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
