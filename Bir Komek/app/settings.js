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
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useLanguage } from './language_store';
import { useTheme } from './theme_store';

const { width: SW } = Dimensions.get('window');
const s = (n) => Math.round(n * (SW / 393));

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { colors, activeMode } = useTheme();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleCopyCode = () => {
    Alert.alert('Uğurlu', 'Birkömək kodunuz kopyalandı.');
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={activeMode === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.headerBackground} 
      />

      {/* ── Header ────────────────────────────────── */}
      <View style={[styles.header, { backgroundColor: colors.headerBackground, borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={s(24)} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('settings')}</Text>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-horizontal" size={s(24)} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: activeMode === 'dark' ? colors.background : '#F4F4F5' }]} showsVerticalScrollIndicator={false}>
        
        {/* ── Profile Card ──────────────────────────── */}
        <View style={[styles.profileCard, { backgroundColor: colors.cardBackground }]}>
          <Image
            source={require('../assets/avatar.jpg')}
            style={styles.avatar}
          />
          <Text style={[styles.profileName, { color: colors.text }]}>Rüfət Rəşidov</Text>
          
          <TouchableOpacity onPress={handleCopyCode} style={styles.codeBadge} activeOpacity={0.8}>
            <Text style={styles.codeText}>Birkömək Kod: 3597978</Text>
            <Feather name="copy" size={s(14)} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* ── General Settings Card ─────────────────── */}
        <View style={[styles.sectionCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>{t('general')}</Text>

          {/* Row 1: Tənzimləmələr -> routes to /general_settings */}
          <TouchableOpacity 
            style={styles.row} 
            activeOpacity={0.7}
            onPress={() => router.push('/general_settings')}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.lightBg }]}>
                <Ionicons name="settings-outline" size={s(20)} color={colors.text} />
              </View>
              <Text style={[styles.rowText, { color: colors.text }]}>{t('settings')}</Text>
            </View>
            <Feather name="chevron-right" size={s(20)} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Row 2: Dəstək -> routes to /support */}
          <TouchableOpacity 
            style={styles.row} 
            activeOpacity={0.7}
            onPress={() => router.push('/support')}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.lightBg }]}>
                <Feather name="message-square" size={s(20)} color={colors.text} />
              </View>
              <Text style={[styles.rowText, { color: colors.text }]}>{t('support')}</Text>
            </View>
            <Feather name="chevron-right" size={s(20)} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Row 3: Məxfilik siyasəti -> routes to /privacy */}
          <TouchableOpacity 
            style={styles.row} 
            activeOpacity={0.7}
            onPress={() => router.push('/privacy')}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.lightBg }]}>
                <Feather name="file-text" size={s(20)} color={colors.text} />
              </View>
              <Text style={[styles.rowText, { color: colors.text }]}>{t('privacy')}</Text>
            </View>
            <Feather name="chevron-right" size={s(20)} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Row 4: Tez-tez verilən suallar -> routes to /faq */}
          <TouchableOpacity 
            style={styles.row} 
            activeOpacity={0.7}
            onPress={() => router.push('/faq')}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.lightBg }]}>
                <Ionicons name="help-circle-outline" size={s(21)} color={colors.text} />
              </View>
              <Text style={[styles.rowText, { color: colors.text }]}>{t('faq')}</Text>
            </View>
            <Feather name="chevron-right" size={s(20)} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* ── Logout Section Card ──────────────────── */}
        <View style={[styles.sectionCard, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity 
            style={styles.row} 
            activeOpacity={0.7}
            onPress={() => setShowLogoutModal(true)}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconContainer, { backgroundColor: colors.lightBg }]}>
                <Feather name="log-out" size={s(20)} color="#E11D48" />
              </View>
              <Text style={[styles.rowText, { color: '#E11D48' }]}>{t('logout')}</Text>
            </View>
            <Feather name="chevron-right" size={s(20)} color="#E11D48" />
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* ── Logout Confirmation Warning Modal ────── */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('logoutConfirm')}</Text>
            <Text style={[styles.modalText, { color: colors.subText }]}>{t('logoutConfirmDesc')}</Text>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnLeft, { backgroundColor: activeMode === 'dark' ? '#374151' : '#E5E7EB' }]}
                activeOpacity={0.8}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={[styles.modalBtnText, { color: colors.text }]}>{t('cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnRight, { backgroundColor: activeMode === 'dark' ? '#4B5563' : '#D1D5DB' }]}
                activeOpacity={0.8}
                onPress={handleLogoutConfirm}
              >
                <Text style={[styles.modalBtnText, { color: colors.text }]}>{t('confirm')}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingTop: s(16),
    paddingBottom: s(12),
    borderBottomWidth: 1,
  },
  backBtn: {
    marginRight: s(16),
    padding: s(4),
  },
  headerTitle: {
    fontSize: s(22),
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
    flex: 1,
  },
  moreBtn: {
    padding: s(4),
  },
  container: {
    paddingHorizontal: s(16),
    paddingTop: s(20),
    paddingBottom: s(40),
    gap: s(16),
    flexGrow: 1,
  },
  profileCard: {
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowText: {
    fontSize: s(15),
    fontWeight: '600',
    fontFamily: 'Plus Jakarta Sans',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 21, 28, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(24),
  },
  modalContainer: {
    borderRadius: s(30),
    padding: s(24),
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: s(20),
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
    marginBottom: s(8),
  },
  modalText: {
    fontSize: s(15),
    lineHeight: s(22),
    fontFamily: 'Plus Jakarta Sans',
    marginBottom: s(24),
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: s(12),
  },
  modalBtn: {
    flex: 1,
    height: s(48),
    borderRadius: s(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: s(16),
    fontWeight: '600',
    fontFamily: 'Plus Jakarta Sans',
  },
});
