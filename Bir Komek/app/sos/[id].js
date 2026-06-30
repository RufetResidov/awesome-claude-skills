import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Switch,
  StatusBar,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { addEvent } from '../history_store';

const { width: SW } = Dimensions.get('window');
const s = (n) => Math.round(n * (SW / 393));

const SOS_DATA = {
  '103': {
    title: 'Təcili tibbi yardım',
    subtitle: 'Ambulans çağırışı',
    number: '103',
    numberColor: '#E11D48',
    image: require('../../assets/ambulance.png'),
  },
  '102': {
    title: 'Polis / Təhlükəsizlik',
    subtitle: 'Şəxsi təhlükəsizlik',
    number: '102',
    numberColor: '#1E3A8A',
    image: require('../../assets/shield.png'),
  },
  '112': {
    title: 'FHN / Yanğın',
    subtitle: 'Yanğın və məişət',
    number: '112',
    numberColor: '#B45309',
    image: require('../../assets/fire_station.png'),
  },
  'universal': {
    title: 'Mərkəzi SOS',
    subtitle: 'Təcili Kömək Mərkəzi',
    number: '112',
    numberColor: '#DC2626',
    image: require('../../assets/ambulance.png'),
  },
};

// ── Family SOS Interactive Simulation Screen ─────────────────
function FamilySosScreen({ router }) {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [selectedRelatives, setSelectedRelatives] = useState({
    ata: true,
    ana: true,
    yoldas: true,
    baci: true,
    qardas: true,
  });

  // Active Alert States
  const [countdown, setCountdown] = useState(5);
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false);

  // Selector Sheet & Success Modal States
  const [showServiceSelection, setShowServiceSelection] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState('103');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newTicketId, setNewTicketId] = useState(null);

  // Status for each relative
  const [statusAta, setStatusAta] = useState('pending');
  const [statusAna, setStatusAna] = useState('pending');
  const [statusYoldas, setStatusYoldas] = useState('pending');
  const [statusBaci, setStatusBaci] = useState('pending');
  const [statusQardas, setStatusQardas] = useState('pending');
  const [feedbackText, setFeedbackText] = useState('Hazırlanır...');

  // Setup completion countdown triggers
  useEffect(() => {
    let interval = null;
    if (isSetupComplete && countdown > 0 && !isCancelled) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isSetupComplete && countdown === 0 && !isCancelled) {
      setIsAlertActive(true);
    }
    return () => clearInterval(interval);
  }, [isSetupComplete, countdown, isCancelled]);

  // Active alert timeline simulation
  useEffect(() => {
    let alertInterval = null;
    if (isAlertActive && !isCancelled) {
      alertInterval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(alertInterval);
  }, [isAlertActive, isCancelled]);

  // Relatives render data
  const relatives = [
    {
      key: 'ata',
      name: 'Rufat Əliyev',
      role: 'Ata',
      avatar: require('../../assets/family/ata.png'),
      status: statusAta,
    },
    {
      key: 'ana',
      name: 'Ayna Əliyeva',
      role: 'Ana',
      avatar: require('../../assets/family/ana.png'),
      status: statusAna,
    },
    {
      key: 'yoldas',
      name: 'Aliyə Əliyeva',
      role: 'Həyat yoldaşı',
      avatar: require('../../assets/family/yoldas.png'),
      status: statusYoldas,
    },
    {
      key: 'baci',
      name: 'Fəridə Əliyeva',
      role: 'Bacı',
      avatar: require('../../assets/family/ana.png'),
      status: statusBaci,
    },
    {
      key: 'qardas',
      name: 'Elnur Əliyev',
      role: 'Qardaş',
      avatar: require('../../assets/family/ata.png'),
      status: statusQardas,
    },
  ];

  // Filter based on selected ones
  const activeRelatives = relatives.filter(r => selectedRelatives[r.key]);

  // Update feedback logs and status symbols based on time progression (30s total) - EMOTIONAL DESIGN
  useEffect(() => {
    if (!isAlertActive) return;

    const N = activeRelatives.length;
    if (N === 0) {
      if (elapsedSeconds < 24) {
        setFeedbackText('Qohum seçilməyib. Birkömək yanınızdadır, narahat olmayın. Sizi Dövlət Körpüsünə bağlayırıq...');
      } else if (elapsedSeconds >= 24 && elapsedSeconds < 30) {
        setFeedbackText('Kömək xəttinə təhlükəsiz keçid hazırlanır...');
      } else {
        setIsAlertActive(false);
        setShowServiceSelection(true);
      }
      return;
    }

    const T = 24 / N; // time allocated per active relative

    if (elapsedSeconds < 24) {
      const activeIdx = Math.floor(elapsedSeconds / T);
      
      activeRelatives.forEach((rel, idx) => {
        let status = 'pending';
        if (idx < activeIdx) {
          status = 'failed';
        } else if (idx === activeIdx) {
          const start = idx * T;
          if (elapsedSeconds < start + T / 2) {
            status = 'sending';
          } else {
            status = 'calling';
          }
        } else {
          status = 'pending';
        }

        // Set status states
        if (rel.key === 'ata') setStatusAta(status);
        if (rel.key === 'ana') setStatusAna(status);
        if (rel.key === 'yoldas') setStatusYoldas(status);
        if (rel.key === 'baci') setStatusBaci(status);
        if (rel.key === 'qardas') setStatusQardas(status);
      });

      // Update feedback texts - using emotional, reassuring tones
      if (activeIdx < N) {
        const curRel = activeRelatives[activeIdx];
        const start = activeIdx * T;
        if (elapsedSeconds < start + T / 2) {
          setFeedbackText(`${curRel.name} (${curRel.role}) hazırda məlumatlandırılır. Zəhmət olmasa gözləyin...`);
        } else {
          setFeedbackText(`${curRel.name} hazırda zəngə cavab verə bilmədi. Birkömək əlaqə saxlamağa davam edir...`);
        }
      }
    } 
    else if (elapsedSeconds >= 24 && elapsedSeconds < 30) {
      // Set all to failed
      activeRelatives.forEach(rel => {
        if (rel.key === 'ata') setStatusAta('failed');
        if (rel.key === 'ana') setStatusAna('failed');
        if (rel.key === 'yoldas') setStatusYoldas('failed');
        if (rel.key === 'baci') setStatusBaci('failed');
        if (rel.key === 'qardas') setStatusQardas('failed');
      });
      setFeedbackText('Yaxınlarınızla əlaqə qurula bilmədi. Sizi BirKömək dəstək xətti ilə Dövlət SOS Körpüsünə bağlayırıq.');
    } 
    else if (elapsedSeconds >= 30) {
      setIsAlertActive(false);
      setShowServiceSelection(true);
    }
  }, [elapsedSeconds, isAlertActive, activeRelatives.length]);

  const handleToggleRelative = (key) => {
    setSelectedRelatives(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCancel = () => {
    setIsCancelled(true);
    setIsAlertActive(false);
    Alert.alert(
      'Siqnal Ləğv Edildi',
      'Ailə SOS siqnalı uğurla ləğv edildi və qohumlarınıza təhlükəsiz olduğunuz barədə məlumat ötürüldü.',
      [{ text: 'Tamam', onPress: () => router.back() }]
    );
  };

  // Register new ticket based on chosen government service
  const handleSelectService = (type) => {
    const ticketId = `ticket-sos-${Date.now()}`;
    setSelectedServiceType(type);
    
    let title = '';
    let status = '';
    let statusType = '';
    let bgColor = '';
    let borderColor = '';
    let attachLabel = '';
    let attachIcon = '';
    
    if (type === '103') {
      title = '103 Regional Təcili Yardım';
      status = 'Briqada Yoldadır';
      statusType = 'red';
      bgColor = '#FFF1F1';
      borderColor = '#FCA5A5';
      attachLabel = 'Təcili Tibbi Yardım Çağırışı';
      attachIcon = 'heart-sharp';
    } else if (type === '102') {
      title = '102 Regional Polis Asayiş';
      status = 'Ekipaj Yoldadır';
      statusType = 'blue';
      bgColor = '#EEF2FF';
      borderColor = '#C7D2FE';
      attachLabel = 'Polis Asayiş Çağırışı';
      attachIcon = 'shield-checkmark-sharp';
    } else {
      title = '112 FHN Yanğın / Xilasetmə';
      status = 'Briqada Yoldadır';
      statusType = 'orange';
      bgColor = '#FFFBEB';
      borderColor = '#FDE68A';
      attachLabel = 'FHN Yanğın / Xilasetmə Çağırışı';
      attachIcon = 'flame-sharp';
    }

    addEvent({
      id: ticketId,
      type: type,
      title: title,
      status: status,
      statusType: statusType,
      date: 'Bugün, ' + new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' }),
      address: 'Bakı, Üzeyir Hacıbəyov küç., 34',
      attachments: [
        { type: 'text', label: attachLabel, icon: attachIcon, color: type === '103' ? '#DC2626' : type === '102' ? '#1E3A8A' : '#B45309' }
      ],
      bgColor: bgColor,
      borderColor: borderColor
    });

    setNewTicketId(ticketId);
    setShowServiceSelection(false);
    setShowSuccessModal(true);
  };

  const getSelectedServiceName = () => {
    if (selectedServiceType === '103') return '103 Təcili Tibbi Yardım (Ambulans)';
    if (selectedServiceType === '102') return '102 Polis (Təhlükəsizlik)';
    return '112 Fövqəladə Hallar (FHN)';
  };

  // 1. Setup / Selection screen
  if (!isSetupComplete) {
    return (
      <SafeAreaView style={styles.root}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={s(24)} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitleSetup}>Ailə SOS Quraşdırılması</Text>
          <View style={{ width: s(24) }} />
        </View>

        <ScrollView contentContainerStyle={styles.setupContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.setupTitle}>Yaxınlarını Seç</Text>
          <Text style={styles.setupSub}>
            Ailə SOS siqnalının göndəriləcəyi birinci dərəcəli qohumlarınızı siyahıdan seçin:
          </Text>

          {relatives.map((rel) => {
            const isSelected = selectedRelatives[rel.key];
            return (
              <TouchableOpacity
                key={rel.key}
                activeOpacity={0.8}
                onPress={() => handleToggleRelative(rel.key)}
                style={[
                  styles.setupCard,
                  isSelected && styles.setupCardSelected
                ]}
              >
                <Image source={rel.avatar} style={styles.setupAvatar} />
                <View style={styles.setupTextCol}>
                  <Text style={styles.setupCardName}>{rel.name}</Text>
                  <Text style={styles.setupCardRole}>{rel.role}</Text>
                </View>
                <View style={[
                  styles.checkbox,
                  isSelected && styles.checkboxChecked
                ]}>
                  {isSelected && <Ionicons name="checkmark" size={s(14)} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity 
            style={styles.activateBtn} 
            activeOpacity={0.9}
            onPress={() => setIsSetupComplete(true)}
          >
            <Text style={styles.activateBtnText}>Seçimi Təsdiqlə və Aktivləşdir</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 2. Active Countdown and Escalation Timeline Screen
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={s(24)} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ailə SOS Xəbərdarlığı</Text>
        <View style={{ width: s(24) }} />
      </View>

      <ScrollView contentContainerStyle={styles.sosContent} showsVerticalScrollIndicator={false}>
        
        {/* Countdown Area */}
        <View style={styles.countdownSection}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <Text style={styles.countdownNum}>
                {countdown > 0 ? countdown : elapsedSeconds}
              </Text>
            </View>
          </View>
          
          <View style={styles.statusLabelGroup}>
            <Text style={styles.statusLabelTitle}>
              {countdown > 0 ? 'SOS siqnalı göndərilir...' : elapsedSeconds >= 24 ? 'Kömək Xətti Aktivdir' : 'SOS siqnalı aktivdir'}
            </Text>
            <Text style={styles.statusLabelSub}>
              {countdown > 0 ? 'Siqnal avtomatik göndəriləcək' : `Aktivlik müddəti: ${elapsedSeconds}s`}
            </Text>
          </View>
        </View>

        {/* Dynamic Status Log Feedback Bar */}
        <View style={[
          styles.feedbackBar, 
          elapsedSeconds >= 24 && { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' }
        ]}>
          <Ionicons 
            name="information-circle-sharp" 
            size={s(20)} 
            color="#2563EB" 
          />
          <Text style={[
            styles.feedbackText,
            elapsedSeconds >= 24 && { color: '#1E40AF', fontWeight: '800' }
          ]}>
            {countdown > 0 ? `Siqnalın işə düşməsinə ${countdown} saniyə qaldı...` : feedbackText}
          </Text>
        </View>

        {/* Relatives list */}
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>
            {countdown > 0 ? 'Göndəriləcək yaxınlar:' : 'Zəncirvari bildiriş axını:'}
          </Text>

          {activeRelatives.length === 0 ? (
            <Text style={styles.emptyListText}>Heç bir qohum seçilməyib.</Text>
          ) : (
            activeRelatives.map((rel) => {
              return (
                <View key={rel.key} style={styles.relativeItem}>
                  <Image source={rel.avatar} style={styles.relativeAvatar} />
                  <View style={styles.relativeTextCol}>
                    <Text style={styles.relativeName}>{rel.name}</Text>
                    <Text style={styles.relativeRole}>{rel.role}</Text>
                  </View>
                  
                  {/* Status indicator on the right */}
                  <View style={styles.statusIndicator}>
                    {countdown > 0 ? (
                      <Ionicons name="time-outline" size={s(20)} color="#9CA3AF" />
                    ) : rel.status === 'pending' ? (
                      <Ionicons name="ellipse-outline" size={s(20)} color="#9CA3AF" style={{ opacity: 0.5 }} />
                    ) : rel.status === 'sending' ? (
                      <ActivityIndicator size="small" color="#2563EB" />
                    ) : rel.status === 'calling' ? (
                      <View style={styles.pulseCalling}>
                        <ActivityIndicator size="small" color="#EF4444" style={{ marginRight: s(4) }} />
                        <Ionicons name="call" size={s(16)} color="#EF4444" />
                      </View>
                    ) : rel.status === 'failed' ? (
                      <Ionicons name="close-circle" size={s(22)} color="#EF4444" />
                    ) : (
                      <Ionicons name="checkmark-circle" size={s(22)} color="#22C55E" />
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Location Display */}
        <View style={styles.locBox}>
          <View style={styles.locIconContainer}>
            <Ionicons name="location" size={s(20)} color="#2563EB" />
          </View>
          <View style={styles.locTextCol}>
            <Text style={styles.locTitle}>Məkanınız paylaşılır</Text>
            <Text style={styles.locAddress}>Bakı, Üzeyir Hacıbəyov küç., 34</Text>
          </View>
        </View>

      </ScrollView>

      {/* Sticky Fixed Bottom Cancel Button Container */}
      <View style={styles.stickyStopContainer}>
        <TouchableOpacity 
          style={styles.stopBtn} 
          activeOpacity={0.9}
          onPress={handleCancel}
        >
          <Text style={styles.stopBtnText}>Dayandırmaq üçün toxunun</Text>
        </TouchableOpacity>
      </View>

      {/* ── Hotline Service Selection Bottom Sheet Overlay ── */}
      <Modal
        visible={showServiceSelection}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowServiceSelection(false)}
      >
        <View style={styles.sheetOverlay}>
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetLine} />
              <Text style={styles.sheetTitle}>SOS Dövlət Körpüsü</Text>
              <Text style={styles.sheetSub}>
                Yaxınlarınız hazırda cavab verə bilmədi. Birkömək köməyinizə gəlir. Hansı yardım briqadasının yaxınlaşmasını istəyirsiniz?
              </Text>
            </View>

            <View style={styles.sheetOptions}>
              {/* 103 option */}
              <TouchableOpacity 
                style={[styles.sheetOptionCard, { borderColor: '#FCA5A5', backgroundColor: '#FFF5F5' }]}
                activeOpacity={0.8}
                onPress={() => handleSelectService('103')}
              >
                <View style={[styles.sheetOptionIconBg, { backgroundColor: '#DC2626' }]}>
                  <Ionicons name="medical" size={s(24)} color="#FFFFFF" />
                </View>
                <View style={styles.sheetOptionTextCol}>
                  <Text style={[styles.sheetOptionNum, { color: '#DC2626' }]}>103</Text>
                  <Text style={styles.sheetOptionName}>Təcili Tibbi Yardım</Text>
                  <Text style={styles.sheetOptionDesc}>Səhhətlə bağlı təcili ambulans çağırışı</Text>
                </View>
                <Ionicons name="chevron-forward" size={s(20)} color="#DC2626" />
              </TouchableOpacity>

              {/* 102 option */}
              <TouchableOpacity 
                style={[styles.sheetOptionCard, { borderColor: '#C7D2FE', backgroundColor: '#F0F4FF' }]}
                activeOpacity={0.8}
                onPress={() => handleSelectService('102')}
              >
                <View style={[styles.sheetOptionIconBg, { backgroundColor: '#1E3A8A' }]}>
                  <Ionicons name="shield" size={s(24)} color="#FFFFFF" />
                </View>
                <View style={styles.sheetOptionTextCol}>
                  <Text style={[styles.sheetOptionNum, { color: '#1E3A8A' }]}>102</Text>
                  <Text style={styles.sheetOptionName}>Polis / Təhlükəsizlik</Text>
                  <Text style={styles.sheetOptionDesc}>Təhlükəsizlik və asayişin qorunması</Text>
                </View>
                <Ionicons name="chevron-forward" size={s(20)} color="#1E3A8A" />
              </TouchableOpacity>

              {/* 112 option */}
              <TouchableOpacity 
                style={[styles.sheetOptionCard, { borderColor: '#FDE68A', backgroundColor: '#FFFDF0' }]}
                activeOpacity={0.8}
                onPress={() => handleSelectService('112')}
              >
                <View style={[styles.sheetOptionIconBg, { backgroundColor: '#B45309' }]}>
                  <Ionicons name="flame" size={s(24)} color="#FFFFFF" />
                </View>
                <View style={styles.sheetOptionTextCol}>
                  <Text style={[styles.sheetOptionNum, { color: '#B45309' }]}>112</Text>
                  <Text style={styles.sheetOptionName}>FHN / Yanğın</Text>
                  <Text style={styles.sheetOptionDesc}>Fövqəladə hallar və yanğın xilasetmə</Text>
                </View>
                <Ionicons name="chevron-forward" size={s(20)} color="#B45309" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Hotline Success Registration Modal ────── */}
      <Modal
        visible={showSuccessModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconBg}>
              <Ionicons name="checkmark-circle" size={s(60)} color="#22C55E" />
            </View>
            
            <Text style={styles.modalTitle}>Seçiminiz qeydə alındı! ✅</Text>
            
            <Text style={styles.modalText}>
              Birkömək sizinlədir. SOS Dövlət Körpüsü vasitəsilə 
              <Text style={{ fontWeight: '800', color: '#11151C' }}> {getSelectedServiceName()} </Text> 
              qaynar xətti ilə əlaqə quruldu. Yardım briqadası ünvanınıza yaxınlaşır.
            </Text>

            <TouchableOpacity 
              style={styles.modalTrackBtn}
              activeOpacity={0.8}
              onPress={() => {
                setShowSuccessModal(false);
                router.push(`/history/${newTicketId}`);
              }}
            >
              <Text style={styles.modalTrackBtnText}>Canlı İzləyin</Text>
              <Ionicons name="arrow-forward" size={s(18)} color="#FFFFFF" style={{ marginLeft: s(6) }} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ── Main Controller Screen ──────────────────────────────────
export default function SosScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [notifyFamily, setNotifyFamily] = useState(true);

  if (id === 'SOS') {
    return <FamilySosScreen router={router} />;
  }

  const data = SOS_DATA[id] || SOS_DATA['universal'];

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* ── Header ────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={s(24)} color="#111827" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreBtn}>
          <Ionicons name="ellipsis-horizontal" size={s(24)} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* ── Content ───────────────────────────────── */}
      <View style={styles.content}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.subtitle}>{data.subtitle}</Text>
        
        <Text style={[styles.number, { color: data.numberColor }]}>{data.number}</Text>
        
        <Image source={data.image} style={styles.mainImg} />

        {/* ── Location Box ──────────────────────────── */}
        <View style={styles.locationBox}>
          <View style={styles.locIconBg}>
            <Ionicons name="location" size={s(20)} color="#2563EB" />
          </View>
          <View style={styles.locTextGroup}>
            <Text style={styles.locTitle}>Məkanınız paylaşılır</Text>
            <Text style={styles.locSub}>Bakı, Üzeyir Hacıbəyov küç., 34</Text>
          </View>
        </View>

        {/* ── Notification Toggle ────────────────────── */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleTextGroup}>
            <Text style={styles.toggleTitle}>Yaxın əlaqə bildirişi</Text>
            <Text style={styles.toggleSub}>Yaxınlarıma avtomatik məlumat ver</Text>
          </View>
          <Switch
            value={notifyFamily}
            onValueChange={setNotifyFamily}
            trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* ── Action Buttons ────────────────────────── */}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} activeOpacity={0.8}>
            <Text style={styles.btnPrimaryText}>Zəng et</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} style={[styles.btn, styles.btnSecondary]} activeOpacity={0.8}>
            <Text style={styles.btnSecondaryText}>Ləğv et</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

// ── Stylesheet ──────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingTop: s(12),
    paddingBottom: s(8),
  },
  headerTitle: {
    fontSize: s(18),
    fontWeight: '700',
    color: '#11151C',
    fontFamily: 'Plus Jakarta Sans',
  },
  headerTitleSetup: {
    fontSize: s(18),
    fontWeight: '800',
    color: '#11151C',
    fontFamily: 'Plus Jakarta Sans',
  },
  backBtn: {
    padding: s(4),
  },
  moreBtn: {
    padding: s(4),
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: s(24),
    paddingTop: s(16),
  },
  title: {
    fontSize: s(24),
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: s(14),
    color: '#6B7280',
    marginTop: s(4),
    textAlign: 'center',
  },
  number: {
    fontSize: s(64),
    fontWeight: '800',
    marginTop: s(20),
    marginBottom: s(10),
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.05)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  mainImg: {
    width: s(220),
    height: s(220),
    resizeMode: 'contain',
    marginVertical: s(12),
  },
  locationBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: s(16),
    padding: s(16),
    width: '100%',
    alignItems: 'center',
    marginBottom: s(16),
  },
  locIconBg: {
    width: s(44),
    height: s(44),
    borderRadius: s(12),
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locTextGroup: {
    marginLeft: s(16),
    flex: 1,
  },
  locSub: {
    fontSize: s(12),
    color: '#6B7280',
    marginTop: s(2),
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: s(16),
    padding: s(16),
    width: '100%',
    marginBottom: s(24),
  },
  toggleTextGroup: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: s(14),
    fontWeight: '700',
    color: '#1F2937',
  },
  toggleSub: {
    fontSize: s(12),
    color: '#9CA3AF',
    marginTop: s(2),
  },
  actions: {
    width: '100%',
    gap: s(12),
  },
  btn: {
    height: s(52),
    borderRadius: s(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: '#DC2626',
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: s(16),
    fontWeight: '700',
  },
  btnSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  btnSecondaryText: {
    color: '#4B5563',
    fontSize: s(16),
    fontWeight: '600',
  },

  // ── Family SOS Styles ──────────────────────────────────────
  setupContent: {
    paddingHorizontal: s(20),
    paddingTop: s(16),
    paddingBottom: s(30),
  },
  setupTitle: {
    fontSize: s(22),
    fontWeight: '800',
    color: '#11151C',
    fontFamily: 'Plus Jakarta Sans',
    marginBottom: s(6),
  },
  setupSub: {
    fontSize: s(14),
    color: '#4B5563',
    fontFamily: 'Plus Jakarta Sans',
    lineHeight: s(20),
    marginBottom: s(20),
  },
  setupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: s(16),
    backgroundColor: '#FFFFFF',
    borderRadius: s(16),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: s(12),
    marginBottom: s(12),
  },
  setupCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#F0F6FF',
  },
  setupAvatar: {
    width: s(48),
    height: s(48),
    borderRadius: s(24),
  },
  setupTextCol: {
    flex: 1,
  },
  setupCardName: {
    fontSize: s(16),
    fontWeight: '700',
    color: '#11151C',
    fontFamily: 'Plus Jakarta Sans',
  },
  setupCardRole: {
    fontSize: s(13),
    color: '#4B5563',
    fontFamily: 'Plus Jakarta Sans',
    marginTop: s(2),
  },
  checkbox: {
    width: s(24),
    height: s(24),
    borderRadius: s(12),
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: '#2563EB',
    backgroundColor: '#2563EB',
  },
  activateBtn: {
    width: '100%',
    backgroundColor: '#2563EB',
    borderRadius: s(16),
    paddingVertical: s(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: s(20),
  },
  activateBtnText: {
    color: '#FFFFFF',
    fontSize: s(16),
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },

  // Active Alert styles
  sosContent: {
    paddingHorizontal: s(20),
    paddingTop: s(8),
    paddingBottom: s(24),
  },
  countdownSection: {
    alignItems: 'center',
    paddingVertical: s(12),
    gap: s(16),
  },
  outerCircle: {
    width: s(180),
    height: s(180),
    borderRadius: s(90),
    borderWidth: 2,
    borderColor: '#D7263D',
    backgroundColor: 'rgba(215, 38, 61, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: s(150),
    height: s(150),
    borderRadius: s(75),
    borderWidth: 4,
    borderColor: '#D7263D',
    backgroundColor: 'rgba(215, 38, 61, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownNum: {
    fontSize: s(70),
    fontWeight: '900',
    color: '#D7263D',
    fontFamily: 'Plus Jakarta Sans',
  },
  statusLabelGroup: {
    alignItems: 'center',
    gap: s(4),
  },
  statusLabelTitle: {
    color: '#D7263D',
    fontSize: s(20),
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  statusLabelSub: {
    color: '#4B5563',
    fontSize: s(14),
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '400',
  },
  feedbackBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
    borderWidth: 1,
    borderRadius: s(16),
    padding: s(14),
    gap: s(10),
    width: '100%',
    marginTop: s(8),
    marginBottom: s(16),
  },
  feedbackText: {
    fontSize: s(13),
    fontWeight: '700',
    color: '#1E40AF',
    flex: 1,
    fontFamily: 'Plus Jakarta Sans',
    lineHeight: s(18),
  },
  listSection: {
    width: '100%',
    gap: s(12),
    marginBottom: s(12),
  },
  listTitle: {
    color: '#11151C',
    fontSize: s(14),
    fontWeight: '850',
    fontFamily: 'Plus Jakarta Sans',
  },
  emptyListText: {
    color: '#6B7280',
    fontSize: s(14),
    textAlign: 'center',
    paddingVertical: s(12),
  },
  relativeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: s(16),
    backgroundColor: '#FFFFFF',
    borderRadius: s(16),
    borderWidth: 1,
    borderColor: '#F0EEF0',
    gap: s(12),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  relativeAvatar: {
    width: s(48),
    height: s(48),
    borderRadius: s(24),
  },
  relativeTextCol: {
    flex: 1,
  },
  relativeName: {
    fontSize: s(16),
    fontWeight: '700',
    color: '#11151C',
    fontFamily: 'Plus Jakarta Sans',
  },
  relativeRole: {
    fontSize: s(13),
    color: '#4B5563',
    fontFamily: 'Plus Jakarta Sans',
    marginTop: s(2),
  },
  statusIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseCalling: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: s(8),
    paddingVertical: s(4),
    borderRadius: s(12),
  },
  locBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF0FD',
    borderRadius: s(20),
    padding: s(16),
    gap: s(12),
    width: '100%',
    marginVertical: s(12),
  },
  locIconContainer: {
    width: s(44),
    height: s(44),
    borderRadius: s(12),
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locTitle: {
    fontSize: s(15),
    fontWeight: '700',
    color: '#2563EB',
    fontFamily: 'Plus Jakarta Sans',
  },
  locAddress: {
    fontSize: s(13),
    color: '#6B7280',
    fontFamily: 'Inter',
    marginTop: s(2),
  },
  
  // Fixed Sticky Bottom Stop Button styles
  stickyStopContainer: {
    paddingHorizontal: s(20),
    paddingBottom: s(16),
    paddingTop: s(8),
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  stopBtn: {
    width: '100%',
    backgroundColor: '#D9282E',
    borderRadius: s(16),
    paddingVertical: s(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopBtnText: {
    color: '#FFFFFF',
    fontSize: s(18),
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },

  // ── Success & Selection Modal Styles ────────────────────────
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 21, 28, 0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: s(28),
    borderTopRightRadius: s(28),
    paddingHorizontal: s(20),
    paddingBottom: s(36),
    paddingTop: s(12),
  },
  sheetHeader: {
    alignItems: 'center',
    marginBottom: s(20),
  },
  sheetLine: {
    width: s(40),
    height: s(4),
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: s(12),
  },
  sheetTitle: {
    fontSize: s(20),
    fontWeight: '850',
    color: '#11151C',
    fontFamily: 'Plus Jakarta Sans',
    marginBottom: s(6),
  },
  sheetSub: {
    fontSize: s(13),
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: 'Plus Jakarta Sans',
    lineHeight: s(18),
  },
  sheetOptions: {
    gap: s(12),
  },
  sheetOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: s(16),
    borderRadius: s(20),
    borderWidth: 1.5,
    gap: s(12),
  },
  sheetOptionIconBg: {
    width: s(48),
    height: s(48),
    borderRadius: s(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetOptionTextCol: {
    flex: 1,
  },
  sheetOptionNum: {
    fontSize: s(12),
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  sheetOptionName: {
    fontSize: s(15),
    fontWeight: '700',
    color: '#11151C',
    fontFamily: 'Plus Jakarta Sans',
    marginTop: s(1),
  },
  sheetOptionDesc: {
    fontSize: s(12),
    color: '#6B7280',
    fontFamily: 'Plus Jakarta Sans',
    marginTop: s(2),
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 21, 28, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(24),
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(24),
    padding: s(24),
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  modalIconBg: {
    marginBottom: s(16),
  },
  modalTitle: {
    fontSize: s(20),
    fontWeight: '850',
    color: '#11151C',
    textAlign: 'center',
    fontFamily: 'Plus Jakarta Sans',
    marginBottom: s(12),
  },
  modalText: {
    fontSize: s(14),
    color: '#4B5563',
    textAlign: 'center',
    fontFamily: 'Plus Jakarta Sans',
    lineHeight: s(22),
    marginBottom: s(24),
  },
  modalTrackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: s(16),
    width: '100%',
    paddingVertical: s(14),
  },
  modalTrackBtnText: {
    color: '#FFFFFF',
    fontSize: s(16),
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
});
