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
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';

const { width: SW } = Dimensions.get('window');
const s = (n) => Math.round(n * (SW / 393));

export default function NotificationsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('unread'); // unread | read

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Header ────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={s(24)} color="#111827" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Bildirişlər</Text>
        </View>

        <TouchableOpacity onPress={() => router.push('/notification_settings')} style={styles.gearBtn}>
          <Ionicons name="settings-outline" size={s(22)} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* ── Scrollable Tabs Bar ───────────────────── */}
      <View style={styles.tabsBar}>
        <TouchableOpacity
          onPress={() => setActiveTab('unread')}
          style={[styles.tabBtn, activeTab === 'unread' && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeTab === 'unread' && styles.tabTextActive]}>
            Oxunmamış
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setActiveTab('read')}
          style={[styles.tabBtn, activeTab === 'read' && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeTab === 'read' && styles.tabTextActive]}>
            Oxunmuşlar
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* ── TODAY SECTION ────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Bugün</Text>

          {/* Card 1: 103 Təcili Tibbi Yardım (Active with Emotional Design) */}
          <View style={styles.card}>
            <View style={[styles.iconBg, { backgroundColor: '#FFE4E6' }]}>
              <Feather name="activity" size={s(20)} color="#E11D48" />
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>103 Təcili Tibbi Yardım</Text>
                <View style={styles.dotRow}>
                  <Text style={styles.timeAgo}>İndi</Text>
                  <View style={styles.blueDot} />
                </View>
              </View>
              <Text style={styles.supportingText}>
                İlkin tibbi müdaxilə etmək üçün işçilər yoldadır (4 dəq.). Zəhmət olmasa sakit qalın və təmkinli olun, həkimlərimiz hər şeyin yaxşı olması üçün çalışır. ❤️
              </Text>
              
              <View style={styles.btnRow}>
                <TouchableOpacity onPress={() => router.push('/history/1')} style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>Mövqeyi İzlə</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Card 2: Ailə SOS (Emotional Design) */}
          <View style={styles.card}>
            <View style={[styles.iconBg, { backgroundColor: '#F5F3FF' }]}>
              <Ionicons name="people-outline" size={s(20)} color="#6D28D9" />
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>Ailə SOS Bildirişi</Text>
                <View style={styles.dotRow}>
                  <Text style={styles.timeAgo}>1s əvvəl</Text>
                  <View style={styles.blueDot} />
                </View>
              </View>
              <Text style={styles.supportingText}>
                Oğlunuz Elşən bildirişi təsdiqlədi və yoldadır. Narahat olmayın, o tezliklə yanınızda olacaq. 🫂
              </Text>
              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>Elşənə zəng et</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* ── YESTERDAY SECTION ────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Dünən</Text>

          {/* Card 3: 102 Polis */}
          <View style={styles.card}>
            <View style={[styles.iconBg, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="shield-outline" size={s(20)} color="#102E73" />
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>102 Polis / Asayiş</Text>
                <View style={styles.dotRow}>
                  <Text style={styles.timeAgo}>Dünən</Text>
                </View>
              </View>
              <Text style={styles.supportingText}>
                Ekipaj yönləndirildi və yaxınlaşır. Hər şey nəzarət altındadır, narahatlığa əsas yoxdur.
              </Text>
            </View>
          </View>

          {/* Card 4: myGov Integration */}
          <View style={styles.card}>
            <View style={[styles.iconBg, { backgroundColor: '#F3F4F6' }]}>
              <Ionicons name="sync-outline" size={s(20)} color="#4B5563" />
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>myGov İnteqrasiyası</Text>
                <View style={styles.dotRow}>
                  <Text style={styles.timeAgo}>Dünən</Text>
                </View>
              </View>
              <Text style={styles.supportingText}>
                Profil məlumatlarınız və tibbi kartınız təhlükəsiz şəkildə sinxronizasiya olundu.
              </Text>
            </View>
          </View>
        </View>

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
  gearBtn: {
    padding: s(4),
    zIndex: 10,
  },
  tabsBar: {
    flexDirection: 'row',
    paddingHorizontal: s(20),
    paddingBottom: s(12),
    gap: s(8),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tabBtn: {
    paddingHorizontal: s(16),
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
    paddingTop: s(10),
    paddingBottom: s(40),
  },
  section: {
    marginTop: s(16),
  },
  sectionHeader: {
    fontSize: s(14),
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Plus Jakarta Sans',
    marginBottom: s(10),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(20),
    padding: s(16),
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(12),
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: s(12),
    // Shadow matching image
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  iconBg: {
    width: s(40),
    height: s(40),
    borderRadius: s(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(4),
  },
  cardTitle: {
    fontSize: s(14),
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Plus Jakarta Sans',
    flex: 1,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  timeAgo: {
    fontSize: s(12),
    color: '#9CA3AF',
    fontFamily: 'Plus Jakarta Sans',
  },
  blueDot: {
    width: s(6),
    height: s(6),
    borderRadius: s(3),
    backgroundColor: '#2563EB',
  },
  supportingText: {
    fontSize: s(13),
    color: '#4B5563',
    lineHeight: s(18),
    fontFamily: 'Plus Jakarta Sans',
  },
  btnRow: {
    flexDirection: 'row',
    gap: s(16),
    marginTop: s(10),
  },
  actionBtn: {
    paddingVertical: s(4),
  },
  actionBtnText: {
    fontSize: s(13),
    fontWeight: '700',
    color: '#2563EB',
    fontFamily: 'Plus Jakarta Sans',
  },
});
