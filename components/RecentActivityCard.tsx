import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle, Award, Lightbulb } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface ActivityProps {
  id: number;
  type: string;
  message: string;
  time: string;
}

interface RecentActivityCardProps {
  activity: ActivityProps;
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ activity }) => {
  const getIcon = () => {
    switch (activity.type) {
      case 'analysis':
        return <CheckCircle size={20} color={Colors.primary} />;
      case 'achievement':
        return <Award size={20} color={Colors.gold} />;
      case 'recommendation':
        return <Lightbulb size={20} color={Colors.secondary} />;
      default:
        return <CheckCircle size={20} color={Colors.primary} />;
    }
  };

  const getBackgroundColor = () => {
    switch (activity.type) {
      case 'analysis':
        return Colors.lightPrimary;
      case 'achievement':
        return Colors.lightGold;
      case 'recommendation':
        return Colors.lightGreen;
      default:
        return Colors.lightPrimary;
    }
  };

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.message}>{activity.message}</Text>
        <Text style={styles.time}>{activity.time}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
  },
  iconContainer: {
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.text,
    marginBottom: 5,
  },
  time: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray,
  },
});

export default RecentActivityCard;