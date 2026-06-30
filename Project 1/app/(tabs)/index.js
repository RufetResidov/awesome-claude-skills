import React, { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';

const { width: SW } = Dimensions.get('window');
const s = (n) => Math.round(n * (SW / 375));

// ─── Data ────────────────────────────────────────────────────────────────────
const SOURCES = [
  { id: '1', name: 'CNN',       bg: '#CC0000', fg: '#fff',    label: 'CNN'  },
  { id: '2', name: 'NBC',       bg: '#F4A81D', fg: '#fff',    label: 'NBC'  },
  { id: '3', name: 'BBC',       bg: '#BB1919', fg: '#fff',    label: 'BBC'  },
  { id: '4', name: 'Fox News',  bg: '#003087', fg: '#fff',    label: 'FOX'  },
  { id: '5', name: 'Bloomberg', bg: '#FF6900', fg: '#fff',    label: 'B'    },
  { id: '6', name: 'KQED',     bg: '#1A1A2E', fg: '#4FC3F7', label: 'K'   },
];

const CATEGORIES = ['Tranding', 'Business', 'Health', 'Politics', 'Sports', 'International'];

const NEWS = [
  {
    id: '1',
    category: 'Technology',
    title: 'Innovations in Business: The Future of Commerce',
    source: 'CNN News',
    time: '14h ago',
    comments: 23,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80',
  },
  {
    id: '2',
    category: 'Crypto',
    title: 'Exploring the Latest in Cryptocurrency Trends',
    source: 'CNN News',
    time: '14h ago',
    comments: 23,
    image: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=200&q=80',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const [activeCat, setActiveCat] = useState('Tranding');

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Header ────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoLetter}>N</Text>
            </View>
            <Text style={styles.logoText}>Newsup</Text>
          </View>
          <TouchableOpacity style={styles.bell}>
            <Ionicons name="notifications-outline" size={s(24)} color="#9CA3AF" />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>

        {/* ── News Sources ──────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sourcesRow}
        >
          {SOURCES.map((src) => (
            <TouchableOpacity key={src.id} style={styles.sourceWrap}>
              <View style={[styles.sourceCircle, { backgroundColor: src.bg }]}>
                <Text style={[styles.sourceLabel, { color: src.fg }]}>{src.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Breaking News ─────────────────────────── */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Breaking News</Text>
          <TouchableOpacity>
            <Text style={styles.viewMore}>View more</Text>
          </TouchableOpacity>
        </View>

        {/* Breaking card */}
        <TouchableOpacity style={styles.breakCard} activeOpacity={0.9}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1617440168937-c6497eaa8db5?w=700&q=80' }}
            style={styles.breakImg}
          />
          {/* Gradient overlay */}
          <View style={styles.breakGrad} />

          {/* Live badge */}
          <View style={styles.liveBadge}>
            <Ionicons name="radio" size={s(14)} color="#fff" />
            <Text style={styles.liveText}>Live</Text>
          </View>

          {/* Card footer */}
          <View style={styles.breakFooter}>
            <Text style={styles.breakTitle}>
              Ukraine conflict: Kyiv brace for a Russian assault
            </Text>
            <View style={styles.breakMeta}>
              <View style={styles.metaLeft}>
                <View style={[styles.miniAvatar, { backgroundColor: '#F3F4F6' }]}>
                  <Text style={styles.miniAvatarTxt}>C</Text>
                </View>
                <Text style={styles.metaWhite}>CNN News</Text>
                <View style={styles.dotSep} />
                <Text style={styles.metaWhite}>Today</Text>
              </View>
              <Text style={styles.metaWhite}>235 Joined</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ── Category Tabs ─────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catRow}
        >
          {CATEGORIES.map((cat) => {
            const active = cat === activeCat;
            return (
              <TouchableOpacity key={cat} onPress={() => setActiveCat(cat)}>
                <Text style={[styles.catText, active && styles.catActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── News List ─────────────────────────────── */}
        {NEWS.map((item, idx) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.newsItem, idx === 0 && { marginTop: s(16) }]}
            activeOpacity={0.8}
            onPress={() => router.push(`/news/${item.id}`)}
          >
            <Image source={{ uri: item.image }} style={styles.newsThumb} />
            <View style={styles.newsBody}>
              {/* Category + dots */}
              <View style={styles.newsTopRow}>
                <Text style={styles.newsCat}>{item.category}</Text>
                <Ionicons name="ellipsis-horizontal" size={s(16)} color="#9CA3AF" />
              </View>
              {/* Title */}
              <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
              {/* Meta row */}
              <View style={styles.newsMeta}>
                {/* Source */}
                <View style={styles.newsSource}>
                  <View style={[styles.miniAvatar, { backgroundColor: '#FFEBEE' }]}>
                    <Text style={[styles.miniAvatarTxt, { color: '#CC0000' }]}>C</Text>
                  </View>
                  <Text style={styles.newsMetaTxt}>{item.source}</Text>
                </View>
                {/* Time + comments */}
                <View style={styles.newsStats}>
                  <Ionicons name="time-outline" size={s(14)} color="#9CA3AF" />
                  <Text style={styles.newsMetaTxt}>{item.time}</Text>
                  <Ionicons
                    name="chatbubble-outline"
                    size={s(14)}
                    color="#9CA3AF"
                    style={{ marginLeft: s(10) }}
                  />
                  <Text style={styles.newsMetaTxt}>{item.comments}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: s(32) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(24),
    paddingTop: s(12),
    paddingBottom: s(8),
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: s(8) },
  logoIcon: {
    width: s(36),
    height: s(36),
    borderRadius: s(10),
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetter: { color: '#fff', fontSize: s(18), fontWeight: '800' },
  logoText: { color: '#2563EB', fontSize: s(22), fontWeight: '700' },
  bell: { position: 'relative', padding: s(8) },
  notifBadge: {
    position: 'absolute',
    top: s(8),
    right: s(8),
    width: s(8),
    height: s(8),
    borderRadius: s(4),
    backgroundColor: '#FF4747',
    borderWidth: 1.5,
    borderColor: '#fff',
  },

  /* Sources */
  sourcesRow: { paddingHorizontal: s(24), gap: s(16), paddingBottom: s(8), paddingTop: s(4) },
  sourceWrap: { alignItems: 'center' },
  sourceCircle: {
    width: s(48),
    height: s(48),
    borderRadius: s(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sourceLabel: { fontSize: s(11), fontWeight: '800', letterSpacing: -0.3 },

  /* Section */
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(25),
    marginTop: s(20),
    marginBottom: s(12),
  },
  sectionTitle: { color: '#111827', fontSize: s(16), fontWeight: '700', lineHeight: s(25.6) },
  viewMore: { color: '#2563EB', fontSize: s(14), fontWeight: '500' },

  /* Breaking card */
  breakCard: {
    marginHorizontal: s(24),
    height: s(208),
    borderRadius: s(20),
    overflow: 'hidden',
  },
  breakImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  breakGrad: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: '70%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderBottomLeftRadius: s(20),
    borderBottomRightRadius: s(20),
  },
  liveBadge: {
    position: 'absolute',
    top: s(16),
    left: s(20),
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    backgroundColor: '#FF4747',
    borderRadius: s(100),
    paddingHorizontal: s(12),
    paddingVertical: s(4),
  },
  liveText: { color: '#fff', fontSize: s(12), fontWeight: '500' },
  breakFooter: {
    position: 'absolute',
    bottom: s(14),
    left: s(20),
    right: s(20),
  },
  breakTitle: {
    color: '#fff',
    fontSize: s(16),
    fontWeight: '700',
    lineHeight: s(24),
    marginBottom: s(8),
  },
  breakMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLeft: { flexDirection: 'row', alignItems: 'center', gap: s(6) },
  metaWhite: { color: '#fff', fontSize: s(12), fontWeight: '500' },
  dotSep: { width: s(4), height: s(4), borderRadius: s(2), backgroundColor: '#fff' },
  miniAvatar: {
    width: s(20),
    height: s(20),
    borderRadius: s(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniAvatarTxt: { color: '#CC0000', fontSize: s(9), fontWeight: '800' },

  /* Category tabs */
  catRow: {
    paddingHorizontal: s(24),
    gap: s(16),
    marginTop: s(24),
    paddingBottom: s(8),
  },
  catText: {
    color: '#111827',
    fontSize: s(16),
    fontWeight: '500',
    lineHeight: s(25.6),
  },
  catActive: {
    color: '#2563EB',
    fontWeight: '700',
  },

  /* News list */
  newsItem: {
    flexDirection: 'row',
    paddingHorizontal: s(24),
    gap: s(16),
    alignItems: 'flex-start',
    marginTop: s(12),
  },
  newsThumb: {
    width: s(80),
    height: s(80),
    borderRadius: s(12),
    backgroundColor: '#F3F4F6',
  },
  newsBody: { flex: 1, gap: s(4) },
  newsTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsCat: { color: '#2563EB', fontSize: s(12), fontWeight: '500', lineHeight: s(19.2) },
  newsTitle: {
    color: '#111827',
    fontSize: s(14),
    fontWeight: '700',
    lineHeight: s(22.4),
  },
  newsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: s(8),
  },
  newsSource: { flexDirection: 'row', alignItems: 'center', gap: s(4) },
  newsStats: { flexDirection: 'row', alignItems: 'center', gap: s(4) },
  newsMetaTxt: { color: '#9CA3AF', fontSize: s(12) },
});
