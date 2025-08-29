import { useAuth } from '../contexts/AuthContext'
import Sidebar from './dashboard/Sidebar'
import DashboardHeader from './dashboard/DashboardHeader'
import QuickStats from './dashboard/QuickStats'
import RecentActivity from './dashboard/RecentActivity'
import './dashboard/Dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader user={user} />
        <div className="dashboard-content">
          <QuickStats />
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
