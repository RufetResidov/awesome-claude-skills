import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  TextInput,
  Modal,
  Animated,
  Easing,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Voice from './voice_wrapper';

const { width: SW } = Dimensions.get('window');
const s = (n) => Math.round(n * (SW / 393));

export default function VoiceAssistantScreen() {
  const router = useRouter();
  const [showSheet, setShowSheet] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [inputText, setInputText] = useState('');
  
  // Current active chat session messages
  // Array of { id: string, sender: 'user'|'assistant', text: string }
  const [messages, setMessages] = useState([]);
  
  // States: 'idle' | 'listening' | 'speaking'
  const [status, setStatus] = useState('idle');
  const [isNativeAvailable, setIsNativeAvailable] = useState(true);
  const [isTextInputVisible, setIsTextInputVisible] = useState(false);

  // Past conversation sessions history
  const [pastSessions, setPastSessions] = useState([
    {
      id: 'session-1',
      date: '30 İyun • 11:15',
      title: 'Təcili 103 Çağırışı',
      messages: [
        { id: '1', sender: 'user', text: 'Təcili 103 tibbi yardım çağır' },
        { id: '2', sender: 'assistant', text: 'Baş üstə, 103 xidməti aktivləşdirildi. İlkin tibbi müdaxilə etmək üçün həkim briqadası yola düşdü. Zəhmət olmasa sakinliyinizi qoruyun. ❤️' }
      ]
    },
    {
      id: 'session-2',
      date: '29 İyun • 18:40',
      title: 'Polis və Təhlükəsizlik',
      messages: [
        { id: '1', sender: 'user', text: 'Polis çağır' },
        { id: '2', sender: 'assistant', text: '102 Təhlükəsizlik xidmətinə koordinatlarınız ötürüldü. Ekipaj ən qısa zamanda yaxınlaşacaq. Özünüzü güvəndə hiss edin. 🛡️' }
      ]
    }
  ]);

  const scrollViewRef = useRef(null);

  // Animated values for pulsing AI Mascot rings
  const pulse1 = useRef(new Animated.Value(1)).current;
  const pulse2 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status === 'speaking' || status === 'listening') {
      const createPulse = (val, delay) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
              Animated.timing(val, {
                toValue: 1.8,
                duration: 1800,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(val, {
                toValue: 1,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
          ])
        );
      };

      const anim1 = createPulse(pulse1, 0);
      const anim2 = createPulse(pulse2, 800);

      anim1.start();
      anim2.start();

      return () => {
        anim1.stop();
        anim2.stop();
        pulse1.setValue(1);
        pulse2.setValue(1);
      };
    }
  }, [status]);

  // Voice listeners initialization
  useEffect(() => {
    Voice.onSpeechStart = () => {
      setStatus('listening');
      setIsTextInputVisible(false);
    };
    
    Voice.onSpeechEnd = () => {
      setStatus('idle');
    };
    
    Voice.onSpeechError = (e) => {
      console.log('Voice recognition error:', e);
      if (e.error?.message?.includes('binding') || !Voice.startSpeech) {
        setIsNativeAvailable(false);
      }
    };
    
    Voice.onSpeechResults = (e) => {
      if (e.value && e.value.length > 0) {
        const spokenText = e.value[0];
        handleNewMessage(spokenText);
      }
    };

    return () => {
      // Auto save current session to history on exit if it contains messages
      saveCurrentSessionToHistory();
      try {
        Voice.destroy().then(Voice.removeAllListeners);
      } catch (err) {
        console.log('Clean up error:', err);
      }
    };
  }, [messages]);

  const SUGGESTIONS = [
    {
      text: 'Təcili 103 Çağır',
      reply: 'Baş üstə, 103 xidməti aktivləşdirilir. İlkin tibbi müdaxilə etmək üçün həkimlərimiz yola çıxdı. Zəhmət olmasa sakinliyinizi qoruyun, hər şey nəzarət altındadır. ❤️',
      badge: 'Təcili',
      badgeColor: '#EF4444',
      desc: 'Ərazinizə dərhal Təcili Tibbi Yardım və həkim yönləndirirəm.',
      icon: 'activity',
    },
    {
      text: 'Yaxınlarıma SOS Göndər',
      reply: 'Bütün təyin olunmuş yaxın kontaktlarınıza anlıq mövqe məlumatlarınız və SOS siqnalı göndərildi. Narahat olmayın, onlar məlumatlıdır. 🫂',
      badge: 'Ailə',
      badgeColor: '#6D28D9',
      desc: 'Təyin etdiyiniz bütün yaxın kontaktlarınıza yerinizi göndərirəm.',
      icon: 'user',
    },
    {
      text: 'Polis / 102 Çağır',
      reply: '102 Təhlükəsizlik xidmətinə koordinatlarınız göndərildi. Ekipaj ən qısa zamanda yaxınlaşacaq. Özünüzü güvəndə hiss edin. 🛡️',
      desc: 'Təhlükəsizliyiniz üçün yaxınlıqdakı asayiş patrulunu yönləndirirəm.',
      icon: 'briefcase',
    },
    {
      text: 'FHN / Yanğın',
      reply: '112 Fövqəladə Hallar Nazirliyi çağırılır... Yanğın və qəza idarəetmə mərkəzinə məlumat ötürüldü. Zəhmət olmasa təhlükəsiz yerə keçin. 🔥',
      desc: 'Yanğın, qəza və digər fövqəladə qəzalarda dərhal FHN çağırıram.',
      icon: 'briefcase',
    },
    {
      text: 'İlkin Yardım Təlimatı',
      reply: 'Müxtəlif zədələrdə edilməli olan ilkin yardım təlimatını açdım. Zəhmət olmasa təlimatlara addım-addım riayət edin.',
      badge: 'Faydalı',
      badgeColor: '#10B981',
      desc: 'Müxtəlif zədələrdə edilməli olan ilkin tibbi addımları göstərirəm.',
      icon: 'book-open',
    },
  ];

  // Auto-scrolling on new messages
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, status]);

  // Saves current session to history list
  const saveCurrentSessionToHistory = () => {
    if (messages.length > 0) {
      const firstUserMsg = messages.find(m => m.sender === 'user')?.text || 'Yeni Yazışma';
      const title = firstUserMsg.length > 25 ? firstUserMsg.substring(0, 25) + '...' : firstUserMsg;
      
      const newSession = {
        id: `session-${Date.now()}`,
        date: 'Bugün • ' + new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' }),
        title: title,
        messages: [...messages]
      };
      
      setPastSessions(prev => [newSession, ...prev]);
    }
  };

  // Handle selected pill or card command
  const handleCommand = (text, reply) => {
    setShowSheet(false);
    const userMsg = { id: `msg-${Date.now()}-u`, sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setStatus('speaking');

    setTimeout(() => {
      const assistantMsg = { id: `msg-${Date.now()}-a`, sender: 'assistant', text: reply };
      setMessages(prev => [...prev, assistantMsg]);
      setStatus('idle');
    }, 1200);
  };

  // Exit screen safely
  const handleExitScreen = () => {
    saveCurrentSessionToHistory();
    setMessages([]);
    router.back();
  };

  const handleNewMessage = (userText) => {
    const userMsg = { id: `msg-${Date.now()}-u`, sender: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setStatus('speaking');

    // Simulate AI thinking and reply
    setTimeout(() => {
      const search = userText.toLowerCase();
      let replyText = `"${userText}" komandası təhlil edildi. SOS, Təcili Yardım və ya Polis çağırışlarından birini seçərək davam edə bilərsiniz.`;
      
      const matched = SUGGESTIONS.find(item => 
        search.includes(item.text.toLowerCase()) || 
        (item.desc && search.includes(item.desc.toLowerCase())) ||
        (item.badge && search.includes(item.badge.toLowerCase()))
      );

      if (matched) {
        replyText = matched.reply;
      } else if (search.includes('hekim') || search.includes('103') || search.includes('tibbi') || search.includes('təcili')) {
        replyText = SUGGESTIONS[0].reply;
      } else if (search.includes('sos') || search.includes('yaxın') || search.includes('aile')) {
        replyText = SUGGESTIONS[1].reply;
      } else if (search.includes('polis') || search.includes('102') || search.includes('asayiş')) {
        replyText = SUGGESTIONS[2].reply;
      } else if (search.includes('fhn') || search.includes('yanğın') || search.includes('112') || search.includes('alov')) {
        replyText = SUGGESTIONS[3].reply;
      } else if (search.includes('yardım') || search.includes('təlimat') || search.includes('ilkin')) {
        replyText = SUGGESTIONS[4].reply;
      }

      const assistantMsg = { id: `msg-${Date.now()}-a`, sender: 'assistant', text: replyText };
      setMessages(prev => [...prev, assistantMsg]);
      setStatus('idle');
    }, 1200);
  };

  const handleTextInputSubmit = () => {
    if (!inputText.trim()) return;
    handleNewMessage(inputText);
    setInputText('');
  };

  const toggleMicListening = async () => {
    if (status === 'listening') {
      try {
        await Voice.stop();
      } catch (e) {
        setStatus('idle');
      }
    } else {
      try {
        setStatus('listening');
        setIsTextInputVisible(false);
        await Voice.start('az-AZ');
      } catch (e) {
        setIsNativeAvailable(false);
        // Fallback Simulation for Expo Go
        setTimeout(() => {
          handleNewMessage('Təcili 103 tibbi yardım çağır');
        }, 2500);
      }
    }
  };

  const handleCopyText = (text) => {
    Clipboard.setStringAsync(text);
    Alert.alert('Kopyalandı', 'Asistentin cavabı kopyalandı.');
  };

  const handleRestoreSession = (session) => {
    // Save current active session if exists before restoring
    saveCurrentSessionToHistory();
    setMessages(session.messages);
    setShowHistory(false);
    setStatus('idle');
    setIsTextInputVisible(false);
  };

  const isChatActive = messages.length > 0;

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F4F5" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >

      {/* ── Centered Header ───────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleExitScreen} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={s(24)} color="#111827" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>AI asistant</Text>
        </View>
        
        {/* Top Right History Trigger */}
        <TouchableOpacity style={styles.historyBtn} onPress={() => setShowHistory(true)}>
          <MaterialCommunityIcons name="history" size={s(24)} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* ── Main Scrollable Messages / Welcome Area ── */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.mainContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section - Hides when chat is active */}
        {!isChatActive && (
          <View style={styles.welcomeSection}>
            <Text style={styles.greetingText}>Salam, Rüfət!</Text>
            <Text style={styles.promptText}>Mən BirköməkAI, sizə necə dəstək ola bilərəm?</Text>
          </View>
        )}

        {/* Conversation List Feed */}
        {isChatActive && (
          <View style={styles.chatSection}>
            {messages.map((msg) => (
              <View key={msg.id} style={styles.messageRow}>
                {msg.sender === 'user' ? (
                  /* User Message Bubble */
                  <View style={styles.userBubble}>
                    <Text style={styles.userBubbleText}>{msg.text}</Text>
                  </View>
                ) : (
                  /* Assistant Flat Response Text with Feedback Actions */
                  <View style={styles.assistantResponseContainer}>
                    <Text style={styles.assistantText}>{msg.text}</Text>
                    
                    <View style={styles.actionRow}>
                      <TouchableOpacity onPress={() => handleCopyText(msg.text)} style={styles.actionBtn}>
                        <Feather name="copy" size={s(18)} color="#4B5563" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionBtn}>
                        <Feather name="thumbs-up" size={s(18)} color="#4B5563" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionBtn}>
                        <Feather name="thumbs-down" size={s(18)} color="#4B5563" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))}

            {/* Waiting for reply waveform */}
            {status === 'speaking' && (
              <View style={styles.thinkingContainer}>
                <Animated.View
                  style={[
                    styles.waveRing,
                    {
                      transform: [{ scale: pulse1 }],
                      opacity: pulse1.interpolate({ inputRange: [1, 1.8], outputRange: [0.5, 0] }),
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.waveRing,
                    {
                      transform: [{ scale: pulse2 }],
                      opacity: pulse2.interpolate({ inputRange: [1, 1.8], outputRange: [0.5, 0] }),
                    },
                  ]}
                />
                <View style={styles.waveCenterDot} />
              </View>
            )}
          </View>
        )}

        {/* Suggestion Pills - Hides when chat is active */}
        {!isChatActive && (
          <View style={styles.pillsContainer}>
            {SUGGESTIONS.slice(0, 4).map((item, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleCommand(item.text, item.reply)}
                style={styles.pill}
                activeOpacity={0.8}
              >
                <View style={styles.pillLeft}>
                  <Feather name={item.icon === 'user' ? 'user' : 'activity'} size={s(16)} color="#4B5563" />
                  <Text style={styles.pillText}>{item.text}</Text>
                </View>
                {item.badge && (
                  <View style={[styles.pillBadge, { backgroundColor: item.badgeColor }]}>
                    <Text style={styles.pillBadgeText}>{item.badge}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {/* Daha çox dropdown trigger */}
            <TouchableOpacity
              onPress={() => setShowSheet(true)}
              style={styles.pillMore}
              activeOpacity={0.8}
            >
              <Text style={styles.pillMoreText}>Daha çox</Text>
              <Feather name="chevron-down" size={s(16)} color="#111827" />
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* ── Bottom Controls Section ────────────────── */}
      <View style={styles.bottomControls}>
        
        {(!isChatActive || isTextInputVisible) ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="İstədiyinizi soruşun"
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleTextInputSubmit}
            />
            <TouchableOpacity
              onPress={toggleMicListening}
              style={[
                styles.micCircleBtn,
                status === 'listening' && { backgroundColor: '#EF4444' }
              ]}
            >
              <Ionicons name="mic-sharp" size={s(20)} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.activeControlsBar}>
            {/* Left: Edit button (Resets session to default welcome screen) */}
            <TouchableOpacity
              onPress={() => {
                saveCurrentSessionToHistory();
                setMessages([]);
                setStatus('idle');
                setIsTextInputVisible(false);
              }}
              style={styles.circleBtn}
            >
              <Feather name="edit-2" size={s(20)} color="#4B5563" />
            </TouchableOpacity>

            {/* Center: Large animated colorful AI Avatar mascot */}
            <View style={styles.avatarMascotContainer}>
              {status !== 'idle' && (
                <>
                  <Animated.View
                    style={[
                      styles.avatarPulse,
                      {
                        transform: [{ scale: pulse1 }],
                        opacity: pulse1.interpolate({ inputRange: [1, 1.8], outputRange: [0.4, 0] }),
                      },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.avatarPulse,
                      {
                        transform: [{ scale: pulse2 }],
                        opacity: pulse2.interpolate({ inputRange: [1, 1.8], outputRange: [0.4, 0] }),
                      },
                    ]}
                  />
                </>
              )}
              <TouchableOpacity
                onPress={toggleMicListening}
                style={[
                  styles.avatarMascotCircle,
                  status === 'listening' && { borderColor: '#EF4444' }
                ]}
                activeOpacity={0.9}
              >
                <View style={styles.mascotCore}>
                  <View style={styles.mascotEyes}>
                    <View style={styles.mascotEye} />
                    <View style={styles.mascotEye} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Right: Keyboard button (Shows text input to write text) */}
            <TouchableOpacity
              onPress={() => {
                setIsTextInputVisible(true);
              }}
              style={styles.circleBtn}
            >
              <MaterialCommunityIcons name="keyboard-outline" size={s(22)} color="#4B5563" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      </KeyboardAvoidingView>

      {/* ── Capabilities Drawer Sheet ──────────────── */}
      <Modal
        visible={showSheet}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSheet(false)}
      >
        <View style={styles.sheetOverlay}>
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderLeft}>
                <View style={styles.logoCircle} />
                <Text style={styles.sheetLogoTitle}>BirköməkAI</Text>
              </View>
              <TouchableOpacity onPress={() => setShowSheet(false)} style={styles.sheetCloseBtn}>
                <Ionicons name="close" size={s(24)} color="#111827" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sheetSubtitle}>Hazırda aşağıdakıları edə bilərəm</Text>

            <ScrollView contentContainerStyle={styles.sheetScroll} showsVerticalScrollIndicator={false}>
              {SUGGESTIONS.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleCommand(item.text, item.reply)}
                  style={styles.sheetCard}
                  activeOpacity={0.9}
                >
                  <View style={styles.cardTop}>
                    <View style={styles.cardTitleRow}>
                      <Feather name={item.icon} size={s(18)} color="#2563EB" />
                      <Text style={styles.cardHeading}>{item.text}</Text>
                    </View>
                    {item.badge && (
                      <View style={[styles.cardBadge, { backgroundColor: item.badgeColor }]}>
                        <Text style={styles.cardBadgeText}>{item.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardDesc}>{item.desc}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Chat History Modal ────────────────────── */}
      <Modal
        visible={showHistory}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowHistory(false)}
      >
        <View style={styles.sheetOverlay}>
          <View style={styles.sheetContainer}>
            {/* Header */}
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderLeft}>
                <MaterialCommunityIcons name="history" size={s(24)} color="#2563EB" />
                <Text style={styles.sheetLogoTitle}>Yazışma Tarixçəsi</Text>
              </View>
              <TouchableOpacity onPress={() => setShowHistory(false)} style={styles.sheetCloseBtn}>
                <Ionicons name="close" size={s(24)} color="#111827" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sheetSubtitle}>Əvvəlki səsli söhbətləriniz</Text>

            {/* Past sessions list */}
            <ScrollView contentContainerStyle={styles.sheetScroll} showsVerticalScrollIndicator={false}>
              {pastSessions.length === 0 ? (
                <Text style={styles.emptyHistoryText}>Heç bir keçmiş yazışma tapılmadı.</Text>
              ) : (
                pastSessions.map((session) => (
                  <TouchableOpacity
                    key={session.id}
                    onPress={() => handleRestoreSession(session)}
                    style={styles.sheetCard}
                    activeOpacity={0.9}
                  >
                    <View style={styles.cardTop}>
                      <Text style={styles.cardHeading}>{session.title}</Text>
                      <Text style={styles.sessionDate}>{session.date}</Text>
                    </View>
                    <Text style={styles.cardDesc}>
                      {session.messages.length} mesajlı səsli söhbət. Bərpa etmək üçün toxunun.
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F4F4F5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingTop: s(16),
    paddingBottom: s(16),
    height: s(60),
    backgroundColor: '#F4F4F5',
  },
  backBtn: {
    padding: s(4),
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  headerTitle: {
    color: '#111827',
    fontSize: s(20),
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  robotBtn: {
    padding: s(4),
  },
  historyBtn: {
    padding: s(4),
  },
  mainContainer: {
    paddingHorizontal: s(24),
    paddingBottom: s(30),
  },
  welcomeSection: {
    marginTop: s(24),
    gap: s(4),
  },
  greetingText: {
    fontSize: s(18),
    fontWeight: '700',
    color: '#2563EB',
    fontFamily: 'Plus Jakarta Sans',
  },
  promptText: {
    fontSize: s(26),
    fontWeight: '900',
    color: '#111827',
    fontFamily: 'Plus Jakarta Sans',
    lineHeight: s(34),
  },
  chatSection: {
    marginTop: s(20),
    gap: s(20),
  },
  messageRow: {
    width: '100%',
  },
  userBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(20),
    paddingVertical: s(12),
    paddingHorizontal: s(20),
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    maxWidth: '85%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  userBubbleText: {
    fontSize: s(15),
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Plus Jakarta Sans',
  },
  assistantResponseContainer: {
    alignSelf: 'stretch',
    gap: s(12),
  },
  assistantText: {
    fontSize: s(15),
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: s(24),
    fontFamily: 'Plus Jakarta Sans',
  },
  actionRow: {
    flexDirection: 'row',
    gap: s(12),
    marginTop: s(4),
  },
  actionBtn: {
    width: s(36),
    height: s(36),
    borderRadius: s(18),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thinkingContainer: {
    width: s(40),
    height: s(40),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  waveRing: {
    position: 'absolute',
    width: s(36),
    height: s(36),
    borderRadius: s(18),
    backgroundColor: '#2563EB',
  },
  waveCenterDot: {
    width: s(8),
    height: s(8),
    borderRadius: s(4),
    backgroundColor: '#2563EB',
  },
  pillsContainer: {
    marginTop: s(30),
    gap: s(10),
    alignItems: 'flex-start',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: s(99),
    paddingVertical: s(12),
    paddingHorizontal: s(18),
    borderWidth: 1,
    borderColor: '#E4E4E7',
    minWidth: s(220),
    gap: s(12),
  },
  pillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  pillText: {
    fontSize: s(14),
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Plus Jakarta Sans',
  },
  pillBadge: {
    paddingHorizontal: s(8),
    paddingVertical: s(2),
    borderRadius: s(6),
  },
  pillBadgeText: {
    color: '#FFFFFF',
    fontSize: s(10),
    fontWeight: '800',
  },
  pillMore: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: s(99),
    paddingVertical: s(10),
    paddingHorizontal: s(18),
    gap: s(6),
  },
  pillMoreText: {
    fontSize: s(14),
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Plus Jakarta Sans',
  },
  bottomControls: {
    paddingHorizontal: s(24),
    paddingBottom: s(24),
    backgroundColor: '#F4F4F5',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: s(20),
    paddingLeft: s(18),
    paddingRight: s(6),
    height: s(56),
    borderWidth: 1,
    borderColor: '#E4E4E7',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: s(15),
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Plus Jakarta Sans',
  },
  micCircleBtn: {
    width: s(44),
    height: s(44),
    borderRadius: s(22),
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeControlsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: s(10),
  },
  circleBtn: {
    width: s(48),
    height: s(48),
    borderRadius: s(24),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  avatarMascotContainer: {
    width: s(80),
    height: s(80),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarPulse: {
    position: 'absolute',
    width: s(72),
    height: s(72),
    borderRadius: s(36),
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
  },
  avatarMascotCircle: {
    width: s(72),
    height: s(72),
    borderRadius: s(36),
    backgroundColor: '#E0F2FE',
    borderWidth: 3,
    borderColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  mascotCore: {
    width: s(44),
    height: s(44),
    borderRadius: s(22),
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mascotEyes: {
    flexDirection: 'row',
    gap: s(8),
  },
  mascotEye: {
    width: s(6),
    height: s(6),
    borderRadius: s(3),
    backgroundColor: '#FFFFFF',
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#F4F4F5',
    borderTopLeftRadius: s(30),
    borderTopRightRadius: s(30),
    paddingTop: s(20),
    paddingHorizontal: s(20),
    maxHeight: '85%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: s(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  sheetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  logoCircle: {
    width: s(24),
    height: s(24),
    borderRadius: s(12),
    backgroundColor: '#2563EB',
  },
  sheetLogoTitle: {
    fontSize: s(16),
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Plus Jakarta Sans',
  },
  sheetCloseBtn: {
    padding: s(4),
  },
  sheetSubtitle: {
    fontSize: s(16),
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Plus Jakarta Sans',
    marginVertical: s(16),
  },
  sheetScroll: {
    paddingBottom: s(40),
    gap: s(12),
  },
  sheetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(20),
    padding: s(16),
    borderWidth: 1,
    borderColor: '#E4E4E7',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(6),
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    flex: 1,
  },
  cardHeading: {
    fontSize: s(15),
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Plus Jakarta Sans',
  },
  cardBadge: {
    paddingHorizontal: s(8),
    paddingVertical: s(2),
    borderRadius: s(6),
  },
  cardBadgeText: {
    color: '#FFFFFF',
    fontSize: s(10),
    fontWeight: '800',
  },
  cardDesc: {
    fontSize: s(13),
    color: '#6B7280',
    lineHeight: s(18),
    fontFamily: 'Plus Jakarta Sans',
  },
  emptyHistoryText: {
    fontSize: s(14),
    color: '#9CA3AF',
    textAlign: 'center',
    marginVertical: s(40),
    fontFamily: 'Plus Jakarta Sans',
  },
  sessionDate: {
    fontSize: s(11),
    color: '#9CA3AF',
    fontFamily: 'Plus Jakarta Sans',
  },
});
