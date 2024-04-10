import { useEffect } from 'react';
import './App.css'
import Navbar from './components/Navbar';
import BottomNavbar from './components/BottomNavbar';
function App() {
  useEffect(()=>{
    //Note: get cookie details and save it
    console.log("Estension Clicked")
  },[]);

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
