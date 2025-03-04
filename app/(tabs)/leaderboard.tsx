import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, ChevronDown, Trophy, Medal } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function LeaderboardScreen() {
  const [leaderboardType, setLeaderboardType] = useState('global');
  const [timeRange, setTimeRange] = useState('week');
  
  const leaderboardData = [
    {
      id: 1,
      name: 'Michael Johnson',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      score: 92,
      rank: 1,
      change: 0,
      country: 'USA',
      handicap: '+2.1',
    },
    {
      id: 2,
      name: 'Sarah Williams',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      score: 89,
      rank: 2,
      change: 1,
      country: 'Canada',
      handicap: '3.4',
    },
    {
      id: 3,
      name: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      score: 87,
      rank: 3,
      change: -1,
      country: 'Australia',
      handicap: '4.2',
    },
    {
      id: 4,
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      score: 85,
      rank: 4,
      change: 2,
      country: 'UK',
      handicap: '5.0',
    },
    {
      id: 5,
      name: 'Emma Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      score: 84,
      rank: 5,
      change: -1,
      country: 'Spain',
      handicap: '5.7',
    },
    {
      id: 6,
      name: 'Robert Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      score: 82,
      rank: 6,
      change: 3,
      country: 'South Korea',
      handicap: '6.3',
    },
    {
      id: 7,
      name: 'Lisa Thompson',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      score: 80,
      rank: 7,
      change: 0,
      country: 'France',
      handicap: '7.1',
    },
    {
      id: 8,
      name: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      score: 79,
      rank: 8,
      change: -2,
      country: 'Germany',
      handicap: '7.8',
    },
    {
      id: 9,
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      score: 78,
      rank: 9,
      change: 1,
      country: 'USA',
      handicap: '8.2',
      isCurrentUser: true,
    },
    {
      id: 10,
      name: 'Maria Garcia',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
      score: 77,
      rank: 10,
      change: 4,
      country: 'Mexico',
      handicap: '8.9',
    },
  ];
  
  const challenges = [
    {
      id: 1,
      title: 'Longest Drive Challenge',
      participants: 1243,
      endDate: '2 days',
      prize: 'Pro Swing Analysis',
    },
    {
      id: 2,
      title: 'Most Improved Swing',
      participants: 876,
      endDate: '5 days',
      prize: 'Premium Membership',
    },
    {
      id: 3,
      title: 'Perfect Tempo Challenge',
      participants: 654,
      endDate: '1 week',
      prize: 'Virtual Coaching Session',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Leaderboard</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={18} color={Colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={18} color={Colors.gray} />
            <Text style={styles.searchPlaceholder}>Search golfers...</Text>
          </View>
        </View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, leaderboardType === 'global' && styles.activeTab]}
            onPress={() => setLeaderboardType('global')}
          >
            <Text style={[styles.tabText, leaderboardType === 'global' && styles.activeTabText]}>
              Global
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, leaderboardType === 'friends' && styles.activeTab]}
            onPress={() => setLeaderboardType('friends')}
          >
            <Text style={[styles.tabText, leaderboardType === 'friends' && styles.activeTabText]}>
              Friends
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, leaderboardType === 'local' && styles.activeTab]}
            onPress={() => setLeaderboardType('local')}
          >
            <Text style={[styles.tabText, leaderboardType === 'local' && styles.activeTabText]}>
              Local
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.timeRangeContainer}>
          <TouchableOpacity style={styles.timeRangeSelector}>
            <Text style={styles.timeRangeText}>
              {timeRange === 'week' ? 'This Week' : timeRange === 'month' ? 'This Month' : 'All Time'}
            </Text>
            <ChevronDown size={16} color={Colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.leaderboardContainer}>
          <View style={styles.leaderboardHeader}>
            <Text style={[styles.headerText, styles.rankHeader]}>Rank</Text>
            <Text style={[styles.headerText, styles.nameHeader]}>Golfer</Text>
            <Text style={[styles.headerText, styles.scoreHeader]}>Score</Text>
            <Text style={[styles.headerText, styles.handicapHeader]}>HCP</Text>
          </View>
          
          {leaderboardData.map((player) => (
            <View 
              key={player.id} 
              style={[
                styles.playerRow,
                player.isCurrentUser && styles.currentUserRow
              ]}
            >
              <View style={styles.rankContainer}>
                {player.rank <= 3 ? (
                  <View style={[
                    styles.medalContainer,
                    player.rank === 1 ? styles.goldMedal : 
                    player.rank === 2 ? styles.silverMedal : 
                    styles.bronzeMedal
                  ]}>
                    {player.rank === 1 ? (
                      <Trophy size={14} color={Colors.white} />
                    ) : (
                      <Medal size={14} color={Colors.white} />
                    )}
                  </View>
                ) : (
                  <Text style={styles.rankText}>{player.rank}</Text>
                )}
                
                <View style={[
                  styles.changeIndicator,
                  player.change > 0 ? styles.positiveChange : 
                  player.change < 0 ? styles.negativeChange : 
                  styles.neutralChange
                ]}>
                  {player.change !== 0 && (
                    <Text style={styles.changeText}>
                      {player.change > 0 ? `+${player.change}` : player.change}
                    </Text>
                  )}
                </View>
              </View>
              
              <View style={styles.playerInfo}>
                <Image source={{ uri: player.avatar }} style={styles.playerAvatar} />
                <View>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerCountry}>{player.country}</Text>
                </View>
              </View>
              
              <Text style={styles.scoreText}>{player.score}</Text>
              <Text style={styles.handicapText}>{player.handicap}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Challenges</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {challenges.map((challenge) => (
            <View key={challenge.id} style={styles.challengeCard}>
              <View style={styles.challengeHeader}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <View style={styles.challengeBadge}>
                  <Text style={styles.challengeBadgeText}>Active</Text>
                </View>
              </View>
              
              <View style={styles.challengeDetails}>
                <View style={styles.challengeDetail}>
                  <Text style={styles.detailLabel}>Participants</Text>
                  <Text style={styles.detailValue}>{challenge.participants}</Text>
                </View>
                
                <View style={styles.challengeDetail}>
                  <Text style={styles.detailLabel}>Ends in</Text>
                  <Text style={styles.detailValue}>{challenge.endDate}</Text>
                </View>
                
                <View style={styles.challengeDetail}>
                  <Text style={styles.detailLabel}>Prize</Text>
                  <Text style={styles.detailValue}>{challenge.prize}</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join Challenge</Text>
              </TouchableOpacity>
            </View>
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
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchPlaceholder: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray,
    marginLeft: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.text,
  },
  activeTabText: {
    color: Colors.white,
  },
  timeRangeContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  timeRangeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeRangeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.text,
    marginRight: 5,
  },
  leaderboardContainer: {
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 15,
    marginBottom: 25,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray,
  },
  rankHeader: {
    width: 50,
  },
  nameHeader: {
    flex: 1,
  },
  scoreHeader: {
    width: 50,
    textAlign: 'center',
  },
  handicapHeader: {
    width: 50,
    textAlign: 'center',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  currentUserRow: {
    backgroundColor: Colors.lightPrimary,
    borderRadius: 8,
    marginHorizontal: -5,
    paddingHorizontal: 5,
  },
  rankContainer: {
    width: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
  },
  medalContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goldMedal: {
    backgroundColor: Colors.gold,
  },
  silverMedal: {
    backgroundColor: '#A0A0A0',
  },
  bronzeMedal: {
    backgroundColor: '#CD7F32',
  },
  changeIndicator: {
    marginLeft: 5,
  },
  positiveChange: {
    color: Colors.success,
  },
  negativeChange: {
    color: Colors.error,
  },
  neutralChange: {
    color: Colors.gray,
  },
  changeText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
  },
  playerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  playerName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    marginBottom: 2,
  },
  playerCountry: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray,
  },
  scoreText: {
    width: 50,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
    textAlign: 'center',
  },
  handicapText: {
    width: 50,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.text,
    textAlign: 'center',
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
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'Inter-Medium',
  },
  challengeCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  challengeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
  },
  challengeBadge: {
    backgroundColor: Colors.lightSuccess,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  challengeBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.success,
  },
  challengeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  challengeDetail: {},
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray,
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
  },
  joinButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
});