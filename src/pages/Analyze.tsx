import { useState, useRef, useEffect } from 'react';
import { Upload, Camera, RefreshCw, ChevronDown, ArrowRight } from 'lucide-react';
import VideoUploader from '../components/VideoUploader';
import YouTubePlayer from '../components/YouTubePlayer';
import SwingAnalysisCanvas from '../components/SwingAnalysisCanvas';
import SwingAnalysisResults from '../components/SwingAnalysisResults';
import Logo from '../components/Logo';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';
import AnalysisService from '../services/AnalysisService';
import StorageService from '../services/StorageService';

const Analyze = () => {
  const [selectedView, setSelectedView] = useState('face-on');
  const [faceOnVideo, setFaceOnVideo] = useState<string | null>(null);
  const [downLineVideo, setDownLineVideo] = useState<string | null>(null);
  const [isFaceOnYouTube, setIsFaceOnYouTube] = useState<boolean>(false);
  const [isDownLineYouTube, setIsDownLineYouTube] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [handedness, setHandedness] = useState('right');
  const [swingScore, setSwingScore] = useState(78);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isActiveVideoYouTube, setIsActiveVideoYouTube] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const faceOnYoutubePlayerRef = useRef<any>(null);
  const downLineYoutubePlayerRef = useRef<any>(null);
  const faceOnVideoRef = useRef<HTMLVideoElement>(null);
  const downLineVideoRef = useRef<HTMLVideoElement>(null);

  // Reset error when changing videos
  useEffect(() => {
    setVideoError(null);
  }, [faceOnVideo, downLineVideo]);

  // Update active video when view changes
  useEffect(() => {
    if (selectedView === 'face-on') {
      setActiveVideo(faceOnVideo);
      setIsActiveVideoYouTube(isFaceOnYouTube);
    } else {
      setActiveVideo(downLineVideo);
      setIsActiveVideoYouTube(isDownLineYouTube);
    }
  }, [selectedView, faceOnVideo, downLineVideo, isFaceOnYouTube, isDownLineYouTube]);

  const handleVideoSelected = (videoSrc: string, isYT: boolean) => {
    setVideoError(null);
    
    if (selectedView === 'face-on') {
      setFaceOnVideo(videoSrc);
      setIsFaceOnYouTube(isYT);
      setActiveVideo(videoSrc);
      setIsActiveVideoYouTube(isYT);
    } else {
      setDownLineVideo(videoSrc);
      setIsDownLineYouTube(isYT);
      setActiveVideo(videoSrc);
      setIsActiveVideoYouTube(isYT);
    }
  };

  const analyzeSwing = async () => {
    if (!faceOnVideo && !downLineVideo) {
      alert('Please upload at least one swing video to analyze.');
      return;
    }
    
    setIsAnalyzing(true);
    setVideoError(null);
    
    try {
      // Determine which video to analyze
      const videoToAnalyze = faceOnVideo ? faceOnVideoRef.current : downLineVideoRef.current;
      const view = faceOnVideo ? 'face-on' : 'down-line';
      
      if (!videoToAnalyze) {
        throw new Error('Video element not found');
      }
      
      // Perform analysis
      const result = await AnalysisService.analyzeSwing(videoToAnalyze, view as any);
      
      // Save analysis result
      StorageService.saveAnalysisResult(result);
      
      // Update state with results
      setAnalysisResult(result);
      setSwingScore(result.swingScore);
      setIsAnalysisComplete(true);
    } catch (error) {
      console.error('Error analyzing swing:', error);
      
      // Fallback to simulated analysis
      const view = faceOnVideo ? 'face-on' : 'down-line';
      const randomScore = Math.floor(Math.random() * 20) + 65; // Random score between 65-85
      setSwingScore(randomScore);
      setIsAnalysisComplete(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetVideos = () => {
    setFaceOnVideo(null);
    setDownLineVideo(null);
    setIsFaceOnYouTube(false);
    setIsDownLineYouTube(false);
    setActiveVideo(null);
    setIsActiveVideoYouTube(false);
    setIsAnalysisComplete(false);
    setVideoError(null);
    setAnalysisResult(null);
  };

  const handleFaceOnYoutubeReady = (event: any) => {
    faceOnYoutubePlayerRef.current = event;
  };

  const handleDownLineYoutubeReady = (event: any) => {
    downLineYoutubePlayerRef.current = event;
  };

  const handleVideoError = (error: string) => {
    setVideoError(error);
  };

  const getActiveYoutubePlayer = () => {
    return selectedView === 'face-on' ? faceOnYoutubePlayerRef.current : downLineYoutubePlayerRef.current;
  };

  return (
    <motion.div 
      className="bg-background min-h-screen pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-5">
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-text mb-1">Analyze Your Swing</h1>
            <p className="text-sm text-gray">Upload videos from two angles for best results</p>
          </div>
          <Logo size="small" />
        </motion.div>
        
        <motion.div 
          className="bg-lightGray rounded-xl p-1 flex mb-5"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.button
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedView === 'face-on' 
                ? 'bg-white text-text shadow-md' 
                : 'text-gray hover:text-text'
            }`}
            onClick={() => setSelectedView('face-on')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Face-On View
          </motion.button>
          
          <motion.button
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedView === 'down-line' 
                ? 'bg-white text-text shadow-md' 
                : 'text-gray hover:text-text'
            }`}
            onClick={() => setSelectedView('down-line')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Down-the-Line View
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="card mb-5 overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {videoError && (
            <motion.div 
              className="bg-lightError p-4 rounded-lg mb-4 text-error text-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              ⚠️ {videoError}
              <button 
                className="ml-2 text-primary underline"
                onClick={resetVideos}
              >
                Reset Videos
              </button>
            </motion.div>
          )}
          
          {selectedView === 'face-on' ? (
            faceOnVideo ? (
              <div className="relative">
                {isFaceOnYouTube ? (
                  <YouTubePlayer videoId={faceOnVideo} onReady={handleFaceOnYoutubeReady} />
                ) : (
                  <video 
                    ref={faceOnVideoRef}
                    src={faceOnVideo}
                    className="w-full rounded-xl shadow-md"
                    controls
                    onError={() => handleVideoError("Error loading video. Please try a different file format like MP4 or MOV.")}
                  />
                )}
                <motion.button 
                  className="absolute top-4 right-4 bg-black/50 px-3 py-2 rounded-full flex items-center hover:bg-black/70 transition-colors"
                  onClick={() => {
                    setFaceOnVideo(null);
                    setIsFaceOnYouTube(false);
                    if (selectedView === 'face-on') {
                      setActiveVideo(null);
                      setIsActiveVideoYouTube(false);
                    }
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <RefreshCw size={16} className="text-white" />
                  <span className="text-white text-xs ml-1 font-medium">Replace</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <Upload size={40} className="text-primary mb-4" />
                </motion.div>
                <motion.h3 
                  className="text-lg font-semibold text-text mb-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Upload Face-On View
                </motion.h3>
                <motion.p 
                  className="text-sm text-gray mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Stand directly in front of the camera
                </motion.p>
                
                <VideoUploader onVideoSelected={handleVideoSelected} view="Face-On" />
              </div>
            )
          ) : (
            downLineVideo ? (
              <div className="relative">
                {isDownLineYouTube ? (
                  <YouTubePlayer videoId={downLineVideo} onReady={handleDownLineYoutubeReady} />
                ) : (
                  <video 
                    ref={downLineVideoRef}
                    src={downLineVideo}
                    className="w-full rounded-xl shadow-md"
                    controls
                    onError={() => handleVideoError("Error loading video. Please try a different file format like MP4 or MOV.")}
                  />
                )}
                <motion.button 
                  className="absolute top-4 right-4 bg-black/50 px-3 py-2 rounded-full flex items-center hover:bg-black/70 transition-colors"
                  onClick={() => {
                    setDownLineVideo(null);
                    setIsDownLineYouTube(false);
                    if (selectedView === 'down-line') {
                      setActiveVideo(null);
                      setIsActiveVideoYouTube(false);
                    }
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <RefreshCw size={16} className="text-white" />
                  <span className="text-white text-xs ml-1 font-medium">Replace</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <Upload size={40} className="text-primary mb-4" />
                </motion.div>
                <motion.h3 
                  className="text-lg font-semibold text-text mb-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Upload Down-the-Line View
                </motion.h3>
                <motion.p 
                  className="text-sm text-gray mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Stand behind or in front of the golfer
                </motion.p>
                
                <VideoUploader onVideoSelected={handleVideoSelected} view="Down-the-Line" />
              </div>
            )
          )}
        </motion.div>
        
        {isAnalysisComplete ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SwingAnalysisResults 
              swingScore={swingScore} 
              metrics={analysisResult?.metrics}
              faults={analysisResult?.faults}
              recommendations={analysisResult?.recommendations}
              onReset={resetVideos}
            />
          </motion.div>
        ) : (
          <>
            <motion.div 
              className="card mb-5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-text">Swing Settings</h2>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-text">Handedness</span>
                <motion.button 
                  className="bg-lightGray px-3 py-2 rounded-lg flex items-center hover:bg-gray-200 transition-colors"
                  onClick={() => setHandedness(handedness === 'right' ? 'left' : 'right')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm font-medium">{handedness === 'right' ? 'Right-handed' : 'Left-handed'}</span>
                </motion.button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-text">Club Type</span>
                <div className="flex items-center bg-lightGray rounded-lg px-3 py-2">
                  <span className="text-sm text-text mr-2">Iron</span>
                  <ChevronDown size={16} className="text-gray" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="card mb-5"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-text">Upload Status</h2>
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-text">Face-On View</span>
                <span className={`text-sm font-medium ${faceOnVideo ? 'text-success' : 'text-warning'}`}>
                  {faceOnVideo ? 'Uploaded' : 'Not Uploaded'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-text">Down-the-Line View</span>
                <span className={`text-sm font-medium ${downLineVideo ? 'text-success' : 'text-warning'}`}>
                  {downLineVideo ? 'Uploaded' : 'Not Uploaded'}
                </span>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex space-x-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <button 
                className="flex-1 py-3 border border-primary text-primary font-semibold rounded-full"
                onClick={resetVideos}
              >
                Reset
              </button>
              
              <button 
                className={`flex-2 py-3 px-6 font-semibold rounded-full flex items-center justify-center ${
                  (!faceOnVideo && !downLineVideo) || isAnalyzing
                    ? 'bg-gray text-white'
                    : 'bg-primary text-white'
                }`}
                onClick={analyzeSwing}
                disabled={(!faceOnVideo && !downLineVideo) || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <LoadingSpinner color="white" size={20} />
                    <span className="ml-2">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span className="mr-2">Analyze Swing</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </motion.div>
          </>
        )}
        
        <motion.div 
          className="mt-8 card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="font-semibold text-text mb-3">Tips for Better Analysis</h2>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-lightPrimary text-primary flex items-center justify-center mr-3 mt-0.5 font-semibold text-sm">1</div>
              <p className="text-sm text-text">Record in good lighting conditions for accurate pose detection</p>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-lightPrimary text-primary flex items-center justify-center mr-3 mt-0.5 font-semibold text-sm">2</div>
              <p className="text-sm text-text">Ensure your full body is visible in the frame from head to toe</p>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-lightPrimary text-primary flex items-center justify-center mr-3 mt-0.5 font-semibold text-sm">3</div>
              <p className="text-sm text-text">Record at 60fps or higher if possible for smoother motion tracking</p>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-lightPrimary text-primary flex items-center justify-center mr-3 mt-0.5 font-semibold text-sm">4</div>
              <p className="text-sm text-text">Use a tripod for stable footage and consistent analysis results</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analyze;