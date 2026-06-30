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
import { useLanguage } from './language_store';
import { useTheme } from './theme_store';

const { width: SW } = Dimensions.get('window');
const s = (n) => Math.round(n * (SW / 393));

const FAQ_DATA = {
  umum: [
    {
      q: 'Birkömək nədir?',
      a: 'Birkömək, yaşlı və tək yaşayan insanların çətin anlarda (təcili tibbi yardım, asayiş, yanğın və ya birinci dərəcəli qohumları ilə) dərhal əlaqə qurması üçün hazırlanmış rəqəmsal dəstək tətbiqidir.',
    },
    {
      q: 'Xidmətin ödənişi və ya abunəliyi varmı?',
      a: 'Xidmətdən istifadə tamamilə pulsuzdur. Bütün SOS siqnalları və təcili tibbi yardım çağırışları pulsuz olaraq yerinə yetirilir.',
    },
    {
      q: 'Ailə SOS sistemi necə işləyir?',
      a: 'Ailə SOS düyməsinə basdıqda tətbiq 30 saniyə ərzində növbə ilə təyin etdiyiniz qohumlarınızı SMS və zənglərlə arayır. Cavab verən olmadıqda çağırışı regional 103 mərkəzinə yönləndirir.',
    },
    {
      q: 'Xidmətin qiymətləndirilməsi nədir?',
      a: 'SOS çağırışı və ya təcili kömək başa çatdıqdan sonra göstərilən xidmətin keyfiyyətini və operativliyini ulduzlarla qiymətləndirə bilərsiniz.',
    },
  ],
  melumat: [
    {
      q: 'Məkan məlumatım necə paylaşılır?',
      a: 'SOS siqnalı aktiv olduqda telefonunuzun GPS koordinatları avtomatik olaraq yaxınlarınıza canlı xəritə linki gibi göndərilir və Dövlət Körpüsü yardım briqadası ilə paylaşılır.',
    },
    {
      q: 'Qeydiyyat ünvanımı necə dəyişə bilərəm?',
      a: 'Ünvan məlumatlarınız qeydiyyat zamanı daxil etdiyiniz myGov məlumatları əsasında formalaşır. Dəyişiklik üçün tənzimləmələrdən profili redaktə et bölməsinə keçə bilərsiniz.',
    },
  ],
  id: [
    {
      q: 'Birkömək ID nədir?',
      a: 'Birkömək ID, profilinizdə yerləşən unikal 7 rəqəmli koddur. Bu kod vasitəsilə yaxınlarınız sizi öz tətbiqlərində təcili əlaqə qohumu olaraq əlavə edə bilərlər.',
    },
    {
      q: 'ID kodumu qohumlarımla necə paylaşım?',
      a: 'Tənzimləmələr (Settings) səhifəsinə daxil olub "Birkömək Kod" kartına klikləyərək kodu kopyalaya və istənilən mesajlaşma tətbiqi ilə yaxınlarınıza yollaya bilərsiniz.',
    },
  ],
  rey: [
    {
      q: 'Təklif və iradlarımı hara bildirə bilərəm?',
      a: 'Tətbiqi daha da inkişaf etdirməkdə bizə kömək etmək üçün dəstək bölməsindən birbaşa Birkömək komandasına rəy və təkliflərinizi yaza bilərsiniz.',
    },
    {
      q: 'Səhvən çağırış etdikdə nə etməliyəm?',
      a: 'Səhvən basılmış SOS çağırışını 5 saniyəlik geri sayım müddətində aşağıdakı "Dayandırmaq üçün toxunun" düyməsi ilə dərhal ləğv edə bilərsiniz.',
    },
  ],
};

