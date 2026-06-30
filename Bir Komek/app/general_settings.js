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
  Switch,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useLanguage, setLanguage } from './language_store';
import { useTheme } from './theme_store';

const { width: SW } = Dimensions.get('window');
const s = (n) => Math.round(n * (SW / 393));

export default function GeneralSettingsScreen() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const { theme: themeMode, colors, activeMode, setTheme } = useTheme();

  // Settings states
  const [screenshotAllowed, setScreenshotAllowed] = useState(false);
  const [biometricAllowed, setBiometricAllowed] = useState(true);

  // Modals visibility states
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  // PIN Change Wizard states
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinStep, setPinStep] = useState(1); // 1: Current, 2: New, 3: Confirm
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [savedPin, setSavedPin] = useState('1234'); // Default PIN is 1234

  const getLanguageLabel = (l) => {
    switch (l) {
      case 'az': return 'Azərbaycan';
      case 'en': return 'English';
      case 'ru': return 'Русский';
      default: return 'Azərbaycan';
    }
  };

  const getThemeLabel = (mode) => {
    switch (mode) {
      case 'day': return t('themeDay');
      case 'night': return t('themeNight');
      case 'system': return t('themeSystem');
      default: return t('themeDay');
    }
  };

  const handleOpenPinModal = () => {
    setPinStep(1);
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    setPinError('');
    setShowPinModal(true);
  };

  const handlePinSubmit = () => {
    setPinError('');
    
    if (pinStep === 1) {
      if (currentPinInput === savedPin) {
        setPinStep(2);
      } else {
        setPinError('Mövcud PİN kod yanlışdır. Yenidən cəhd edin.');
      }
    } else if (pinStep === 2) {
      if (newPinInput.length === 4 && /^\d+$/.test(newPinInput)) {
        setPinStep(3);
      } else {
        setPinError('PİN kod 4 rəqəmli olmalıdır.');
      }
    } else if (pinStep === 3) {
      if (confirmPinInput === newPinInput) {
        setSavedPin(newPinInput);
        setShowPinModal(false);
        Alert.alert('Uğurlu', 'PİN kodunuz uğurla yeniləndi.');
      } else {
        setPinError('Daxil edilən PİN-lər eyni deyil.');
      }
    }
  };

  const handleActiveSessions = () => {
    Alert.alert(
      t('activeSessions'),
      '• iPhone 15 Pro Max (Baku, Active Now)\n• iPad Air (Baku, 2 days ago)\n• Safari Browser (Baku, Active Now)',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={activeMode === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.headerBackground} 
      />

      {/* Header */}
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
        
        {/* ── Ümumi (General) Section ───────────────── */}
        <Text style={[styles.sectionTitle, { color: colors.subText }]}>{t('general')}</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.cardBackground }]}>
          
          {/* Row 1: Tətbiq Rəngi */}
          <TouchableOpacity 
            style={[styles.row, { borderColor: colors.border }]} 
            activeOpacity={0.7}
            onPress={() => setShowThemeModal(true)}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconBg, { backgroundColor: colors.lightBg }]}>
                <Feather name="sun" size={s(20)} color={colors.text} />
              </View>
              <Text style={[styles.rowText, { color: colors.text }]}>{t('theme')}</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={[styles.statusText, { color: colors.subText }]}>{getThemeLabel(themeMode)}</Text>
              <Feather name="chevron-right" size={s(20)} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          {/* Row 2: Tətbiqin Dili */}
          <TouchableOpacity 
            style={[styles.row, { borderBottomWidth: 0, borderColor: colors.border }]} 
            activeOpacity={0.7}
            onPress={() => setShowLanguageModal(true)}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconBg, { backgroundColor: colors.lightBg }]}>
                <Ionicons name="globe-outline" size={s(20)} color={colors.text} />
              </View>
              <Text style={[styles.rowText, { color: colors.text }]}>{t('language')}</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={[styles.statusText, { color: colors.subText }]}>{getLanguageLabel(lang)}</Text>
              <Feather name="chevron-right" size={s(20)} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

        </View>

        {/* ── Təhlükəsizlik (Security) Section ───────── */}
        <Text style={[styles.sectionTitle, { color: colors.subText }]}>Təhlükəsizlik</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.cardBackground }]}>
          
          {/* Row 1: Ekran görüntüsü icazəsi (Switch) */}
          <View style={[styles.row, { borderColor: colors.border }]}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBg, { backgroundColor: colors.lightBg }]}>
                <Feather name="aperture" size={s(20)} color={colors.text} />
              </View>
              <Text style={[styles.rowText, { color: colors.text }]}>{t('screenshotPermission')}</Text>
            </View>
            <Switch
              value={screenshotAllowed}
              onValueChange={setScreenshotAllowed}
              trackColor={{ false: '#E5E7EB', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Row 2: Biometrik giriş (Switch) */}
          <View style={[styles.row, { borderColor: colors.border }]}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBg, { backgroundColor: colors.lightBg }]}>
                <Ionicons name="scan-outline" size={s(20)} color={colors.text} />
              </View>
              <Text style={[styles.rowText, { color: colors.text }]}>{t('biometricLogin')}</Text>
            </View>
            <Switch
              value={biometricAllowed}
              onValueChange={setBiometricAllowed}
              trackColor={{ false: '#E5E7EB', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Row 3: PİN-i dəyiş */}
          <TouchableOpacity 
            style={[styles.row, { borderColor: colors.border }]} 
            activeOpacity={0.7}
            onPress={handleOpenPinModal}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconBg, { backgroundColor: colors.lightBg }]}>
                <Feather name="lock" size={s(20)} color={colors.text} />
              </View>
              <Text style={[styles.rowText, { color: colors.text }]}>{t('changePin')}</Text>
            </View>
            <Feather name="chevron-right" size={s(20)} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Row 4: Aktiv sessiyalar */}
          <TouchableOpacity 
            style={[styles.row, { borderBottomWidth: 0, borderColor: colors.border }]} 
            activeOpacity={0.7}
            onPress={handleActiveSessions}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconBg, { backgroundColor: colors.lightBg }]}>
                <Feather name="smartphone" size={s(20)} color={colors.text} />
              </View>
              <Text style={[styles.rowText, { color: colors.text }]}>{t('activeSessions')}</Text>
            </View>
            <Feather name="chevron-right" size={s(20)} color="#9CA3AF" />
          </TouchableOpacity>

        </View>

      </ScrollView>

      {/* ── Theme Modal Selector ──────────────────── */}
      <Modal
        visible={showThemeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('theme')}</Text>

            <TouchableOpacity 
              style={[styles.pickerOption, themeMode === 'day' && styles.pickerOptionActive, { backgroundColor: activeMode === 'dark' ? '#374151' : '#F3F4F6' }]}
              onPress={() => { setTheme('day'); setShowThemeModal(false); }}
            >
              <Text style={[styles.pickerText, { color: colors.text }, themeMode === 'day' && styles.pickerTextActive]}>
                {t('themeDay')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.pickerOption, themeMode === 'night' && styles.pickerOptionActive, { backgroundColor: activeMode === 'dark' ? '#374151' : '#F3F4F6' }]}
              onPress={() => { setTheme('night'); setShowThemeModal(false); }}
            >
              <Text style={[styles.pickerText, { color: colors.text }, themeMode === 'night' && styles.pickerTextActive]}>
                {t('themeNight')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.pickerOption, themeMode === 'system' && styles.pickerOptionActive, { backgroundColor: activeMode === 'dark' ? '#374151' : '#F3F4F6' }]}
              onPress={() => { setTheme('system'); setShowThemeModal(false); }}
            >
              <Text style={[styles.pickerText, { color: colors.text }, themeMode === 'system' && styles.pickerTextActive]}>
                {t('themeSystem')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalCancelBtn}
              onPress={() => setShowThemeModal(false)}
            >
              <Text style={styles.modalCancelBtnText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Language Modal Selector ───────────────── */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('language')}</Text>

            <TouchableOpacity 
              style={[styles.pickerOption, lang === 'az' && styles.pickerOptionActive, { backgroundColor: activeMode === 'dark' ? '#374151' : '#F3F4F6' }]}
              onPress={() => { setLanguage('az'); setShowLanguageModal(false); }}
            >
              <Text style={[styles.pickerText, { color: colors.text }, lang === 'az' && styles.pickerTextActive]}>
                Azərbaycan (AZ)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.pickerOption, lang === 'en' && styles.pickerOptionActive, { backgroundColor: activeMode === 'dark' ? '#374151' : '#F3F4F6' }]}
              onPress={() => { setLanguage('en'); setShowLanguageModal(false); }}
            >
              <Text style={[styles.pickerText, { color: colors.text }, lang === 'en' && styles.pickerTextActive]}>
                English (EN)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.pickerOption, lang === 'ru' && styles.pickerOptionActive, { backgroundColor: activeMode === 'dark' ? '#374151' : '#F3F4F6' }]}
              onPress={() => { setLanguage('ru'); setShowLanguageModal(false); }}
            >
              <Text style={[styles.pickerText, { color: colors.text }, lang === 'ru' && styles.pickerTextActive]}>
                Русский (RU)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalCancelBtn}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.modalCancelBtnText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── PIN Change Wizard Modal ────────────────── */}
      <Modal
        visible={showPinModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('changePin')}</Text>

            {pinStep === 1 && (
              <View style={styles.pinStepContainer}>
                <Text style={[styles.pinStepSub, { color: colors.subText }]}>
                  Mövcud 4 rəqəmli PİN kodunuzu daxil edin:
                </Text>
                <TextInput
                  style={[styles.pinInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                  placeholder="••••"
                  placeholderTextColor={activeMode === 'dark' ? '#6B7280' : '#9CA3AF'}
                  secureTextEntry={true}
                  keyboardType="numeric"
                  maxLength={4}
                  value={currentPinInput}
                  onChangeText={(val) => {
                    setCurrentPinInput(val);
                    setPinError('');
                  }}
                  autoFocus={true}
                />
              </View>
            )}

            {pinStep === 2 && (
              <View style={styles.pinStepContainer}>
                <Text style={[styles.pinStepSub, { color: colors.subText }]}>
                  Yeni 4 rəqəmli PİN kodunuzu daxil edin:
                </Text>
                <TextInput
                  style={[styles.pinInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                  placeholder="••••"
                  placeholderTextColor={activeMode === 'dark' ? '#6B7280' : '#9CA3AF'}
                  secureTextEntry={true}
                  keyboardType="numeric"
                  maxLength={4}
                  value={newPinInput}
                  onChangeText={(val) => {
                    setNewPinInput(val);
                    setPinError('');
                  }}
                  autoFocus={true}
                />
              </View>
            )}

            {pinStep === 3 && (
              <View style={styles.pinStepContainer}>
                <Text style={[styles.pinStepSub, { color: colors.subText }]}>
                  Yeni PİN kodunuzu təsdiqləyin:
                </Text>
                <TextInput
                  style={[styles.pinInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
                  placeholder="••••"
                  placeholderTextColor={activeMode === 'dark' ? '#6B7280' : '#9CA3AF'}
                  secureTextEntry={true}
                  keyboardType="numeric"
                  maxLength={4}
                  value={confirmPinInput}
                  onChangeText={(val) => {
                    setConfirmPinInput(val);
                    setPinError('');
                  }}
                  autoFocus={true}
                />
              </View>
            )}

            {!!pinError && (
              <Text style={styles.pinErrorText}>{pinError}</Text>
            )}

            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnLeft, { backgroundColor: activeMode === 'dark' ? '#374151' : '#E5E7EB' }]}
                activeOpacity={0.8}
                onPress={() => setShowPinModal(false)}
              >
                <Text style={[styles.modalBtnText, { color: colors.text }]}>{t('cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnRight]}
                activeOpacity={0.8}
                onPress={handlePinSubmit}
              >
                <Text style={[styles.modalBtnText, { color: '#FFFFFF' }]}>Davam et</Text>
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
    paddingHorizontal: s(20),
    paddingTop: s(16),
    paddingBottom: s(40),
    flexGrow: 1,
    gap: s(12),
  },
  sectionTitle: {
    fontSize: s(14),
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
    marginTop: s(12),
    marginBottom: s(6),
    paddingHorizontal: s(4),
  },
  settingsCard: {
    borderRadius: s(24),
    paddingHorizontal: s(16),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: s(10),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: s(16),
    borderBottomWidth: 1,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
  },
  iconBg: {
    width: s(40),
    height: s(40),
    borderRadius: s(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowText: {
    fontSize: s(15),
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  statusText: {
    fontSize: s(14),
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
    gap: s(10),
  },
  modalTitle: {
    fontSize: s(18),
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
    marginBottom: s(12),
    textAlign: 'center',
  },
  pickerOption: {
    width: '100%',
    paddingVertical: s(14),
    paddingHorizontal: s(20),
    borderRadius: s(16),
    alignItems: 'center',
  },
  pickerOptionActive: {
    backgroundColor: '#2563EB',
  },
  pickerText: {
    fontSize: s(15),
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  pickerTextActive: {
    color: '#FFFFFF',
  },
  modalCancelBtn: {
    width: '100%',
    paddingVertical: s(14),
    alignItems: 'center',
    marginTop: s(8),
  },
  modalCancelBtnText: {
    fontSize: s(15),
    fontWeight: '800',
    color: '#EF4444',
    fontFamily: 'Plus Jakarta Sans',
  },
  // PIN Change Styles
  pinStepContainer: {
    width: '100%',
    alignItems: 'center',
    gap: s(10),
    marginVertical: s(10),
  },
  pinStepSub: {
    fontSize: s(14),
    fontFamily: 'Plus Jakarta Sans',
    textAlign: 'center',
    marginBottom: s(8),
    lineHeight: s(20),
  },
  pinInput: {
    width: '100%',
    height: s(54),
    borderWidth: 1,
    borderRadius: s(16),
    paddingHorizontal: s(16),
    fontSize: s(24),
    letterSpacing: s(16),
    textAlign: 'center',
    fontFamily: 'Plus Jakarta Sans',
  },
  pinErrorText: {
    fontSize: s(13),
    color: '#EF4444',
    fontFamily: 'Plus Jakarta Sans',
    textAlign: 'center',
    marginTop: s(-4),
    marginBottom: s(8),
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: s(12),
    marginTop: s(10),
  },
  modalBtn: {
    flex: 1,
    height: s(48),
    borderRadius: s(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnLeft: {
    backgroundColor: '#E5E7EB',
  },
  modalBtnRight: {
    backgroundColor: '#2563EB',
  },
  modalBtnText: {
    fontSize: s(16),
    fontWeight: '600',
    fontFamily: 'Plus Jakarta Sans',
  },
});
