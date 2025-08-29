import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import FundiProfile from './components/FundiProfile'
import About from './components/About'
import Contact from './components/Contact'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'

// Dashboard Components
import MyJobs from './components/dashboard/MyJobs'
import MyBookings from './components/dashboard/MyBookings'
import Messages from './components/dashboard/Messages'
import Payments from './components/dashboard/Payments'
import Reviews from './components/dashboard/Reviews'
import Settings from './components/dashboard/Settings'
import FindFundis from './components/dashboard/FindFundis'

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
          <Route path="find-fundis" element={<FindFundis />} />
          <Route path="jobs" element={<MyJobs />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/fundi-profile" element={<FundiProfile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
