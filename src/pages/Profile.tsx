import { useState } from 'react'
import { Settings, ChevronRight, Award, Clock, LogOut, Bell, Shield, HelpCircle } from 'lucide-react'

const Profile = () => {
  const [notifications, setNotifications] = useState(true)
  
  const userProfile = {
    name: 'John Smith',
    email: 'john.smith@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    memberSince: 'June 2025',
    handicap: '8.2',
    swingScore: 78,
    swingsAnalyzed: 42,
    achievements: 12,
  }
  
  const achievements = [
    { id: 1, name: 'Consistent Backswing', date: 'Jun 5, 2025' },
    { id: 2, name: 'Perfect Tempo', date: 'May 28, 2025' },
    { id: 3, name: 'Improved Hip Rotation', date: 'May 15, 2025' },
  ]

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="p-5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-text">Profile</h1>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Settings size={22} className="text-text" />
          </button>
        </div>
        
        <div className="card mb-6">
          <div className="flex mb-5">
            <img 
              src={userProfile.avatar} 
              alt={userProfile.name}
              className="w-20 h-20 rounded-full mr-4"
            />
            <div className="flex flex-col justify-center">
              <h2 className="font-bold text-lg text-text mb-1">{userProfile.name}</h2>
              <p className="text-sm text-gray mb-1">{userProfile.email}</p>
              <p className="text-xs text-gray">Member since {userProfile.memberSince}</p>
            </div>
          </div>
          
          <button className="w-full bg-lightPrimary text-primary font-semibold py-2.5 rounded-full mb-5">
            Edit Profile
          </button>
          
          <div className="flex border-t border-lightGray pt-4">
            <div className="flex-1 text-center">
              <p className="font-bold text-lg text-primary">{userProfile.handicap}</p>
              <p className="text-xs text-gray">Handicap</p>
            </div>
            
            <div className="flex-1 text-center border-x border-lightGray">
              <p className="font-bold text-lg text-primary">{userProfile.swingScore}</p>
              <p className="text-xs text-gray">Swing Score</p>
            </div>
            
            <div className="flex-1 text-center">
              <p className="font-bold text-lg text-primary">{userProfile.swingsAnalyzed}</p>
              <p className="text-xs text-gray">Swings</p>
            </div>
          </div>
        </div>
        
        <h2 className="text-lg font-semibold text-text mb-4">Recent Achievements</h2>
        <div className="card mb-6">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center justify-between py-3 border-b border-lightGray last:border-0">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-lightGold flex items-center justify-center mr-3">
                  <Award size={20} className="text-gold" />
                </div>
                <div>
                  <p className="font-medium text-text text-sm">{achievement.name}</p>
                  <p className="text-xs text-gray">{achievement.date}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray" />
            </div>
          ))}
          
          <button className="w-full text-primary font-medium text-sm py-3">
            View All Achievements
          </button>
        </div>
        
        <h2 className="text-lg font-semibold text-text mb-4">Subscription</h2>
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-text">Free Plan</h3>
            <span className="bg-lightSuccess text-success text-xs font-medium px-3 py-1 rounded-full">
              Active
            </span>
          </div>
          
          <p className="text-sm text-text mb-4">
            You're currently on the Free plan with limited features.
            Upgrade to Pro for unlimited swing analysis and advanced features.
          </p>
          
          <button className="w-full bg-primary text-white font-semibold py-3 rounded-full">
            Upgrade to Pro
          </button>
        </div>
        
        <h2 className="text-lg font-semibold text-text mb-4">Settings</h2>
        <div className="card">
          <div className="flex items-center justify-between py-3 border-b border-lightGray">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-lightPrimary flex items-center justify-center mr-3">
                <Bell size={18} className="text-primary" />
              </div>
              <span className="font-medium text-text">Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
              />
              <div className="w-11 h-6 bg-lightGray peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-lightGray">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-lightSuccess flex items-center justify-center mr-3">
                <Shield size={18} className="text-success" />
              </div>
              <span className="font-medium text-text">Privacy</span>
            </div>
            <ChevronRight size={18} className="text-gray" />
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-lightGray">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-lightWarning flex items-center justify-center mr-3">
                <HelpCircle size={18} className="text-warning" />
              </div>
              <span className="font-medium text-text">Help & Support</span>
            </div>
            <ChevronRight size={18} className="text-gray" />
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-lightError flex items-center justify-center mr-3">
                <LogOut size={18} className="text-error" />
              </div>
              <span className="font-medium text-text">Log Out</span>
            </div>
            <ChevronRight size={18} className="text-gray" />
          </div>
        </div>
        
        <div className="flex justify-center mt-6">
          <p className="text-xs text-gray">Version 1.0.0</p>
        </div>
      </div>
    </div>
  )
}

export default Profile