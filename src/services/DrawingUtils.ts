import * as poseDetection from '@tensorflow-models/pose-detection';

// Define connections for skeleton drawing
const POSE_CONNECTIONS = [
  ['nose', 'left_eye'],
  ['nose', 'right_eye'],
  ['left_eye', 'left_ear'],
  ['right_eye', 'right_ear'],
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'],
  ['right_shoulder', 'right_elbow'],
  ['left_elbow', 'left_wrist'],
  ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'],
  ['right_hip', 'right_knee'],
  ['left_knee', 'left_ankle'],
  ['right_knee', 'right_ankle']
];

// Draw keypoints on canvas
export function drawKeypoints(keypoints: poseDetection.Keypoint[], ctx: CanvasRenderingContext2D) {
  const keypointInd = keypoints.findIndex(k => k.score > 0.3);
  if (keypointInd < 0) return;

  ctx.fillStyle = 'red';
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  
  for (const keypoint of keypoints) {
    // Only draw keypoints with a good confidence score
    if (keypoint.score && keypoint.score > 0.3) {
      const { x, y } = keypoint;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  }
}

// Draw skeleton by connecting keypoints
export function drawSkeleton(keypoints: poseDetection.Keypoint[], ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'white';
  ctx.strokeStyle = '#00FF00';
  ctx.lineWidth = 2;

  // Create a map of keypoints by name for easier lookup
  const keypointMap = new Map();
  keypoints.forEach(keypoint => {
    if (keypoint.name && keypoint.score && keypoint.score > 0.3) {
      keypointMap.set(keypoint.name, keypoint);
    }
  });

  // Draw the connections
  for (const [start, end] of POSE_CONNECTIONS) {
    const startPoint = keypointMap.get(start);
    const endPoint = keypointMap.get(end);

    if (startPoint && endPoint) {
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x, endPoint.y);
      ctx.stroke();
    }
  }
}

// Draw angle annotations
export function drawAngle(
  point1: poseDetection.Keypoint,
  point2: poseDetection.Keypoint,
  point3: poseDetection.Keypoint,
  angle: number,
  ctx: CanvasRenderingContext2D
) {
  if (!point1 || !point2 || !point3) return;
  
  // Draw the angle arc
  ctx.beginPath();
  ctx.arc(point2.x, point2.y, 20, 
    Math.atan2(point1.y - point2.y, point1.x - point2.x),
    Math.atan2(point3.y - point2.y, point3.x - point2.x),
    false);
  ctx.strokeStyle = 'yellow';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw the angle text
  ctx.fillStyle = 'yellow';
  ctx.font = '12px Arial';
  ctx.fillText(`${Math.round(angle)}°`, point2.x + 25, point2.y);
}

// Draw swing plane line
export function drawSwingPlane(keypoints: poseDetection.Keypoint[], ctx: CanvasRenderingContext2D) {
  const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
  const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
  const rightHip = keypoints.find(kp => kp.name === 'right_hip');
  const leftHip = keypoints.find(kp => kp.name === 'left_hip');
  
  if (!rightShoulder || !leftShoulder || !rightHip || !leftHip) return;
  
  // Calculate midpoints
  const midShoulder = {
    x: (rightShoulder.x + leftShoulder.x) / 2,
    y: (rightShoulder.y + leftShoulder.y) / 2
  };
  
  const midHip = {
    x: (rightHip.x + leftHip.x) / 2,
    y: (rightHip.y + leftHip.y) / 2
  };
  
  // Draw spine line
  ctx.beginPath();
  ctx.moveTo(midShoulder.x, midShoulder.y);
  ctx.lineTo(midHip.x, midHip.y);
  ctx.strokeStyle = '#4CAF50';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Extend the line for swing plane
  const dx = midShoulder.x - midHip.x;
  const dy = midShoulder.y - midHip.y;
  const length = Math.sqrt(dx * dx + dy * dy) * 2;
  
  const extendedX = midHip.x - (dx / Math.sqrt(dx * dx + dy * dy)) * length;
  const extendedY = midHip.y - (dy / Math.sqrt(dx * dx + dy * dy)) * length;
  
  ctx.beginPath();
  ctx.moveTo(midHip.x, midHip.y);
  ctx.lineTo(extendedX, extendedY);
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = '#4CAF50';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]);
}