import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface SwingComparisonViewProps {
  userVideoSrc: string;
  isYouTube?: boolean;
  userMetrics?: {
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
}

const SwingComparisonView: React.FC<SwingComparisonViewProps> = ({ 
  userVideoSrc, 
  isYouTube = false,
  userMetrics
}) => {
  const [selectedPro, setSelectedPro] = useState('tiger');
  
  const proGolfers = [
    { id: 'tiger', name: 'Tiger Woods', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
    { id: 'rory', name: 'Rory McIlroy', image: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
    { id: 'scottie', name: 'Scottie Scheffler', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
  ];
  
  const proData = {
    'tiger': {
      name: 'Tiger Woods',
      metrics: {
        shoulderTurn: 95,
        hipTurn: 45,
        spineAngle: 38,
        tempo: '3.0:1',
        clubSpeed: '120 mph',
        attackAngle: '-1.2°',
        clubPath: '2.1°',
        faceAngle: '0.3°',
      }
    },
    'rory': {
      name: 'Rory McIlroy',
      metrics: {
        shoulderTurn: 93,
        hipTurn: 48,
        spineAngle: 35,
        tempo: '2.8:1',
        clubSpeed: '122 mph',
        attackAngle: '1.5°',
        clubPath: '1.8°',
        faceAngle: '0.2°',
      }
    },
    'scottie': {
      name: 'Scottie Scheffler',
      metrics: {
        shoulderTurn: 90,
        hipTurn: 42,
        spineAngle: 40,
        tempo: '3.2:1',
        clubSpeed: '118 mph',
        attackAngle: '-0.8°',
        clubPath: '0.5°',
        faceAngle: '0.1°',
      }
    }
  };
  
  const currentProGolfer = proGolfers.find(pro => pro.id === selectedPro) || proGolfers[0];
  const currentProData = proData[selectedPro as keyof typeof proData];
  
  const handlePrevPro = () => {
    const currentIndex = proGolfers.findIndex(pro => pro.id === selectedPro);
    const prevIndex = (currentIndex - 1 + proGolfers.length) % proGolfers.length;
    setSelectedPro(proGolfers[prevIndex].id);
  };
  
  const handleNextPro = () => {
    const currentIndex = proGolfers.findIndex(pro => pro.id === selectedPro);
    const nextIndex = (currentIndex + 1) % proGolfers.length;
    setSelectedPro(proGolfers[nextIndex].id);
  };
  
  // Calculate differences between user and pro metrics
  const calculateDifferences = () => {
    if (!userMetrics) return null;
    
    const differences = [];
    
    // Shoulder Turn
    if (userMetrics.shoulderTurn !== null && currentProData.metrics.shoulderTurn) {
      const diff = Math.round(userMetrics.shoulderTurn - currentProData.metrics.shoulderTurn);
      differences.push({
        name: 'Shoulder Turn',
        difference: `${diff > 0 ? '+' : ''}${diff}°`,
        isSignificant: Math.abs(diff) > 10
      });
    }
    
    // Hip Turn
    if (userMetrics.hipTurn !== null && currentProData.metrics.hipTurn) {
      const diff = Math.round(userMetrics.hipTurn - currentProData.metrics.hipTurn);
      differences.push({
        name: 'Hip Turn',
        difference: `${diff > 0 ? '+' : ''}${diff}°`,
        isSignificant: Math.abs(diff) > 8
      });
    }
    
    // Tempo
    if (userMetrics.tempo && currentProData.metrics.tempo) {
      const userTempo = parseFloat(userMetrics.tempo.split(':')[0]);
      const proTempo = parseFloat(currentProData.metrics.tempo.split(':')[0]);
      const diff = (userTempo - proTempo).toFixed(1);
      differences.push({
        name: 'Tempo',
        difference: `${parseFloat(diff) > 0 ? '+' : ''}${diff}`,
        isSignificant: Math.abs(parseFloat(diff)) > 0.3
      });
    }
    
    // Club Speed
    if (userMetrics.clubSpeed && currentProData.metrics.clubSpeed) {
      const userSpeed = parseInt(userMetrics.clubSpeed);
      const proSpeed = parseInt(currentProData.metrics.clubSpeed);
      const diff = userSpeed - proSpeed;
      differences.push({
        name: 'Club Speed',
        difference: `${diff > 0 ? '+' : ''}${diff} mph`,
        isSignificant: Math.abs(diff) > 15
      });
    }
    
    // Club Path
    if (userMetrics.clubPath && currentProData.metrics.clubPath) {
      const userPath = parseFloat(userMetrics.clubPath);
      const proPath = parseFloat(currentProData.metrics.clubPath);
      const diff = (userPath - proPath).toFixed(1);
      differences.push({
        name: 'Club Path',
        difference: `${parseFloat(diff) > 0 ? '+' : ''}${diff}°`,
        isSignificant: Math.abs(parseFloat(diff)) > 3
      });
    }
    
    return differences;
  };
  
  const differences = calculateDifferences();

  return (
    <div className="swing-comparison-view">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-text">Compare with Pro</h3>
        <div className="flex items-center">
          <motion.button 
            onClick={handlePrevPro}
            className="p-1 bg-lightGray rounded-full mr-2"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={16} className="text-text" />
          </motion.button>
          <motion.span 
            key={currentProGolfer.id}
            className="text-sm font-medium text-text"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {currentProGolfer.name}
          </motion.span>
          <motion.button 
            onClick={handleNextPro}
            className="p-1 bg-lightGray rounded-full ml-2"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={16} className="text-text" />
          </motion.button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          className="relative"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="absolute top-2 left-2 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded-full">You</p>
          {isYouTube ? (
            <iframe 
              src={`https://www.youtube.com/embed/${userVideoSrc}?controls=0`}
              className="w-full h-40 rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <img 
              src={userVideoSrc}
              alt="Your swing"
              className="w-full h-40 object-cover rounded-lg"
            />
          )}
          
          {/* Overlay with swing metrics */}
          <motion.div 
            className="absolute bottom-2 left-2 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            Shoulder Turn: {userMetrics?.shoulderTurn ? Math.round(userMetrics.shoulderTurn) : 85}°
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="relative"
          key={currentProGolfer.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="absolute top-2 left-2 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded-full">{currentProGolfer.name}</p>
          <motion.img 
            src={currentProGolfer.image}
            alt={currentProGolfer.name}
            className="w-full h-40 object-cover rounded-lg"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Overlay with swing metrics */}
          <motion.div 
            className="absolute bottom-2 left-2 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            Shoulder Turn: {currentProData.metrics.shoulderTurn}°
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <h4 className="font-medium text-text mb-2">Key Differences</h4>
        {differences && differences.length > 0 ? (
          <ul className="text-sm text-text space-y-2">
            {differences.map((diff, index) => (
              <motion.li 
                key={index}
                className="flex items-center"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              >
                <div className={`w-2 h-2 rounded-full mr-2 ${diff.isSignificant ? 'bg-error' : 'bg-primary'}`}></div>
                <span>
                  Your {diff.name} is {diff.difference} {diff.isSignificant ? 'significantly ' : ''}
                  {diff.difference.startsWith('-') ? 'less than' : 'more than'} {currentProGolfer.name}'s
                </span>
              </motion.li>
            ))}
          </ul>
        ) : (
          <ul className="text-sm text-text space-y-2">
            <motion.li 
              className="flex items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
              <span>Your shoulder turn is 10° less than {currentProGolfer.name}</span>
            </motion.li>
            <motion.li 
              className="flex items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
              <span>Your hip rotation is similar to {currentProGolfer.name}</span>
            </motion.li>
            <motion.li 
              className="flex items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <div className="w-2 h-2 rounded-full bg-error mr-2"></div>
              <span>Your club path is more outside-in than {currentProGolfer.name}</span>
            </motion.li>
          </ul>
        )}
      </motion.div>
      
      <motion.div
        className="mt-4 p-3 bg-lightPrimary rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <p className="text-sm text-primary font-medium">
          Pro Tip: {currentProGolfer.name === 'Tiger Woods' 
            ? "Tiger's swing is characterized by incredible rotation and a stable lower body. Focus on your hip-shoulder differential to generate more power like Tiger."
            : currentProGolfer.name === 'Rory McIlroy'
            ? "Rory's swing features exceptional rotation and a free-flowing tempo. Work on your flexibility and rhythm to achieve a similar effortless power."
            : "Scottie's swing is known for its consistency and solid fundamentals. Focus on maintaining your spine angle and developing a repeatable motion like Scottie."}
        </p>
      </motion.div>
    </div>
  );
};

export default SwingComparisonView;