import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import LoadingSpinner from './LoadingSpinner';
import { motion } from 'framer-motion';

interface YouTubePlayerProps {
  videoId: string;
  onReady?: (player: any) => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, onReady }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Reset state when video ID changes
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setPlayerReady(false);
  }, [videoId]);

  // Calculate responsive dimensions
  const width = Math.min(windowWidth - 40, 640);
  const height = width * 0.5625; // 16:9 aspect ratio

  const opts = {
    height,
    width,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
      rel: 0,
      origin: window.location.origin,
    },
  };

  const handleReady = (event: any) => {
    setIsLoading(false);
    setPlayerReady(true);
    if (onReady) {
      onReady(event);
    }
  };

  const handleError = (event: any) => {
    console.error("YouTube player error:", event);
    setIsLoading(false);
    setError("Failed to load YouTube video. Please check the URL and try again.");
  };

  const handleStateChange = (event: any) => {
    // YouTube player state changed
    const playerState = event.data;
    
    // If video is playing (1) or paused (2), we know it's loaded successfully
    if (playerState === 1 || playerState === 2) {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="youtube-player-container relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {isLoading && !playerReady && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center bg-lightGray rounded-xl z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LoadingSpinner text="Loading YouTube video..." />
        </motion.div>
      )}
      
      {error ? (
        <motion.div 
          className="flex flex-col items-center justify-center h-60 bg-lightError rounded-xl p-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-error mb-2">⚠️ {error}</div>
          <motion.button 
            className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reload Page
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <YouTube 
            videoId={videoId} 
            opts={opts} 
            onReady={handleReady}
            onError={handleError}
            onStateChange={handleStateChange}
            className="rounded-xl overflow-hidden shadow-md"
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default YouTubePlayer;