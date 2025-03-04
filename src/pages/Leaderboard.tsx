import { useState } from 'react'
import { Search, Filter, ChevronDown, Trophy, Medal } from 'lucide-react'

const Leaderboard = () => {
  const [leaderboardType, setLeaderboardType] = useState('global')
  const [timeRange, setTimeRange] = useState('week')
  
  const leaderboardData = [
    {
      id: 1,
      name: 'Michael Johnson',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      score: 92,
      rank: 1,
      change: 0,
      country: 'USA',
      handicap: '+2.1',
    },
    {
      id: 2,
      name: 'Sarah Williams',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      score: 89,
      rank: 2,
      change: 1,
      country: 'Canada',
      handicap: '3.4',
    },
    {
      id: 3,
      name: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      score: 87,
      rank: 3,
      change: -1,
      country: 'Australia',
      handicap: '4.2',
    },
    {
      id: 4,
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      score: 85,
      rank: 4,
      change: 2,
      country: 'UK',
      handicap: '5.0',
    },
    {
      id: 5,
      name: 'Emma Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      score: 84,
      rank: 5,
      change: -1,
      country: 'Spain',
      handicap: '5.7',
    },
    {
      id: 6,
      name: 'Robert Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      score: 82,
      rank: 6,
      change: 3,
      country: 'South Korea',
      handicap: '6.3',
    },
    {
      id: 7,
      name: 'Lisa Thompson',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      score: 80,
      rank: 7,
      change: 0,
      country: 'France',
      handicap: '7.1',
    },
    {
      id: 8,
      name: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      score: 79,
      rank: 8,
      change: -2,
      country: 'Germany',
      handicap: '7.8',
    },
    {
      id: 9,
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      score: 78,
      rank: 9,
      change: 1,
      country: 'USA',
      handicap: '8.2',
      isCurrentUser: true,
    },
    {
      id: 10,
      name: 'Maria Garcia',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      score: 77,
      rank: 10,
      change: 4,
      country: 'Mexico',
      handicap: '8.9',
    },
  ]
  
  const challenges = [
    {
      id: 1,
      title: 'Longest Drive Challenge',
      participants: 1243,
      endDate: '2 days',
      prize: 'Pro Swing Analysis',
    },
    {
      id: 2,
      title: 'Most Improved Swing',
      participants: 876,
      endDate: '5 days',
      prize: 'Premium Membership',
    },
    {
      id: 3,
      title: 'Perfect Tempo Challenge',
      participants: 654,
      endDate: '1 week',
      prize: 'Virtual Coaching Session',
    },
  ]

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="p-5">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold text-text">Leaderboard</h1>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Filter size={18} className="text-text" />
          </button>
        </div>
        
        <div className="mb-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray" />
            </div>
            <input
              type="text"
              className="bg-white w-full pl-10 pr-3 py-3 rounded-xl text-text focus:outline-none shadow-sm"
              placeholder="Search golfers..."
            />
          </div>
        </div>
        
        <div className="flex mb-5">
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium mr-2 ${
              leaderboardType === 'global' 
                ? 'bg-primary text-white' 
                : 'text-text'
            }`}
            onClick={() => setLeaderboardType('global')}
          >
            Global
          </button>
          
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium mr-2 ${
              leaderboardType === 'friends' 
                ? 'bg-primary text-white' 
                : 'text-text'
            }`}
            onClick={() => setLeaderboardType('friends')}
          >
            Friends
          </button>
          
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              leaderboardType === 'local' 
                ? 'bg-primary text-white' 
                : 'text-text'
            }`}
            onClick={() => setLeaderboardType('local')}
          >
            Local
          </button>
        </div>
        
        <div className="flex justify-end mb-5">
          <button className="bg-white px-3 py-2 rounded-full flex items-center shadow-sm">
            <span className="text-sm text-text mr-2">
              {timeRange === 'week' ? 'This Week' : timeRange === 'month' ? 'This Month' : 'All Time'}
            </span>
            <ChevronDown size={16} className="text-text" />
          </button>
        </div>
        
        <div className="card mb-6">
          <div className="flex text-xs font-semibold text-gray mb-3">
            <div className="w-12 text-center">Rank</div>
            <div className="flex-1">Golfer</div>
            <div className="w-12 text-center">Score</div>
            <div className="w-12 text-center">HCP</div>
          </div>
          
          {leaderboardData.map((player) => (
            <div 
              key={player.id} 
              className={`flex items-center py-3 border-b border-lightGray last:border-0 ${
                player.isCurrentUser ? 'bg-lightPrimary -mx-5 px-5 rounded-lg' : ''
              }`}
            >
              <div className="w-12 flex justify-center">
                {player.rank <= 3 ? (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    player.rank === 1 ? 'bg-gold' : 
                    player.rank === 2 ? 'bg-gray' : 
                    'bg-[#CD7F32]'
                  }`}>
                    {player.rank === 1 ? (
                      <Trophy size={14} className="text-white" />
                    ) : (
                      <Medal size={14} className="text-white" />
                    )}
                  </div>
                ) : (
                  <span className="font-semibold text-text">{player.rank}</span>
                )}
              </div>
              
              <div className="flex-1 flex items-center">
                <img 
                  src={player.avatar} 
                  alt={player.name}
                  className="w-9 h-9 rounded-full mr-3"
                />
                <div>
                  <p className="font-semibold text-text text-sm">{player.name}</p>
                  <p className="text-xs text-gray">{player.country}</p>
                </div>
              </div>
              
              <div className="w-12 text-center font-bold text-primary text-base">{player.score}</div>
              <div className="w-12 text-center font-medium text-text">{player.handicap}</div>
            </div>
          ))}
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-text">Weekly Challenges</h2>
            <button className="text-sm text-primary font-medium">View All</button>
          </div>
          
          {challenges.map((challenge) => (
            <div key={challenge.id} className="card mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-text">{challenge.title}</h3>
                <span className="bg-lightSuccess text-success text-xs font-medium px-3 py-1 rounded-full">
                  Active
                </span>
              </div>
              
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-xs text-gray mb-1">Participants</p>
                  <p className="text-sm font-semibold text-text">{challenge.participants}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray mb-1">Ends in</p>
                  <p className="text-sm font-semibold text-text">{challenge.endDate}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray mb-1">Prize</p>
                  <p className="text-sm font-semibold text-text">{challenge.prize}</p>
                </div>
              </div>
              
              <button className="w-full bg-primary text-white font-semibold py-3 rounded-full">
                Join Challenge
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Leaderboard