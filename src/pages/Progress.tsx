import { useState } from 'react'
import { Calendar, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const Progress = () => {
  const [timeRange, setTimeRange] = useState('month')
  const [expandedFaults, setExpandedFaults] = useState<number[]>([])
  
  const swingMetrics = [
    { id: 1, name: 'Swing Score', value: 78, change: '+3', trend: 'up' },
    { id: 2, name: 'Club Speed', value: '92 mph', change: '+2 mph', trend: 'up' },
    { id: 3, name: 'Tempo', value: '3:1', change: '0.2', trend: 'up' },
    { id: 4, name: 'Hip Rotation', value: '45°', change: '+3°', trend: 'up' },
  ]
  
  const swingFaults = [
    { 
      id: 1, 
      name: 'Early Extension', 
      severity: 'moderate', 
      trend: 'improving',
      description: 'Your pelvis is moving toward the ball during the downswing, causing inconsistent contact.',
      drills: ['Hip Bumps Against Wall', 'Chair Drill']
    },
    { 
      id: 2, 
      name: 'Over-the-Top', 
      severity: 'mild', 
      trend: 'improving',
      description: 'Your downswing is starting with the upper body, causing an out-to-in swing path.',
      drills: ['Headcover Under Arm', 'Towel Drill']
    },
    { 
      id: 3, 
      name: 'Reverse Spine Angle', 
      severity: 'severe', 
      trend: 'worsening',
      description: 'Your spine is tilting toward the target at the top of the backswing, limiting rotation.',
      drills: ['Posture Drill with Club', 'Alignment Stick Drill']
    },
  ]
  
  const toggleFaultExpansion = (id: number) => {
    if (expandedFaults.includes(id)) {
      setExpandedFaults(expandedFaults.filter(faultId => faultId !== id))
    } else {
      setExpandedFaults([...expandedFaults, id])
    }
  }
  
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Swing Score',
        data: [65, 68, 72, 70, 74, 78],
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        tension: 0.3,
      }
    ]
  }
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#2c3e50',
        bodyColor: '#2c3e50',
        borderColor: '#ecf0f1',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: () => 'Swing Score',
        }
      },
    },
    scales: {
      y: {
        min: 60,
        grid: {
          color: 'rgba(236, 240, 241, 0.5)',
        },
        ticks: {
          color: '#95a5a6',
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#95a5a6',
        }
      }
    },
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="p-5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-text">Your Progress</h1>
          <button className="bg-white px-3 py-2 rounded-full flex items-center shadow-sm">
            <Calendar size={16} className="text-text mr-2" />
            <span className="text-sm font-medium text-text mr-1">
              {timeRange === 'week' ? 'This Week' : timeRange === 'month' ? 'This Month' : 'This Year'}
            </span>
            <ChevronDown size={16} className="text-text" />
          </button>
        </div>
        
        <div className="card mb-6">
          <h2 className="font-semibold text-text mb-4">Swing Score Trend</h2>
          <Line data={chartData} options={chartOptions} />
        </div>
        
        <h2 className="text-lg font-semibold text-text mb-4">Key Metrics</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {swingMetrics.map(metric => (
            <div key={metric.id} className="card">
              <p className="text-sm text-gray mb-2">{metric.name}</p>
              <p className="text-xl font-bold text-text mb-2">{metric.value}</p>
              <div className="flex items-center">
                {metric.trend === 'up' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-success">
                    <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 7H21V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-error">
                    <path d="M3 7L9 13L13 9L21 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 17H21V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Progress