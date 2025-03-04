import React from 'react';
import { CheckCircle, Award, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActivityProps {
  id: number;
  type: string;
  message: string;
  time: string;
}

interface RecentActivityCardProps {
  activity: ActivityProps;
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ activity }) => {
  const getIcon = () => {
    switch (activity.type) {
      case 'analysis':
        return <CheckCircle size={20} color="#4CAF50" />;
      case 'achievement':
        return <Award size={20} color="#FFD700" />;
      case 'recommendation':
        return <Lightbulb size={20} color="#8BC34A" />;
      default:
        return <CheckCircle size={20} color="#4CAF50" />;
    }
  };

  const getBackgroundColor = () => {
    switch (activity.type) {
      case 'analysis':
        return 'bg-lightPrimary';
      case 'achievement':
        return 'bg-lightGold';
      case 'recommendation':
        return 'bg-lightGreen';
      default:
        return 'bg-lightPrimary';
    }
  };

  return (
    <motion.div 
      className={`flex items-center p-4 rounded-xl mb-3 ${getBackgroundColor()} hover:shadow-md transition-shadow`}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mr-4">
        {getIcon()}
      </div>
      <div>
        <p className="text-sm font-medium text-text mb-1">{activity.message}</p>
        <p className="text-xs text-gray">{activity.time}</p>
      </div>
    </motion.div>
  );
};

export default RecentActivityCard;