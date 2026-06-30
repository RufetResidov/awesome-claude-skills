import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { EVENTS_STORE } from '../history_store';

const { width: SW } = Dimensions.get('window');
const s = (n) => Math.round(n * (SW / 393));

const EVENTS = [
  {
    id: '1',
    type: '103',
    title: '103 Təcili Tibbi Yardım',
    status: 'Briqada Yoldadır',
    statusType: 'red',
    date: '30 İyun 2026, 11:15',
    address: 'Nizami küçəsi 45',
    attachments: [
      { type: 'audio', label: '15s Səs Yazısı Arxivləndi', icon: 'waveform', color: '#E11D48' },
      { type: 'image', label: 'Hadisə Anı Fotosu Arxivləndi', icon: 'image-outline', color: '#2563EB' },
    ],
    bgColor: '#FFF1F1',
    borderColor: '#FCA5A5',
  },
  {
    id: '2',
    type: '102',
    title: '102 Polis',
    status: 'Yardım Göstərildi',
    statusType: 'green',
    date: '15 İyun 2026, 23:40',
    mapLink: true,
    attachments: [
      { type: 'video', label: '10s Video Yazısı Arxivləndi', icon: 'video-outline', color: '#059669' },
    ],
    bgColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  {
    id: '3',
    type: '112',
    title: '112 FHN / Yanğın',
    status: 'Briqada Yoldadır',
    statusType: 'orange',
    date: '10 İyun 2026, 15:45',
    address: 'Atatürk prospekti 12',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  {
    id: '4',
    type: 'SOS',
    title: 'Ailə SOS (Yaxınlarıma Bildir)',
    status: 'Ləğv Edildi (Səhvən Basılma)',
    statusType: 'gray',
    date: '02 İyun 2026, 09:12',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
  },
];

const TABS = [
  { key: 'all', label: 'Hamısı' },
  { key: '103', label: 'Tibbi' },
  { key: '102', label: 'Polis' },
  { key: '112', label: 'FHN' },
  { key: 'SOS', label: 'Ailə' },
];

export default function HistoryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [events, setEvents] = useState(EVENTS_STORE);

  useFocusEffect(
    React.useCallback(() => {
      setEvents([...EVENTS_STORE]);
    }, [])
  );

  const filteredEvents = events.filter(
    (event) => activeTab === 'all' || event.type === activeTab
  );

  const handleCardPress = (id) => {
    router.push(`/history/${id}`);
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* ── Centered Header ───────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={s(24)} color="#111827" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Xidmət Tarixçəsi</Text>
        </View>
        
        <TouchableOpacity style={styles.moreBtn} activeOpacity={0.7}>
          <Ionicons name="ellipsis-horizontal" size={s(24)} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* ── Tabs Bar ──────────────────────────────── */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {TABS.map((tab) => {
            const active = tab.key === activeTab;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[styles.tab, active && styles.tabActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── History List ──────────────────────────── */}
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {filteredEvents.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            onPress={() => handleCardPress(item.id)}
            style={[styles.card, { backgroundColor: item.bgColor, borderColor: item.borderColor }]}
          >
            <View style={styles.cardHeader}>
              <Text
                style={[
                  styles.cardTitle,
                  item.type === '102' && { color: '#102E73' },
                  item.type === '112' && { color: '#B45309' },
                  item.type === 'SOS' && { color: '#6D28D9' },
                ]}
              >
                {item.title}
              </Text>
              
              <View
                style={[
                  styles.tag,
                  item.statusType === 'red' && styles.tagRed,
                  item.statusType === 'green' && styles.tagGreen,
                  item.statusType === 'orange' && styles.tagOrange,
                  item.statusType === 'gray' && styles.tagGray,
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    item.statusType === 'red' && { color: '#9F1239' },
                    item.statusType === 'green' && { color: '#065F46' },
                    item.statusType === 'orange' && { color: '#B45309' },
                    item.statusType === 'gray' && { color: '#374151' },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
            
            <View style={styles.cardBody}>
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={s(16)} color="#4B5563" />
                <Text style={styles.infoText}>{item.date}</Text>
              </View>
              {item.address && (
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={s(16)} color="#4B5563" />
                  <Text style={styles.infoText}>{item.address}</Text>
                </View>
              )}
            </View>

            {/* Render details / attachments section */}
            {item.attachments && item.attachments.length > 0 && (
              <>
                <View style={[styles.cardDivider, { backgroundColor: item.borderColor, opacity: 0.5 }]} />
                <View style={styles.attachmentsContainer}>
                  {item.attachments.map((attach, idx) => (
                    <View key={idx} style={styles.attachmentRow}>
                      {attach.type === 'audio' ? (
                        <MaterialCommunityIcons name={attach.icon} size={s(18)} color={attach.color} />
                      ) : (
                        <Ionicons name={attach.icon} size={s(18)} color={attach.color} />
                      )}
                      <Text style={[styles.attachmentText, { color: attach.color }]}>
                        {attach.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {item.mapLink && (
              <>
                <View style={[styles.cardDivider, { backgroundColor: item.borderColor, opacity: 0.5 }]} />
                <View style={styles.linkRow}>
                  <Ionicons name="map-outline" size={s(16)} color="#2563EB" />
                  <Text style={[styles.linkText, { color: '#2563EB' }]}>Koordinat Xəritəsi</Text>
                </View>
              </>
            )}
          </TouchableOpacity>
        ))}

        {filteredEvents.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Heç bir qeyd tapılmadı</Text>
          </View>
        )}
      </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingTop: s(16),
    paddingBottom: s(16),
    position: 'relative',
    height: s(60),
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: s(4),
    zIndex: 10,
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#111827',
    fontSize: s(20),
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  moreBtn: {
    padding: s(4),
    zIndex: 10,
  },
  tabsWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: s(12),
  },
  tabsScroll: {
    paddingHorizontal: s(20),
    gap: s(8),
  },
  tab: {
    paddingHorizontal: s(18),
    height: s(36),
    borderRadius: s(10),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: s(13),
    fontWeight: '600',
    color: '#4B5563',
    fontFamily: 'Plus Jakarta Sans',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  container: {
    paddingHorizontal: s(20),
    paddingTop: s(20),
    paddingBottom: s(40),
    gap: s(16),
  },
  card: {
    borderRadius: s(16),
    padding: s(16),
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: s(8),
  },
  cardTitle: {
    color: '#E11D48',
    fontSize: s(15),
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
    flex: 1,
  },
  tag: {
    paddingHorizontal: s(10),
    paddingVertical: s(4),
    borderRadius: s(8),
  },
  tagRed: {
    backgroundColor: '#FFE4E6',
  },
  tagGreen: {
    backgroundColor: '#D1FAE5',
  },
  tagOrange: {
    backgroundColor: '#FEF3C7',
  },
  tagGray: {
    backgroundColor: '#E5E7EB',
  },
  tagText: {
    fontSize: s(11),
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  cardBody: {
    marginTop: s(14),
    gap: s(8),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  infoText: {
    color: '#374151',
    fontSize: s(13),
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '500',
  },
  cardDivider: {
    height: 1,
    marginVertical: s(14),
  },
  attachmentsContainer: {
    gap: s(10),
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  attachmentText: {
    fontSize: s(13),
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  linkText: {
    fontSize: s(13),
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
    textDecorationLine: 'underline',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: s(40),
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: s(14),
    fontFamily: 'Plus Jakarta Sans',
  },
});
