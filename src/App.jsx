import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import FundiProfile from './components/FundiProfile'
import FundiPage from './components/FundiPage'
import PublicFindFundis from './components/PublicFindFundis'
import FundiTable from './components/FundiTable'
import About from './components/About'
import Contact from './components/Contact'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'

// Dashboard Components
import MyJobs from './components/dashboard/MyJobs'
import MyBookings from './components/dashboard/MyBookings'
import Messages from './components/dashboard/Messages'
import Payments from './components/dashboard/Payments'
import Reviews from './components/dashboard/Reviews'
import Settings from './components/dashboard/Settings'
import Availability from './components/dashboard/Availability'
import Profile from './components/dashboard/Profile'
import Users from './components/dashboard/Users'
import Fundis from './components/dashboard/Fundis'
import Reports from './components/dashboard/Reports'

// Component to conditionally render Navbar
function AppContent() {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {!isDashboard && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="find-fundis" element={<FundiTable />} />
          <Route path="jobs" element={<MyJobs />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="settings" element={<Settings />} />
          <Route path="availability" element={<Availability />} />
          <Route path="profile" element={<Profile />} />
          <Route path="users" element={<Users />} />
          <Route path="fundis" element={<Fundis />} />
          <Route path="reports" element={<Reports />} />
        </Route>
        <Route path="/fundi-profile" element={<FundiProfile />} />
        <Route path="/fundi" element={<FundiPage />} />
        <Route path="/find-fundis" element={<PublicFindFundis />} />
        <Route path="/fundi-table" element={<FundiTable />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
