import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { CustomTabBar } from './_layout';

const { width: SW } = Dimensions.get('window');
const s = (n) => Math.round(n * (SW / 393)); // scaled according to figma width 393

const SERVICES = [
  {
    id: '103',
    title: 'Təcili tibbi yardım',
    subtitle: 'Ambulans çağırışı',
    number: '103',
    bgColor: '#FFF1F1',
    numberColor: '#E11D48',
    image: require('../../assets/ambulance.png'),
  },
  {
    id: '102',
    title: 'Polis / Təhlükəsizlik',
    subtitle: 'Şəxsi təhlükəsizlik',
    number: '102',
    bgColor: '#EEF2FF',
    numberColor: '#102E73',
    image: require('../../assets/shield.png'),
  },
  {
    id: '112',
    title: 'FHN / Yanğın',
    subtitle: 'Yanğın və məişət',
    number: '112',
    bgColor: '#FFFBEB',
    numberColor: '#B45309',
    image: require('../../assets/fire_station.png'),
  },
  {
    id: 'SOS',
    title: 'Ailə SOS',
    subtitle: 'Yaxınlarıma bildir',
    number: 'SOS',
    bgColor: '#F5F3FF',
    numberColor: '#6D28D9',
    image: require('../../assets/family.png'),
  },
];

export default function HomeScreen() {
  const router = useRouter();

  const handleCardPress = (id) => {
    if (id === 'SOS') {
      router.push('/sos_report');
    } else {
      router.push(`/sos/${id}`);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        
        {/* ── Header ────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.userSection}>
            <Image
              source={require('../../assets/avatar.jpg')} // Local user avatar
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>Salam Rufat</Text>
              <Text style={styles.subGreeting}>Təkrar xoş gəldiniz 😊</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => router.push('/history')} style={styles.headerBtn}>
              <Feather name="file-text" size={s(20)} color="#1F2937" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.headerBtn}>
              <Ionicons name="notifications-outline" size={s(20)} color="#1F2937" />
              <View style={styles.badge} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Services Grid ─────────────────────────── */}
        <View style={styles.grid}>
          {SERVICES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, { backgroundColor: item.bgColor }]}
              onPress={() => handleCardPress(item.id)}
              activeOpacity={0.9}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </View>
              {item.number !== 'SOS' && (
                <Text style={[styles.cardNum, { color: item.numberColor }]}>{item.number}</Text>
              )}
              <Image source={item.image} style={styles.cardImg} />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Banner ────────────────────────────────── */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Onların təhlükəsizliyi{"\n"}bizim borcumuzdur !</Text>
            <Text style={styles.bannerSubtitle}>Bir toxunuşla qayğı və dəstək</Text>
          </View>
          <Image
            source={require('../../assets/elderly.png')}
            style={styles.bannerImg}
          />
        </View>

        {/* ── Page Indicators ───────────────────────── */}
        <View style={styles.indicatorRow}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

      </ScrollView>
      <CustomTabBar activeTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingBottom: s(140),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingTop: s(16),
    paddingBottom: s(16),
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: s(48),
    height: s(48),
    borderRadius: s(24),
    backgroundColor: '#F3F4F6',
  },
  userInfo: {
    marginLeft: s(12),
  },
  greeting: {
    fontSize: s(18),
    fontWeight: '700',
    color: '#111827',
  },
  subGreeting: {
    fontSize: s(13),
    color: '#6B7280',
    marginTop: s(2),
  },
  headerActions: {
    flexDirection: 'row',
    gap: s(10),
  },
  headerBtn: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: s(2),
    right: s(2),
    width: s(10),
    height: s(10),
    borderRadius: s(5),
    backgroundColor: '#2563EB',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: s(16),
    justifyContent: 'space-between',
    gap: s(16),
    marginTop: s(16),
  },
  card: {
    width: s(172),
    height: s(160),
    borderRadius: s(16),
    paddingVertical: s(24),
    paddingHorizontal: s(12),
    justifyContent: 'flex-start',
    gap: s(8),
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    gap: s(2),
    alignSelf: 'stretch',
  },
  cardTitle: {
    fontSize: s(14),
    fontWeight: '700',
    color: '#11151C',
    lineHeight: s(20),
    fontFamily: 'Plus Jakarta Sans',
  },
  cardSubtitle: {
    fontSize: s(12),
    color: '#8B93A1',
    fontWeight: '400',
    fontFamily: 'Plus Jakarta Sans',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    alignSelf: 'stretch',
  },
  cardNum: {
    fontSize: s(25),
    fontWeight: '900',
    lineHeight: s(25),
    fontFamily: 'Plus Jakarta Sans',
  },
  cardImg: {
    width: s(108),
    height: s(90),
    resizeMode: 'contain',
    position: 'absolute',
    left: s(64),
    top: s(64),
  },
  banner: {
    marginHorizontal: s(20),
    marginTop: s(24),
    backgroundColor: '#2563EB',
    borderRadius: s(20),
    height: s(120),
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
  },
  bannerContent: {
    paddingLeft: s(16),
    justifyContent: 'center',
    gap: s(4),
    zIndex: 1,
  },
  bannerTitle: {
    fontSize: s(15),
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: s(20),
    fontFamily: 'Plus Jakarta Sans',
  },
  bannerSubtitle: {
    fontSize: s(12),
    color: 'rgba(255, 255, 255, 0.60)',
    fontWeight: '400',
    lineHeight: s(16),
    fontFamily: 'Plus Jakarta Sans',
  },
  bannerImg: {
    width: s(183),
    height: s(120),
    resizeMode: 'contain',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: s(6),
    marginTop: s(16),
  },
  dot: {
    width: s(6),
    height: s(6),
    borderRadius: s(3),
    backgroundColor: '#E5E7EB',
  },
  dotActive: {
    width: s(20),
    backgroundColor: '#2563EB',
  },
});
