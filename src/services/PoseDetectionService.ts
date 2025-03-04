import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import { drawKeypoints, drawSkeleton } from './DrawingUtils';

class PoseDetectionService {
  private detector: poseDetection.PoseDetector | null = null;
  private isInitialized = false;
  private isInitializing = false;
  private lastPoses: poseDetection.Pose[] = [];
  private poseHistory: poseDetection.Pose[][] = [];
  private readonly MAX_HISTORY_LENGTH = 30; // Store last 30 frames for analysis

  async initialize() {
    if (this.isInitialized || this.isInitializing) return;
    
    this.isInitializing = true;
    
    try {
      // Load TensorFlow.js and the WebGL backend
      const tf = await import('@tensorflow/tfjs-core');
      await import('@tensorflow/tfjs-converter');
      await import('@tensorflow/tfjs-backend-webgl');
      
      // Check if WebGL is available
      try {
        await tf.setBackend('webgl');
        await tf.ready();
        console.log('TensorFlow.js initialized with WebGL backend');
      } catch (err) {
        console.warn('WebGL backend not available, falling back to CPU', err);
        await tf.setBackend('cpu');
        await tf.ready();
      }
      
      // Load the MoveNet model - best for golf swing analysis due to accuracy
      const model = poseDetection.SupportedModels.MoveNet;
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
        enableSmoothing: true,
        minPoseScore: 0.25
      };
      
      this.detector = await poseDetection.createDetector(model, detectorConfig);
      this.isInitialized = true;
      this.isInitializing = false;
      console.log('Pose detection model initialized');
    } catch (error) {
      console.error('Error initializing pose detection model:', error);
      this.isInitializing = false;
      throw error;
    }
  }

  async detectPose(image: HTMLVideoElement | HTMLImageElement, canvas?: HTMLCanvasElement) {
    if (!this.isInitialized) {
      try {
        await this.initialize();
      } catch (err) {
        console.error('Failed to initialize pose detection:', err);
        return null;
      }
    }
    
    if (!this.detector) {
      throw new Error('Detector not initialized');
    }
    
    try {
      const poses = await this.detector.estimatePoses(image);
      
      // Store poses in history for temporal analysis
      if (poses && poses.length > 0) {
        this.lastPoses = poses;
        this.poseHistory.push([...poses]);
        
        // Limit history length
        if (this.poseHistory.length > this.MAX_HISTORY_LENGTH) {
          this.poseHistory.shift();
        }
        
        // Draw poses on canvas if provided
        if (canvas && poses.length > 0) {
          this.drawPose(poses[0], canvas, image);
        }
      }
      
      return poses;
    } catch (error) {
      console.error('Error detecting poses:', error);
      return null;
    }
  }

  drawPose(pose: poseDetection.Pose, canvas: HTMLCanvasElement, image: HTMLVideoElement | HTMLImageElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas and draw the video frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas dimensions to match video
    canvas.width = image.width;
    canvas.height = image.height;
    
    // Draw keypoints and skeleton
    drawKeypoints(pose.keypoints, ctx);
    drawSkeleton(pose.keypoints, ctx);
  }

  // Get the last detected poses
  getLastPoses() {
    return this.lastPoses;
  }

  // Get pose history for temporal analysis
  getPoseHistory() {
    return this.poseHistory;
  }

  // Calculate swing metrics based on pose keypoints
  calculateSwingMetrics(poses: poseDetection.Pose[] | null = null) {
    const posesToAnalyze = poses || this.lastPoses;
    
    if (!posesToAnalyze || posesToAnalyze.length === 0) {
      return null;
    }
    
    const pose = posesToAnalyze[0]; // Get the first detected person
    
    // Extract keypoints
    const keypoints = pose.keypoints;
    
    // Calculate metrics
    const metrics = {
      shoulderTurn: this.calculateShoulderTurn(keypoints),
      hipTurn: this.calculateHipTurn(keypoints),
      spineAngle: this.calculateSpineAngle(keypoints),
      kneeFlexion: this.calculateKneeFlexion(keypoints),
      headStability: this.calculateHeadStability(),
      tempo: this.calculateTempo(),
      swingPlane: this.analyzeSwingPlane(),
    };
    
    return metrics;
  }

  // Analyze swing phases using pose history
  analyzeSwingPhases() {
    if (this.poseHistory.length < 10) {
      return null; // Not enough frames to analyze
    }
    
    // Detect key swing phases
    const phases = {
      address: this.detectAddressPosition(),
      takeaway: this.detectTakeaway(),
      backswing: this.detectBackswing(),
      top: this.detectTopOfSwing(),
      downswing: this.detectDownswing(),
      impact: this.detectImpact(),
      followThrough: this.detectFollowThrough(),
      finish: this.detectFinish()
    };
    
    return phases;
  }

  // Detect swing faults by analyzing pose history and metrics
  detectSwingFaults() {
    const metrics = this.calculateSwingMetrics();
    if (!metrics) return [];
    
    const faults = [];
    
    // Check for early extension
    if (this.detectEarlyExtension()) {
      faults.push({
        id: 1,
        name: 'Early Extension',
        severity: this.calculateFaultSeverity('earlyExtension'),
        description: 'Your pelvis is moving toward the ball during the downswing, causing inconsistent contact.',
        recommendations: ['Hip Bumps Against Wall', 'Chair Drill', 'Maintain Posture Exercise']
      });
    }
    
    // Check for over-the-top swing
    if (this.detectOverTheTop()) {
      faults.push({
        id: 2,
        name: 'Over-the-Top',
        severity: this.calculateFaultSeverity('overTheTop'),
        description: 'Your downswing is starting with the upper body, causing an out-to-in swing path.',
        recommendations: ['Headcover Under Arm', 'Towel Drill', 'Drop-in Slot Drill']
      });
    }
    
    // Check for reverse spine angle
    if (this.detectReverseSpineAngle()) {
      faults.push({
        id: 3,
        name: 'Reverse Spine Angle',
        severity: this.calculateFaultSeverity('reverseSpineAngle'),
        description: 'Your spine is tilting toward the target at the top of the backswing, limiting rotation.',
        recommendations: ['Posture Drill with Club', 'Alignment Stick Drill', 'Wall Drill']
      });
    }
    
    // Check for sway
    if (this.detectSway()) {
      faults.push({
        id: 4,
        name: 'Lateral Sway',
        severity: this.calculateFaultSeverity('sway'),
        description: 'Your lower body is moving laterally away from the target during backswing instead of rotating.',
        recommendations: ['Alignment Rod Drill', 'Wall Press Drill', 'Single Leg Balance Practice']
      });
    }
    
    return faults;
  }

  // Helper methods to calculate specific metrics
  private calculateShoulderTurn(keypoints: poseDetection.Keypoint[]) {
    // Find shoulder keypoints
    const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
    const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
    
    if (!leftShoulder || !rightShoulder) {
      return null;
    }
    
    // Calculate shoulder angle relative to horizontal
    const dx = rightShoulder.x - leftShoulder.x;
    const dy = rightShoulder.y - leftShoulder.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    return angle;
  }

  private calculateHipTurn(keypoints: poseDetection.Keypoint[]) {
    // Find hip keypoints
    const leftHip = keypoints.find(kp => kp.name === 'left_hip');
    const rightHip = keypoints.find(kp => kp.name === 'right_hip');
    
    if (!leftHip || !rightHip) {
      return null;
    }
    
    // Calculate hip angle relative to horizontal
    const dx = rightHip.x - leftHip.x;
    const dy = rightHip.y - leftHip.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    return angle;
  }

  private calculateSpineAngle(keypoints: poseDetection.Keypoint[]) {
    // Find relevant keypoints
    const nose = keypoints.find(kp => kp.name === 'nose');
    const midHip = this.calculateMidpoint(
      keypoints.find(kp => kp.name === 'left_hip'),
      keypoints.find(kp => kp.name === 'right_hip')
    );
    
    if (!nose || !midHip) {
      return null;
    }
    
    // Calculate spine angle relative to vertical
    const dx = nose.x - midHip.x;
    const dy = nose.y - midHip.y;
    const angle = Math.atan2(dx, dy) * (180 / Math.PI);
    
    return angle;
  }

  private calculateKneeFlexion(keypoints: poseDetection.Keypoint[]) {
    // Find relevant keypoints
    const leftKnee = keypoints.find(kp => kp.name === 'left_knee');
    const rightKnee = keypoints.find(kp => kp.name === 'right_knee');
    const leftHip = keypoints.find(kp => kp.name === 'left_hip');
    const rightHip = keypoints.find(kp => kp.name === 'right_hip');
    const leftAnkle = keypoints.find(kp => kp.name === 'left_ankle');
    const rightAnkle = keypoints.find(kp => kp.name === 'right_ankle');
    
    if (!leftKnee || !rightKnee || !leftHip || !rightHip || !leftAnkle || !rightAnkle) {
      return null;
    }
    
    // Calculate angle between hip, knee, and ankle
    const leftAngle = this.calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightAngle = this.calculateAngle(rightHip, rightKnee, rightAnkle);
    
    return { left: leftAngle, right: rightAngle };
  }

  private calculateHeadStability() {
    // Analyze head movement throughout the swing
    if (this.poseHistory.length < 5) return null;
    
    const headPositions = this.poseHistory.map(poses => {
      if (poses.length === 0) return null;
      return poses[0].keypoints.find(kp => kp.name === 'nose');
    }).filter(Boolean);
    
    if (headPositions.length < 5) return null;
    
    // Calculate variance in head position
    let sumX = 0, sumY = 0, sumX2 = 0, sumY2 = 0;
    
    headPositions.forEach(pos => {
      if (pos) {
        sumX += pos.x;
        sumY += pos.y;
        sumX2 += pos.x * pos.x;
        sumY2 += pos.y * pos.y;
      }
    });
    
    const n = headPositions.length;
    const varianceX = sumX2 / n - (sumX / n) ** 2;
    const varianceY = sumY2 / n - (sumY / n) ** 2;
    
    // Total variance (lower is more stable)
    const totalVariance = Math.sqrt(varianceX + varianceY);
    
    return totalVariance;
  }

  private calculateTempo() {
    // Analyze swing tempo using the time between key phases
    const phases = this.analyzeSwingPhases();
    if (!phases || !phases.top || !phases.impact) return null;
    
    // Calculate backswing to downswing ratio
    const backswingFrames = phases.top.frameIndex - phases.address.frameIndex;
    const downswingFrames = phases.impact.frameIndex - phases.top.frameIndex;
    
    if (backswingFrames <= 0 || downswingFrames <= 0) return null;
    
    // Calculate tempo ratio (typically around 3:1 for pros)
    const tempoRatio = backswingFrames / downswingFrames;
    
    return tempoRatio.toFixed(1) + ':1';
  }

  private analyzeSwingPlane() {
    // Analyze the swing plane using club path
    // This would require tracking the club, which is more complex
    // For now, we'll return a placeholder
    return 'neutral';
  }

  // Methods to detect swing phases
  private detectAddressPosition() {
    // Detect the address position based on pose stability
    // For now, we'll assume the first few frames are address
    if (this.poseHistory.length < 3) return { detected: false, frameIndex: 0 };
    
    return { detected: true, frameIndex: 0 };
  }

  private detectTakeaway() {
    // Detect the takeaway phase
    if (this.poseHistory.length < 5) return { detected: false, frameIndex: 0 };
    
    // Simplified: assume takeaway is around 20% into the swing
    const frameIndex = Math.floor(this.poseHistory.length * 0.2);
    return { detected: true, frameIndex };
  }

  private detectBackswing() {
    // Detect the backswing phase
    if (this.poseHistory.length < 8) return { detected: false, frameIndex: 0 };
    
    // Simplified: assume backswing is around 40% into the swing
    const frameIndex = Math.floor(this.poseHistory.length * 0.4);
    return { detected: true, frameIndex };
  }

  private detectTopOfSwing() {
    // Detect the top of the swing
    if (this.poseHistory.length < 10) return { detected: false, frameIndex: 0 };
    
    // Simplified: assume top of swing is around 50% into the swing
    const frameIndex = Math.floor(this.poseHistory.length * 0.5);
    return { detected: true, frameIndex };
  }

  private detectDownswing() {
    // Detect the downswing phase
    if (this.poseHistory.length < 12) return { detected: false, frameIndex: 0 };
    
    // Simplified: assume downswing is around 60% into the swing
    const frameIndex = Math.floor(this.poseHistory.length * 0.6);
    return { detected: true, frameIndex };
  }

  private detectImpact() {
    // Detect the impact phase
    if (this.poseHistory.length < 15) return { detected: false, frameIndex: 0 };
    
    // Simplified: assume impact is around 70% into the swing
    const frameIndex = Math.floor(this.poseHistory.length * 0.7);
    return { detected: true, frameIndex };
  }

  private detectFollowThrough() {
    // Detect the follow-through phase
    if (this.poseHistory.length < 18) return { detected: false, frameIndex: 0 };
    
    // Simplified: assume follow-through is around 80% into the swing
    const frameIndex = Math.floor(this.poseHistory.length * 0.8);
    return { detected: true, frameIndex };
  }

  private detectFinish() {
    // Detect the finish position
    if (this.poseHistory.length < 20) return { detected: false, frameIndex: 0 };
    
    // Simplified: assume finish is around 90% into the swing
    const frameIndex = Math.floor(this.poseHistory.length * 0.9);
    return { detected: true, frameIndex };
  }

  // Methods to detect swing faults
  private detectEarlyExtension() {
    // Detect early extension by analyzing hip position during downswing
    // For now, return a placeholder
    return Math.random() > 0.5;
  }

  private detectOverTheTop() {
    // Detect over-the-top swing path
    // For now, return a placeholder
    return Math.random() > 0.6;
  }

  private detectReverseSpineAngle() {
    // Detect reverse spine angle at the top of the swing
    // For now, return a placeholder
    return Math.random() > 0.7;
  }

  private detectSway() {
    // Detect lateral sway during the backswing
    // For now, return a placeholder
    return Math.random() > 0.8;
  }

  // Calculate the severity of a fault
  private calculateFaultSeverity(faultType: string) {
    // For now, randomly assign severity
    const random = Math.random();
    if (random < 0.33) return 'mild';
    if (random < 0.66) return 'moderate';
    return 'severe';
  }

  private calculateMidpoint(point1?: poseDetection.Keypoint, point2?: poseDetection.Keypoint) {
    if (!point1 || !point2) {
      return null;
    }
    
    return {
      x: (point1.x + point2.x) / 2,
      y: (point1.y + point2.y) / 2,
      name: 'midpoint',
      score: Math.min(point1.score || 0, point2.score || 0),
    };
  }

  private calculateAngle(point1?: poseDetection.Keypoint, point2?: poseDetection.Keypoint, point3?: poseDetection.Keypoint) {
    if (!point1 || !point2 || !point3) {
      return null;
    }
    
    const vector1 = {
      x: point1.x - point2.x,
      y: point1.y - point2.y,
    };
    
    const vector2 = {
      x: point3.x - point2.x,
      y: point3.y - point2.y,
    };
    
    // Calculate dot product
    const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
    
    // Calculate magnitudes
    const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
    const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
    
    // Calculate angle in radians
    const angleRad = Math.acos(dotProduct / (magnitude1 * magnitude2));
    
    // Convert to degrees
    const angleDeg = angleRad * (180 / Math.PI);
    
    return angleDeg;
  }
}

export default new PoseDetectionService();