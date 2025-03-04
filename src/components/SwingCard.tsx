import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface SwingProps {
  id: number;
  date: string;
  score: number;
  improvement: string;
  view: string;
}

interface SwingCardProps {
  swing: SwingProps;
}

const SwingCard: React.FC<SwingCardProps> = ({ swing }) => {
  // Format date to more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div 
      className="flex-shrink-0 w-56 h-40 rounded-2xl overflow-hidden relative shadow-md"
      whileHover={{ scale: 1.05, shadow: "0 10px 25px rgba(0,0,0,0.1)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
            {formatDate(swing.date)}
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
          
          <ChevronRight size={20} className="text-white" />
        </div>
        
        <div className="absolute top-4 right-4 bg-success px-2 py-1 rounded-full">
          <span className="text-white text-xs font-semibold">{swing.improvement}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SwingCard;