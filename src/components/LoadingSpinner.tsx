import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 24, 
  color = 'primary',
  text
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'white':
        return 'text-white';
      case 'accent':
        return 'text-accent';
      case 'primary':
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <RefreshCw size={size} className={getColorClass()} />
      </motion.div>
      {text && (
        <motion.p 
          className={`mt-2 text-sm font-medium ${getColorClass()}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;