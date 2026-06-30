import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  Dimensions,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width: SW } = Dimensions.get('window');
const s = (n) => Math.round(n * (SW / 375));

// ─── Static data ─────────────────────────────────────────────────────────────
const INIT_COMMENTS = [
  {
    id: '1',
    name: 'Alex Mora Moa',
    time: '13 min ago',
    text: 'Russia withdraws troops near Ukraine. but I found the market price to recover quite slowly.',
    likes: 0,
    replies: 0,
    liked: false,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
  },
  {
    id: '2',
    name: 'Alex Mora Moa',
    time: '24 min ago',
    text: 'Bullish run is by the corner ,market is at an overbought level now',
    likes: 33,
    replies: 0,
    liked: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  },
  {
    id: '3',
    name: 'Alex Mora Moa',
    time: '30 min ago',
    text: 'Getting nervous, trying to clear up my schedule so i can stare at the screen for a  hr or so when US opens',
    likes: 8,
    replies: 0,
    liked: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
  },
  {
    id: '4',
    name: 'Alex Mora Moa',
    time: '45 min ago',
    text: "Glad I'm on this sinking ship with u all. Makes drowning less....awful?",
    likes: 0,
    replies: 0,
    liked: false,
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&q=80',
  },
];

// ─── Comment Item ─────────────────────────────────────────────────────────────
function CommentItem({ item, onToggleLike }) {
  return (
    <View style={styles.commentWrap}>
      {/* Avatar */}
      <Image source={{ uri: item.avatar }} style={styles.avatar} />

      {/* Content */}
      <View style={styles.commentContent}>
        {/* Name row */}
        <View style={styles.nameRow}>
          <View>
            <Text style={styles.commentName}>{item.name}</Text>
            <Text style={styles.commentTime}>{item.time}</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={s(20)} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Comment text */}
        <Text style={styles.commentText}>{item.text}</Text>

        {/* Actions */}
        <View style={styles.actions}>
          {/* Like pill */}
          <TouchableOpacity style={styles.pill} onPress={() => onToggleLike(item.id)}>
            <Ionicons
              name={item.liked ? 'heart' : 'heart-outline'}
              size={s(16)}
              color={item.liked ? '#DD3333' : '#9CA3AF'}
            />
            <Text style={[styles.pillText, item.liked && styles.pillTextLiked]}>
              {item.likes} Likes
            </Text>
          </TouchableOpacity>

          {/* Reply pill */}
          <TouchableOpacity style={styles.pill}>
            <Ionicons name="chatbubble-outline" size={s(16)} color="#9CA3AF" />
            <Text style={styles.pillText}>{item.replies} Replies</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function CommentsScreen() {
  const router = useRouter();
  const [comments, setComments] = useState(INIT_COMMENTS);
  const [text, setText] = useState('');

  function handleToggleLike(id) {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : c
      )
    );
  }

  function handleSend() {
    if (!text.trim()) return;
    const newComment = {
      id: String(Date.now()),
      name: 'You',
      time: 'Just now',
      text: text.trim(),
      likes: 0,
      replies: 0,
      liked: false,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    };
    setComments((prev) => [newComment, ...prev]);
    setText('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView style={styles.root}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* ── App bar ──────────────────────────────── */}
        <View style={styles.appBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={s(28)} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Comment</Text>
          <View style={{ width: s(44) }} />
        </View>

        {/* ── Comment list ──────────────────────────── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {comments.map((item) => (
            <CommentItem key={item.id} item={item} onToggleLike={handleToggleLike} />
          ))}
          <View style={{ height: s(20) }} />
        </ScrollView>

        {/* ── Bottom input bar ────────────────────────── */}
        <View style={styles.bottomBar}>
          <TextInput
            style={styles.input}
            placeholder="Type your comment..."
            placeholderTextColor="#9CA3AF"
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Ionicons name="send" size={s(18)} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Home indicator */}
        <View style={styles.homeIndicator} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },

  /* App bar */
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(16),
    height: s(56),
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: { width: s(44), height: s(44), justifyContent: 'center' },
  appBarTitle: {
    color: '#111827',
    fontSize: s(16),
    fontWeight: '700',
    lineHeight: s(25.6),
    textAlign: 'center',
  },

  /* List */
  listContent: {
    paddingHorizontal: s(24),
    paddingTop: s(24),
  },

  /* Comment item */
  commentWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(12),
    marginBottom: s(24),
  },
  avatar: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: '#F3F4F6',
  },
  commentContent: {
    flex: 1,
    gap: s(12),
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  commentName: {
    color: '#111827',
    fontSize: s(14),
    fontWeight: '700',
    lineHeight: s(22.4),
  },
  commentTime: {
    color: '#9CA3AF',
    fontSize: s(12),
    fontWeight: '500',
    lineHeight: s(19.2),
  },
  commentText: {
    color: '#111827',
    fontSize: s(12),
    fontWeight: '400',
    lineHeight: s(19.2),
  },

  /* Like / reply pills */
  actions: {
    flexDirection: 'row',
    gap: s(8),
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    paddingHorizontal: s(8),
    paddingVertical: s(4),
    backgroundColor: '#F9FAFB',
    borderRadius: s(1000),
  },
  pillText: {
    color: '#9CA3AF',
    fontSize: s(12),
    fontWeight: '500',
    lineHeight: s(19.2),
  },
  pillTextLiked: {
    color: '#DD3333',
  },

  /* Bottom bar */
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(24),
    paddingTop: s(12),
    paddingBottom: s(12),
    gap: s(12),
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F3F4F6',
  },
  input: {
    flex: 1,
    minHeight: s(44),
    maxHeight: s(100),
    backgroundColor: '#F9FAFB',
    borderRadius: s(100),
    paddingHorizontal: s(16),
    paddingVertical: s(10),
    fontSize: s(14),
    color: '#111827',
  },
  sendBtn: {
    width: s(44),
    height: s(44),
    borderRadius: s(22),
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Home indicator */
  homeIndicator: {
    width: s(134),
    height: s(5),
    borderRadius: 100,
    backgroundColor: '#111827',
    alignSelf: 'center',
    marginBottom: s(8),
    marginTop: s(4),
  },
});
