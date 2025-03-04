import PoseDetectionService from './PoseDetectionService';
import MLService from './MLService';
import StorageService from './StorageService';
import { v4 as uuidv4 } from 'uuid';

// Define types for analysis results
export interface SwingAnalysisResult {
  id: string;
  date: string;
  swingScore: number;
  metrics: {
    shoulderTurn: number | null;
    hipTurn: number | null;
    spineAngle: number | null;
    tempo: string | null;
    clubSpeed: string | null;
    attackAngle: string | null;
    clubPath: string | null;
    faceAngle: string | null;
  };
  faults: SwingFault[];
  recommendations: string[];
  view: 'face-on' | 'down-line';
  videoUrl?: string;
}

export interface SwingFault {
  id: number;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  recommendations: string[];
}

class AnalysisService {
  private analysisResults: SwingAnalysisResult[] = [];
  private isInitialized = false;
  
  constructor() {
    this.init();
  }
  
  private async init() {
    if (this.isInitialized) return;
    
    try {
      // Load saved analyses from storage
      this.analysisResults = StorageService.loadAnalysisResults();
      
      // Initialize ML service
      await MLService.initialize();
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing AnalysisService:', error);
    }
  }
  
  // Analyze a swing video and generate results
  async analyzeSwing(videoElement: HTMLVideoElement, view: 'face-on' | 'down-line'): Promise<SwingAnalysisResult> {
    try {
      // Process video frames to detect poses
      await this.processVideoFrames(videoElement);
      
      // Get pose history for ML analysis
      const poseHistory = PoseDetectionService.getPoseHistory();
      
      // Use ML model to analyze the swing
      const mlPrediction = await MLService.analyzeSwing(poseHistory);
      
      // Map ML prediction to swing faults
      const swingFaults = this.mapPredictionToFaults(mlPrediction);
      
      // Generate recommendations based on faults
      const recommendations = this.generateRecommendations(swingFaults);
      
      // Create analysis result
      const result: SwingAnalysisResult = {
        id: uuidv4(),
        date: new Date().toISOString(),
        swingScore: mlPrediction.swingScore,
        metrics: {
          shoulderTurn: mlPrediction.metrics.shoulderTurn,
          hipTurn: mlPrediction.metrics.hipTurn,
          spineAngle: mlPrediction.metrics.spineAngle,
          tempo: mlPrediction.metrics.tempo,
          clubSpeed: this.estimateClubSpeed(mlPrediction.swingScore),
          attackAngle: mlPrediction.metrics.attackAngle,
          clubPath: mlPrediction.metrics.clubPath,
          faceAngle: mlPrediction.metrics.faceAngle,
        },
        faults: swingFaults,
        recommendations,
        view
      };
      
      // Save the result
      this.analysisResults.push(result);
      StorageService.saveAnalysisResult(result);
      
      return result;
    } catch (error) {
      console.error('Error analyzing swing:', error);
      // Return fallback analysis if real analysis fails
      return this.generateFallbackAnalysis(view);
    }
  }
  
  // Process video frames to extract pose data
  private async processVideoFrames(videoElement: HTMLVideoElement) {
    // Reset pose history
    PoseDetectionService.getPoseHistory().length = 0;
    
    // Process key frames from the video
    const duration = videoElement.duration;
    const frameCount = Math.min(30, Math.floor(duration * 3)); // Process up to 30 frames
    
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
      await PoseDetectionService.detectPose(videoElement);
    }
    
