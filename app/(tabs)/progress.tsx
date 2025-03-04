import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import SwingMetricCard from '@/components/SwingMetricCard';
import SwingFaultCard from '@/components/SwingFaultCard';
import LineChart from '@/components/LineChart';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const [timeRange, setTimeRange] = useState('month');
  const [expandedFaults, setExpandedFaults] = useState([]);
  
  const swingMetrics = [
    { id: 1, name: 'Swing Score', value: 78, change: '+3', trend: 'up' },
    { id: 2, name: 'Club Speed', value: '92 mph', change: '+2 mph', trend: 'up' },
    { id: 3, name: 'Tempo', value: '3:1', change: '0.2', trend: 'up' },
    { id: 4, name: 'Hip Rotation', value: '45°', change: '+3°', trend: 'up' },
  ];
  
  const swingFaults = [
    { 
      id: 1, 
      name: 'Early Extension', 
      severity: 'moderate', 
      trend: 'improving',
      description: 'Your pelvis is moving toward the ball during the downswing, causing inconsistent contact.',
      drills: ['Hip Bumps Against Wall', 'Chair Drill']
    },
    { 
      id: 2, 
      name: 'Over-the-Top', 
      severity: 'mild', 
      trend: 'improving',
      description: 'Your downswing is starting with the upper body, causing an out-to-in swing path.',
      drills: ['Headcover Under Arm', 'Towel Drill']
    },
    { 
      id: 3, 
      name: 'Reverse Spine Angle', 
      severity: 'severe', 
      trend: 'worsening',
      description: 'Your spine is tilting toward the target at the top of the backswing, limiting rotation.',
      drills: ['Posture Drill with Club', 'Alignment Stick Drill']
    },
  ];
  
  const toggleFaultExpansion = (id) => {
    if (expandedFaults.includes(id)) {
      setExpandedFaults(expandedFaults.filter(faultId => faultId !== id));
    } else {
      setExpandedFaults([...expandedFaults, id]);
    }
  };
  
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [65, 68, 72, 70, 74, 78],
        color: () => Colors.primary,
        strokeWidth: 2
      }
    ]
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Progress</Text>
          <TouchableOpacity style={styles.timeRangeSelector}>
            <Calendar size={16} color={Colors.text} />
            <Text style={styles.timeRangeText}>
              {timeRange === 'week' ? 'This Week' : timeRange === 'month' ? 'This Month' : 'This Year'}
            </Text>
            <ChevronDown size={16} color={Colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Swing Score Trend</Text>
          <LineChart data={chartData} width={width - 40} height={220} />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            {swingMetrics.map(metric => (
              <SwingMetricCard key={metric.id} metric={metric} />
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Swing Faults</Text>
          <View style={styles.faultsContainer}>
            {swingFaults.map(fault => (
              <View key={fault.id} style={styles.faultCardWrapper}>
                <SwingFaultCard 
                  fault={fault} 
                  isExpanded={expandedFaults.includes(fault.id)}
                  onPress={() => toggleFaultExpansion(fault.id)}
                />
                
                {expandedFaults.includes(fault.id) && (
                  <View style={styles.faultDetails}>
                    <Text style={styles.faultDescription}>{fault.description}</Text>
                    
                    <Text style={styles.recommendedDrillsTitle}>Recommended Drills:</Text>
                    {fault.drills.map((drill, index) => (
                      <View key={index} style={styles.drillItem}>
                        <View style={styles.drillBullet} />
                        <Text style={styles.drillText}>{drill}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.insightsContainer}>
          <View style={styles.insightHeader}>
            <AlertCircle size={20} color={Colors.primary} />
            <Text style={styles.insightTitle}>AI Insights</Text>
          </View>
          
          <Text style={styles.insightText}>
            Your swing is showing consistent improvement in tempo and club path. Focus on reducing early extension to improve contact consistency. Your hip rotation has improved by 15% in the last month.
          </Text>
          
          <TouchableOpacity style={styles.insightButton}>
            <Text style={styles.insightButtonText}>View Detailed Analysis</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Training Plan</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.trainingCard}>
            <View style={styles.trainingHeader}>
              <Text style={styles.trainingTitle}>This Week's Focus</Text>
              <View style={styles.trainingBadge}>
                <Text style={styles.trainingBadgeText}>In Progress</Text>
              </View>
            </View>
            
            <Text style={styles.trainingDescription}>
              Based on your recent swings, we recommend focusing on hip rotation and maintaining spine angle.
            </Text>
            
            <View style={styles.trainingProgress}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '65%' }]} />
              </View>
              <Text style={styles.progressText}>65% Complete</Text>
            </View>
            
            <TouchableOpacity style={styles.trainingButton}>
              <Text style={styles.trainingButtonText}>Continue Training</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeRangeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.text,
    marginHorizontal: 8,
  },
  chartContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 15,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    marginBottom: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'Inter-Medium',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },
  faultsContainer: {
    paddingHorizontal: 20,
  },
  faultCardWrapper: {
    marginBottom: 15,
  },
  faultDetails: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 15,
    marginTop: -10,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  faultDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    marginBottom: 15,
    lineHeight: 20,
  },
  recommendedDrillsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    marginBottom: 10,
  },
  drillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  drillBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginRight: 10,
  },
  drillText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
  },
  insightsContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
    backgroundColor: Colors.lightPrimary,
    borderRadius: 16,
    padding: 20,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
    marginLeft: 10,
  },
  insightText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 15,
  },
  insightButton: {
    backgroundColor: Colors.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  insightButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
  },
  trainingCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  trainingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trainingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
  },
  trainingBadge: {
    backgroundColor: Colors.lightSuccess,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trainingBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.success,
  },
  trainingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 15,
  },
  trainingProgress: {
    marginBottom: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.lightGray,
    borderRadius: 4,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.success,
    textAlign: 'right',
  },
  trainingButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  trainingButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
});