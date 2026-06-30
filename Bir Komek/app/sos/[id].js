import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Switch,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width: SW } = Dimensions.get('window');
const s = (n) => Math.round(n * (SW / 393));

const SOS_DATA = {
  '103': {
    title: 'Təcili tibbi yardım',
    subtitle: 'Ambulans çağırışı',
    number: '103',
    numberColor: '#E11D48',
    image: require('../../assets/ambulance.png'),
  },
  '102': {
    title: 'Polis / Təhlükəsizlik',
    subtitle: 'Şəxsi təhlükəsizlik',
    number: '102',
    numberColor: '#1E3A8A',
    image: require('../../assets/shield.png'),
  },
  '112': {
    title: 'FHN / Yanğın',
    subtitle: 'Yanğın və məişət',
    number: '112',
    numberColor: '#B45309',
    image: require('../../assets/fire_station.png'),
  },
  'SOS': {
    title: 'Ailə SOS',
    subtitle: 'Yaxınlarıma bildir',
    number: 'SOS',
    numberColor: '#6D28D9',
    image: require('../../assets/family.png'),
  },
  'universal': {
    title: 'Mərkəzi SOS',
    subtitle: 'Təcili Kömək Mərkəzi',
    number: '112',
    numberColor: '#DC2626',
    image: require('../../assets/ambulance.png'),
  },
};

export default function SosScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [notifyFamily, setNotifyFamily] = useState(true);

  const data = SOS_DATA[id] || SOS_DATA['universal'];

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* ── Header ────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={s(24)} color="#111827" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-horizontal" size={s(24)} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* ── Content ───────────────────────────────── */}
      <View style={styles.content}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.subtitle}>{data.subtitle}</Text>
        
        <Text style={[styles.number, { color: data.numberColor }]}>{data.number}</Text>
        
        <Image source={data.image} style={styles.mainImg} />

        {/* ── Location Box ──────────────────────────── */}
        <View style={styles.locationBox}>
          <View style={styles.locIconBg}>
            <Ionicons name="location" size={s(20)} color="#2563EB" />
          </View>
          <View style={styles.locTextGroup}>
            <Text style={styles.locTitle}>Məkanınız paylaşılır</Text>
            <Text style={styles.locSub}>Bakı, Üzeyir Hacıbəyov küç., 34</Text>
          </View>
        </View>

        {/* ── Notification Toggle ────────────────────── */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleTextGroup}>
            <Text style={styles.toggleTitle}>Yaxın əlaqə bildirişi</Text>
            <Text style={styles.toggleSub}>Yaxınlarıma avtomatik məlumat ver</Text>
          </View>
          <Switch
            value={notifyFamily}
            onValueChange={setNotifyFamily}
            trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* ── Action Buttons ────────────────────────── */}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} activeOpacity={0.8}>
            <Text style={styles.btnPrimaryText}>Zəng et</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} style={[styles.btn, styles.btnSecondary]} activeOpacity={0.8}>
            <Text style={styles.btnSecondaryText}>Ləğv et</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingTop: s(12),
    paddingBottom: s(8),
  },
  backBtn: {
    padding: s(4),
  },
  moreBtn: {
    padding: s(4),
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: s(24),
    paddingTop: s(16),
  },
  title: {
    fontSize: s(24),
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: s(14),
    color: '#6B7280',
    marginTop: s(4),
    textAlign: 'center',
  },
  number: {
    fontSize: s(64),
    fontWeight: '800',
    marginTop: s(20),
    marginBottom: s(10),
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.05)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  mainImg: {
    width: s(220),
    height: s(220),
    resizeMode: 'contain',
    marginVertical: s(12),
  },
  locationBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: s(16),
    padding: s(16),
    width: '100%',
    alignItems: 'center',
    marginBottom: s(16),
  },
  locIconBg: {
    width: s(44),
    height: s(44),
    borderRadius: s(12),
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    // We can style with opacity for container
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  locTextGroup: {
    marginLeft: s(16),
    flex: 1,
  },
  locTitle: {
    fontSize: s(14),
    fontWeight: '700',
    color: '#2563EB',
  },
  locSub: {
    fontSize: s(12),
    color: '#6B7280',
    marginTop: s(2),
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: s(16),
    padding: s(16),
    width: '100%',
    marginBottom: s(24),
  },
  toggleTextGroup: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: s(14),
    fontWeight: '700',
    color: '#1F2937',
  },
  toggleSub: {
    fontSize: s(12),
    color: '#9CA3AF',
    marginTop: s(2),
  },
  actions: {
    width: '100%',
    gap: s(12),
  },
  btn: {
    height: s(52),
    borderRadius: s(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: '#DC2626',
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: s(16),
    fontWeight: '700',
  },
  btnSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  btnSecondaryText: {
    color: '#4B5563',
    fontSize: s(16),
    fontWeight: '600',
  },
});
