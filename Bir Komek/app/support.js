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
  Linking,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useTheme } from './theme_store';

const { width: SW } = Dimensions.get('window');
const s = (n) => Math.round(n * (SW / 393));

export default function SupportScreen() {
  const router = useRouter();
  const { colors, activeMode } = useTheme();
  
  // Problem reporting states
  const [showReportModal, setShowReportModal] = useState(false);
  const [problemText, setProblemText] = useState('');

  const handleCallCenter = () => {
    Linking.openURL('tel:*8818').catch(err => {
      console.error("Dial error", err);
      Alert.alert('Xəta', 'Zəng etmək mümkün olmadı. Nömrə: *8818');
    });
  };

  const handleSendReport = () => {
    if (!problemText.trim()) {
      Alert.alert('Xəbərdarlıq', 'Zəhmət olmasa problemi təsvir edin.');
      return;
    }
    setShowReportModal(false);
    setProblemText('');
    Alert.alert('Göndərildi', 'Problemlə bağlı müraciətiniz Birkömək komandasına göndərildi. Qısa zamanda araşdırılacaq.');
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={activeMode === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.headerBackground} 
      />

      {/* Left-Aligned Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBackground, borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={s(24)} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Dəstək</Text>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-horizontal" size={s(24)} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: activeMode === 'dark' ? colors.background : '#F4F4F5' }]} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.infoCard, { backgroundColor: colors.cardBackground }]}>
          <Feather name="headphones" size={s(36)} color="#2563EB" />
          <Text style={[styles.infoTitle, { color: colors.text }]}>Sizə Necə Kömək Edə Bilərik?</Text>
          <Text style={[styles.infoText, { color: colors.subText }]}>
            Hər hansı bir sualınız və ya probleminiz yarandıqda aşağıdakı kanallardan biri vasitəsilə bizimlə dərhal əlaqə qura bilərsiniz.
          </Text>
        </View>

        {/* ── Support Options ───────────────────────── */}
        <View style={[styles.optionsCard, { backgroundColor: colors.cardBackground }]}>
          
          {/* Option 1: Birkömək Dəstək */}
          <TouchableOpacity 
            style={[styles.optionRow, { borderColor: colors.border }]} 
            activeOpacity={0.7}
            onPress={() => router.push('/voice_assistant')}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.iconBg, { backgroundColor: activeMode === 'dark' ? '#1E293B' : '#EFF6FF' }]}>
                <Ionicons name="chatbubble-ellipses-outline" size={s(22)} color="#2563EB" />
              </View>
              <View style={styles.optionTextCol}>
                <Text style={[styles.optionName, { color: colors.text }]}>Birkömək Dəstək</Text>
                <Text style={[styles.optionDesc, { color: colors.subText }]}>Səsli köməkçi ilə söhbət və yönləndirmə</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={s(20)} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Option 2: Birkömək Çağrı Mərkəzi */}
          <TouchableOpacity 
            style={[styles.optionRow, { borderColor: colors.border }]} 
            activeOpacity={0.7}
            onPress={handleCallCenter}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.iconBg, { backgroundColor: activeMode === 'dark' ? '#1E2D25' : '#ECFDF5' }]}>
                <Ionicons name="call-outline" size={s(22)} color="#10B981" />
              </View>
              <View style={styles.optionTextCol}>
                <Text style={[styles.optionName, { color: colors.text }]}>Bir kömək çağrı mərkəzi</Text>
                <Text style={[styles.optionDesc, { color: colors.subText }]}>Çağrı mərkəzinə birbaşa zəng et (*8818)</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={s(20)} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Option 3: Problemi Bildir */}
          <TouchableOpacity 
            style={[styles.optionRow, { borderBottomWidth: 0, borderColor: colors.border }]} 
            activeOpacity={0.7}
            onPress={() => setShowReportModal(true)}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.iconBg, { backgroundColor: activeMode === 'dark' ? '#2E221E' : '#FFF7ED' }]}>
                <Ionicons name="warning-outline" size={s(22)} color="#F97316" />
              </View>
              <View style={styles.optionTextCol}>
                <Text style={[styles.optionName, { color: colors.text }]}>Problemi bildir</Text>
                <Text style={[styles.optionDesc, { color: colors.subText }]}>Tətbiqdə yaranan problemi bizə yazın</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={s(20)} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* ── Problem Reporting Form Modal ─────────── */}
      <Modal
        visible={showReportModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Problemi bildir</Text>
            <Text style={[styles.modalSub, { color: colors.subText }]}>
              Yarandıqca çətinliyi və ya iradlarınızı aşağıda qeyd edin. Birkömək heyəti dərhal araşdıracaq:
            </Text>
            
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
              placeholder="Problemin təsviri..."
              placeholderTextColor={activeMode === 'dark' ? '#6B7280' : '#9CA3AF'}
              multiline={true}
              numberOfLines={4}
              value={problemText}
              onChangeText={setProblemText}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnLeft, { backgroundColor: activeMode === 'dark' ? '#374151' : '#E5E7EB' }]}
                activeOpacity={0.8}
                onPress={() => setShowReportModal(false)}
              >
                <Text style={[styles.modalBtnText, { color: colors.text }]}>Ləğv et</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalBtn, styles.modalBtnRight]}
                activeOpacity={0.8}
                onPress={handleSendReport}
              >
                <Text style={[styles.modalBtnText, { color: '#FFFFFF' }]}>Göndər</Text>
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
    paddingTop: s(20),
    paddingBottom: s(40),
    flexGrow: 1,
    gap: s(16),
  },
  infoCard: {
    borderRadius: s(24),
    padding: s(20),
    alignItems: 'center',
    gap: s(10),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  infoTitle: {
    fontSize: s(16),
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
    textAlign: 'center',
  },
  infoText: {
    fontSize: s(13.5),
    lineHeight: s(20),
    textAlign: 'center',
    fontFamily: 'Plus Jakarta Sans',
  },
  optionsCard: {
    borderRadius: s(24),
    padding: s(16),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: s(16),
    borderBottomWidth: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    flex: 1,
  },
  iconBg: {
    width: s(44),
    height: s(44),
    borderRadius: s(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextCol: {
    flex: 1,
    gap: s(2),
  },
  optionName: {
    fontSize: s(15),
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  optionDesc: {
    fontSize: s(12),
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
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
    marginBottom: s(8),
  },
  modalSub: {
    fontSize: s(13.5),
    lineHeight: s(18),
    fontFamily: 'Plus Jakarta Sans',
    marginBottom: s(16),
  },
  textInput: {
    width: '100%',
    height: s(100),
    borderWidth: 1,
    borderRadius: s(16),
    padding: s(14),
    fontSize: s(14),
    fontFamily: 'Plus Jakarta Sans',
    textAlignVertical: 'top',
    marginBottom: s(20),
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
