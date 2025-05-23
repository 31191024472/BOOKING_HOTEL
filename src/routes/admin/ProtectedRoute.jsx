import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext.js';

const ProtectedRoute = ({ role }) => {
  const { userDetails, loading } = useContext(AuthContext);
  // console.log("Check login user detail", userDetails);

  if (loading) return <p>Loading...</p>;

  if (!userDetails) {
    return <Navigate to="/login" replace />;
  }

  if (role && userDetails.role !== role) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