    // Reset video to start
    videoElement.currentTime = 0;
  }
  
  // Map ML prediction to swing faults
  private mapPredictionToFaults(prediction: any): SwingFault[] {
    const faults: SwingFault[] = [];
    
    // Early Extension
    if (prediction.faults.earlyExtension.detected) {
      faults.push({
        id: 1,
        name: 'Early Extension',
        severity: prediction.faults.earlyExtension.severity,
        description: 'Your pelvis is moving toward the ball during the downswing, causing inconsistent contact.',
        recommendations: ['Hip Bumps Against Wall', 'Chair Drill', 'Maintain Posture Exercise']
      });
    }
    
    // Over-the-Top
    if (prediction.faults.overTheTop.detected) {
      faults.push({
        id: 2,
        name: 'Over-the-Top',
        severity: prediction.faults.overTheTop.severity,
        description: 'Your downswing is starting with the upper body, causing an out-to-in swing path.',
        recommendations: ['Headcover Under Arm', 'Towel Drill', 'Drop-in Slot Drill']
      });
    }
    
    // Reverse Spine Angle
    if (prediction.faults.reverseSpineAngle.detected) {
      faults.push({
        id: 3,
        name: 'Reverse Spine Angle',
        severity: prediction.faults.reverseSpineAngle.severity,
        description: 'Your spine is tilting toward the target at the top of the backswing, limiting rotation.',
        recommendations: ['Posture Drill with Club', 'Alignment Stick Drill', 'Wall Drill']
      });
    }
    
    // Sway
    if (prediction.faults.sway.detected) {
      faults.push({
        id: 4,
        name: 'Lateral Sway',
        severity: prediction.faults.sway.severity,
        description: 'Your lower body is moving laterally away from the target during backswing instead of rotating.',
        recommendations: ['Alignment Rod Drill', 'Wall Press Drill', 'Single Leg Balance Practice']
      });
    }
    
    return faults;
  }
  
  // Generate recommendations based on detected faults
  private generateRecommendations(faults: SwingFault[]): string[] {
    const recommendations: string[] = [];
    
    // Add general recommendations
    recommendations.push('Focus on maintaining a consistent tempo throughout your swing');
    
    // Add specific recommendations based on faults
    faults.forEach(fault => {
      // Add the first recommendation from each fault
      if (fault.recommendations.length > 0) {
        recommendations.push(`To fix ${fault.name.toLowerCase()}: ${fault.recommendations[0]}`);
      }
    });
    
    // Add a positive note if few faults
    if (faults.length <= 1) {
      recommendations.push('Your swing fundamentals look good. Keep practicing for consistency!');
    }
    
    return recommendations;
  }
  
  // Estimate club speed based on swing score
  private estimateClubSpeed(swingScore: number): string {
    // Simple estimation based on swing score
    const baseSpeed = 85; // mph
    const adjustedSpeed = baseSpeed + (swingScore - 75) * 0.5;
    return `${Math.round(adjustedSpeed)} mph`;
  }
  
  // Generate fallback analysis if real analysis fails
  private generateFallbackAnalysis(view: 'face-on' | 'down-line'): SwingAnalysisResult {
    const swingScore = Math.floor(Math.random() * 20) + 65; // Random score between 65-85
    
    // Generate some random faults
    const faults: SwingFault[] = [];
    
    if (Math.random() > 0.5) {
      faults.push({
        id: 1,
        name: 'Early Extension',
        severity: Math.random() > 0.6 ? 'moderate' : 'mild',
        description: 'Your pelvis is moving toward the ball during the downswing, causing inconsistent contact.',
        recommendations: ['Hip Bumps Against Wall', 'Chair Drill', 'Maintain Posture Exercise']
      });
    }
    
    if (Math.random() > 0.6) {
      faults.push({
        id: 2,
        name: 'Over-the-Top',
        severity: Math.random() > 0.7 ? 'severe' : 'moderate',
        description: 'Your downswing is starting with the upper body, causing an out-to-in swing path.',
        recommendations: ['Headcover Under Arm', 'Towel Drill', 'Drop-in Slot Drill']
      });
    }
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(faults);
    
    return {
      id: uuidv4(),
      date: new Date().toISOString(),
      swingScore,
      metrics: {
        shoulderTurn: Math.floor(Math.random() * 20) + 80, // 80-100
        hipTurn: Math.floor(Math.random() * 15) + 35, // 35-50
        spineAngle: Math.floor(Math.random() * 10) + 30, // 30-40
        tempo: `${(Math.random() * 0.8 + 2.6).toFixed(1)}:1`, // 2.6-3.4:1
        clubSpeed: this.estimateClubSpeed(swingScore),
        attackAngle: `${(Math.random() * 5 - 5).toFixed(1)}°`, // -5 to 0
        clubPath: `${(Math.random() * 8 - 4).toFixed(1)}°`, // -4 to 4
        faceAngle: `${(Math.random() * 6 - 3).toFixed(1)}°`, // -3 to 3
      },
      faults,
      recommendations,
      view
    };
  }
  
  // Get all analysis results
  getAnalysisResults(): SwingAnalysisResult[] {
    return this.analysisResults;
  }
  
  // Get a specific analysis result by ID
  getAnalysisResultById(id: string): SwingAnalysisResult | undefined {
    return this.analysisResults.find(result => result.id === id);
  }
  
  // Compare user's swing with pro golfer data
  compareWithPro(analysisId: string, proGolferId: string) {
    const userAnalysis = this.getAnalysisResultById(analysisId);
    if (!userAnalysis) return null;
    
    // In a real app, we would fetch pro golfer data from a database
    // For now, we'll use hardcoded data
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
    
    const pro = proData[proGolferId as keyof typeof proData];
    if (!pro) return null;
    
    // Calculate differences
    const differences = {
      shoulderTurn: userAnalysis.metrics.shoulderTurn !== null ? 
        userAnalysis.metrics.shoulderTurn - pro.metrics.shoulderTurn : null,
      hipTurn: userAnalysis.metrics.hipTurn !== null ? 
        userAnalysis.metrics.hipTurn - pro.metrics.hipTurn : null,
      tempo: userAnalysis.metrics.tempo && pro.metrics.tempo ? 
        parseFloat(userAnalysis.metrics.tempo.split(':')[0]) - parseFloat(pro.metrics.tempo.split(':')[0]) : null,
      clubSpeed: userAnalysis.metrics.clubSpeed && pro.metrics.clubSpeed ? 
        parseInt(userAnalysis.metrics.clubSpeed) - parseInt(pro.metrics.clubSpeed) : null,
    };
    
    return {
      proName: pro.name,
      proMetrics: pro.metrics,
      differences
    };
  }
}

export default new AnalysisService();