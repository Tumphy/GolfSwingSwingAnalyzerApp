import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, TrendingUp, Award, Calendar } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import SwingCard from '@/components/SwingCard';
import RecentActivityCard from '@/components/RecentActivityCard';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('John');
  const [swingScore, setSwingScore] = useState(78);
  const [recentSwings, setRecentSwings] = useState([
    { id: 1, date: '2025-06-10', score: 82, improvement: '+3', view: 'Face-On' },
    { id: 2, date: '2025-06-08', score: 79, improvement: '+1', view: 'Down-the-Line' },
    { id: 3, date: '2025-06-05', score: 78, improvement: '+2', view: 'Face-On' },
  ]);
  
  const [activities, setActivities] = useState([
    { id: 1, type: 'analysis', message: 'Your swing analysis is complete', time: '2 hours ago' },
    { id: 2, type: 'achievement', message: 'You earned "Consistent Backswing" badge', time: '1 day ago' },
    { id: 3, type: 'recommendation', message: 'New drill recommended: Hip Rotation', time: '2 days ago' },
  ]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
          >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1570691079236-4bca6c45d440?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80' }} 
              style={styles.profileImage} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.scoreCard}>
          <View style={styles.scoreInfo}>
            <Text style={styles.scoreLabel}>Your Swing Score</Text>
            <Text style={styles.scoreValue}>{swingScore}</Text>
            <Text style={styles.scoreSubtext}>Top 22% of all golfers</Text>
          </View>
          <View style={styles.scoreActions}>
            <TouchableOpacity 
              style={styles.analyzeButton}
              onPress={() => router.push('/analyze')}
            >
              <Play size={18} color={Colors.white} />
              <Text style={styles.analyzeButtonText}>Analyze Swing</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/progress')}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.lightBlue }]}>
              <TrendingUp size={22} color={Colors.primary} />
            </View>
            <Text style={styles.actionText}>Progress</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/leaderboard')}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.lightGold }]}>
              <Award size={22} color={Colors.gold} />
            </View>
            <Text style={styles.actionText}>Rankings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.lightGreen }]}>
              <Calendar size={22} color={Colors.green} />
            </View>
            <Text style={styles.actionText}>Training</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Swings</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.swingsContainer}
          >
            {recentSwings.map((swing) => (
              <SwingCard key={swing.id} swing={swing} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          
          {activities.map((activity) => (
            <RecentActivityCard key={activity.id} activity={activity} />
          ))}
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
  greeting: {
    fontSize: 16,
    color: Colors.gray,
    fontFamily: 'Inter-Regular',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  scoreCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 5,
    fontFamily: 'Inter-Medium',
  },
  scoreValue: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
    marginBottom: 5,
  },
  scoreSubtext: {
    fontSize: 12,
    color: Colors.success,
    fontFamily: 'Inter-Regular',
  },
  scoreActions: {
    alignItems: 'flex-end',
  },
  analyzeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: Colors.white,
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 25,
  },
  actionButton: {
    alignItems: 'center',
    width: (width - 60) / 3,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 13,
    color: Colors.text,
    fontFamily: 'Inter-Medium',
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
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'Inter-Medium',
  },
  swingsContainer: {
    paddingLeft: 20,
    paddingRight: 10,
  },
});