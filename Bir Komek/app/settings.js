import React from 'react';
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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const { width: SW } = Dimensions.get('window');
const s = (n) => Math.round(n * (SW / 393));

export default function SettingsScreen() {
  const router = useRouter();

  const handleCopyCode = () => {
    Alert.alert('Uğurlu', 'Birkömək kodunuz kopyalandı.');
  };

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
        
        {/* ── Profile Card ──────────────────────────── */}
        <View style={styles.profileCard}>
          <Image
            source={require('../assets/avatar.jpg')}
            style={styles.avatar}
          />
          <Text style={styles.profileName}>Rüfət Rəşidov</Text>
          
          <TouchableOpacity onPress={handleCopyCode} style={styles.codeBadge} activeOpacity={0.8}>
            <Text style={styles.codeText}>Birkömək Kod: 3597978</Text>
            <Feather name="copy" size={s(14)} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* ── General Settings Card ─────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>General</Text>

          {/* Row 1: Tənzimləmələr */}
          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="settings-outline" size={s(20)} color="#111827" />
              </View>
              <Text style={styles.rowText}>Tənzimləmələr</Text>
            </View>
            <Feather name="chevron-right" size={s(20)} color="#111827" />
          </TouchableOpacity>

          {/* Row 2: Dəstək */}
          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <View style={styles.iconContainer}>
                <Feather name="message-square" size={s(20)} color="#111827" />
              </View>
              <Text style={styles.rowText}>Dəstək</Text>
            </View>
            <Feather name="chevron-right" size={s(20)} color="#111827" />
          </TouchableOpacity>

          {/* Row 3: Məxfilik siyasəti */}
          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <View style={styles.iconContainer}>
                <Feather name="file-text" size={s(20)} color="#111827" />
              </View>
              <Text style={styles.rowText}>Məxfilik siyasəti</Text>
            </View>
            <Feather name="chevron-right" size={s(20)} color="#111827" />
          </TouchableOpacity>

          {/* Row 4: Tez-tez verilən suallar (Fixed FAQ Icon) */}
          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="help-circle-outline" size={s(21)} color="#111827" />
              </View>
              <Text style={styles.rowText}>Tez-tez verilən suallar</Text>
            </View>
            <Feather name="chevron-right" size={s(20)} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* ── Logout Section Card ──────────────────── */}
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <View style={styles.iconContainer}>
                <Feather name="log-out" size={s(20)} color="#E11D48" />
              </View>
              <Text style={[styles.rowText, { color: '#E11D48' }]}>Çıxış</Text>
            </View>
            <Feather name="chevron-right" size={s(20)} color="#E11D48" />
          </TouchableOpacity>
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
    paddingTop: s(20),
    paddingBottom: s(40),
    gap: s(16),
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(20),
    paddingVertical: s(24),
    paddingHorizontal: s(16),
    alignItems: 'center',
    gap: s(10),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: s(64),
    height: s(64),
    borderRadius: s(32),
  },
  profileName: {
    fontSize: s(18),
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Plus Jakarta Sans',
  },
  codeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: s(14),
    paddingVertical: s(8),
    borderRadius: s(10),
    gap: s(6),
  },
  codeText: {
    color: '#FFFFFF',
    fontSize: s(13),
    fontWeight: '600',
    fontFamily: 'Plus Jakarta Sans',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(20),
    padding: s(16),
    gap: s(16),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeading: {
    fontSize: s(20),
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Plus Jakarta Sans',
    marginBottom: s(4),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
  },
  iconContainer: {
    width: s(40),
    height: s(40),
    borderRadius: s(12),
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowText: {
    fontSize: s(15),
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Plus Jakarta Sans',
  },
});
