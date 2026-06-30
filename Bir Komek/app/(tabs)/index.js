import React, { useState, useEffect, useRef } from 'react';
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
  Modal,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { CustomTabBar } from './_layout';
import { useLanguage } from '../language_store';
import { useTheme } from '../theme_store';

const { width: SW } = Dimensions.get('window');
const s = (n) => Math.round(n * (SW / 393)); // scaled according to figma width 393

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { colors, activeMode } = useTheme();
  
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollViewRef = useRef(null);

  // External Link Warning Modal states
  const [showExternalWarning, setShowExternalWarning] = useState(false);

  // Dynamic Banners
  const banners = [
    {
      id: 1,
      title: t('banner1Title'),
      subtitle: t('banner1Subtitle'),
      image: require('../../assets/elderly.png'),
    },
    {
      id: 2,
      title: t('banner2Title'),
      subtitle: t('banner2Subtitle'),
      image: require('../../assets/banner.png'),
    },
  ];

  // Dynamic Services with dark-tinted backgrounds for dark mode
  const services = [
    {
      id: '103',
      title: t('ambulance'),
      subtitle: t('ambulanceSub'),
      number: '103',
      bgColor: activeMode === 'dark' ? '#2E1A1A' : '#FFF1F1',
      numberColor: '#EF4444',
      image: require('../../assets/ambulance.png'),
    },
    {
      id: '102',
      title: t('police'),
      subtitle: t('policeSub'),
      number: '102',
      bgColor: activeMode === 'dark' ? '#1E2538' : '#EEF2FF',
      numberColor: '#3B82F6',
      image: require('../../assets/shield.png'),
    },
    {
      id: '112',
      title: t('fire'),
      subtitle: t('fireSub'),
      number: '112',
      bgColor: activeMode === 'dark' ? '#2E251E' : '#FFFBEB',
      numberColor: '#F59E0B',
      image: require('../../assets/fire_station.png'),
    },
    {
      id: 'SOS',
      title: t('familySos'),
      subtitle: t('familySosSub'),
      number: 'SOS',
      bgColor: activeMode === 'dark' ? '#251E38' : '#F5F3FF',
      numberColor: '#8B5CF6',
      image: require('../../assets/family.png'),
    },
  ];

  // Auto-slide banner every 20 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const nextSlide = (activeSlide + 1) % banners.length;
      setActiveSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * (SW - s(40)),
        animated: true,
      });
    }, 20000);
    return () => clearInterval(timer);
  }, [activeSlide, banners.length]);

  const handleCardPress = (id) => {
    router.push(`/sos/${id}`);
  };

  const handleConfirmExternal = () => {
    setShowExternalWarning(false);
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    if (viewSize > 0) {
      const index = Math.round(contentOffset / viewSize);
      if (index !== activeSlide) {
        setActiveSlide(index);
      }
    }
  };

  const handleDotPress = (idx) => {
    setActiveSlide(idx);
    scrollViewRef.current?.scrollTo({
      x: idx * (SW - s(40)),
      animated: true,
    });
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={activeMode === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background} 
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        
        {/* ── Header ────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.userSection}>
            <Image
              source={require('../../assets/avatar.jpg')} // Local user avatar
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={[styles.greeting, { color: colors.text }]}>{t('greeting')}</Text>
              <Text style={[styles.subGreeting, { color: colors.subText }]}>{t('subGreeting')}</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              onPress={() => router.push('/history')} 
              style={[styles.headerBtn, { backgroundColor: colors.lightBg }]}
            >
              <Feather name="file-text" size={s(20)} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => router.push('/notifications')} 
              style={[styles.headerBtn, { backgroundColor: colors.lightBg }]}
            >
              <Ionicons name="notifications-outline" size={s(20)} color={colors.text} />
              <View style={styles.badge} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Services Grid ─────────────────────────── */}
        <View style={styles.grid}>
          {services.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, { backgroundColor: item.bgColor }]}
              onPress={() => handleCardPress(item.id)}
              activeOpacity={0.9}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.cardSubtitle, { color: colors.subText }]}>{item.subtitle}</Text>
              </View>
              {item.number !== 'SOS' && (
                <Text style={[styles.cardNum, { color: item.numberColor }]}>{item.number}</Text>
              )}
              <Image source={item.image} style={styles.cardImg} />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Banner Carousel (Horizontal Swipe Support) ── */}
        <View style={styles.bannerContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            style={styles.bannerScrollView}
            scrollEventThrottle={16}
          >
            {banners.map((banner) => (
              <TouchableOpacity 
                key={banner.id} 
                style={styles.bannerSlide}
                activeOpacity={0.95}
                onPress={() => setShowExternalWarning(true)}
              >
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerTitle}>{banner.title}</Text>
                  <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                </View>
                <Image
                  source={banner.image}
                  style={styles.bannerImg}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Page Indicators ───────────────────────── */}
        <View style={styles.indicatorRow}>
          {banners.map((_, idx) => (
            <TouchableOpacity 
              key={idx}
              onPress={() => handleDotPress(idx)}
              style={[
                styles.dot, 
                activeSlide === idx && styles.dotActive
              ]} 
            />
          ))}
        </View>

      </ScrollView>
      <CustomTabBar activeTab="home" />

      {/* ── External Warning Modal (iOS Dialog Style) ── */}
      <Modal
        visible={showExternalWarning}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowExternalWarning(false)}
      >
        <View style={styles.warningOverlay}>
          <View style={[styles.warningContainer, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.warningTitle, { color: colors.text }]}>Xarici keçid</Text>
            <Text style={[styles.warningText, { color: colors.subText }]}>
              Bu keçid digər tətbiqdə açılacaq. Davam etmək istəyirsiniz?
            </Text>

            <View style={styles.warningBtnRow}>
              <TouchableOpacity 
                style={[styles.warningBtn, { backgroundColor: activeMode === 'dark' ? '#374151' : '#E5E7EB' }]}
                activeOpacity={0.8}
                onPress={() => setShowExternalWarning(false)}
              >
                <Text style={[styles.warningBtnText, { color: colors.text }]}>Ləğv et</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.warningBtn, { backgroundColor: activeMode === 'dark' ? '#4B5563' : '#D1D5DB' }]}
                activeOpacity={0.8}
                onPress={handleConfirmExternal}
              >
                <Text style={[styles.warningBtnText, { color: colors.text }]}>Keçid et</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
    paddingBottom: s(8),
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
    fontFamily: 'Plus Jakarta Sans',
  },
  subGreeting: {
    fontSize: s(13),
    marginTop: s(2),
    fontFamily: 'Plus Jakarta Sans',
  },
  headerActions: {
    flexDirection: 'row',
    gap: s(10),
  },
  headerBtn: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
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
    marginTop: s(40),
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
    lineHeight: s(20),
    fontFamily: 'Plus Jakarta Sans',
  },
  cardSubtitle: {
    fontSize: s(12),
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
  bannerContainer: {
    marginHorizontal: s(20),
    marginTop: s(24),
    borderRadius: s(20),
    height: s(120),
    overflow: 'hidden',
  },
  bannerScrollView: {
    flex: 1,
  },
  bannerSlide: {
    width: SW - s(40),
    height: s(120),
    backgroundColor: '#2563EB',
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
  warningOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 21, 28, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(24),
  },
  warningContainer: {
    borderRadius: s(30),
    padding: s(24),
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  warningTitle: {
    fontSize: s(20),
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
    marginBottom: s(8),
  },
  warningText: {
    fontSize: s(15),
    lineHeight: s(22),
    fontFamily: 'Plus Jakarta Sans',
    marginBottom: s(24),
  },
  warningBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: s(12),
  },
  warningBtn: {
    flex: 1,
    height: s(48),
    borderRadius: s(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningBtnText: {
    fontSize: s(16),
    fontWeight: '600',
    fontFamily: 'Plus Jakarta Sans',
  },
});
