import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedGolfBallProps {
  size?: number;
  animate?: boolean;
}

const AnimatedGolfBall: React.FC<AnimatedGolfBallProps> = ({ 
  size = 40, 
  animate = true 
}) => {
  const [isAnimating, setIsAnimating] = useState(animate);
  
  useEffect(() => {
    if (!animate) return;
    
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [animate]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Golf ball */}
      <motion.div 
        className="absolute inset-0 bg-white rounded-full border border-gray-200 shadow-md"
        animate={isAnimating ? { y: [-5, 5, -5] } : {}}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        {/* Dimples */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-gray-200"></div>
        <div className="absolute top-1/4 right-1/4 w-1 h-1 rounded-full bg-gray-200"></div>
        <div className="absolute bottom-1/4 left-1/4 w-1 h-1 rounded-full bg-gray-200"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1 h-1 rounded-full bg-gray-200"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-gray-200"></div>
      </motion.div>
      
      {/* Shadow */}
      <motion.div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gray-300 rounded-full"
        style={{ 
          width: size * 0.8, 
          height: size * 0.1,
          opacity: 0.3
        }}
        animate={isAnimating ? { 
          width: [size * 0.8, size * 0.6, size * 0.8],
          opacity: [0.3, 0.5, 0.3]
        } : {}}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      ></motion.div>
    </div>
  );
};

export default AnimatedGolfBall;