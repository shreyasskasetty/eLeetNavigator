import { Navigate } from "react-router-dom";
import { CircularProgress } from '@mui/material';
import {Box} from '@mui/material';
import { useSelector } from "react-redux";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isSignedIn = useSelector((state: any)=>state.user.isSignedIn)
  const isDashboardLoading = useSelector((state: any)=>state.user.isDashboardLoading)

  if (isDashboardLoading && !isSignedIn) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return isSignedIn ? <>{children}</> : <Navigate to="/" />;
}

export default PrivateRoute;