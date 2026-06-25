import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Calendar, Shield, Bot, Award, Plus, Lock, Unlock, Moon, Sparkles, MessageSquare } from 'lucide-react-native';

export default function App() {
  const [screen, setScreen] = useState('Splash'); // Onboarding / Tabs
  const [profile, setProfile] = useState({
    name: '김서연',
    motto: '오늘도 나만의 리듬을 찾아서...',
    streak: 12,
    avgFlowTime: 4.2
  });

  const [events, setEvents] = useState([
    { id: '1', title: '기말고사 (수학)', type: 'fixed', time: '09:00', duration: 120, desc: '중요 시험 - 절대 수정 불가' },
    { id: '2', title: '중간 발표 준비', type: 'flexible', time: '14:00', duration: 120, desc: 'AI 최적화 가능 시간' },
    { id: '3', title: '팀 프로젝트 회의', type: 'flexible', time: '19:00', duration: 90, desc: '온라인 싱크업 미팅' }
  ]);

  const toggleLock = (id) => {
    setEvents(events.map(e => e.id === id ? { ...e, type: e.type === 'fixed' ? 'flexible' : 'fixed' } : e));
  };

  if (screen === 'Splash') {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.logoCircle}>
          <Sparkles size={40} color="#346823" />
        </View>
        <Text style={styles.splashTitle}>장단:음</Text>
        <Text style={styles.splashTagline}>RebalAI</Text>
        <TouchableOpacity style={styles.splashBtn} onPress={() => setScreen('Home')}>
          <Text style={styles.splashBtnText}>시작하기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header bar */}
      <View style={styles.header}>
        <Text style={styles.headerText}>장단:음 (RebalAI)</Text>
        <View style={styles.avatarMini}>
          <Text style={styles.avatarText}>김</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Balance Score */}
        <View style={styles.balanceCard}>
          <View>
            <Text style={styles.balanceLabel}>RHYTHM BALANCE</Text>
            <Text style={styles.balanceNum}>85/100</Text>
          </View>
          <View style={styles.badge}>
            <Sparkles size={14} color="#1e510f" />
            <Text style={styles.badgeText}>OPTIMAL RHYTHM</Text>
          </View>
        </View>

        {/* Timetable header */}
        <Text style={styles.sectionTitle}>오늘의 Rhythmic Timetable</Text>

        {/* Timetable Items */}
        <View style={styles.timeline}>
          {events.map((e) => (
            <View key={e.id} style={styles.timelineItem}>
              <Text style={styles.timeLabel}>{e.time}</Text>
              
              <View style={[styles.eventCard, e.type === 'fixed' ? styles.fixedCard : styles.flexibleCard]}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{e.title}</Text>
                  <TouchableOpacity onPress={() => toggleLock(e.id)}>
                    {e.type === 'fixed' ? <Lock size={18} color="#346823" /> : <Unlock size={18} color="#72796c" />}
                  </TouchableOpacity>
                </View>
                <Text style={styles.eventDesc}>{e.desc}</Text>
                
                <View style={styles.tagRow}>
                  <Text style={e.type === 'fixed' ? styles.fixedTag : styles.flexibleTag}>
                    {e.type === 'fixed' ? 'FIXED 고정' : 'FLEXIBLE 유동'}
                  </Text>
                  <Text style={styles.durationTag}>{e.duration}분</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Navigation tabs mimicking Expo Router */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tab}>
          <Calendar size={22} color="#346823" />
          <Text style={[styles.tabText, { color: '#346823' }]}>일정</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Award size={22} color="#72796c" />
          <Text style={styles.tabText}>기록</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Bot size={22} color="#72796c" />
          <Text style={styles.tabText}>코칭</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8faf0',
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#f8faf0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#346823',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 24,
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#346823',
  },
  splashTagline: {
    fontSize: 16,
    color: '#49663f',
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginTop: 4,
    marginBottom: 48,
  },
  splashBtn: {
    width: '100%',
    height: 52,
    backgroundColor: '#346823',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#346823',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  splashBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#f8faf0',
    borderBottomWidth: 1,
    borderBottomColor: '#c1c9b933',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#346823',
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#b7f39d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#042100',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  balanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 24,
    shadowColor: '#346823',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#72796c',
  },
  balanceNum: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#346823',
    marginTop: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#caecbb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e510f',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#191d17',
    marginBottom: 16,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeLabel: {
    width: 50,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#72796c',
    paddingTop: 12,
  },
  eventCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
  },
  fixedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#346823',
  },
  flexibleCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#c1c9b9',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#191d17',
  },
  eventDesc: {
    fontSize: 12,
    color: '#72796c',
    marginTop: 4,
    lineHeight: 16,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  fixedTag: {
    fontSize: 9,
    fontWeight: 'extrabold',
    backgroundColor: '#3468231a',
    color: '#346823',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  flexibleTag: {
    fontSize: 9,
    fontWeight: 'extrabold',
    backgroundColor: '#edefe5',
    color: '#72796c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  durationTag: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#72796c',
  },
  tabBar: {
    height: 70,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#c1c9b933',
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#72796c',
    marginTop: 4,
  },
});
