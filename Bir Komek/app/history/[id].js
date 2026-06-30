import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { DETAILED_EVENTS_STORE } from '../history_store';

const { width: SW } = Dimensions.get('window');
const s = (n) => Math.round(n * (SW / 393));

const DETAILED_EVENTS = {
  '1': {
    id: '1',
    type: '103',
    title: '103 Təcili Tibbi Yardım',
    status: 'Briqada Yoldadır',
    statusColor: '#E11D48',
    bgColor: '#FFF1F1',
    borderColor: '#FCA5A5',
    date: '30 İyun 2026',
    time: '11:15',
    address: 'Bakı, Nizami küçəsi 45',
    coords: '40.3783° N, 49.8524° E',
    timeline: [
      { title: 'Çağırış qəbul edildi', desc: 'Sistem çağırışı təsdiqlədi', time: '11:15', active: true },
      { title: 'Operator təsdiqi', desc: 'ITS tərəfindən operator təyin olundu', time: '11:16', active: true },
      { title: 'Briqada yola düşdü', desc: '103 Təcili Yardım ambulansı çıxdı', time: '11:18', active: true },
      { title: 'Ünvana çatma', desc: 'Briqadanın yaxınlaşma müddəti: 4 dəq.', time: 'Gözlənilir', active: false },
    ],
    audioFile: { duration: '0:15', label: 'Hadisə anı səs yazısı' },
    photoFile: { label: 'Hadisə anı fotoşəkili' },
  },
  '2': {
    id: '2',
    type: '102',
    title: '102 Polis / Asayiş',
    status: 'Yardım Göstərildi',
    statusColor: '#102E73',
    bgColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    date: '15 İyun 2026',
    time: '23:40',
    address: 'Bakı, Fəvvarələr Meydanı',
    coords: '40.3701° N, 49.8372° E',
    timeline: [
      { title: 'Çağırış qəbul edildi', desc: 'Təhlükəsizlik mərkəzi qeydə aldı', time: '23:40', active: true },
      { title: 'Polis patrul yönləndirildi', desc: 'Ərazi üzrə ən yaxın ekipaj yola çıxdı', time: '23:42', active: true },
      { title: 'Hadisə yerinə çatma', desc: 'Ekipaj ünvana yaxınlaşdı', time: '23:46', active: true },
      { title: 'Problem həll olundu', desc: 'İnsident aradan qaldırıldı, kömək edildi', time: '23:55', active: true },
    ],
    videoFile: { duration: '0:10', label: 'Hadisə anı video qeydi' },
  },
  '3': {
    id: '3',
    type: '112',
    title: '112 FHN / Yanğın',
    status: 'Briqada Yoldadır',
    statusColor: '#B45309',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    date: '10 İyun 2026',
    time: '15:45',
    address: 'Bakı, Atatürk prospekti 12',
    coords: '40.4093° N, 49.8681° E',
    timeline: [
      { title: 'Çağırış qəbul edildi', desc: 'FHN böhran idarəetmə mərkəzi', time: '15:45', active: true },
      { title: 'Briqada yola düşdü', desc: 'Yanğınsöndürmə briqadası çıxış etdi', time: '15:47', active: true },
    ],
  },
  '4': {
    id: '4',
    type: 'SOS',
    title: 'Ailə SOS',
    status: 'Ləğv Edildi (Səhvən Basılma)',
    statusColor: '#4B5563',
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    date: '02 İyun 2026',
    time: '09:12',
    address: 'Bakı, Üzeyir Hacıbəyov küç., 34',
    coords: '40.3758° N, 49.8550° E',
    timeline: [
      { title: 'SOS siqnalı aktivləşdirildi', desc: 'Yaxın kontaktlara mövqe göndərildi', time: '09:12', active: true },
      { title: 'Çağırış ləğv edildi', desc: 'İstifadəçi tərəfindən səhvən basıldı və ləğv edildi', time: '09:13', active: true },
    ],
  },
};

