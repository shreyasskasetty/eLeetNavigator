import {
  createBrowserRouter,
} from "react-router-dom";
import LoginPage from './pages/LoginPage';
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./pages/PrivateRoute";

export const router = createBrowserRouter([
        {
          path: "/",
          element: <LoginPage/>
        },
        {
          path: "/dashboard",
          element: <PrivateRoute><Dashboard/></PrivateRoute>
        }
        ]
);
