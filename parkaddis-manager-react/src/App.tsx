import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import Register from './screens/Register';
import Scanner from './screens/Scanner';
import Profile from './screens/Profile';
import ManualReservation from './screens/ManualReservation';
import Success from './screens/Success';
import CheckoutSuccess from './screens/CheckoutSuccess';
import Sessions from './screens/Sessions';
import Settings from './screens/Settings';
import FacilityConfig from './screens/settings/FacilityConfig';
import NotificationPrefs from './screens/settings/NotificationPrefs';
import StaffManagement from './screens/settings/StaffManagement';
import AccountSecurity from './screens/settings/AccountSecurity';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-100 flex justify-center">
        {/* Adaptive Container */}
        <div className="w-full bg-background min-h-screen relative flex flex-col">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scanner" element={<Scanner />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/manual-reservation" element={<ManualReservation />} />
              <Route path="/success" element={<Success />} />
              <Route path="/checkout-success" element={<CheckoutSuccess />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/facility" element={<FacilityConfig />} />
              <Route path="/settings/notifications" element={<NotificationPrefs />} />
              <Route path="/settings/staff" element={<StaffManagement />} />
              <Route path="/settings/security" element={<AccountSecurity />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </Router>
  );
}
