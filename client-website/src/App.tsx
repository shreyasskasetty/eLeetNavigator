import {router} from './routes.tsx'
import {
  RouterProvider,
} from "react-router-dom";
import Navbar from './components/Navbar.tsx';
import LoginModal from './components/LoginModal.tsx';

function App() {
  return (
    <>
        <Navbar />
        <LoginModal />
        <RouterProvider router={router} />
    </>
  )
}

export default App
