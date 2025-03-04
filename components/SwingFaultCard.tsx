import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface FaultProps {
  id: number;
  name: string;
  severity: string;
  trend: string;
  description: string;
  drills: string[];
}

interface SwingFaultCardProps {
  fault: FaultProps;
  isExpanded: boolean;
  onPress: () => void;
}

const SwingFaultCard: React.FC<SwingFaultCardProps> = ({ fault, isExpanded, onPress }) => {
  const getSeverityColor = () => {
    switch (fault.severity) {
      case 'mild':
        return Colors.success;
      case 'moderate':
        return Colors.warning;
      case 'severe':
        return Colors.error;
      default:
        return Colors.gray;
    }
  };

  const getTrendIcon = () => {
    switch (fault.trend) {
      case 'improving':
        return '↑';
      case 'worsening':
        return '↓';
      default:
        return '→';
    }
  };

  const getTrendColor = () => {
    switch (fault.trend) {
      case 'improving':
        return Colors.success;
      case 'worsening':
        return Colors.error;
      default:
        return Colors.gray;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isExpanded && styles.expandedContainer
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View 
            style={[
              styles.severityIndicator, 
              { backgroundColor: getSeverityColor() }
            ]} 
          />
          <Text style={styles.faultName}>{fault.name}</Text>
        </View>
        
        <View style={styles.rightContainer}>
          <View style={styles.trendContainer}>
            <Text 
              style={[
                styles.trendText,
                { color: getTrendColor() }
              ]}
            >
              {getTrendIcon()} {fault.trend}
            </Text>
          </View>
          
          {isExpanded ? (
            <ChevronUp size={20} color={Colors.gray} />
          ) : (
            <ChevronDown size={20} color={Colors.gray} />
          )}
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.severityContainer}>
          <Text style={styles.severityLabel}>Severity:</Text>
          <View 
            style={[
              styles.severityBadge,
              { backgroundColor: getSeverityColor() + '20' }
            ]}
          >
            <Text 
              style={[
                styles.severityText,
                { color: getSeverityColor() }
              ]}
            >
              {fault.severity.charAt(0).toUpperCase() + fault.severity.slice(1)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 15,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  expandedContainer: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  faultName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendContainer: {
    marginRight: 10,
  },
  trendText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  detailsContainer: {
    marginTop: 10,
  },
  severityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray,
    marginRight: 5,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  severityText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});

export default SwingFaultCard;