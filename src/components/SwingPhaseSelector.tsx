import { useState } from 'react';
import { motion } from 'framer-motion';

interface SwingPhase {
  id: string;
  label: string;
}

interface SwingPhaseSelectorProps {
  phases: SwingPhase[];
  activePhase: string;
  onPhaseChange: (phaseId: string) => void;
}

const SwingPhaseSelector: React.FC<SwingPhaseSelectorProps> = ({
  phases,
  activePhase,
  onPhaseChange
}) => {
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-2">
        {phases.map(phase => (
          <motion.button
            key={phase.id}
            className={`relative py-2 px-3 text-sm font-medium rounded-lg transition-all duration-300 ${
              activePhase === phase.id 
                ? 'bg-primary text-white shadow-md' 
                : hoveredPhase === phase.id
                  ? 'bg-lightPrimary text-primary'
                  : 'bg-lightGray text-text'
            }`}
            onClick={() => onPhaseChange(phase.id)}
            onMouseEnter={() => setHoveredPhase(phase.id)}
            onMouseLeave={() => setHoveredPhase(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {phase.label}
            {activePhase === phase.id && (
              <motion.span 
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              ></motion.span>
            )}
          </motion.button>
        ))}
      </div>
      
      {/* Progress bar */}
      <div className="mt-4 h-1 bg-lightGray rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ 
            width: `${(phases.findIndex(p => p.id === activePhase) + 1) / phases.length * 100}%` 
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        ></motion.div>
      </div>
    </div>
  );
};

export default SwingPhaseSelector;