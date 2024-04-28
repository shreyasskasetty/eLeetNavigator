import {
  Navigate,
  createBrowserRouter,
} from "react-router-dom";
import Welcome from './pages/Welcome';
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./pages/PrivateRoute";
import UsernameForm from "./pages/UsernameForm";

export const router = createBrowserRouter(
    [
        {
          path: "/",
          element: <Welcome/>
        },
        {
          path: "/dashboard",
          element: <PrivateRoute> <Dashboard/> </PrivateRoute>
        },
        {
          path: "/username",
          element: <PrivateRoute> <UsernameForm /> </PrivateRoute>
        }
    ]
);
