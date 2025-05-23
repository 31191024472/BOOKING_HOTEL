import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import Home from './routes/home/Home';
import HotelsSearch from './routes/listings/HotelsSearch';
import UserProfile from './routes/user-profile/UserProfile';
// import { makeServer } from './mirage/mirageServer';
import AdminDashboard from 'routes/admin/AdminDashboard';
import AdminLayout from 'routes/admin/AdminLayout';
import EmailPromotion from 'routes/admin/AdminNotification';
import BookingManagement from 'routes/admin/BookingManagement';
import HotelManagement from 'routes/admin/HotelManagement';
import ProtectedRoute from 'routes/admin/ProtectedRoute';
import RoomManagement from 'routes/admin/RoomManagement';
import UserManagement from 'routes/admin/UserManagement';
import BookingConfirmation from 'routes/booking-confimation/BookingConifrmation';
import Checkout from 'routes/checkout/Checkout';
import AboutUs from './routes/about-us/AboutUs';
import ForgotPassword from './routes/forgot-password/ForgotPassword';
import HotelDetails from './routes/hotel-details/HotelDetails';
import BaseLayout from './routes/layouts/base-layout/BaseLayout';
import Login from './routes/login/Login';
import Register from './routes/register/Register';
// if (process.env.NODE_ENV === 'development') {
//   makeServer();
// }

const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/hotels',
        element: <HotelsSearch />,
      },
      {
        path: '/about-us',
        element: <AboutUs />,
      },
      {
        path: '/user-profile',
        element: <ProtectedRoute role="user" />,
        children: [{ path: '', element: <UserProfile /> }],
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/hotel/:hotelId',
        element: <HotelDetails />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: '/checkout',
        element: <Checkout />,
      },
      {
        path: '/booking-confirmation',
        element: <BookingConfirmation />,
      },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute role="admin" />, // Kiểm tra quyền admin trước khi vào
    children: [
      {
        path: '', // Khi vào /admin sẽ load AdminLayout
        element: <AdminLayout />,
        children: [
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'users', element: <UserManagement /> },
          { path: 'bookings', element: <BookingManagement /> },
          { path: 'hotels', element: <HotelManagement /> },
          { path: 'rooms', element: <RoomManagement /> },
          { path: 'notifications', element: <EmailPromotion /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
