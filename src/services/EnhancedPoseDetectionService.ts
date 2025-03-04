import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import { BaselineSwingData, parseRange, isWithinRange, calculateDeviation } from './SwingBaselineData';
import { drawKeypoints, drawSkeleton } from './DrawingUtils';

// Define types for swing metrics
export interface SwingMetrics {
    shoulderTurn: number | null;
    hipTurn: number | null;
    spineAngle: number | null;
    kneeFlexion: number | null;
    headHeight: number | null;
    swingPlaneAngle: number | null;
    hipSlide: number | null;
    armExtension: number | null;
    tempo: string | null;
}

// Define types for swing faults
export interface SwingFault {
    name: string;
    description: string;
    severity: 'mild' | 'moderate' | 'severe';
    confidence: number;
    recommendations: string[];
}

// Define types for swing phase detection
export interface SwingPhase {
    name: string;
    frameIndex: number;
    confidence: number;
}

class EnhancedPoseDetectionService {
    private detector: poseDetection.PoseDetector | null = null;
    private isInitialized = false;
    private poseHistory: poseDetection.Pose[][] = [];
    private swingPhases: SwingPhase[] = [];
    private clubType: 'Driver' | 'Iron' = 'Iron';
    private viewType: 'Face-On' | 'Down-the-Line' = 'Face-On';
    private handedness: 'right' | 'left' = 'right';

    // Initialize the pose detector
    async initialize(): Promise<void> {
        if (this.isInitialized) return;
        
        try {
            // Load TensorFlow.js and the WebGL backend
            const tf = await import('@tensorflow/tfjs-core');
            await import('@tensorflow/tfjs-converter');
            await import('@tensorflow/tfjs-backend-webgl');
            
            // Set backend to WebGL for better performance
            await tf.setBackend('webgl');
            await tf.ready();
            
            // Initialize MoveNet model (best for golf swing analysis)
            const model = poseDetection.SupportedModels.MoveNet;
            const detectorConfig = {
                modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
                enableSmoothing: true,
                minPoseScore: 0.25
            };
            
            this.detector = await poseDetection.createDetector(model, detectorConfig);
            this.isInitialized = true;
            console.log('Enhanced pose detection model initialized');
        } catch (error) {
            console.error('Error initializing enhanced pose detection:', error);
            throw error;
        }
    }

    // Set configuration for analysis
    setConfiguration(clubType: 'Driver' | 'Iron', viewType: 'Face-On' | 'Down-the-Line', handedness: 'right' | 'left'): void {
        this.clubType = clubType;
        this.viewType = viewType;
        this.handedness = handedness;
    }

