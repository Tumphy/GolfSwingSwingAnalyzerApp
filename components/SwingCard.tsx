import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Calendar, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface SwingProps {
  id: number;
  date: string;
  score: number;
  improvement: string;
  view: string;
}

interface SwingCardProps {
  swing: SwingProps;
}

const SwingCard: React.FC<SwingCardProps> = ({ swing }) => {
  // Format date to more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <TouchableOpacity style={styles.container}>
      <Image 
        source={{ uri: swing.view === 'Face-On' 
          ? 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
        }}
        style={styles.image}
      />
      
      <View style={styles.overlay}>
        <View style={styles.dateContainer}>
          <Calendar size={14} color={Colors.white} />
          <Text style={styles.dateText}>{formatDate(swing.date)}</Text>
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>{swing.score}</Text>
            <Text style={styles.scoreLabel}>Score</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.viewContainer}>
            <Text style={styles.viewValue}>{swing.view}</Text>
            <Text style={styles.viewLabel}>View</Text>
          </View>
          
          <ChevronRight size={20} color={Colors.white} />
        </View>
        
        <View style={styles.improvementBadge}>
          <Text style={styles.improvementText}>{swing.improvement}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 220,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 15,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    justifyContent: 'space-between',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: Colors.white,
    marginLeft: 5,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreValue: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  scoreLabel: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 15,
  },
  viewContainer: {
    alignItems: 'center',
    flex: 1,
  },
  viewValue: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  viewLabel: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
  },
  improvementBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  improvementText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
});

export default SwingCard;