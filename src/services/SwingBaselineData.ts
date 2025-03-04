// Baseline swing data for different club types and viewing angles
// This data represents ideal ranges for various metrics at different swing phases

export const BaselineSwingData = {
    "Driver": {
        "Face-On": {
            "Takeaway": { "ShoulderTurn": "5-15", "HipTurn": "2-10", "HeadHeight": "0.9-1.1", "SpineTilt": "5-10" },
            "Early Backswing": { "ShoulderTurn": "20-40", "HipTurn": "10-20", "HeadHeight": "0.88-1.08", "SpineTilt": "8-12" },
            "Top of Backswing": { "ShoulderTurn": "90-110", "HipTurn": "40-50", "HeadHeight": "0.85-1.05", "SpineTilt": "10-15" },
            "Transition": { "ShoulderTurn": "80-100", "HipTurn": "30-45", "HeadHeight": "0.87-1.07", "SpineTilt": "10-20" },
            "Downswing": { "ShoulderTurn": "40-70", "HipTurn": "30-50", "HeadHeight": "0.9-1.1", "SpineTilt": "15-25" },
            "Impact": { "ShoulderTurn": "30-50", "HipTurn": "35-50", "HeadHeight": "0.9-1.1", "SpineTilt": "15-25" },
            "Follow-Through": { "ShoulderTurn": "90-120", "HipTurn": "80-100", "HeadHeight": "0.85-1.05", "SpineTilt": "5-15" }
        },
        "Down-the-Line": {
            "Takeaway": { "SwingPlaneAngle": "45-55", "SpineTilt": "35-45", "HeadHeight": "0.9-1.1" },
            "Early Backswing": { "SwingPlaneAngle": "50-60", "SpineTilt": "38-48", "HeadHeight": "0.88-1.08" },
            "Top of Backswing": { "SwingPlaneAngle": "50-70", "SpineTilt": "40-50", "HeadHeight": "0.85-1.05" },
            "Transition": { "SwingPlaneAngle": "50-65", "SpineTilt": "38-48", "HeadHeight": "0.87-1.07" },
            "Downswing": { "SwingPlaneAngle": "45-55", "SpineTilt": "35-45", "HeadHeight": "0.9-1.1" },
            "Impact": { "SwingPlaneAngle": "45-55", "SpineTilt": "35-45", "HeadHeight": "0.9-1.1" },
            "Follow-Through": { "SwingPlaneAngle": "40-55", "SpineTilt": "30-40", "HeadHeight": "0.85-1.05" }
        }
    },
    "Iron": {
        "Face-On": {
            "Takeaway": { "ShoulderTurn": "5-10", "HipTurn": "2-8", "HeadHeight": "0.9-1.1", "SpineTilt": "3-8" },
            "Early Backswing": { "ShoulderTurn": "20-35", "HipTurn": "10-18", "HeadHeight": "0.88-1.08", "SpineTilt": "6-10" },
            "Top of Backswing": { "ShoulderTurn": "80-100", "HipTurn": "35-45", "HeadHeight": "0.85-1.05", "SpineTilt": "10-15" },
            "Transition": { "ShoulderTurn": "75-95", "HipTurn": "30-40", "HeadHeight": "0.87-1.07", "SpineTilt": "10-20" },
            "Downswing": { "ShoulderTurn": "30-60", "HipTurn": "25-40", "HeadHeight": "0.9-1.1", "SpineTilt": "12-22" },
            "Impact": { "ShoulderTurn": "30-50", "HipTurn": "30-45", "HeadHeight": "0.9-1.1", "SpineTilt": "12-22" },
            "Follow-Through": { "ShoulderTurn": "90-110", "HipTurn": "80-100", "HeadHeight": "0.85-1.05", "SpineTilt": "5-15" }
        },
        "Down-the-Line": {
            "Takeaway": { "SwingPlaneAngle": "50-60", "SpineTilt": "35-45", "HeadHeight": "0.9-1.1" },
            "Early Backswing": { "SwingPlaneAngle": "55-65", "SpineTilt": "38-48", "HeadHeight": "0.88-1.08" },
            "Top of Backswing": { "SwingPlaneAngle": "55-70", "SpineTilt": "40-50", "HeadHeight": "0.85-1.05" },
            "Transition": { "SwingPlaneAngle": "50-65", "SpineTilt": "38-48", "HeadHeight": "0.87-1.07" },
            "Downswing": { "SwingPlaneAngle": "50-60", "SpineTilt": "35-45", "HeadHeight": "0.9-1.1" },
            "Impact": { "SwingPlaneAngle": "50-60", "SpineTilt": "35-45", "HeadHeight": "0.9-1.1" },
            "Follow-Through": { "SwingPlaneAngle": "45-55", "SpineTilt": "30-40", "HeadHeight": "0.85-1.05" }
        }
    }
};

// Helper function to parse range strings like "5-10" into min/max values
export const parseRange = (rangeStr: string): { min: number; max: number } => {
    const [min, max] = rangeStr.split('-').map(Number);
    return { min, max };
};

// Helper function to check if a value is within a range
export const isWithinRange = (value: number, rangeStr: string): boolean => {
    const { min, max } = parseRange(rangeStr);
    return value >= min && value <= max;
};

// Helper function to calculate how far a value is from the ideal range
export const calculateDeviation = (value: number, rangeStr: string): number => {
    const { min, max } = parseRange(rangeStr);
    if (value < min) return min - value;
    if (value > max) return value - max;
    return 0; // Within range
};