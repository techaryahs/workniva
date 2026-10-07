import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public pages
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Customer protected
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import MyBookingsPage from './pages/MyBookingsPage';
import BookingDetailsPage from './pages/BookingDetailsPage';

// Admin protected
import { AdminLayout } from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminCalendar from './pages/admin/AdminCalendar';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminPricing from './pages/admin/AdminPricing';
import AdminAvailability from './pages/admin/AdminAvailability';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Customer Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/booking/confirmation" element={<BookingConfirmationPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/my-bookings/:bookingId" element={<BookingDetailsPage />} />
          </Route>
          
          {/* Admin Protected Routes */}
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true} />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="calendar" element={<AdminCalendar />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="pricing" element={<AdminPricing />} />
              <Route path="availability" element={<AdminAvailability />} />
            <Route path="notifications" element={<AdminNotifications />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
