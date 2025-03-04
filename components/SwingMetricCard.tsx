import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface MetricProps {
  id: number;
  name: string;
  value: string | number;
  change: string;
  trend: string;
}

interface SwingMetricCardProps {
  metric: MetricProps;
}

const SwingMetricCard: React.FC<SwingMetricCardProps> = ({ metric }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.metricName}>{metric.name}</Text>
      <Text style={styles.metricValue}>{metric.value}</Text>
      
      <View style={styles.changeContainer}>
        {metric.trend === 'up' ? (
          <TrendingUp size={14} color={Colors.success} />
        ) : (
          <TrendingDown size={14} color={Colors.error} />
        )}
        <Text 
          style={[
            styles.changeText, 
            metric.trend === 'up' ? styles.positiveChange : styles.negativeChange
          ]}
        >
          {metric.change}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '46%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 15,
    marginHorizontal: '2%',
    marginBottom: 15,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  metricName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  positiveChange: {
    color: Colors.success,
  },
  negativeChange: {
    color: Colors.error,
  },
});

export default SwingMetricCard;