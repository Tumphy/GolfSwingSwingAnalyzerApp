import { useState, useRef } from 'react';
import { Upload, Link, X, Youtube } from 'lucide-react';
import AnimatedGolfBall from './AnimatedGolfBall';
import { motion } from 'framer-motion';

interface VideoUploaderProps {
  onVideoSelected: (videoSrc: string, isYouTube: boolean) => void;
  view: string;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoSelected, view }) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    
    // Check file type
    const validTypes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v'];
    if (!validTypes.includes(file.type)) {
      setUploadError(`Unsupported file format: ${file.type}. Please use MP4, MOV, or WebM.`);
      setIsUploading(false);
      return;
    }
    
    // Check file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setUploadError('File too large. Please upload a video smaller than 100MB.');
      setIsUploading(false);
      return;
    }
    
    // Simulate upload delay
    setTimeout(() => {
      try {
        const videoUrl = URL.createObjectURL(file);
        onVideoSelected(videoUrl, false);
        setIsUploading(false);
      } catch (error) {
        console.error("Error creating object URL:", error);
        setUploadError('Failed to process video. Please try a different file.');
        setIsUploading(false);
      }
    }, 1500);
  };

  const handleYoutubeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (youtubeUrl) {
      setIsUploading(true);
      setUploadError(null);
      
      // Extract YouTube video ID
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = youtubeUrl.match(youtubeRegex);
      
      // Simulate processing delay
      setTimeout(() => {
        if (match && match[1]) {
          const videoId = match[1];
          onVideoSelected(videoId, true);
          setYoutubeUrl('');
          setShowYoutubeInput(false);
        } else {
          setUploadError('Please enter a valid YouTube URL');
        }
        setIsUploading(false);
      }, 1000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      handleFileUpload(file);
    } else {
      setUploadError('Please drop a valid video file (MP4, MOV, or WebM)');
    }
  };

  return (
    <div className="flex flex-col items-center">
      {isUploading ? (
        <motion.div 
          className="flex flex-col items-center justify-center py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatedGolfBall size={48} />
          <motion.p 
            className="mt-4 text-primary font-medium"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Processing video...
          </motion.p>
        </motion.div>
      ) : (
        <>
          {uploadError && (
            <motion.div 
              className="w-full bg-lightError p-3 rounded-lg mb-4 text-error text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              ⚠️ {uploadError}
            </motion.div>
          )}
          
          <motion.div 
            className={`w-full border-2 border-dashed rounded-xl p-8 mb-4 text-center cursor-pointer transition-all ${
              isDragging ? 'border-primary bg-lightPrimary' : 'border-lightGray hover:border-primary hover:bg-lightPrimary/50'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Upload size={32} className="mx-auto text-primary mb-2" />
              <p className="text-sm font-medium text-text mb-1">
                Drag & drop your video here or click to browse
              </p>
              <p className="text-xs text-gray">
                Supports MP4, MOV, WEBM (max 100MB)
              </p>
            </motion.div>
          </motion.div>

          <div className="flex space-x-3 mb-4 w-full">
            <motion.button 
              className="flex-1 bg-primary text-white px-4 py-3 rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Upload size={18} />
              <span className="ml-2 text-sm font-semibold">Upload Video</span>
            </motion.button>
            
            <motion.button 
              className="flex-1 bg-accent text-text px-4 py-3 rounded-full flex items-center justify-center hover:bg-accent/90 transition-colors"
              onClick={() => setShowYoutubeInput(!showYoutubeInput)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Youtube size={18} />
              <span className="ml-2 text-sm font-semibold">YouTube Link</span>
            </motion.button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/mp4,video/quicktime,video/webm,video/x-m4v"
            className="hidden"
          />

          {showYoutubeInput && (
            <motion.form 
              onSubmit={handleYoutubeSubmit} 
              className="w-full mt-2"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="Paste YouTube URL here"
                  className="w-full px-4 py-3 pr-10 border border-lightGray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowYoutubeInput(false)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray hover:text-text"
                >
                  <X size={16} />
                </button>
              </div>
              <motion.button
                type="submit"
                className="w-full mt-3 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Analyze {view} Video
              </motion.button>
            </motion.form>
          )}
        </>
      )}
    </div>
  );
};

export default VideoUploader;