export default function HistoryDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const event = DETAILED_EVENTS_STORE[id] || DETAILED_EVENTS[id] || DETAILED_EVENTS['1'];

  const player = useVideoPlayer(require('../../assets/accident.mp4'), (player) => {
    player.loop = true;
  });

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Centered Header ───────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={s(24)} color="#111827" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Hadisə Təfərrüatı</Text>
        </View>
        
        <TouchableOpacity style={styles.moreBtn} activeOpacity={0.7}>
          <Ionicons name="ellipsis-horizontal" size={s(24)} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* ── Event Summary Card ────────────────────── */}
        <View style={[styles.card, { backgroundColor: event.bgColor, borderColor: event.borderColor }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: event.statusColor }]}>{event.title}</Text>
            <View style={[styles.tag, { backgroundColor: 'rgba(255,255,255,0.6)' }]}>
              <Text style={[styles.tagText, { color: event.statusColor }]}>{event.status}</Text>
            </View>
          </View>
          
          <View style={styles.cardBody}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={s(16)} color="#4B5563" />
              <Text style={styles.infoText}>{event.date} • {event.time}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={s(16)} color="#4B5563" />
              <Text style={styles.infoText}>{event.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="globe-outline" size={s(16)} color="#4B5563" />
              <Text style={styles.infoText}>{event.coords}</Text>
            </View>
          </View>
        </View>

        {/* ── Process Timeline ──────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Çağırış Prosesi</Text>
          <View style={styles.timelineContainer}>
            {event.timeline.map((step, idx) => {
              const isLast = idx === event.timeline.length - 1;
              return (
                <View key={idx} style={styles.timelineRow}>
                  <View style={styles.timelineLeft}>
                    <View style={[styles.timelineNode, step.active && styles.nodeActive]}>
                      {step.active && <Ionicons name="checkmark" size={s(12)} color="#FFFFFF" />}
                    </View>
                    {!isLast && <View style={[styles.timelineLine, step.active && styles.lineActive]} />}
                  </View>
                  <View style={styles.timelineRight}>
                    <View style={styles.timelineContent}>
                      <Text style={[styles.timelineStepTitle, step.active && styles.textActive]}>
                        {step.title}
                      </Text>
                      <Text style={styles.timelineStepDesc}>{step.desc}</Text>
                    </View>
                    <Text style={styles.timelineStepTime}>{step.time}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Archived Media ────────────────────────── */}
        {(event.audioFile || event.photoFile || event.videoFile) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Arxiv Məlumatları</Text>
            <View style={styles.mediaContainer}>
              
              {/* Audio Waveform Player */}
              {event.audioFile && (
                <View style={styles.mediaCard}>
                  <View style={styles.mediaCardHeader}>
                    <Ionicons name="mic-outline" size={s(20)} color="#E11D48" />
                    <Text style={styles.mediaCardLabel}>{event.audioFile.label}</Text>
                  </View>
                  <View style={styles.audioPlayer}>
                    <TouchableOpacity
                      onPress={() => setIsPlaying(!isPlaying)}
                      style={styles.playBtn}
                    >
                      <Ionicons
                        name={isPlaying ? 'pause' : 'play'}
                        size={s(20)}
                        color="#FFFFFF"
                      />
                    </TouchableOpacity>
                    <View style={styles.waveformContainer}>
                      <MaterialCommunityIcons name="waveform" size={s(32)} color="#E11D48" />
                      <Text style={styles.durationText}>{event.audioFile.duration}</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Photo Attachment */}
              {event.photoFile && (
                <View style={styles.mediaCard}>
                  <View style={styles.mediaCardHeader}>
                    <Ionicons name="image-outline" size={s(20)} color="#2563EB" />
                    <Text style={styles.mediaCardLabel}>{event.photoFile.label}</Text>
                  </View>
                  <View style={styles.imagePlaceholder}>
                    <Image
                      source={event.photoFile.uri ? { uri: event.photoFile.uri } : require('../../assets/emergency_photo.jpg')}
                      style={styles.thumbnail}
                    />
                    <TouchableOpacity style={styles.expandBtn}>
                      <Ionicons name="expand" size={s(18)} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Video Attachment */}
              {event.videoFile && (
                <View style={styles.mediaCard}>
                  <View style={styles.mediaCardHeader}>
                    <Ionicons name="videocam-outline" size={s(20)} color="#059669" />
                    <Text style={styles.mediaCardLabel}>{event.videoFile.label}</Text>
                  </View>
                  <View style={styles.videoPlayer}>
                    <VideoView
                      style={styles.videoThumbnail}
                      player={player}
                      allowsFullscreen
                      allowsPictureInPicture
                      contentFit="cover"
                    />
                  </View>
                </View>
              )}

            </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
  container: {
    paddingHorizontal: s(20),
    paddingTop: s(20),
    paddingBottom: s(40),
  },
  card: {
    borderRadius: s(16),
    padding: s(16),
    borderWidth: 1,
    marginBottom: s(24),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: s(8),
  },
  cardTitle: {
    fontSize: s(16),
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
    flex: 1,
  },
  tag: {
    paddingHorizontal: s(10),
    paddingVertical: s(4),
    borderRadius: s(8),
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
  section: {
    marginBottom: s(24),
  },
  sectionTitle: {
    fontSize: s(16),
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Plus Jakarta Sans',
    marginBottom: s(14),
  },
  timelineContainer: {
    paddingLeft: s(8),
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: s(64),
  },
  timelineLeft: {
    alignItems: 'center',
    width: s(24),
    marginRight: s(12),
  },
  timelineNode: {
    width: s(20),
    height: s(20),
    borderRadius: s(10),
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  nodeActive: {
    backgroundColor: '#059669',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    position: 'absolute',
    top: s(20),
    bottom: 0,
    zIndex: 1,
  },
  lineActive: {
    backgroundColor: '#059669',
  },
  timelineRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: s(16),
  },
  timelineContent: {
    flex: 1,
    paddingRight: s(8),
  },
  timelineStepTitle: {
    fontSize: s(14),
    fontWeight: '700',
    color: '#9CA3AF',
    fontFamily: 'Plus Jakarta Sans',
  },
  textActive: {
    color: '#111827',
  },
  timelineStepDesc: {
    fontSize: s(12),
    color: '#6B7280',
    marginTop: s(2),
    fontFamily: 'Plus Jakarta Sans',
  },
  timelineStepTime: {
    fontSize: s(12),
    color: '#6B7280',
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '600',
  },
  mediaContainer: {
    gap: s(16),
  },
  mediaCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: s(16),
    padding: s(16),
  },
  mediaCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    marginBottom: s(12),
  },
  mediaCardLabel: {
    fontSize: s(13),
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Plus Jakarta Sans',
  },
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
  },
  playBtn: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: '#E11D48',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveformContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF1F1',
    borderRadius: s(10),
    paddingHorizontal: s(12),
    height: s(40),
  },
  durationText: {
    fontSize: s(12),
    fontWeight: '600',
    color: '#E11D48',
    fontFamily: 'Plus Jakarta Sans',
  },
  imagePlaceholder: {
    height: s(150),
    borderRadius: s(12),
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  expandBtn: {
    position: 'absolute',
    right: s(10),
    bottom: s(10),
    width: s(36),
    height: s(36),
    borderRadius: s(18),
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayer: {
    height: s(150),
    borderRadius: s(12),
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  videoPlayBtn: {
    width: s(48),
    height: s(48),
    borderRadius: s(24),
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
});
