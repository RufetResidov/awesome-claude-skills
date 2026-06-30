import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Switch,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SW } = Dimensions.get('window');
const s = (n) => Math.round(n * (SW / 393));

export default function NotificationSettingsScreen() {
  const router = useRouter();

  // Bir Kömək product-specific toggle states
  const [medAlert, setMedAlert] = useState(true);
  const [policeAlert, setPoliceAlert] = useState(true);
  const [fhnAlert, setFhnAlert] = useState(true);
  const [familySos, setFamilySos] = useState(true);
  const [medication, setMedication] = useState(true);
  const [myGovSync, setMyGovSync] = useState(false);
  const [aiRecs, setAiRecs] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F4F5" />

      {/* ── Centered Header ───────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={s(24)} color="#111827" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Tənzimləmələr</Text>
        </View>
        
        <View style={styles.emptyRight} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* ── SOS & Xidmət Bildirişləri ──────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Çağırış Bildirişləri</Text>
          <View style={styles.listContainer}>
            
            {/* Row 1: Təcili Tibbi Yardım */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBg, { backgroundColor: '#FFF1F1' }]}>
                  <Feather name="activity" size={s(20)} color="#E11D48" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.rowTitle}>Təcili Tibbi Yardım (103)</Text>
                  <Text style={styles.rowSub}>Ambulans statusu və çatma vaxtı</Text>
                </View>
              </View>
              <Switch
                value={medAlert}
                onValueChange={setMedAlert}
                trackColor={{ false: '#E4E4E7', true: '#2563EB' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Row 2: Polis & Asayiş */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBg, { backgroundColor: '#EEF2FF' }]}>
                  <Ionicons name="shield-outline" size={s(20)} color="#102E73" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.rowTitle}>Polis və Asayiş (102)</Text>
                  <Text style={styles.rowSub}>Ekipaj statusu və təhlükəsizlik siqnalları</Text>
                </View>
              </View>
              <Switch
                value={policeAlert}
                onValueChange={setPoliceAlert}
                trackColor={{ false: '#E4E4E7', true: '#2563EB' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Row 3: FHN */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBg, { backgroundColor: '#FFFBEB' }]}>
                  <Ionicons name="flame-outline" size={s(20)} color="#B45309" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.rowTitle}>FHN / Yanğın (112)</Text>
                  <Text style={styles.rowSub}>Xilasetmə briqadasının status yenilənmələri</Text>
                </View>
              </View>
              <Switch
                value={fhnAlert}
                onValueChange={setFhnAlert}
                trackColor={{ false: '#E4E4E7', true: '#2563EB' }}
                thumbColor="#FFFFFF"
              />
            </View>

          </View>
        </View>

        {/* ── Ailə & Qayğı ─────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Ailə və Qayğı</Text>
          <View style={styles.listContainer}>
            
            {/* Row 1: Yaxınlarımın SOS siqnalları */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBg, { backgroundColor: '#F5F3FF' }]}>
                  <Ionicons name="people-outline" size={s(20)} color="#6D28D9" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.rowTitle}>Yaxınlarımın SOS Siqnalları</Text>
                  <Text style={styles.rowSub}>Ailə üzvlərinin təcili çağırış siqnalları</Text>
                </View>
              </View>
              <Switch
                value={familySos}
                onValueChange={setFamilySos}
                trackColor={{ false: '#E4E4E7', true: '#2563EB' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Row 2: Dərman Xatırlatıcısı */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBg, { backgroundColor: '#EEF2FF' }]}>
                  <MaterialCommunityIcons name="pill" size={s(20)} color="#2563EB" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.rowTitle}>Dərman Qəbulu Xatırlatıcısı</Text>
                  <Text style={styles.rowSub}>Gündəlik tibbi preparat vaxtı bildirişləri</Text>
                </View>
              </View>
              <Switch
                value={medication}
                onValueChange={setMedication}
                trackColor={{ false: '#E4E4E7', true: '#2563EB' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Row 3: myGov Tibbi Kart */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBg, { backgroundColor: '#F3F4F6' }]}>
                  <Ionicons name="sync-outline" size={s(20)} color="#4B5563" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.rowTitle}>myGov Tibbi Kart</Text>
                  <Text style={styles.rowSub}>Sağlamlıq kartı sinxronizasiya hesabatları</Text>
                </View>
              </View>
              <Switch
                value={myGovSync}
                onValueChange={setMyGovSync}
                trackColor={{ false: '#E4E4E7', true: '#2563EB' }}
                thumbColor="#FFFFFF"
              />
            </View>

          </View>
        </View>

        {/* ── İnsaytlar ────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>İnsaytlar</Text>
          <View style={styles.listContainer}>
            
            {/* Row 1: AI Recommendations */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBg, { backgroundColor: '#EEF2FF' }]}>
                  <Feather name="cpu" size={s(20)} color="#2563EB" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.rowTitle}>AI Təhlükəsizlik Tövsiyələri</Text>
                  <Text style={styles.rowSub}>Ərazi və hava şəraitinə görə ağıllı məsləhətlər</Text>
                </View>
              </View>
              <Switch
                value={aiRecs}
                onValueChange={setAiRecs}
                trackColor={{ false: '#E4E4E7', true: '#2563EB' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Row 2: Weekly Insight */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBg, { backgroundColor: '#EEF2FF' }]}>
                  <Feather name="calendar" size={s(20)} color="#2563EB" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.rowTitle}>Həftəlik Hadisə Xülasəsi</Text>
                  <Text style={styles.rowSub}>Həftəlik çağırış və təhlükəsizlik hesabatları</Text>
                </View>
              </View>
              <Switch
                value={weeklyDigest}
                onValueChange={setWeeklyDigest}
                trackColor={{ false: '#E4E4E7', true: '#2563EB' }}
                thumbColor="#FFFFFF"
              />
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
    backgroundColor: '#F4F4F5',
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
    backgroundColor: '#F4F4F5',
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
  emptyRight: {
    width: s(32),
  },
  container: {
    paddingHorizontal: s(16),
    paddingTop: s(10),
    paddingBottom: s(40),
    gap: s(20),
  },
  section: {
    gap: s(10),
  },
  sectionHeader: {
    fontSize: s(14),
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Plus Jakarta Sans',
    paddingHorizontal: s(4),
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(20),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F5',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    flex: 1,
  },
  iconBg: {
    width: s(40),
    height: s(40),
    borderRadius: s(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: s(2),
  },
  rowTitle: {
    fontSize: s(14),
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Plus Jakarta Sans',
  },
  rowSub: {
    fontSize: s(12),
    color: '#6B7280',
    fontFamily: 'Plus Jakarta Sans',
  },
});
