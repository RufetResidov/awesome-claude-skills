import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width: SW } = Dimensions.get('window');
const s = (n) => Math.round(n * (SW / 375));

// Static article store (expand later with real API)
const ARTICLES = {
  '1': {
    id: '1',
    title: "Bitcoin Bull Run 'May Not Happen Until 2025'",
    source: 'CNN News',
    author: 'By Naiera Azzafron',
    image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=80',
    likes: '1+',
    dislikes: 123,
    comments: 231,
  },
  '2': {
    id: '2',
    title: 'Innovations in Business: The Future of Commerce',
    source: 'CNN News',
    author: 'By James Mitchell',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    likes: '45',
    dislikes: 8,
    comments: 57,
  },
};

const FALLBACK = ARTICLES['1'];

export default function NewsDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const article = ARTICLES[String(id)] || FALLBACK;

  const [bookmarked, setBookmarked] = useState(false);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Scrollable content ─────────────────────── */}
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero image */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: article.image }} style={styles.heroImg} resizeMode="cover" />
          {/* Dark overlay — top (status bar protection) */}
          <View style={styles.darkOverlay} />
          {/* White fade — bottom transition to content */}
          <View style={styles.whiteBottomFade} />
        </View>

        {/* ── Content card ──────────────────────────── */}
        <View style={styles.contentCard}>

          {/* Source row */}
          <View style={styles.sourceRow}>
            <View style={styles.sourceLeft}>
              {/* CNN Avatar */}
              <View style={styles.cnnAvatar}>
                <Text style={styles.cnnAvatarText}>CNN</Text>
              </View>
              <View>
                <Text style={styles.sourceName}>{article.source}</Text>
                <Text style={styles.sourceAuthor}>{article.author}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followBtnText}>Follow</Text>
            </TouchableOpacity>
          </View>

          {/* Title + stats */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{article.title}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="thumbs-up-outline" size={s(16)} color="#9CA3AF" />
                <Text style={styles.statText}>{article.likes} Like</Text>
              </View>
              <View style={styles.statDot} />
              <View style={styles.statItem}>
                <Ionicons name="thumbs-down-outline" size={s(16)} color="#9CA3AF" />
                <Text style={styles.statText}>{article.dislikes} Dislike</Text>
              </View>
              <View style={styles.statDot} />
              <TouchableOpacity
                style={styles.statItem}
                onPress={() => router.push('/news/comments')}
              >
                <Ionicons name="chatbubble-outline" size={s(16)} color="#9CA3AF" />
                <Text style={styles.statText}>{article.comments} Comment</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Article body */}
          <View style={styles.body}>
            <Text style={styles.bodyText}>
              Bitcoin's next bull run may not happen until late 2024 or early 2025,
              Huobi's co-founder has claimed.
            </Text>

            <Text style={styles.bodyText}>
              Other crypto analysts had previously argued that halving events were beginning
              to have less of an effect on Bitcoin's value — principally because most of
              the <Text style={styles.bodyBold}>21 million BTC</Text> that will ever exist
              is now in circulation.
            </Text>

            <Text style={styles.bodyText}>
              According to the co-founder of Huobi, one of the leading cryptocurrency
              exchanges in the world, the next major surge in Bitcoin's value, often
              referred to as a 'bull run', might not be on the horizon anytime soon.
              While the cryptocurrency market is known for its unpredictability and volatile
              nature, the co-founder suggests that enthusiasts and investors might have to
              exercise patience.
            </Text>
          </View>

          <View style={{ height: s(120) }} />
        </View>
      </ScrollView>

      {/* ── Fixed app bar (overlaid on image) ──────── */}
      <View style={styles.appBar} pointerEvents="box-none">
        <SafeAreaView style={styles.appBarInner} pointerEvents="box-none">
          <TouchableOpacity style={styles.appBarBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={s(28)} color="#fff" />
          </TouchableOpacity>
          <View style={styles.appBarRight} pointerEvents="box-none">
            <TouchableOpacity style={styles.appBarBtn} onPress={() => setBookmarked(!bookmarked)}>
              <Ionicons
                name={bookmarked ? 'bookmark' : 'bookmark'}
                size={s(24)}
                color="#fff"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.appBarBtn}>
              <Ionicons name="ellipsis-vertical" size={s(24)} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {/* ── Fixed bottom bar ────────────────────────── */}
      <View style={styles.bottomBar}>
        <View style={styles.commentRow}>
          <TouchableOpacity style={styles.heartBtn}>
            <Ionicons name="heart" size={s(24)} color="#DD3333" />
          </TouchableOpacity>
          <View style={styles.commentInput}>
            <Text style={styles.commentPlaceholder}>Write comment</Text>
          </View>
        </View>
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { flexGrow: 1 },

  /* ── Hero ── */
  heroWrap: {
    width: SW,
    height: s(359),
    backgroundColor: '#F3F4F6',
    position: 'relative',
    overflow: 'hidden',
  },
  heroImg: {
    width: SW,
    height: s(359) + s(30),
    marginTop: -s(12),
  },
  darkOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: s(120),
    backgroundColor: 'rgba(17,24,39,0.65)',
  },
  whiteBottomFade: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: s(80),
    backgroundColor: 'rgba(249,250,251,0.75)',
  },

  /* ── Content card ── */
  contentCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: s(24),
    paddingTop: s(24),
  },

  /* Source row */
  sourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(16),
  },
  sourceLeft: { flexDirection: 'row', alignItems: 'center', gap: s(12) },
  cnnAvatar: {
    width: s(48),
    height: s(48),
    borderRadius: s(24),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cnnAvatarText: { color: '#CC0000', fontSize: s(13), fontWeight: '900', letterSpacing: -0.5 },
  sourceName: { color: '#111827', fontSize: s(20), fontWeight: '700', lineHeight: s(28) },
  sourceAuthor: { color: '#9CA3AF', fontSize: s(14), fontWeight: '400', lineHeight: s(22.4) },
  followBtn: {
    backgroundColor: '#2563EB',
    borderRadius: s(1000),
    paddingHorizontal: s(12),
    paddingVertical: s(8),
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: s(64),
    height: s(32),
  },
  followBtnText: { color: '#fff', fontSize: s(10), fontWeight: '500', letterSpacing: 0.5 },

  /* Title + stats */
  titleSection: { gap: s(8), marginBottom: s(16) },
  title: {
    width: s(327),
    color: '#111827',
    fontSize: s(20),
    fontWeight: '700',
    lineHeight: s(28),
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    flexWrap: 'wrap',
  },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: s(4) },
  statText: { color: '#9CA3AF', fontSize: s(14), fontWeight: '400', lineHeight: s(22.4) },
  statDot: {
    width: s(4),
    height: s(4),
    borderRadius: s(2),
    backgroundColor: '#E5E7EB',
  },

  /* Body */
  body: { gap: s(12) },
  bodyText: {
    color: '#6B7280',
    fontSize: s(14),
    fontWeight: '500',
    lineHeight: s(22.4),
  },
  bodyBold: {
    color: '#111827',
    fontWeight: '700',
  },

  /* ── App bar (absolute, overlaid on image) ── */
  appBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 10,
  },
  appBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingTop: Platform.OS === 'android' ? s(36) : 0,
    height: s(56) + (Platform.OS === 'android' ? s(36) : 0),
  },
  appBarBtn: {
    width: s(40),
    height: s(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  appBarRight: { flexDirection: 'row', alignItems: 'center' },

  /* ── Bottom bar ── */
  bottomBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(24),
    paddingTop: s(12),
    paddingBottom: s(12),
    gap: s(12),
  },
  heartBtn: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  commentInput: {
    flex: 1,
    height: s(40),
    backgroundColor: '#F9FAFB',
    borderRadius: s(100),
    paddingHorizontal: s(12),
    justifyContent: 'center',
  },
  commentPlaceholder: {
    color: '#9CA3AF',
    fontSize: s(12),
    fontWeight: '400',
    lineHeight: s(19.2),
  },
  homeIndicator: {
    width: s(134),
    height: s(5),
    borderRadius: 100,
    backgroundColor: '#111827',
    alignSelf: 'center',
    marginBottom: s(8),
    marginTop: s(4),
  },
});
