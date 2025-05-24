import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext.js';

const PartnerProtectedRoute = () => {
  const { userDetails, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  if (!userDetails) {
    return <Navigate to="/login" replace />;
  }

  if (userDetails.role !== 'partner') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PartnerProtectedRoute; 