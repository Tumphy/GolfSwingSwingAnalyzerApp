import { Outlet, NavLink } from 'react-router-dom'
import { Home, Upload, BarChart2, Award, User } from 'lucide-react'

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-lightGray h-16 flex items-center justify-around shadow-lg">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex flex-col items-center ${isActive ? 'text-primary' : 'text-gray'} transition-colors`
          }
          end
        >
          <Home size={24} />
          <span className="text-xs mt-1 font-medium">Home</span>
        </NavLink>
        
        <NavLink 
          to="/analyze" 
          className={({ isActive }) => 
            `flex flex-col items-center ${isActive ? 'text-primary' : 'text-gray'} transition-colors`
          }
        >
          <Upload size={24} />
          <span className="text-xs mt-1 font-medium">Analyze</span>
        </NavLink>
        
        <NavLink 
          to="/progress" 
          className={({ isActive }) => 
            `flex flex-col items-center ${isActive ? 'text-primary' : 'text-gray'} transition-colors`
          }
        >
          <BarChart2 size={24} />
          <span className="text-xs mt-1 font-medium">Progress</span>
        </NavLink>
        
        <NavLink 
          to="/leaderboard" 
          className={({ isActive }) => 
            `flex flex-col items-center ${isActive ? 'text-primary' : 'text-gray'} transition-colors`
          }
        >
          <Award size={24} />
          <span className="text-xs mt-1 font-medium">Leaderboard</span>
        </NavLink>
        
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `flex flex-col items-center ${isActive ? 'text-primary' : 'text-gray'} transition-colors`
          }
        >
          <User size={24} />
          <span className="text-xs mt-1 font-medium">Profile</span>
        </NavLink>
      </nav>
    </div>
  )
}

export default Layout