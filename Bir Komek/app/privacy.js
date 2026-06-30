import React from 'react';
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
import { useTheme } from './theme_store';

const { width: SW } = Dimensions.get('window');
const s = (n) => Math.round(n * (SW / 393));

export default function PrivacyScreen() {
  const router = useRouter();
  const { colors, activeMode } = useTheme();

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Məxfilik siyasəti</Text>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-horizontal" size={s(24)} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Policy Details */}
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: activeMode === 'dark' ? colors.background : '#F4F4F5' }]} showsVerticalScrollIndicator={false}>
        
        <View style={[styles.introCard, { backgroundColor: colors.cardBackground }]}>
          <Feather name="shield" size={s(40)} color="#2563EB" />
          <Text style={[styles.introTitle, { color: colors.text }]}>Təhlükəsizliyiniz Bizim Üçün Vacibdir</Text>
          <Text style={[styles.introText, { color: colors.subText }]}>
            Birkömək tətbiqi istifadəçilərin, xüsusilə yaşlı və qayğıya ehtiyacı olan yaxınlarımızın şəxsi məlumatlarının məxfiliyini qorumağı özünün ən ali borcu hesab edir.
          </Text>
        </View>

        {/* Section 1 */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Toplanan Məlumatlar</Text>
          <Text style={[styles.sectionText, { color: colors.subText }]}>
            Tətbiq yalnız fövqəladə hallarda köməyin gəlməsini sürətləndirmək məqsədilə canlı məkan koordinatlarınızı, Birkömək ID-nizi və təyin etdiyiniz 1-ci dərəcəli qohumların əlaqə nömrələrini qeydə alır.
          </Text>
        </View>

        {/* Section 2 */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Məlumatların İstifadəsi</Text>
          <Text style={[styles.sectionText, { color: colors.subText }]}>
            Sizin məkan koordinatlarınız heç bir kommersiya və ya reklam məqsədilə üçüncü tərəflərə ötürülmür. Bu məlumatlar yalnız SOS siqnalı aktivləşdirildikdə ailə zəncirindəki qohumlarınıza və seçdiyiniz dövlət təcili yardım xidmətlərinə (103, 102, 112) ünvan tərifi üçün verilir.
          </Text>
        </View>

        {/* Section 3 */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>3. Təhlükəsizlik Zəmanəti</Text>
          <Text style={[styles.sectionText, { color: colors.subText }]}>
            Birkömək sistemindəki bütün məlumat axını müasir rəqəmsal şifrələmə protokolları vasitəsilə tam təhlükəsiz kanallarla ötürülür və icazəsiz daxilolmalardan ciddi şəkildə qorunur.
          </Text>
        </View>

        {/* Section 4 */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Əlaqə və Dəstək</Text>
          <Text style={[styles.sectionText, { color: colors.subText }]}>
            Məxfilik siyasəti haqqında suallarınız yaranarsa, tətbiqdəki "Dəstək" bölməsindən Birkömək komandasına yaza və ya destek@birkomek.az ünvanına e-poçt göndərə bilərsiniz.
          </Text>
        </View>

      </ScrollView>
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
  introCard: {
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
  introTitle: {
    fontSize: s(16),
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
    textAlign: 'center',
  },
  introText: {
    fontSize: s(13.5),
    lineHeight: s(20),
    textAlign: 'center',
    fontFamily: 'Plus Jakarta Sans',
  },
  section: {
    borderRadius: s(20),
    padding: s(18),
    gap: s(8),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: s(15),
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  sectionText: {
    fontSize: s(13.5),
    lineHeight: s(20),
    fontFamily: 'Plus Jakarta Sans',
  },
});
