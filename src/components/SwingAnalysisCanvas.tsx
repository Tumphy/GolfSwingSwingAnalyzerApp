import { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from 'lucide-react';
import SwingPhaseSelector from './SwingPhaseSelector';
import LoadingSpinner from './LoadingSpinner';
import { motion } from 'framer-motion';
import PoseDetectionService from '../services/PoseDetectionService';

interface SwingAnalysisCanvasProps {
  videoSrc: string;
  isYouTube?: boolean;
  youtubePlayer?: any;
}

const SwingAnalysisCanvas: React.FC<SwingAnalysisCanvasProps> = ({ 
  videoSrc, 
  isYouTube = false,
  youtubePlayer
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const poseCanvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(100); // Default value
  const [isPlaying, setIsPlaying] = useState(false);
  const [swingPhase, setSwingPhase] = useState('address');
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoInitialized, setVideoInitialized] = useState(false);
  const [poseDetected, setPoseDetected] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const animationRef = useRef<number | null>(null);

  // Swing phases
  const swingPhases = [
    { id: 'address', label: 'Address' },
    { id: 'takeaway', label: 'Takeaway' },
    { id: 'backswing', label: 'Backswing' },
    { id: 'top', label: 'Top' },
    { id: 'downswing', label: 'Downswing' },
    { id: 'impact', label: 'Impact' },
    { id: 'follow-through', label: 'Follow-through' },
    { id: 'finish', label: 'Finish' }
  ];

  // Initialize fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize fabric canvas
    fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
      width: 640,
      height: 360,
    });

    // Initialize pose detection
    const initPoseDetection = async () => {
      setIsAnalyzing(true);
      try {
        await PoseDetectionService.initialize();
        console.log('Pose detection initialized');
        setIsAnalyzing(false);
      } catch (err) {
        console.error('Failed to initialize pose detection:', err);
        setIsAnalyzing(false);
      }
    };

    initPoseDetection();

    // Clean up
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handle video source changes
  useEffect(() => {
    setIsLoading(true);
    setIsVideoReady(false);
    setError(null);
    setVideoInitialized(false);
    setPoseDetected(false);
    
    // Reset animation and video state
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    setIsPlaying(false);
    
    const timeoutId = setTimeout(() => {
      if (isLoading && !isVideoReady) {
        setError("Video loading is taking longer than expected. Please check your connection or try a different video format.");
      }
    }, 15000); // 15 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, [videoSrc, isYouTube]);

  // Initialize YouTube player
  useEffect(() => {
    if (!isYouTube || !youtubePlayer || videoInitialized) return;
    
    try {
      const initYouTubeVideo = () => {
        if (youtubePlayer && youtubePlayer.target) {
          const player = youtubePlayer.target;
          
          // Check if player is ready
          if (player.getDuration && typeof player.getDuration === 'function') {
            const duration = player.getDuration();
            if (duration > 0) {
              setTotalFrames(Math.floor(duration * 10)); // 10 frames per second for scrubbing
              setIsLoading(false);
              setIsVideoReady(true);
              setVideoInitialized(true);
              
              // Draw initial frame
              setTimeout(() => {
                drawAnalysisLines();
                // Process video for pose detection
                processYouTubeVideo(player);
              }, 500);
              return true;
            }
          }
          return false;
        }
        return false;
      };
      
      // Try to initialize immediately
      if (!initYouTubeVideo()) {
        // If not ready, try again after a short delay
        const checkInterval = setInterval(() => {
          if (initYouTubeVideo()) {
            clearInterval(checkInterval);
          }
        }, 1000);
        
        // Clear interval after 10 seconds to prevent infinite checking
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!videoInitialized) {
            setError("Could not initialize YouTube video. Please try a different video or format.");
            setIsLoading(false);
          }
        }, 10000);
      }
    } catch (err) {
      console.error("YouTube player error:", err);
      setError("Failed to load YouTube video. Please try again with a different video.");
      setIsLoading(false);
    }
  }, [isYouTube, youtubePlayer, videoInitialized]);

  // Process YouTube video for pose detection
  const processYouTubeVideo = async (player: any) => {
    setIsAnalyzing(true);
    
    try {
      // Create a temporary canvas to capture YouTube frames
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 640;
      tempCanvas.height = 360;
      const ctx = tempCanvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Sample frames from the video
      const duration = player.getDuration();
      const frameCount = Math.min(20, Math.floor(duration * 2)); // Process up to 20 frames
      
      for (let i = 0; i < frameCount; i++) {
        // Seek to specific time
        player.seekTo(i / frameCount * duration);
        
        // Wait for the video to seek
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Capture the current frame
        const videoElement = document.querySelector('iframe[src*="youtube"]') as HTMLIFrameElement;
        if (videoElement) {
          // This is a simplified approach - in production, you'd need a more robust solution
          // as direct pixel access to YouTube iframe content is restricted
          // For a real implementation, consider using YouTube's API or a server-side solution
          
          // For now, we'll simulate pose detection
          await simulatePoseDetection();
        }
      }
      
      // Reset video to start
      player.seekTo(0);
      setPoseDetected(true);
      setIsAnalyzing(false);
    } catch (err) {
      console.error('Error processing YouTube video:', err);
      setIsAnalyzing(false);
      // Still set pose detected to true to show analysis UI
      setPoseDetected(true);
    }
  };

  // Initialize HTML5 video
  useEffect(() => {
    if (isYouTube || !videoRef.current || videoInitialized) return;
    
    const video = videoRef.current;
    
    const handleMetadata = () => {
      if (video.duration) {
        setTotalFrames(Math.floor(video.duration * 10)); // 10 frames per second for scrubbing
        setIsLoading(false);
        setIsVideoReady(true);
        setVideoInitialized(true);
        
        // Draw initial frame
        setTimeout(() => {
          drawAnalysisLines();
          // Process video for pose detection
          processVideo(video);
        }, 500);
      }
    };
    
    const handleError = (e: Event) => {
      console.error("Video loading error", e);
      setError("Failed to load video. Please check the file format and try again. Supported formats include MP4, MOV, and WebM.");
      setIsLoading(false);
    };
    
    const handleCanPlay = () => {
      if (!videoInitialized) {
        handleMetadata();
      }
    };
    
    video.addEventListener('loadedmetadata', handleMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    
    // If video is already loaded
    if (video.readyState >= 2) {
      handleMetadata();
    }
    
    // Force load the video
    try {
      video.load();
    } catch (err) {
      console.error("Error loading video:", err);
    }
    
    return () => {
      video.removeEventListener('loadedmetadata', handleMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [isYouTube, videoInitialized]);

  // Process video for pose detection
  const processVideo = async (videoElement: HTMLVideoElement) => {
    setIsAnalyzing(true);
    
    try {
      // Sample frames from the video
      const duration = videoElement.duration;
      const frameCount = Math.min(20, Math.floor(duration * 2)); // Process up to 20 frames
      
      for (let i = 0; i < frameCount; i++) {
        // Set video to specific timestamp
        videoElement.currentTime = (i / frameCount) * duration;
        
        // Wait for the video to seek to the specified time
        await new Promise<void>(resolve => {
          const onSeeked = () => {
            videoElement.removeEventListener('seeked', onSeeked);
            resolve();
          };
          videoElement.addEventListener('seeked', onSeeked);
        });
        
        // Detect pose at this frame
        await detectPoses(videoElement);
      }
      
      // Reset video to start
      videoElement.currentTime = 0;
      setPoseDetected(true);
      setIsAnalyzing(false);
    } catch (err) {
      console.error('Error processing video:', err);
      setIsAnalyzing(false);
      // Still set pose detected to true to show analysis UI
      setPoseDetected(true);
    }
  };

  // Simulate pose detection for testing
  const simulatePoseDetection = async () => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return true;
  };

  // Detect poses in the video
  const detectPoses = async (videoElement: HTMLVideoElement) => {
    if (!poseCanvasRef.current) return;
    
    try {
      const poses = await PoseDetectionService.detectPose(videoElement, poseCanvasRef.current);
      return poses;
    } catch (err) {
      console.error("Error detecting poses:", err);
      return null;
    }
  };

  const drawAnalysisLines = () => {
    // Draw analysis lines based on current frame and swing phase
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    canvas.clear();
    
    // Draw different analysis lines based on swing phase
    switch(swingPhase) {
      case 'address':
        drawAddressLines(canvas);
        break;
      case 'takeaway':
        drawTakeawayLines(canvas);
        break;
      case 'backswing':
        drawBackswingLines(canvas);
        break;
      case 'top':
        drawTopLines(canvas);
        break;
      case 'downswing':
        drawDownswingLines(canvas);
        break;
      case 'impact':
        drawImpactLines(canvas);
        break;
      case 'follow-through':
        drawFollowThroughLines(canvas);
        break;
      case 'finish':
        drawFinishLines(canvas);
        break;
      default:
        drawAddressLines(canvas);
    }
    
    canvas.renderAll();
  };

  useEffect(() => {
    drawAnalysisLines();
  }, [currentFrame, swingPhase, poseDetected]);

  const drawAddressLines = (canvas: fabric.Canvas) => {
    // Vertical alignment line
    const verticalLine = new fabric.Line([320, 0, 320, 360], {
      stroke: '#8BC34A', // Secondary green
      strokeWidth: 2,
      strokeDashArray: [5, 5],
    });
    
    // Posture line
    const postureLine = new fabric.Line([280, 100, 380, 300], {
      stroke: '#4CAF50', // Primary green
      strokeWidth: 2,
    });
    
    // Spine angle indicator
    const spineAngle = new fabric.Text('42°', {
      left: 390,
      top: 200,
      fontSize: 16,
      fill: '#4CAF50',
      fontWeight: 'bold',
      backgroundColor: 'rgba(255,255,255,0.7)',
      padding: 5,
    });
    
    // Body alignment points
    drawBodyPoints(canvas);
    
    canvas.add(verticalLine, postureLine, spineAngle);
  };

  const drawTakeawayLines = (canvas: fabric.Canvas) => {
    // Club path line
    const clubPathLine = new fabric.Line([320, 250, 400, 200], {
      stroke: '#4CAF50',
      strokeWidth: 2,
    });
    
    // Takeaway angle
    const takeawayAngle = new fabric.Text('65°', {
      left: 410,
      top: 190,
      fontSize: 16,
      fill: '#4CAF50',
      fontWeight: 'bold',
      backgroundColor: 'rgba(255,255,255,0.7)',
      padding: 5,
    });
    
    // Body alignment points
    drawBodyPoints(canvas);
    
    canvas.add(clubPathLine, takeawayAngle);
  };

  const drawBackswingLines = (canvas: fabric.Canvas) => {
    // Backswing plane
    const backswingPlane = new fabric.Line([200, 50, 400, 250], {
      stroke: '#4CAF50',
      strokeWidth: 2,
    });
    
    // Wrist hinge indicator
    const wristHinge = new fabric.Text('90°', {
      left: 350,
      top: 150,
      fontSize: 16,
      fill: '#4CAF50',
      fontWeight: 'bold',
      backgroundColor: 'rgba(255,255,255,0.7)',
      padding: 5,
    });
    
    // Body alignment points
    drawBodyPoints(canvas);
    
    canvas.add(backswingPlane, wristHinge);
  };

  const drawTopLines = (canvas: fabric.Canvas) => {
    // Swing plane
    const swingPlane = new fabric.Line([150, 50, 450, 250], {
      stroke: '#4CAF50',
      strokeWidth: 2,
    });
    
    // Shoulder turn indicator
    const shoulderTurn = new fabric.Text('90°', {
      left: 150,
      top: 100,
      fontSize: 16,
      fill: '#4CAF50',
      fontWeight: 'bold',
      backgroundColor: 'rgba(255,255,255,0.7)',
      padding: 5,
    });
    
    // Hip turn indicator
    const hipTurn = new fabric.Text('45°', {
      left: 150,
      top: 200,
      fontSize: 16,
      fill: '#4CAF50',
      fontWeight: 'bold',
      backgroundColor: 'rgba(255,255,255,0.7)',
      padding: 5,
    });
    
    // Body alignment points
    drawBodyPoints(canvas);
    
    canvas.add(swingPlane, shoulderTurn, hipTurn);
  };

  const drawDownswingLines = (canvas: fabric.Canvas) => {
    // Downswing plane
    const downswingPlane = new fabric.Line([150, 50, 450, 250], {
      stroke: '#4CAF50',
      strokeWidth: 2,
    });
    
    // Club path
    const clubPath = new fabric.Path('M 400 250 Q 350 200 300 150', {
      stroke: '#8BC34A', // Secondary green
      strokeWidth: 3,
      fill: '',
    });
    
    // Body alignment points
    drawBodyPoints(canvas);
    
    canvas.add(downswingPlane, clubPath);
  };

  const drawImpactLines = (canvas: fabric.Canvas) => {
    // Impact line
    const impactLine = new fabric.Line([320, 0, 320, 360], {
      stroke: '#4CAF50',
      strokeWidth: 2,
    });
    
    // Club face angle
    const clubFaceAngle = new fabric.Text('Square', {
      left: 350,
      top: 250,
      fontSize: 16,
      fill: '#8BC34A',
      fontWeight: 'bold',
      backgroundColor: 'rgba(255,255,255,0.7)',
      padding: 5,
    });
    
    // Attack angle
    const attackAngle = new fabric.Text('-4°', {
      left: 250,
      top: 250,
      fontSize: 16,
      fill: '#4CAF50',
      fontWeight: 'bold',
      backgroundColor: 'rgba(255,255,255,0.7)',
      padding: 5,
    });
    
    // Body alignment points
    drawBodyPoints(canvas);
    
    canvas.add(impactLine, clubFaceAngle, attackAngle);
  };

  const drawFollowThroughLines = (canvas: fabric.Canvas) => {
    // Follow through path
    const followThroughPath = new fabric.Path('M 320 250 Q 370 200 420 150', {
      stroke: '#8BC34A',
      strokeWidth: 3,
      fill: '',
    });
    
    // Body rotation
    const bodyRotation = new fabric.Text('90°', {
      left: 400,
      top: 200,
      fontSize: 16,
      fill: '#4CAF50',
      fontWeight: 'bold',
      backgroundColor: 'rgba(255,255,255,0.7)',
      padding: 5,
    });
    
    // Body alignment points
    drawBodyPoints(canvas);
    
    canvas.add(followThroughPath, bodyRotation);
  };

  const drawFinishLines = (canvas: fabric.Canvas) => {
    // Balance line
    const balanceLine = new fabric.Line([320, 0, 320, 360], {
      stroke: '#4CAF50',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
    });
    
    // Finish position indicator
    const finishPosition = new fabric.Text('Balanced', {
      left: 350,
      top: 150,
      fontSize: 16,
      fill: '#8BC34A',
      fontWeight: 'bold',
      backgroundColor: 'rgba(255,255,255,0.7)',
      padding: 5,
    });
    
    // Body alignment points
    drawBodyPoints(canvas);
    
    canvas.add(balanceLine, finishPosition);
  };

  const drawBodyPoints = (canvas: fabric.Canvas) => {
    // These would be dynamically positioned based on pose detection
    // For now, we'll use static positions for demonstration
    
    // Head
    const head = new fabric.Circle({
      left: 320,
      top: 80,
      radius: 15,
      stroke: '#FFD700', // Gold
      strokeWidth: 2,
      fill: 'rgba(255, 215, 0, 0.2)',
    });
    
    // Shoulders
    const leftShoulder = new fabric.Circle({
      left: 300,
      top: 120,
      radius: 5,
      stroke: '#FFD700',
      strokeWidth: 2,
      fill: 'rgba(255, 215, 0, 0.2)',
    });
    
    const rightShoulder = new fabric.Circle({
      left: 340,
      top: 120,
      radius: 5,
      stroke: '#FFD700',
      strokeWidth: 2,
      fill: 'rgba(255, 215, 0, 0.2)',
    });
    
    // Hips
    const leftHip = new fabric.Circle({
      left: 300,
      top: 180,
      radius: 5,
      stroke: '#FFD700',
      strokeWidth: 2,
      fill: 'rgba(255, 215, 0, 0.2)',
    });
    
    const rightHip = new fabric.Circle({
      left: 340,
      top: 180,
      radius: 5,
      stroke: '#FFD700',
      strokeWidth: 2,
      fill: 'rgba(255, 215, 0, 0.2)',
    });
    
    // Knees
    const leftKnee = new fabric.Circle({
      left: 300,
      top: 240,
      radius: 5,
      stroke: '#FFD700',
      strokeWidth: 2,
      fill: 'rgba(255, 215, 0, 0.2)',
    });
    
    const rightKnee = new fabric.Circle({
      left: 340,
      top: 240,
      radius: 5,
      stroke: '#FFD700',
      strokeWidth: 2,
      fill: 'rgba(255, 215, 0, 0.2)',
    });
    
    // Feet
    const leftFoot = new fabric.Circle({
      left: 300,
      top: 300,
      radius: 5,
      stroke: '#FFD700',
      strokeWidth: 2,
      fill: 'rgba(255, 215, 0, 0.2)',
    });
    
    const rightFoot = new fabric.Circle({
      left: 340,
      top: 300,
      radius: 5,
      stroke: '#FFD700',
      strokeWidth: 2,
      fill: 'rgba(255, 215, 0, 0.2)',
    });
    
    // Connect the points with lines
    const spine = new fabric.Line([320, 80, 320, 180], {
      stroke: '#FFD700',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
    });
    
    const shoulderLine = new fabric.Line([300, 120, 340, 120], {
      stroke: '#FFD700',
      strokeWidth: 2,
    });
    
    const hipLine = new fabric.Line([300, 180, 340, 180], {
      stroke: '#FFD700',
      strokeWidth: 2,
    });
    
    const leftLeg = new fabric.Line([300, 180, 300, 300], {
      stroke: '#FFD700',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
    });
    
    const rightLeg = new fabric.Line([340, 180, 340, 300], {
      stroke: '#FFD700',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
    });
    
    canvas.add(
      head, leftShoulder, rightShoulder, leftHip, rightHip, 
      leftKnee, rightKnee, leftFoot, rightFoot,
      spine, shoulderLine, hipLine, leftLeg, rightLeg
    );
  };

  const handlePrevFrame = () => {
    setCurrentFrame(prev => Math.max(0, prev - 1));
    updateVideoPosition(Math.max(0, currentFrame - 1));
  };

  const handleNextFrame = () => {
    setCurrentFrame(prev => Math.min(totalFrames - 1, prev + 1));
    updateVideoPosition(Math.min(totalFrames - 1, currentFrame + 1));
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      // Start playing
      try {
        if (isYouTube && youtubePlayer) {
          youtubePlayer.target.playVideo();
        } else if (videoRef.current) {
          videoRef.current.play().catch(err => {
            console.error("Error playing video:", err);
            setIsPlaying(false);
          });
        }
        startAnimation();
      } catch (err) {
        console.error("Error toggling play/pause:", err);
        setIsPlaying(false);
      }
    } else {
      // Pause
      try {
        if (isYouTube && youtubePlayer) {
          youtubePlayer.target.pauseVideo();
        } else if (videoRef.current) {
          videoRef.current.pause();
        }
        stopAnimation();
      } catch (err) {
        console.error("Error pausing video:", err);
      }
    }
  };

  const startAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    const animate = () => {
      try {
        if (isYouTube && youtubePlayer) {
          const currentTime = youtubePlayer.target.getCurrentTime();
          const duration = youtubePlayer.target.getDuration();
          const progress = currentTime / duration;
          setCurrentFrame(Math.floor(progress * totalFrames));
        } else if (videoRef.current) {
          const currentTime = videoRef.current.currentTime;
          const duration = videoRef.current.duration;
          const progress = currentTime / duration;
          setCurrentFrame(Math.floor(progress * totalFrames));
        }
      } catch (err) {
        console.error("Animation error:", err);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const updateVideoPosition = (frame: number) => {
    try {
      if (isYouTube && youtubePlayer) {
        const duration = youtubePlayer.target.getDuration();
        const seekTime = (frame / totalFrames) * duration;
        youtubePlayer.target.seekTo(seekTime);
      } else if (videoRef.current) {
        const duration = videoRef.current.duration;
        const seekTime = (frame / totalFrames) * duration;
        videoRef.current.currentTime = seekTime;
      }
    } catch (err) {
      console.error("Error updating video position:", err);
    }
  };

  const handleReset = () => {
    setCurrentFrame(0);
    updateVideoPosition(0);
    setIsPlaying(false);
    
    try {
      if (isYouTube && youtubePlayer) {
        youtubePlayer.target.pauseVideo();
        youtubePlayer.target.seekTo(0);
      } else if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    } catch (err) {
      console.error("Error resetting video:", err);
    }
  };

  const handlePhaseChange = (phase: string) => {
    setSwingPhase(phase);
    
    // Set video to appropriate frame for this phase
    let framePosition = 0;
    
    switch(phase) {
      case 'address':
        framePosition = 0;
        break;
      case 'takeaway':
        framePosition = Math.floor(totalFrames * 0.1);
        break;
      case 'backswing':
        framePosition = Math.floor(totalFrames * 0.2);
        break;
      case 'top':
        framePosition = Math.floor(totalFrames * 0.3);
        break;
      case 'downswing':
        framePosition = Math.floor(totalFrames * 0.4);
        break;
      case 'impact':
        framePosition = Math.floor(totalFrames * 0.5);
        break;
      case 'follow-through':
        framePosition = Math.floor(totalFrames * 0.6);
        break;
      case 'finish':
        framePosition = Math.floor(totalFrames * 0.7);
        break;
    }
    
    setCurrentFrame(framePosition);
    updateVideoPosition(framePosition);
  };

  if (isLoading) {
    return (
      <motion.div 
        className="flex items-center justify-center h-60 bg-lightGray rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <LoadingSpinner text="Loading video analysis..." />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-60 bg-lightError rounded-xl p-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
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
    );
  }

  return (
    <motion.div 
      className="swing-analysis-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Video element (hidden if using YouTube) */}
      {!isYouTube && (
        <video
          ref={videoRef}
          src={videoSrc}
          className={`w-full rounded-xl ${isYouTube ? 'hidden' : ''}`}
          controls={false}
          muted
          playsInline
          crossOrigin="anonymous"
          preload="auto"
        />
      )}
      
      {/* Canvas overlay */}
      <div className="relative mt-4">
        {isAnalyzing && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 rounded-xl">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <LoadingSpinner text="Analyzing swing..." />
            </div>
          </div>
        )}
        
        <canvas ref={canvasRef} className="border border-lightGray rounded-xl shadow-md" />
        <canvas ref={poseCanvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
        
        {/* Video controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.button 
              onClick={handleReset}
              className="p-2 bg-lightGray hover:bg-gray-200 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RotateCcw size={18} className="text-text" />
            </motion.button>
            
            <motion.button 
              onClick={handlePrevFrame}
              className="p-2 bg-lightGray hover:bg-gray-200 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={18} className="text-text" />
            </motion.button>
            
            <motion.button 
              onClick={handlePlayPause}
              className="p-2 bg-primary hover:bg-primary/90 text-white rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </motion.button>
            
            <motion.button 
              onClick={handleNextFrame}
              className="p-2 bg-lightGray hover:bg-gray-200 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={18} className="text-text" />
            </motion.button>
          </div>
          
          <div className="text-sm text-gray font-medium">
            Frame: {currentFrame + 1}/{totalFrames}
          </div>
        </div>
        
        {/* Swing phase selector */}
        <div className="mt-6">
          <SwingPhaseSelector 
            phases={swingPhases}
            activePhase={swingPhase}
            onPhaseChange={handlePhaseChange}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SwingAnalysisCanvas;