    // Process video for swing analysis
    async processVideo(videoElement: HTMLVideoElement): Promise<void> {
        if (!this.isInitialized) {
            await this.initialize();
        }
        
        if (!this.detector) {
            throw new Error('Detector not initialized');
        }
        
        // Reset history
        this.poseHistory = [];
        this.swingPhases = [];
        
        try {
            // Sample frames from the video
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
                const poses = await this.detector.estimatePoses(videoElement);
                
                if (poses && poses.length > 0) {
                    this.poseHistory.push([...poses]);
                }
            }
            
            // Reset video to start
            videoElement.currentTime = 0;
            
            // Detect swing phases
            this.detectSwingPhases();
            
            return;
        } catch (error) {
            console.error('Error processing video for enhanced analysis:', error);
            throw error;
        }
    }

    // Detect key swing phases
    private detectSwingPhases(): void {
        if (this.poseHistory.length < 10) {
            console.warn('Not enough frames to detect swing phases');
            return;
        }
        
        // Simple approach: divide the swing into phases based on frame indices
        const totalFrames = this.poseHistory.length;
        
        this.swingPhases = [
            { name: 'Address', frameIndex: 0, confidence: 0.9 },
            { name: 'Takeaway', frameIndex: Math.floor(totalFrames * 0.1), confidence: 0.85 },
            { name: 'Early Backswing', frameIndex: Math.floor(totalFrames * 0.25), confidence: 0.8 },
            { name: 'Top of Backswing', frameIndex: Math.floor(totalFrames * 0.4), confidence: 0.9 },
            { name: 'Transition', frameIndex: Math.floor(totalFrames * 0.5), confidence: 0.85 },
            { name: 'Downswing', frameIndex: Math.floor(totalFrames * 0.6), confidence: 0.9 },
            { name: 'Impact', frameIndex: Math.floor(totalFrames * 0.7), confidence: 0.95 },
            { name: 'Follow-Through', frameIndex: Math.floor(totalFrames * 0.85), confidence: 0.9 }
        ];
        
        // In a production version, we would use ML to detect these phases more accurately
        // For now, this simple approach will work for demonstration
    }

    // Calculate angle between three points
    private calculateAngle(a: number[], b: number[], c: number[]): number {
        const ab = [a[0] - b[0], a[1] - b[1]];
        const cb = [c[0] - b[0], c[1] - b[1]];
        
        // Calculate dot product
        const dot = ab[0] * cb[0] + ab[1] * cb[1];
        
        // Calculate magnitudes
        const abMag = Math.sqrt(ab[0] * ab[0] + ab[1] * ab[1]);
        const cbMag = Math.sqrt(cb[0] * cb[0] + cb[1] * cb[1]);
        
        // Calculate angle in radians
        const angle = Math.acos(dot / (abMag * cbMag));
        
        // Convert to degrees
        return angle * (180 / Math.PI);
    }

    // Get coordinates from a keypoint
    private getCoords(keypoint: poseDetection.Keypoint): number[] {
        return [keypoint.x, keypoint.y];
    }

    // Calculate swing metrics for a specific phase
    calculateSwingMetrics(phaseName: string): SwingMetrics {
        const phase = this.swingPhases.find(p => p.name === phaseName);
        if (!phase || this.poseHistory.length === 0) {
            return {
                shoulderTurn: null,
                hipTurn: null,
                spineAngle: null,
                kneeFlexion: null,
                headHeight: null,
                swingPlaneAngle: null,
                hipSlide: null,
                armExtension: null,
                tempo: null
            };
        }
        
        // Get pose data for this phase
        const frameIndex = Math.min(phase.frameIndex, this.poseHistory.length - 1);
        const pose = this.poseHistory[frameIndex][0]; // Get first person
        
        if (!pose || !pose.keypoints) {
            return {
                shoulderTurn: null,
                hipTurn: null,
                spineAngle: null,
                kneeFlexion: null,
                headHeight: null,
                swingPlaneAngle: null,
                hipSlide: null,
                armExtension: null,
                tempo: null
            };
        }
        
        // Extract keypoints
        const keypoints = pose.keypoints;
        const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
        const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
        const leftHip = keypoints.find(kp => kp.name === 'left_hip');
        const rightHip = keypoints.find(kp => kp.name === 'right_hip');
        const leftKnee = keypoints.find(kp => kp.name === 'left_knee');
        const rightKnee = keypoints.find(kp => kp.name === 'right_knee');
        const leftAnkle = keypoints.find(kp => kp.name === 'left_ankle');
        const rightAnkle = keypoints.find(kp => kp.name === 'right_ankle');
        const nose = keypoints.find(kp => kp.name === 'nose');
        
        // Calculate metrics
        let shoulderTurn = null;
        let hipTurn = null;
        let spineAngle = null;
        let kneeFlexion = null;
        let headHeight = null;
        let swingPlaneAngle = null;
        let hipSlide = null;
        let armExtension = null;
        
        // Calculate shoulder turn
        if (leftShoulder && rightShoulder) {
            const dx = rightShoulder.x - leftShoulder.x;
            const dy = rightShoulder.y - leftShoulder.y;
            shoulderTurn = Math.atan2(dy, dx) * (180 / Math.PI);
            
            // Adjust for handedness
            if (this.handedness === 'left') {
                shoulderTurn = -shoulderTurn;
            }
        }
        
        // Calculate hip turn
        if (leftHip && rightHip) {
            const dx = rightHip.x - leftHip.x;
            const dy = rightHip.y - leftHip.y;
            hipTurn = Math.atan2(dy, dx) * (180 / Math.PI);
            
            // Adjust for handedness
            if (this.handedness === 'left') {
                hipTurn = -hipTurn;
            }
        }
        
        // Calculate spine angle
        if (leftShoulder && leftHip && rightShoulder && rightHip) {
            const midShoulder = {
                x: (leftShoulder.x + rightShoulder.x) / 2,
                y: (leftShoulder.y + rightShoulder.y) / 2
            };
            
            const midHip = {
                x: (leftHip.x + rightHip.x) / 2,
                y: (leftHip.y + rightHip.y) / 2
            };
            
            const dx = midShoulder.x - midHip.x;
            const dy = midShoulder.y - midHip.y;
            spineAngle = Math.atan2(dx, dy) * (180 / Math.PI);
        }
        
        // Calculate knee flexion
        if (leftHip && leftKnee && leftAnkle) {
            kneeFlexion = this.calculateAngle(
                this.getCoords(leftHip),
                this.getCoords(leftKnee),
                this.getCoords(leftAnkle)
            );
        }
        
        // Calculate head height (relative to address position)
        if (nose && this.poseHistory.length > 0) {
            const addressPose = this.poseHistory[0][0];
            const addressNose = addressPose.keypoints.find(kp => kp.name === 'nose');
            
            if (addressNose) {
                headHeight = nose.y / addressNose.y;
            }
        }
        
        // Calculate hip slide (lateral movement)
        if (leftHip && rightHip && this.poseHistory.length > 0) {
            const addressPose = this.poseHistory[0][0];
            const addressLeftHip = addressPose.keypoints.find(kp => kp.name === 'left_hip');
            const addressRightHip = addressPose.keypoints.find(kp => kp.name === 'right_hip');
            
            if (addressLeftHip && addressRightHip) {
                const currentMidHipX = (leftHip.x + rightHip.x) / 2;
                const addressMidHipX = (addressLeftHip.x + addressRightHip.x) / 2;
                
                hipSlide = currentMidHipX - addressMidHipX;
            }
        }
        
        // Calculate swing plane angle (for down-the-line view)
        if (this.viewType === 'Down-the-Line' && leftShoulder && rightShoulder && leftHip && rightHip) {
            // This is a simplified calculation
            const shoulderLine = Math.atan2(rightShoulder.y - leftShoulder.y, rightShoulder.x - leftShoulder.x);
            const hipLine = Math.atan2(rightHip.y - leftHip.y, rightHip.x - leftHip.x);
            
            swingPlaneAngle = Math.abs(shoulderLine - hipLine) * (180 / Math.PI);
        }
        
        // Calculate tempo (backswing to downswing ratio)
        let tempo = null;
        const topPhase = this.swingPhases.find(p => p.name === 'Top of Backswing');
        const impactPhase = this.swingPhases.find(p => p.name === 'Impact');
        
        if (topPhase && impactPhase) {
            const backswingFrames = topPhase.frameIndex;
            const downswingFrames = impactPhase.frameIndex - topPhase.frameIndex;
            
            if (backswingFrames > 0 && downswingFrames > 0) {
                const ratio = backswingFrames / downswingFrames;
                tempo = ratio.toFixed(1) + ':1';
            }
        }
        
        return {
            shoulderTurn,
            hipTurn,
            spineAngle,
            kneeFlexion,
            headHeight,
            swingPlaneAngle,
            hipSlide,
            armExtension,
            tempo
        };
    }

    // Detect swing faults by comparing metrics to baseline data
    detectSwingFaults(): SwingFault[] {
        const faults: SwingFault[] = [];
        
        // Check each phase for potential faults
        for (const phase of this.swingPhases) {
            const metrics = this.calculateSwingMetrics(phase.name);
            const baselineData = BaselineSwingData[this.clubType][this.viewType][phase.name as keyof typeof BaselineSwingData.Driver['Face-On']];
            
            if (!baselineData || !metrics) continue;
            
            // Check shoulder turn
            if (metrics.shoulderTurn !== null && baselineData.ShoulderTurn && this.viewType === 'Face-On') {
                const deviation = calculateDeviation(metrics.shoulderTurn, baselineData.ShoulderTurn);
                
                if (deviation > 15) {
                    faults.push({
                        name: 'Excessive Shoulder Turn',
                        description: `Your shoulder turn is ${deviation.toFixed(1)}° ${metrics.shoulderTurn > parseRange(baselineData.ShoulderTurn).max ? 'too much' : 'too little'} at ${phase.name}.`,
                        severity: deviation > 25 ? 'severe' : deviation > 20 ? 'moderate' : 'mild',
                        confidence: 0.8,
                        recommendations: [
                            'Focus on proper shoulder rotation',
                            'Practice with alignment sticks',
                            'Work on flexibility exercises'
                        ]
                    });
                }
            }
            
            // Check hip turn
            if (metrics.hipTurn !== null && baselineData.HipTurn && this.viewType === 'Face-On') {
                const deviation = calculateDeviation(metrics.hipTurn, baselineData.HipTurn);
                
                if (deviation > 10) {
                    faults.push({
                        name: 'Improper Hip Rotation',
                        description: `Your hip turn is ${deviation.toFixed(1)}° ${metrics.hipTurn > parseRange(baselineData.HipTurn).max ? 'too much' : 'too little'} at ${phase.name}.`,
                        severity: deviation > 20 ? 'severe' : deviation > 15 ? 'moderate' : 'mild',
                        confidence: 0.85,
                        recommendations: [
                            'Practice hip rotation drills',
                            'Use a mirror for feedback',
                            'Strengthen core muscles'
                        ]
                    });
                }
            }
            
            // Check spine angle
            if (metrics.spineAngle !== null && baselineData.SpineTilt) {
                const deviation = calculateDeviation(metrics.spineAngle, baselineData.SpineTilt);
                
                if (deviation > 8) {
                    faults.push({
                        name: phase.name === 'Top of Backswing' ? 'Reverse Spine Angle' : 'Improper Spine Tilt',
                        description: `Your spine angle is ${deviation.toFixed(1)}° ${metrics.spineAngle > parseRange(baselineData.SpineTilt).max ? 'too upright' : 'too tilted'} at ${phase.name}.`,
                        severity: deviation > 15 ? 'severe' : deviation > 10 ? 'moderate' : 'mild',
                        confidence: 0.9,
                        recommendations: [
                            'Practice maintaining spine angle throughout swing',
                            'Use the "head cover under arm" drill',
                            'Work on posture and core stability'
                        ]
                    });
                }
            }
            
            // Check head height
            if (metrics.headHeight !== null && baselineData.HeadHeight) {
                const deviation = calculateDeviation(metrics.headHeight, baselineData.HeadHeight);
                
                if (deviation > 0.1) {
                    const isTooLow = metrics.headHeight < parseRange(baselineData.HeadHeight).min;
                    
                    faults.push({
                        name: isTooLow ? 'Excessive Dipping' : 'Standing Up',
                        description: `Your head ${isTooLow ? 'dips too low' : 'rises too much'} at ${phase.name}.`,
                        severity: deviation > 0.2 ? 'severe' : deviation > 0.15 ? 'moderate' : 'mild',
                        confidence: 0.75,
                        recommendations: [
                            isTooLow ? 'Focus on maintaining head height' : 'Avoid standing up during the swing',
                            'Practice with a head cover balanced on your head',
                            'Film your swing from face-on view for feedback'
                        ]
                    });
                }
            }
            
            // Check swing plane angle (down-the-line view)
            if (metrics.swingPlaneAngle !== null && baselineData.SwingPlaneAngle && this.viewType === 'Down-the-Line') {
                const deviation = calculateDeviation(metrics.swingPlaneAngle, baselineData.SwingPlaneAngle);
                
                if (deviation > 10) {
                    const isTooFlat = metrics.swingPlaneAngle < parseRange(baselineData.SwingPlaneAngle).min;
                    
                    faults.push({
                        name: isTooFlat ? 'Too Flat Swing Plane' : 'Too Upright Swing Plane',
                        description: `Your swing plane is ${deviation.toFixed(1)}° ${isTooFlat ? 'too flat' : 'too upright'} at ${phase.name}.`,
                        severity: deviation > 20 ? 'severe' : deviation > 15 ? 'moderate' : 'mild',
                        confidence: 0.8,
                        recommendations: [
                            isTooFlat ? 'Work on a more upright swing path' : 'Work on a flatter swing path',
                            'Use alignment sticks to visualize the correct plane',
                            'Practice with a swing plane trainer'
                        ]
                    });
                }
            }
            
            // Check hip slide
            if (metrics.hipSlide !== null && Math.abs(metrics.hipSlide) > 30 && phase.name === 'Top of Backswing') {
                faults.push({
                    name: 'Lateral Sway',
                    description: 'Your hips move too much laterally during the backswing instead of rotating.',
                    severity: Math.abs(metrics.hipSlide) > 50 ? 'severe' : Math.abs(metrics.hipSlide) > 40 ? 'moderate' : 'mild',
                    confidence: 0.85,
                    recommendations: [
                        'Practice with a chair or alignment rod against your hip',
                        'Focus on hip rotation rather than lateral movement',
                        'Strengthen core and glute muscles'
                    ]
                });
            }
        }
        
        // Check for early extension
        const downswingPhase = this.swingPhases.find(p => p.name === 'Downswing');
        const addressPhase = this.swingPhases.find(p => p.name === 'Address');
        
        if (downswingPhase && addressPhase && this.poseHistory.length > 0) {
            const downswingPose = this.poseHistory[downswingPhase.frameIndex][0];
            const addressPose = this.poseHistory[addressPhase.frameIndex][0];
            
            const downswingHips = {
                left: downswingPose.keypoints.find(kp => kp.name === 'left_hip'),
                right: downswingPose.keypoints.find(kp => kp.name === 'right_hip')
            };
            
            const addressHips = {
                left: addressPose.keypoints.find(kp => kp.name === 'left_hip'),
                right: addressPose.keypoints.find(kp => kp.name === 'right_hip')
            };
            
            if (downswingHips.left && downswingHips.right && addressHips.left && addressHips.right) {
                const downswingHipY = (downswingHips.left.y + downswingHips.right.y) / 2;
                const addressHipY = (addressHips.left.y + addressHips.right.y) / 2;
                
                const hipExtension = addressHipY - downswingHipY;
                
                if (hipExtension > 20) {
                    faults.push({
                        name: 'Early Extension',
                        description: 'Your hips move toward the ball during the downswing, causing inconsistent contact.',
                        severity: hipExtension > 40 ? 'severe' : hipExtension > 30 ? 'moderate' : 'mild',
                        confidence: 0.9,
                        recommendations: [
                            'Practice the "wall drill" to maintain posture',
                            'Focus on rotating rather than standing up',
                            'Strengthen core muscles'
                        ]
                    });
                }
            }
        }
        
        // Check for over-the-top move
        const transitionPhase = this.swingPhases.find(p => p.name === 'Transition');
        
        if (transitionPhase && this.poseHistory.length > 0) {
            const transitionPose = this.poseHistory[transitionPhase.frameIndex][0];
            
            const shoulders = {
                left: transitionPose.keypoints.find(kp => kp.name === 'left_shoulder'),
                right: transitionPose.keypoints.find(kp => kp.name === 'right_shoulder')
            };
            
            const wrists = {
                left: transitionPose.keypoints.find(kp => kp.name === 'left_wrist'),
                right: transitionPose.keypoints.find(kp => kp.name === 'right_wrist')
            };
            
            if (shoulders.left && shoulders.right && wrists.left && wrists.right) {
                // This is a simplified check for over-the-top move
                // In a real implementation, we would need more sophisticated analysis
                
                const leadWrist = this.handedness === 'right' ? wrists.left : wrists.right;
                const trailShoulder = this.handedness === 'right' ? shoulders.right : shoulders.left;
                
                if (leadWrist.y < trailShoulder.y && this.viewType === 'Face-On') {
                    faults.push({
                        name: 'Over-the-Top Swing Path',
                        description: 'Your downswing is starting with the upper body and coming from outside-to-in, causing slices and pulls.',
                        severity: 'moderate',
                        confidence: 0.8,
                        recommendations: [
                            'Drop the club into the "slot" during transition',
                            'Start downswing with lower body rotation',
                            'Practice the "headcover drill"'
                        ]
                    });
                }
            }
        }
        
        // Remove duplicate faults (keep the most severe)
        const uniqueFaults: SwingFault[] = [];
        const faultNames = new Set<string>();
        
        // Sort by severity first
        const sortedFaults = [...faults].sort((a, b) => {
            const severityScore = { 'severe': 3, 'moderate': 2, 'mild': 1 };
            return severityScore[b.severity] - severityScore[a.severity];
        });
        
        for (const fault of sortedFaults) {
            if (!faultNames.has(fault.name)) {
                uniqueFaults.push(fault);
                faultNames.add(fault.name);
            }
        }
        
        return uniqueFaults;
    }

    // Calculate overall swing score based on detected faults
    calculateSwingScore(): number {
        const faults = this.detectSwingFaults();
        
        // Start with a base score
        let score = 85;
        
        // Deduct points for each fault based on severity
        for (const fault of faults) {
            switch (fault.severity) {
                case 'severe':
                    score -= 8;
                    break;
                case 'moderate':
                    score -= 5;
                    break;
                case 'mild':
                    score -= 2;
                    break;
            }
        }
        
        // Ensure score is within 0-100 range
        return Math.max(0, Math.min(100, Math.round(score)));
    }

    // Generate recommendations based on detected faults
    generateRecommendations(): string[] {
        const faults = this.detectSwingFaults();
        const recommendations: string[] = [];
        
        // Add general recommendations
        recommendations.push('Focus on maintaining a consistent tempo throughout your swing');
        
        // Add specific recommendations based on faults
        for (const fault of faults) {
            if (fault.recommendations.length > 0) {
                recommendations.push(`To fix ${fault.name.toLowerCase()}: ${fault.recommendations[0]}`);
            }
        }
        
        // Add a positive note if few faults
        if (faults.length <= 1) {
            recommendations.push('Your swing fundamentals look good. Keep practicing for consistency!');
        }
        
        // Limit to 5 recommendations
        return recommendations.slice(0, 5);
    }

    // Get the pose history
    getPoseHistory(): poseDetection.Pose[][] {
        return this.poseHistory;
    }

    // Get detected swing phases
    getSwingPhases(): SwingPhase[] {
        return this.swingPhases;
    }
}

export default new EnhancedPoseDetectionService();