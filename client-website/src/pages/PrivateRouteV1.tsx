import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
interface PrivateRouteProps {
    children: React.ReactNode;
  }
const PrivateRoute : React.FC<PrivateRouteProps> = ({ children, isAuthenticated}:any) => {
    return isAuthenticated ? (
        {...children}
    ) : (
        <Navigate to="/" />
    )
}

const mapStateToProps = (state : any) => ({
    auth: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(PrivateRoute);
