import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  TextInput,
  Image,
  Modal,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { addEvent } from './history_store';

const { width: SW, height: SH } = Dimensions.get('window');
const s = (n) => Math.round(n * (SW / 393));

export default function SosReportScreen() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  
  // Custom Camera States
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [recordingVideo, setRecordingVideo] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const timerRef = useRef(null);
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState('back');
  const [hasPermission, setHasPermission] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedMediaType, setSelectedMediaType] = useState(null); // 'image' | 'video'

  const [isImageFullVisible, setIsImageFullVisible] = useState(false);
  const [fullImageUri, setFullImageUri] = useState(null);

  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const voiceTimerRef = useRef(null);

  const startVoiceRecording = () => {
    setIsRecordingVoice(true);
    setRecordingDuration(0);
    voiceTimerRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
  };

  const cancelVoiceRecording = () => {
    setIsRecordingVoice(false);
    if (voiceTimerRef.current) {
      clearInterval(voiceTimerRef.current);
    }
    setRecordingDuration(0);
  };

  const sendVoiceRecording = () => {
    if (voiceTimerRef.current) {
      clearInterval(voiceTimerRef.current);
    }
    const durationStr = formatDuration(recordingDuration);
    const ticketId = `ticket-${Date.now()}`;
    
    addEvent({
      id: ticketId,
      type: 'universal',
      title: 'Mərkəzi SOS (112)',
      status: 'Briqada Yoldadır',
      statusType: 'orange',
      date: 'Bugün, ' + new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' }),
      address: 'Bakı, Üzeyir Hacıbəyov küç., 34',
      attachments: [{
        type: 'audio',
        label: 'Səs Yazısı Arxivləndi',
        icon: 'waveform',
        color: '#E11D48',
      }],
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A'
    });

    const voiceMsg = {
      id: `user-voice-${Date.now()}`,
      sender: 'user',
      time: new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' }),
      isAudio: true,
      audioDuration: durationStr,
      avatar: require('../assets/avatar.jpg'),
    };
    setMessages(prev => [...prev, voiceMsg]);
    setIsRecordingVoice(false);

    setTimeout(() => {
      const assistantMsg = {
        id: `assist-msg-${Date.now()}`,
        sender: 'BirköməkAI',
        time: new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' }),
        text: `Səsli müraciətiniz uğurla qeydə alındı! Müraciətin gedişatını və canlı statusunu izləmək üçün Xidmət Tarixçəsinə keçid edə bilərsiniz.`,
        isSystemReply: true,
        ticketId: ticketId,
        orgInitials: 'BK',
      };
      setMessages(prev => [...prev, assistantMsg]);
    }, 1000);
  };

  const formatDuration = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleOpenFullImage = (uri) => {
    if (uri) {
      setFullImageUri(uri);
      setIsImageFullVisible(true);
    }
  };

  const renderWaveform = () => {
    const bars = [8, 14, 22, 10, 6, 18, 26, 20, 12, 16, 24, 18, 10, 14, 20, 8, 12, 22, 16, 6, 10, 18, 12, 14, 8];
    return (
      <View style={styles.waveformContainer}>
        {bars.map((h, i) => (
          <View key={i} style={[styles.waveformBar, { height: s(h) }]} />
        ))}
      </View>
    );
  };

  const handleOpenCamera = async () => {
    try {
      const status = await Camera.getCameraPermissionsAsync();
      if (status.granted) {
        setHasPermission(true);
        setIsCameraVisible(true);
        return;
      }
      const req = await Camera.requestCameraPermissionsAsync();
      if (req.granted) {
        setHasPermission(true);
        setIsCameraVisible(true);
      } else {
        Alert.alert('Kamera İcazəsi', 'Kameranı açmaq üçün icazə verməlisiniz.');
      }
    } catch (err) {
      console.log('Camera permission check error (using fallback):', err);
      setHasPermission(true);
      setIsCameraVisible(true);
    }
  };

  const startVideoRecording = () => {
    setRecordingVideo(true);
    setRecordTimer(0);
    timerRef.current = setInterval(() => {
      setRecordTimer(prev => prev + 1);
    }, 1000);
  };

  const stopVideoRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setRecordingVideo(false);
    setIsCameraVisible(false);
    
    // Set to local input media draft
    setSelectedMedia('https://images.unsplash.com/photo-1516156008625-3a9d6067ffd5?w=500');
    setSelectedMediaType('video');
    Alert.alert('Video yadda saxlanıldı', 'Çəkdiyiniz video daxiletmə qutusuna əlavə olundu.');
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setSelectedMedia(photo.uri);
        setSelectedMediaType('image');
        setIsCameraVisible(false);
        return;
      } catch (e) {
        console.log("Error taking photo:", e);
      }
    }
    // Fallback if cameraRef fails or simulator
    setSelectedMedia('https://images.unsplash.com/photo-1516156008625-3a9d6067ffd5?w=500');
    setSelectedMediaType('image');
    setIsCameraVisible(false);
    Alert.alert('Fotoşəkil çəkildi', 'Hadisə yerinin fotoşəkli daxiletmə qutusuna əlavə olundu.');
  };

  const handlePickFromGallery = async () => {
    setIsCameraVisible(false);
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Qalereya İcazəsi", "Şəkil seçmək üçün qalereya icazəsi verilməlidir.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedMedia(asset.uri);
        setSelectedMediaType(asset.type === 'video' ? 'video' : 'image');
      }
    } catch (err) {
      console.log('Gallery picker error:', err);
    }
  };

  const handleSendMessage = () => {
    Keyboard.dismiss();
    if (!inputText.trim()) {
      Alert.alert('Mətn tələb olunur', 'Yalnız boş media göndərmək mümkün deyil. Problemi təsvir edən mətn yazın.');
      return;
    }
    
    // Semantic emergency content analyzer
    const textLower = inputText.toLowerCase();
    let type = 'universal';
    let title = 'Mərkəzi SOS (112)';
    let bgColor = '#FFFBEB';
    let borderColor = '#FDE68A';
    
    if (textLower.includes('yanğın') || textLower.includes('alov') || textLower.includes('tüstü') || textLower.includes('fhn') || textLower.includes('yanir') || textLower.includes('söndür')) {
      type = '112';
      title = '112 FHN / Yanğın';
      bgColor = '#FFFBEB';
      borderColor = '#FDE68A';
    } else if (textLower.includes('həkim') || textLower.includes('təcili') || textLower.includes('ambulans') || textLower.includes('xəstə') || textLower.includes('qəza') || textLower.includes('infarkt') || textLower.includes('103')) {
      type = '103';
      title = '103 Təcili Tibbi Yardım';
      bgColor = '#FFF1F1';
      borderColor = '#FCA5A5';
    } else if (textLower.includes('polis') || textLower.includes('oğru') || textLower.includes('dava') || textLower.includes('təhlükə') || textLower.includes('hücum') || textLower.includes('102') || textLower.includes('oğurluq')) {
      type = '102';
      title = '102 Polis';
      bgColor = '#EEF2FF';
      borderColor = '#C7D2FE';
    }

    const ticketId = `ticket-${Date.now()}`;
    const attachments = [];
    if (selectedMedia) {
      attachments.push({
        type: selectedMediaType,
        label: selectedMediaType === 'video' ? 'Video Yazısı Arxivləndi' : 'Hadisə Anı Fotosu Arxivləndi',
        icon: selectedMediaType === 'video' ? 'video-outline' : 'image-outline',
        color: '#2563EB',
        uri: selectedMedia
      });
    }

    // Add to shared store
    addEvent({
      id: ticketId,
      type,
      title,
      status: 'Briqada Yoldadır',
      statusType: 'orange',
      date: 'Bugün, ' + new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' }),
      address: 'Bakı, Üzeyir Hacıbəyov küç., 34',
      attachments,
      bgColor,
      borderColor
    });

    // Add user message locally to screen conversation list
    const userMsg = {
      id: `user-msg-${Date.now()}`,
      sender: 'Rüfət Rəşidov',
      time: new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' }),
      text: inputText,
      image: selectedMedia,
      isVideo: selectedMediaType === 'video',
      avatar: require('../assets/avatar.jpg'),
    };
    setMessages(prev => [...prev, userMsg]);

    // Reset editor inputs
    setInputText('');
    setSelectedMedia(null);
    setSelectedMediaType(null);

    // Compute orgInitials initials based on type
    let orgInitials = 'BK';
    if (type === '112') orgInitials = 'FHN';
    else if (type === '103') orgInitials = 'TTY';
    else if (type === '102') orgInitials = 'DİN';

    // Simulate system message reply after 1000ms
    setTimeout(() => {
      const assistantMsg = {
        id: `assist-msg-${Date.now()}`,
        sender: 'BirköməkAI',
        time: new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' }),
        text: `Müraciətiniz uğurla qeydə alındı! Müraciətin gedişatını və canlı statusunu izləmək üçün Xidmət Tarixçəsinə keçid edə bilərsiniz.`,
        isSystemReply: true,
        ticketId: ticketId,
        orgInitials: orgInitials,
      };
      setMessages(prev => [...prev, assistantMsg]);
    }, 1000);
  };

  const GALLERY_PREVIEWS = [
    { id: 1, color: '#4B5563' },
    { id: 2, color: '#3B82F6' },
    { id: 3, color: '#EF4444' },
    { id: 4, color: '#10B981' },
    { id: 5, color: '#F59E0B' },
    { id: 6, color: '#6D28D9' },
  ];

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F4F5" />

      {/* ── Header ────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={s(24)} color="#111827" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Birkömək</Text>
        </View>
        
      </View>

      {/* ── Full-Screen Image Viewer Modal ────────── */}
      <Modal
        visible={isImageFullVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsImageFullVisible(false)}
      >
        <TouchableOpacity
          style={styles.fullImageOverlay}
          activeOpacity={1}
          onPress={() => setIsImageFullVisible(false)}
        >
          <View style={styles.fullImageContainer}>
            {fullImageUri && (
              <Image source={{ uri: fullImageUri }} style={styles.fullImage} />
            )}
            <TouchableOpacity style={styles.fullImageCloseBtn} onPress={() => setIsImageFullVisible(false)}>
              <Ionicons name="close-circle" size={s(36)} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? s(0) : s(20)}
      >
        {/* ── Scrollable Content ────────────────────── */}
      <ScrollView contentContainerStyle={styles.feedScroll} showsVerticalScrollIndicator={false}>
        {messages.length === 0 ? (
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeBlue}>Salam, Rüfət!</Text>
            <Text style={styles.welcomeMain}>Mən Birkömək, sizə necə dəstək ola bilərəm?</Text>
          </View>
        ) : (
          messages.map(msg => {
            const isUser = msg.sender === 'user' || msg.sender === 'Rüfət Rəşidov';
            
            if (isUser) {
              return (
                <View key={msg.id} style={styles.userBubbleContainer}>
                  <View style={styles.avatarWrapper}>
                    <Image source={msg.avatar || require('../assets/avatar.jpg')} style={styles.cardAvatar} />
                    <View style={styles.activeDot} />
                  </View>

                  <View style={styles.userBubble}>
                    {/* User Image */}
                    {msg.image && (
                      <View style={styles.userImageWrapper}>
                        <TouchableOpacity onPress={() => handleOpenFullImage(msg.image)}>
                          <Image source={{ uri: msg.image }} style={styles.userImage} />
                        </TouchableOpacity>
                        <View style={styles.imageMetaRow}>
                          <Feather name="download" size={s(15)} color="#475569" />
                          <Text style={styles.imageMetaSize}>{msg.fileSize || '120 KB'}</Text>
                          <Text style={styles.imageMetaName} numberOfLines={1}>{msg.fileName || 'face-scar.jpg'}</Text>
                        </View>
                      </View>
                    )}

                    {/* User Audio Waveform */}
                    {msg.isAudio && (
                      <View style={styles.audioBubbleRow}>
                        <TouchableOpacity style={styles.playBtnCircle}>
                          <Ionicons name="play" size={s(15)} color="#2563EB" style={{ marginLeft: s(2) }} />
                        </TouchableOpacity>
                        {renderWaveform()}
                      </View>
                    )}

                    {/* User Text */}
                    {msg.text ? <Text style={styles.userBubbleText}>{msg.text}</Text> : null}
                    
                    <View style={styles.bubbleFooter}>
                      {msg.isAudio && <Text style={styles.audioDurationText}>{msg.audioDuration}</Text>}
                      <Text style={styles.userTimeText}>{msg.time || '11:25'}</Text>
                      <Ionicons name="checkmark-done" size={s(15)} color="rgba(255,255,255,0.6)" />
                    </View>
                  </View>
                </View>
              );
            } else {
              // Assistant Bubble Layout
              return (
                <View key={msg.id} style={styles.assistantBubbleContainer}>
                  <View style={styles.assistantBubble}>
                    {/* Document Box */}
                    {msg.docFile && (
                      <View style={styles.docWrapper}>
                        <View style={styles.docHeader}>
                          <MaterialCommunityIcons name="file-document" size={s(28)} color="#2563EB" />
                          <View style={styles.docTextCol}>
                            <Text style={styles.docName} numberOfLines={1}>{msg.docFile.name}</Text>
                            <Text style={styles.docSize}>{msg.docFile.size}</Text>
                          </View>
                        </View>
                      </View>
                    )}

                    {/* Text response */}
                    {msg.text ? <Text style={styles.assistantBubbleText}>{msg.text}</Text> : null}

                    {/* Go to History (system action button) */}
                    {msg.isSystemReply && (
                      <TouchableOpacity
                        onPress={() => router.push(`/history/${msg.ticketId}`)}
                        style={styles.goToHistoryBtn}
                      >
                        <Text style={styles.goToHistoryText}>Canlı İzləyin</Text>
                        <Ionicons name="arrow-forward" size={s(16)} color="#FFFFFF" />
                      </TouchableOpacity>
                    )}

                    <View style={styles.assistantFooter}>
                      <Text style={styles.assistantTimeText}>{msg.time || '11:25'}</Text>
                      <Ionicons name="checkmark-done" size={s(15)} color="#22C55E" />
                    </View>
                  </View>

                  {/* Verified Assistant initials avatar on the right */}
                  <View style={styles.verifiedAvatarContainer}>
                    <View style={styles.assistantAvatarWrapper}>
                      <View style={[styles.cardAvatar, styles.avatarPlaceholder, { backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#E0E7FF' }]}>
                        <Text style={styles.assistantInitialsText}>{msg.orgInitials || 'BK'}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }
          })
        )}
      </ScrollView>

      {/* ── Premium Input Editor Box ──────────────── */}
      <View style={styles.editorContainer}>
        {isRecordingVoice ? (
          <View style={styles.recordingPanel}>
            {/* Top Row: Timer and Sound Waveform */}
            <View style={styles.recTopRow}>
              <Text style={styles.recTimerText}>{formatDuration(recordingDuration)}</Text>
              <View style={styles.recWaveform}>
                {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25].map((bar) => {
                  const h = Math.floor(Math.sin(bar + recordingDuration) * 8 + 12);
                  return <View key={bar} style={[styles.recWaveBar, { height: s(h) }]} />;
                })}
              </View>
            </View>

            {/* Bottom Row: Trash icon, red pause, and send button */}
            <View style={styles.recBottomRow}>
              <TouchableOpacity onPress={cancelVoiceRecording} style={styles.recTrashBtn}>
                <Feather name="trash-2" size={s(20)} color="#9CA3AF" />
              </TouchableOpacity>

              <View style={styles.recPauseContainer}>
                <View style={styles.pauseBar} />
                <View style={styles.pauseBar} />
              </View>

              <TouchableOpacity onPress={sendVoiceRecording} style={styles.recSendBtn}>
                <Feather name="arrow-up" size={s(20)} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.blueInputBox}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                multiline
                value={inputText}
                onChangeText={setInputText}
              />
            </View>

            {/* Media preview inside input container */}
            {selectedMedia && (
              <View style={styles.inputMediaWrapper}>
                <TouchableOpacity onPress={() => handleOpenFullImage(selectedMedia)}>
                  <Image source={{ uri: selectedMedia }} style={styles.inputMediaThumbnail} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedMedia(null);
                    setSelectedMediaType(null);
                  }}
                  style={styles.removeMediaBtn}
                >
                  <Ionicons name="close-circle" size={s(22)} color="#EF4444" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.editorFooter}>
              {/* Plus button to open camera */}
              <TouchableOpacity
                onPress={handleOpenCamera}
                style={styles.plusBtn}
              >
                <Feather name="plus" size={s(20)} color="#2563EB" />
              </TouchableOpacity>

              <View style={styles.rightButtonsRow}>
                {/* Microphone icon button */}
                <TouchableOpacity onPress={startVoiceRecording} style={styles.micBtn}>
                  <Ionicons name="mic-sharp" size={s(19)} color="#2563EB" />
                </TouchableOpacity>

                {/* Upload send button */}
                <TouchableOpacity
                  onPress={handleSendMessage}
                  style={styles.sendBtn}
                >
                  <Feather name="arrow-up" size={s(20)} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>

      {/* ── Custom Camera Full-Screen Modal ────────── */}
      <Modal
        visible={isCameraVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsCameraVisible(false)}
      >
        <SafeAreaView style={styles.cameraRoot}>
          <StatusBar barStyle="light-content" backgroundColor="#000000" />

          {/* Camera Top Bar */}
          <View style={styles.cameraHeader}>
            <TouchableOpacity
              onPress={() => {
                if (recordingVideo) stopVideoRecording();
                setIsCameraVisible(false);
              }}
              style={styles.camCloseBtn}
            >
              <Ionicons name="close" size={s(28)} color="#FFFFFF" />
            </TouchableOpacity>

            {recordingVideo && (
              <View style={styles.timerBadge}>
                <View style={styles.timerDot} />
                <Text style={styles.timerText}>
                  {Math.floor(recordTimer / 60)}:{(recordTimer % 60).toString().padStart(2, '0')}
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={() => setFlashOn(!flashOn)}
              style={styles.camFlashBtn}
            >
              <Ionicons
                name={flashOn ? "flash" : "flash-off"}
                size={s(24)}
                color={flashOn ? "#FBBF24" : "#FFFFFF"}
              />
            </TouchableOpacity>
          </View>

          {/* Camera Viewfinder */}
          <View style={[styles.viewfinder, { overflow: 'hidden' }]}>
            {hasPermission ? (
              <CameraView
                style={StyleSheet.absoluteFillObject}
                facing={facing}
                flash={flashOn ? 'on' : 'off'}
                enableTorch={flashOn}
                mode={recordingVideo ? 'video' : 'picture'}
                ref={cameraRef}
              />
            ) : (
              <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="camera-reverse" size={s(48)} color="#FFFFFF" opacity={0.2} />
              </View>
            )}
            <Text style={styles.viewfinderHelpText}>
              {recordingVideo ? 'Video yazılır (buraxdıqda bitir)...' : 'Foto üçün toxunun • Video üçün basıb saxlayın'}
            </Text>
          </View>

          {/* Bottom Previews and Shutter Controls */}
          <View style={styles.cameraFooter}>
            
            {/* Shutter Bar Controls (Clean design - no magic filter/edit icon) */}
            <View style={styles.shutterBar}>
              {/* Gallery icon */}
              <TouchableOpacity onPress={handlePickFromGallery} style={styles.camActionBtn}>
                <Ionicons name="images-outline" size={s(22)} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Shutter Button (Click = Photo, Hold = Video) */}
              <TouchableOpacity
                onPress={takePhoto}
                onLongPress={startVideoRecording}
                onPressOut={() => {
                  if (recordingVideo) {
                    stopVideoRecording();
                  }
                }}
                style={styles.shutterOuterRing}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.shutterInnerCircle,
                  recordingVideo && { backgroundColor: '#EF4444', borderRadius: s(8), transform: [{ scale: 0.8 }] }
                ]} />
              </TouchableOpacity>

              {/* Flip camera */}
              <TouchableOpacity
                onPress={() => setFacing(prev => prev === 'back' ? 'front' : 'back')}
                style={styles.camActionBtn}
              >
                <Ionicons name="camera-reverse-outline" size={s(22)} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

        </SafeAreaView>
      </Modal>

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
  settingsBtn: {
    padding: s(4),
  },
  feedScroll: {
    padding: s(16),
    gap: s(20),
  },
  
  // User Bubble Styles
  userBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    gap: s(8),
    marginBottom: s(10),
  },
  avatarWrapper: {
    position: 'relative',
  },
  activeDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: s(10),
    height: s(10),
    borderRadius: s(5),
    backgroundColor: '#22C55E',
    borderWidth: 1.5,
    borderColor: '#F4F4F5',
  },
  userBubble: {
    backgroundColor: '#2563EB',
    borderRadius: s(18),
    borderTopLeftRadius: s(4),
    padding: s(12),
    maxWidth: '82%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  userImageWrapper: {
    borderRadius: s(12),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2563EB',
    overflow: 'hidden',
    marginBottom: s(8),
  },
  userImage: {
    width: '100%',
    height: s(180),
    resizeMode: 'cover',
  },
  imageMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: s(8),
    backgroundColor: '#FFFFFF',
    gap: s(6),
  },
  imageMetaSize: {
    fontSize: s(10),
    fontWeight: '600',
    color: '#64748B',
  },
  imageMetaName: {
    fontSize: s(11),
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    textAlign: 'right',
  },
  userBubbleText: {
    fontSize: s(14),
    color: '#FFFFFF',
    lineHeight: s(20),
    fontFamily: 'Plus Jakarta Sans',
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: s(6),
    gap: s(4),
  },
  userTimeText: {
    fontSize: s(10),
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Plus Jakarta Sans',
  },

  // Audio wave styles
  audioBubbleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    marginBottom: s(4),
    width: s(220),
  },
  playBtnCircle: {
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: s(32),
    gap: s(2.5),
    flex: 1,
  },
  waveformBar: {
    width: s(2.5),
    borderRadius: s(1),
    backgroundColor: '#FFFFFF',
  },
  audioDurationText: {
    fontSize: s(10),
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '700',
    marginRight: 'auto',
  },

  // Assistant Bubble Styles
  assistantBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    width: '100%',
    gap: s(8),
    marginBottom: s(10),
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(18),
    borderTopRightRadius: s(4),
    borderWidth: 1,
    borderColor: '#E4E4E7',
    padding: s(12),
    maxWidth: '82%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  assistantBubbleText: {
    fontSize: s(14),
    color: '#1F2937',
    lineHeight: s(20),
    fontFamily: 'Plus Jakarta Sans',
  },
  assistantFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: s(6),
    gap: s(4),
  },
  assistantTimeText: {
    fontSize: s(10),
    color: '#9CA3AF',
    fontFamily: 'Plus Jakarta Sans',
  },
  verifiedAvatarContainer: {
    alignSelf: 'flex-start',
    marginTop: s(4),
  },
  verifiedShieldCircle: {
    width: s(24),
    height: s(24),
    borderRadius: s(12),
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  assistantAvatarWrapper: {
    position: 'relative',
    width: s(40),
    height: s(40),
  },
  verifiedShieldOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: s(16),
    height: s(16),
    borderRadius: s(8),
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  assistantInitialsText: {
    fontSize: s(13),
    fontWeight: '800',
    color: '#2563EB',
    fontFamily: 'Plus Jakarta Sans',
  },
  recordingPanel: {
    backgroundColor: '#F4F4F5',
    borderRadius: s(24),
    padding: s(16),
    borderWidth: 1,
    borderColor: '#E4E4E7',
    gap: s(12),
  },
  recTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(8),
  },
  recTimerText: {
    fontSize: s(18),
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Plus Jakarta Sans',
  },
  recWaveform: {
    flexDirection: 'row',
    alignItems: 'center',
    height: s(24),
    gap: s(3),
  },
  recWaveBar: {
    width: s(3),
    backgroundColor: '#9CA3AF',
    borderRadius: s(1.5),
  },
  recBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recTrashBtn: {
    padding: s(8),
  },
  recPauseContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: s(4),
  },
  pauseBar: {
    width: s(4),
    height: s(20),
    backgroundColor: '#EF4444',
    borderRadius: s(2),
  },
  recSendBtn: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  docWrapper: {
    backgroundColor: '#F8FAFC',
    borderRadius: s(12),
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: s(10),
    marginBottom: s(8),
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  docTextCol: {
    flex: 1,
  },
  docName: {
    fontSize: s(13),
    fontWeight: '700',
    color: '#1E293B',
  },
  docSize: {
    fontSize: s(11),
    color: '#64748B',
    marginTop: s(2),
  },

  cardAvatar: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
  },
  avatarPlaceholder: {
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardName: {
    fontSize: s(14),
    fontWeight: '700',
    color: '#111827',
    fontFamily: 'Plus Jakarta Sans',
  },
  cardTime: {
    fontSize: s(12),
    color: '#9CA3AF',
    fontFamily: 'Plus Jakarta Sans',
  },
  cardText: {
    fontSize: s(14),
    color: '#4B5563',
    lineHeight: s(22),
    fontFamily: 'Plus Jakarta Sans',
  },
  editorContainer: {
    paddingHorizontal: s(16),
    paddingBottom: s(20),
    backgroundColor: '#F4F4F5',
    paddingTop: s(12),
  },
  blueInputBox: {
    borderWidth: 1.5,
    borderColor: '#2563EB',
    borderRadius: s(24),
    padding: s(12),
    backgroundColor: '#FFFFFF',
    minHeight: s(120),
    justifyContent: 'space-between',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textInput: {
    flex: 1,
    fontSize: s(15),
    color: '#111827',
    lineHeight: s(22),
    fontFamily: 'Plus Jakarta Sans',
    paddingTop: 0,
    minHeight: s(60),
    textAlignVertical: 'top',
  },
  expandBtn: {
    padding: s(4),
  },
  editorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: s(10),
  },
  plusBtn: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtn: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  micBtn: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Camera screen styles
  cameraRoot: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    height: s(60),
    zIndex: 100,
  },
  camCloseBtn: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camFlashBtn: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    paddingHorizontal: s(12),
    paddingVertical: s(6),
    borderRadius: s(20),
    gap: s(6),
  },
  timerDot: {
    width: s(8),
    height: s(8),
    borderRadius: s(4),
    backgroundColor: '#FFFFFF',
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: s(13),
    fontWeight: '700',
  },
  viewfinder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  viewfinderImage: {
    width: s(140),
    height: s(140),
    opacity: 0.15,
    tintColor: '#FFFFFF',
  },
  viewfinderHelpText: {
    color: '#FFFFFF',
    fontSize: s(13),
    fontWeight: '600',
    textAlign: 'center',
    position: 'absolute',
    bottom: s(20),
    fontFamily: 'Plus Jakarta Sans',
  },
  cardImage: {
    width: '100%',
    height: s(200),
    borderRadius: s(12),
    marginTop: s(12),
    resizeMode: 'cover',
  },
  welcomeSection: {
    paddingTop: s(40),
    paddingHorizontal: s(8),
    gap: s(6),
  },
  welcomeBlue: {
    fontSize: s(20),
    fontWeight: '700',
    color: '#2563EB',
    fontFamily: 'Plus Jakarta Sans',
  },
  welcomeMain: {
    fontSize: s(30),
    fontWeight: '800',
    color: '#111827',
    lineHeight: s(38),
    fontFamily: 'Plus Jakarta Sans',
    marginTop: s(4),
  },
  inputMediaWrapper: {
    position: 'relative',
    width: s(80),
    height: s(80),
    borderRadius: s(12),
    marginVertical: s(10),
    overflow: 'visible',
  },
  inputMediaThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: s(12),
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  removeMediaBtn: {
    position: 'absolute',
    top: s(-8),
    right: s(-8),
    backgroundColor: '#FFFFFF',
    borderRadius: s(11),
  },
  goToHistoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: s(12),
    paddingVertical: s(10),
    paddingHorizontal: s(16),
    marginTop: s(12),
    gap: s(6),
  },
  goToHistoryText: {
    color: '#FFFFFF',
    fontSize: s(14),
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  fullImageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImageContainer: {
    width: '90%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  fullImageCloseBtn: {
    position: 'absolute',
    top: s(20),
    right: s(20),
  },
  cameraFooter: {
    paddingBottom: s(30),
    gap: s(20),
  },
  galleryStrip: {
    paddingHorizontal: s(20),
    gap: s(8),
    height: s(70),
  },
  galleryThumb: {
    width: s(60),
    height: s(60),
    borderRadius: s(10),
    opacity: 0.8,
  },
  shutterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(30),
  },
  camActionBtn: {
    width: s(48),
    height: s(48),
    borderRadius: s(24),
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterOuterRing: {
    width: s(80),
    height: s(80),
    borderRadius: s(40),
    borderWidth: 5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInnerCircle: {
    width: s(62),
    height: s(62),
    borderRadius: s(31),
    backgroundColor: '#FFFFFF',
  },
});
