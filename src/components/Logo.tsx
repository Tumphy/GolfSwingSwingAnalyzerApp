import { useState } from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', animated = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'w-8 h-8';
      case 'large':
        return 'w-20 h-20';
      case 'medium':
      default:
        return 'w-12 h-12';
    }
  };
  
  return (
    <motion.div 
      className="flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <motion.div 
        className={`relative ${getSizeClass()} rounded-full bg-primary flex items-center justify-center overflow-hidden`}
        animate={animated && isHovered ? { rotate: [-5, 15, -10, 5, 0] } : {}}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Golf ball with dimples */}
        <div className="absolute inset-0 bg-white rounded-full"></div>
        
        {/* Golf club */}
        <motion.div 
          className="absolute w-1 h-3/4 bg-gray-800 -rotate-45 translate-x-1 translate-y-1"
          animate={animated && isHovered ? { rotate: [-45, -30, -45] } : {}}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        ></motion.div>
        
        {/* Dimples */}
        <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-gray-200"></div>
        <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-gray-200"></div>
        <div className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-gray-200"></div>
        <div className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-gray-200"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-gray-200"></div>
      </motion.div>
      
      <div className={`ml-2 ${size === 'small' ? 'text-sm' : size === 'large' ? 'text-2xl' : 'text-lg'} font-bold`}>
        <motion.span 
          className="text-primary"
          animate={animated && isHovered ? { y: [-1, 1, -1] } : {}}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          Swing
        </motion.span>
        <motion.span 
          className="text-accent"
          animate={animated && isHovered ? { y: [1, -1, 1] } : {}}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          AI
        </motion.span>
      </div>
    </motion.div>
  );
};

export default Logo;