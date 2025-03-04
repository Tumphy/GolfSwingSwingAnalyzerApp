import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, TrendingUp, Award, Calendar } from 'lucide-react'
import Logo from '../components/Logo'
import AnimatedGolfBall from '../components/AnimatedGolfBall'

const Home = () => {
  const [userName] = useState('John')
  const [swingScore] = useState(78)
  const [recentSwings] = useState([
    { id: 1, date: '2025-06-10', score: 82, improvement: '+3', view: 'Face-On' },
    { id: 2, date: '2025-06-08', score: 79, improvement: '+1', view: 'Down-the-Line' },
    { id: 3, date: '2025-06-05', score: 78, improvement: '+2', view: 'Face-On' },
  ])
  
  const [activities] = useState([
    { id: 1, type: 'analysis', message: 'Your swing analysis is complete', time: '2 hours ago' },
    { id: 2, type: 'achievement', message: 'You earned "Consistent Backswing" badge', time: '1 day ago' },
    { id: 3, type: 'recommendation', message: 'New drill recommended: Hip Rotation', time: '2 days ago' },
  ])

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="p-5">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray">Welcome back,</p>
            <h1 className="text-2xl font-bold text-text">{userName}</h1>
          </div>
          <Link to="/profile">
            <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1570691079236-4bca6c45d440?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </div>

        <div className="card flex justify-between items-center mb-5 hover:shadow-lg transition-shadow">
          <div>
            <p className="text-sm text-gray mb-1">Your Swing Score</p>
            <h2 className="text-3xl font-bold text-primary mb-1">{swingScore}</h2>
            <p className="text-xs text-success">Top 22% of all golfers</p>
          </div>
          <Link to="/analyze" className="bg-primary text-white px-4 py-3 rounded-full flex items-center hover:bg-primary/90 transition-colors">
            <Play size={18} />
            <span className="ml-2 font-semibold text-sm">Analyze Swing</span>
          </Link>
        </div>

        <div className="flex justify-between mb-6">
          <Link to="/progress" className="flex flex-col items-center group">
            <div className="w-12 h-12 rounded-xl bg-lightPrimary flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
              <TrendingUp size={22} className="text-primary" />
            </div>
            <span className="text-xs font-medium text-text">Progress</span>
          </Link>
          
          <Link to="/leaderboard" className="flex flex-col items-center group">
            <div className="w-12 h-12 rounded-xl bg-lightGold flex items-center justify-center mb-2 group-hover:bg-accent/20 transition-colors">
              <Award size={22} className="text-accent" />
            </div>
            <span className="text-xs font-medium text-text">Rankings</span>
          </Link>
          
          <button className="flex flex-col items-center group">
            <div className="w-12 h-12 rounded-xl bg-lightGreen flex items-center justify-center mb-2 group-hover:bg-success/20 transition-colors">
              <Calendar size={22} className="text-success" />
            </div>
            <span className="text-xs font-medium text-text">Training</span>
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-text">Recent Swings</h2>
            <button className="text-sm text-primary font-medium hover:text-primary/80 transition-colors">See All</button>
          </div>
          
          <div className="flex overflow-x-auto pb-2 -mx-5 px-5 space-x-4">
            {recentSwings.map((swing) => (
              <div key={swing.id} className="flex-shrink-0 w-56 h-40 rounded-2xl overflow-hidden relative shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src={swing.view === 'Face-On' 
                    ? 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
                    : 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
                  }
                  alt={`Swing ${swing.id}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 flex flex-col justify-between">
                  <div className="flex items-center">
                    <Calendar size={14} className="text-white" />
                    <span className="text-white text-xs ml-1">
                      {new Date(swing.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4">
                      <div className="text-center">
                        <p className="text-white font-bold text-lg">{swing.score}</p>
                        <p className="text-white text-xs opacity-80">Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-semibold">{swing.view}</p>
                        <p className="text-white text-xs opacity-80">View</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 bg-success px-2 py-1 rounded-full">
                    <span className="text-white text-xs font-semibold">{swing.improvement}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text mb-4">Recent Activity</h2>
          
          {activities.map((activity) => {
            let bgColor = 'bg-lightPrimary';
            let icon = <Play size={20} className="text-primary" />;
            
            if (activity.type === 'achievement') {
              bgColor = 'bg-lightGold';
              icon = <Award size={20} className="text-accent" />;
            } else if (activity.type === 'recommendation') {
              bgColor = 'bg-lightGreen';
              icon = <Calendar size={20} className="text-success" />;
            }
            
            return (
              <div key={activity.id} className={`${bgColor} rounded-xl p-4 flex items-center mb-3 hover:shadow-md transition-shadow`}>
                <div className="mr-4">
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-text mb-1">{activity.message}</p>
                  <p className="text-xs text-gray">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 flex justify-center">
          <Logo size="large" />
        </div>
      </div>
    </div>
  )
}

export default Home