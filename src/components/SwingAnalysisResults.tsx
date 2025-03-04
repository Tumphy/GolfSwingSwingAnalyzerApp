import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import AnimatedGolfBall from './AnimatedGolfBall';
import SwingComparisonView from './SwingComparisonView';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface SwingFault {
  id: number;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  recommendations: string[];
}

interface SwingMetric {
  id: number;
  name: string;
  value: string | number;
  rating: 'good' | 'average' | 'poor';
  ideal: string;
}

interface SwingAnalysisResultsProps {
  swingScore: number;
  metrics?: {
    shoulderTurn: number | null;
    hipTurn: number | null;
    spineAngle: number | null;
    tempo: string | null;
    clubSpeed: string | null;
    attackAngle: string | null;
    clubPath: string | null;
    faceAngle: string | null;
    headHeight?: number | null;
    swingPlaneAngle?: number | null;
    hipSlide?: number | null;
  };
  faults?: SwingFault[];
  recommendations?: string[];
  onReset?: () => void;
}

const SwingAnalysisResults: React.FC<SwingAnalysisResultsProps> = ({ 
  swingScore, 
  metrics,
  faults,
  recommendations,
  onReset 
}) => {
  const [expandedFaults, setExpandedFaults] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('metrics');
  
  const { ref: scoreRef, inView: scoreInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // Default swing faults if none provided
  const swingFaults: SwingFault[] = faults || [
    {
      id: 1,
      name: 'Early Extension',
      severity: 'moderate',
      description: 'Your pelvis is moving toward the ball during the downswing, causing inconsistent contact and potential back strain.',
      recommendations: [
        'Practice the "Wall Drill" to maintain posture',
        'Focus on rotating rather than standing up',
        'Strengthen core muscles'
      ]
    },
    {
      id: 2,
      name: 'Over-the-Top Swing Path',
      severity: 'severe',
      description: 'Your downswing is starting with the upper body and coming from outside-to-in, causing slices and pulls.',
      recommendations: [
        'Drop the club into the "slot" during transition',
        'Start downswing with lower body rotation',
        'Practice the "Headcover Drill"'
      ]
    },
    {
      id: 3,
      name: 'Inadequate Hip Rotation',
      severity: 'mild',
      description: 'Your hips aren\'t rotating enough in the backswing, limiting your power and causing compensations.',
      recommendations: [
        'Practice hip mobility exercises',
        'Focus on turning, not swaying',
        'Use alignment sticks for feedback'
      ]
    }
  ];
  
  // Create swing metrics from provided metrics or defaults
  const createSwingMetrics = (): SwingMetric[] => {
    if (!metrics) {
      return [
        {
          id: 1,
          name: 'Club Path',
          value: '-4.2°',
          rating: 'poor',
          ideal: '0° to +2°'
        },
        {
          id: 2,
          name: 'Face Angle',
          value: '+2.1°',
          rating: 'average',
          ideal: '0°'
        },
        {
          id: 3,
          name: 'Attack Angle',
          value: '-3.5°',
          rating: 'good',
          ideal: '-4° (driver: +1°)'
        },
        {
          id: 4,
          name: 'Swing Tempo',
          value: '3.2:1',
          rating: 'average',
          ideal: '3:1'
        }
      ];
    }
    
    const result: SwingMetric[] = [];
    
    // Club Path
    if (metrics.clubPath) {
      const clubPathValue = parseFloat(metrics.clubPath);
      let rating: 'good' | 'average' | 'poor' = 'average';
      
      if (clubPathValue > -2 && clubPathValue < 3) {
        rating = 'good';
      } else if (clubPathValue < -5 || clubPathValue > 5) {
        rating = 'poor';
      }
      
      result.push({
        id: 1,
        name: 'Club Path',
        value: metrics.clubPath,
        rating,
        ideal: '0° to +2°'
      });
    }
    
    // Face Angle
    if (metrics.faceAngle) {
      const faceAngleValue = parseFloat(metrics.faceAngle);
      let rating: 'good' | 'average' | 'poor' = 'average';
      
      if (faceAngleValue > -1 && faceAngleValue < 1) {
        rating = 'good';
      } else if (faceAngleValue < -3 || faceAngleValue > 3) {
        rating = 'poor';
      }
      
      result.push({
        id: 2,
        name: 'Face Angle',
        value: metrics.faceAngle,
        rating,
        ideal: '0°'
      });
    }
    
    // Attack Angle
    if (metrics.attackAngle) {
      const attackAngleValue = parseFloat(metrics.attackAngle);
      let rating: 'good' | 'average' | 'poor' = 'average';
      
      // For irons, we want a negative attack angle
      if (attackAngleValue > -5 && attackAngleValue < -2) {
        rating = 'good';
      } else if (attackAngleValue > 0) {
        rating = 'poor';
      }
      
      result.push({
        id: 3,
        name: 'Attack Angle',
        value: metrics.attackAngle,
        rating,
        ideal: '-4° (driver: +1°)'
      });
    }
    
    // Tempo
    if (metrics.tempo) {
      const tempoValue = parseFloat(metrics.tempo.split(':')[0]);
      let rating: 'good' | 'average' | 'poor' = 'average';
      
      if (tempoValue > 2.8 && tempoValue < 3.2) {
        rating = 'good';
      } else if (tempoValue < 2.5 || tempoValue > 3.5) {
        rating = 'poor';
      }
      
      result.push({
        id: 4,
        name: 'Swing Tempo',
        value: metrics.tempo,
        rating,
        ideal: '3:1'
      });
    }
    
    // Shoulder Turn
    if (metrics.shoulderTurn) {
      let rating: 'good' | 'average' | 'poor' = 'average';
      
      if (metrics.shoulderTurn > 85 && metrics.shoulderTurn < 105) {
        rating = 'good';
      } else if (metrics.shoulderTurn < 75 || metrics.shoulderTurn > 115) {
        rating = 'poor';
      }
      
      result.push({
        id: 5,
        name: 'Shoulder Turn',
        value: `${Math.round(metrics.shoulderTurn)}°`,
        rating,
        ideal: '90°'
      });
    }
    
    // Hip Turn
    if (metrics.hipTurn) {
      let rating: 'good' | 'average' | 'poor' = 'average';
      
      if (metrics.hipTurn > 40 && metrics.hipTurn < 50) {
        rating = 'good';
      } else if (metrics.hipTurn < 30 || metrics.hipTurn > 60) {
        rating = 'poor';
      }
      
      result.push({
        id: 6,
        name: 'Hip Turn',
        value: `${Math.round(metrics.hipTurn)}°`,
        rating,
        ideal: '45°'
      });
    }
    
    // Club Speed
    if (metrics.clubSpeed) {
      result.push({
        id: 7,
        name: 'Club Speed',
        value: metrics.clubSpeed,
        rating: 'good',
        ideal: '85-95 mph'
      });
    }
    
    // Return at most 4 metrics
    return result.slice(0, 4);
  };
  
  const swingMetrics = createSwingMetrics();
  
  const toggleFaultExpansion = (id: number) => {
    if (expandedFaults.includes(id)) {
      setExpandedFaults(expandedFaults.filter(faultId => faultId !== id));
    } else {
      setExpandedFaults([...expandedFaults, id]);
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'bg-lightSuccess text-success';
      case 'moderate':
        return 'bg-lightWarning text-warning';
      case 'severe':
        return 'bg-lightError text-error';
      default:
        return 'bg-lightGray text-gray';
    }
  };
  
  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'good':
        return <CheckCircle size={16} className="text-success" />;
      case 'average':
        return <AlertCircle size={16} className="text-warning" />;
      case 'poor':
        return <XCircle size={16} className="text-error" />;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="swing-analysis-results"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="card mb-6 overflow-hidden"
        ref={scoreRef}
        initial={{ y: 20, opacity: 0 }}
        animate={scoreInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text">Swing Score</h3>
          <div className="flex items-center">
            <AnimatedGolfBall size={24} />
            <motion.div 
              className="text-2xl font-bold text-primary ml-2"
              initial={{ scale: 0 }}
              animate={scoreInView ? { scale: 1 } : {}}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20, 
                delay: 0.5 
              }}
            >
              {swingScore}
            </motion.div>
          </div>
        </div>
        
        <div className="w-full h-4 bg-lightGray rounded-full mb-2 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-error via-warning to-success rounded-full"
            initial={{ width: 0 }}
            animate={scoreInView ? { width: `${swingScore}%` } : {}}
            transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
          ></motion.div>
        </div>
        
        <div className="flex justify-between text-xs text-gray">
          <span>Poor</span>
          <span>Average</span>
          <span>Excellent</span>
        </div>
      </motion.div>
      
      {/* Tab navigation */}
      <div className="flex border-b border-lightGray mb-6">
        <motion.button
          className={`py-3 px-4 font-medium text-sm relative ${
            activeTab === 'metrics' 
              ? 'text-primary' 
              : 'text-gray hover:text-text'
          }`}
          onClick={() => setActiveTab('metrics')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Swing Metrics
          {activeTab === 'metrics' && (
            <motion.div 
              className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
              layoutId="activeTab"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>
        <motion.button
          className={`py-3 px-4 font-medium text-sm relative ${
            activeTab === 'faults' 
              ? 'text-primary' 
              : 'text-gray hover:text-text'
          }`}
          onClick={() => setActiveTab('faults')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Swing Faults
          {activeTab === 'faults' && (
            <motion.div 
              className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
              layoutId="activeTab"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>
        <motion.button
          className={`py-3 px-4 font-medium text-sm relative ${
            activeTab === 'compare' 
              ? 'text-primary' 
              : 'text-gray hover:text-text'
          }`}
          onClick={() => setActiveTab('compare')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Compare
          {activeTab === 'compare' && (
            <motion.div 
              className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
              layoutId="activeTab"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>
      </div>
      
      {/* Metrics tab */}
      {activeTab === 'metrics' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="grid grid-cols-2 gap-4 mb-6">
            {swingMetrics.map((metric, index) => (
              <motion.div 
                key={metric.id} 
                className="card hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-text">{metric.name}</h4>
                  {getRatingIcon(metric.rating)}
                </div>
                <p className="text-xl font-bold text-text mb-1">{metric.value}</p>
                <p className="text-xs text-gray">Ideal: {metric.ideal}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="bg-lightPrimary rounded-2xl p-5 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-center mb-3">
              <AlertCircle size={20} className="text-primary mr-2" />
              <h3 className="font-semibold text-primary">AI Insights</h3>
            </div>
            
            <p className="text-sm text-text mb-4">
              {recommendations && recommendations.length > 0 ? 
                recommendations[0] : 
                "Your swing shows an outside-to-in path with early extension. Focus on starting your downswing with your lower body and maintaining your spine angle through impact. Your tempo is slightly quick at 3.2:1 - try to smooth out your transition for better consistency."}
            </p>
            
            {recommendations && recommendations.length > 1 && (
              <p className="text-sm text-text mb-4">
                {recommendations[1]}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
      
      {/* Faults tab */}
      {activeTab === 'faults' && (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {swingFaults.map((fault, index) => (
            <motion.div 
              key={fault.id} 
              className="mb-4 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <motion.div 
                className="card cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => toggleFaultExpansion(fault.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className={`w-2 h-2 rounded-full mr-3 ${
                        fault.severity === 'mild' ? 'bg-success' : 
                        fault.severity === 'moderate' ? 'bg-warning' : 
                        'bg-error'
                      }`}
                    />
                    <span className="font-semibold text-text">{fault.name}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span 
                      className={`text-xs font-medium px-2 py-1 rounded-full mr-3 ${
                        getSeverityColor(fault.severity)
                      }`}
                    >
                      {fault.severity.charAt(0).toUpperCase() + fault.severity.slice(1)}
                    </span>
                    
                    {expandedFaults.includes(fault.id) ? (
                      <ChevronUp size={20} className="text-gray" />
                    ) : (
                      <ChevronDown size={20} className="text-gray" />
                    )}
                  </div>
                </div>
              </motion.div>
              
              {expandedFaults.includes(fault.id) && (
                <motion.div 
                  className="bg-white rounded-b-2xl p-4 -mt-1 shadow-md border border-t-0 border-lightGray"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm text-text mb-4">{fault.description}</p>
                  
                  <p className="text-sm font-semibold text-text mb-2">Recommendations:</p>
                  {fault.recommendations.map((rec, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center mb-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                      <p className="text-sm text-text">{rec}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Compare tab */}
      {activeTab === 'compare' && (
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <SwingComparisonView 
            userVideoSrc="https://images.unsplash.com/photo-1535131749006-b7f58c99034b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
            userMetrics={metrics}
          />
        </motion.div>
      )}
      
      {onReset && (
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button 
            className="w-full bg-lightGray text-text py-3 rounded-full font-medium hover:bg-gray-200 transition-colors"
            onClick={onReset}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Analyze Another Swing
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SwingAnalysisResults;