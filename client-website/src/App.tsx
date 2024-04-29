import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { setOpen } from './features/ui/notificationSlice';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './pages/PrivateRoute';
import UsernameForm from './pages/UsernameForm';


function App() {
    const dispatch = useDispatch();
    const open:any = useSelector((state:any) => state.notification.open);
    const alertConfig :any= useSelector((state:any) => state.notification.alertConfig);
  
    const handleClose :any= (event:any, reason:any) => {
      if (reason === 'clickaway') {
        return;
      }
      dispatch(setOpen(false));
    };
  
    return (
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/username" element={
            <PrivateRoute>
              <UsernameForm />
            </PrivateRoute>
          } />
          {/* You can add more routes here */}
        </Routes>
        <LoginModal />
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleClose} severity={alertConfig.severity} sx={{ width: '100%' }}>
            {alertConfig.message}
          </Alert>
        </Snackbar>
      </BrowserRouter>
    );
  }
  
  export default App;
  