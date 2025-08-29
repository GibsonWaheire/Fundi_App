import { useAuth } from '../contexts/AuthContext'
import { useLocation, Outlet } from 'react-router-dom'
import Sidebar from './dashboard/Sidebar'
import DashboardHeader from './dashboard/DashboardHeader'
import QuickStats from './dashboard/QuickStats'
import RecentActivity from './dashboard/RecentActivity'
import FundiDashboard from './dashboard/FundiDashboard'
import ClientDashboard from './dashboard/ClientDashboard'
import AdminDashboard from './dashboard/AdminDashboard'
import './dashboard/Dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()
  const location = useLocation()

  // Show main dashboard content only on the main dashboard route
  const isMainDashboard = location.pathname === '/dashboard'

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader user={user} />
        <div className="dashboard-content">
          {isMainDashboard ? (
            <>
              {user?.role === 'fundi' && <FundiDashboard />}
              {user?.role === 'admin' && <AdminDashboard />}
              {(!user?.role || user?.role === 'client') && <ClientDashboard />}
            </>
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  )
}