export default function FaqScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { colors, activeMode } = useTheme();

  const [activeTab, setActiveTab] = useState('umum');
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (idx) => {
    if (expandedIndex === idx) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(idx);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setExpandedIndex(null);
  };

  const currentFaqs = FAQ_DATA[activeTab] || [];

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('faq')}</Text>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-horizontal" size={s(24)} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Tabs Row */}
      <View style={[styles.tabContainer, { backgroundColor: colors.background }]}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabScroll}
        >
          <TouchableOpacity 
            style={[styles.tabPill, activeTab === 'umum' && styles.tabPillActive, { backgroundColor: activeTab === 'umum' ? '#2563EB' : colors.lightBg }]}
            activeOpacity={0.8}
            onPress={() => handleTabChange('umum')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'umum' ? '#FFFFFF' : colors.subText }]}>Ümumi</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabPill, activeTab === 'melumat' && styles.tabPillActive, { backgroundColor: activeTab === 'melumat' ? '#2563EB' : colors.lightBg }]}
            activeOpacity={0.8}
            onPress={() => handleTabChange('melumat')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'melumat' ? '#FFFFFF' : colors.subText }]}>Məlumatlarım</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabPill, activeTab === 'id' && styles.tabPillActive, { backgroundColor: activeTab === 'id' ? '#2563EB' : colors.lightBg }]}
            activeOpacity={0.8}
            onPress={() => handleTabChange('id')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'id' ? '#FFFFFF' : colors.subText }]}>Birkömək ID</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabPill, activeTab === 'rey' && styles.tabPillActive, { backgroundColor: activeTab === 'rey' ? '#2563EB' : colors.lightBg }]}
            activeOpacity={0.8}
            onPress={() => handleTabChange('rey')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'rey' ? '#FFFFFF' : colors.subText }]}>Rəy və Təklif</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* FAQs List */}
      <ScrollView contentContainerStyle={[styles.listContainer, { backgroundColor: activeMode === 'dark' ? colors.background : '#F4F4F5' }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.faqCard, { backgroundColor: colors.cardBackground }]}>
          {currentFaqs.map((faq, idx) => {
            const isExpanded = expandedIndex === idx;
            const isLastItem = idx === currentFaqs.length - 1;

            return (
              <View 
                key={idx} 
                style={[
                  styles.faqItem,
                  !isLastItem && styles.faqDivider,
                  { borderColor: colors.border }
                ]}
              >
                <TouchableOpacity 
                  style={styles.faqQuestionRow}
                  activeOpacity={0.7}
                  onPress={() => toggleExpand(idx)}
                >
                  <Text style={[styles.faqQuestion, { color: colors.text }]}>{faq.q}</Text>
                  <Feather 
                    name={isExpanded ? "chevron-down" : "chevron-right"} 
                    size={s(20)} 
                    color={colors.subText} 
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={[styles.faqAnswerContainer, { backgroundColor: activeMode === 'dark' ? '#374151' : '#F9FAFB', borderColor: colors.border }]}>
                    <Text style={[styles.faqAnswer, { color: colors.text }]}>{faq.a}</Text>
                  </View>
                )}
              </View>
            );
          })}
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
  tabContainer: {
    paddingVertical: s(14),
  },
  tabScroll: {
    paddingHorizontal: s(20),
    gap: s(10),
  },
  tabPill: {
    paddingVertical: s(8),
    paddingHorizontal: s(18),
    borderRadius: s(12),
  },
  tabPillActive: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: s(14),
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  listContainer: {
    paddingHorizontal: s(20),
    paddingTop: s(8),
    paddingBottom: s(40),
    flexGrow: 1,
  },
  faqCard: {
    borderRadius: s(24),
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginTop: s(12),
  },
  faqItem: {
    paddingHorizontal: s(20),
    paddingVertical: s(18),
  },
  faqDivider: {
    borderBottomWidth: 1,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: s(12),
  },
  faqQuestion: {
    flex: 1,
    fontSize: s(15),
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
    lineHeight: s(22),
  },
  faqAnswerContainer: {
    marginTop: s(12),
    borderRadius: s(12),
    padding: s(14),
    borderWidth: 1,
  },
  faqAnswer: {
    fontSize: s(13.5),
    fontFamily: 'Plus Jakarta Sans',
    lineHeight: s(20),
  },
});
