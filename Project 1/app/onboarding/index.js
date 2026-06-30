import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DESIGN_WIDTH = 375;
const scale = SCREEN_WIDTH / DESIGN_WIDTH;

function s(size) {
  return Math.round(size * scale);
}

export default function Onboarding() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        {/* Progress Slider */}
        <View style={styles.sliderRow}>
          <View style={styles.sliderActive} />
          <View style={styles.sliderInactive} />
        </View>

        {/* Skip */}
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Phone Mockup Image Area */}
      <View style={styles.pictContainer}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
          }}
          style={styles.phoneImage}
          resizeMode="contain"
        />
      </View>

      {/* Bottom Text + Buttons */}
      <View style={styles.bottomContent}>
        {/* Title */}
        <Text style={styles.title}>
          <Text style={styles.titleBlue}>Explore and share </Text>
          <Text style={styles.titleDark}>stories that hold significance to you</Text>
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Embark on a journey to uncover and pass along the stories that carry
          personal meaning and importance to you, spreading their significance to others
        </Text>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Home Indicator */}
      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* ── Top Bar ── */
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(24),
    marginTop: s(20),
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  sliderActive: {
    width: s(31),
    height: s(4),
    borderRadius: 2,
    backgroundColor: '#2563EB',
  },
  sliderInactive: {
    width: s(11),
    height: s(4),
    borderRadius: 2,
    backgroundColor: '#8495B9',
    opacity: 0.3,
  },
  skipText: {
    color: '#8495B9',
    fontSize: s(16),
    fontWeight: '500',
    letterSpacing: 0.4,
    lineHeight: s(24),
  },

  /* ── Phone Mockup ── */
  pictContainer: {
    alignItems: 'center',
    marginTop: s(28),
    height: s(340),
  },
  phoneImage: {
    width: s(260),
    height: s(340),
    borderRadius: s(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: s(8) },
    shadowOpacity: 0.15,
    shadowRadius: s(20),
  },

  /* ── Bottom content ── */
  bottomContent: {
    flex: 1,
    paddingHorizontal: s(24),
    paddingTop: s(24),
    paddingBottom: s(16),
    justifyContent: 'space-between',
  },

  title: {
    width: s(327),
    textAlign: 'center',
    fontSize: s(24),
    fontWeight: '700',
    lineHeight: s(32),
    alignSelf: 'center',
  },
  titleBlue: {
    color: '#2563EB',
    fontSize: s(24),
    fontWeight: '700',
    lineHeight: s(32),
  },
  titleDark: {
    color: '#111827',
    fontSize: s(24),
    fontWeight: '700',
    lineHeight: s(32),
  },

  subtitle: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: s(14),
    fontWeight: '400',
    lineHeight: s(22),
    marginTop: s(12),
    alignSelf: 'center',
    width: s(327),
  },

  /* ── Buttons ── */
  buttonRow: {
    flexDirection: 'row',
    gap: s(12),
    marginTop: s(20),
    width: s(327),
    alignSelf: 'center',
  },
  loginButton: {
    flex: 1,
    height: s(56),
    paddingVertical: s(16),
    backgroundColor: '#FFFFFF',
    borderRadius: s(16),
    borderWidth: 1,
    borderColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#2563EB',
    fontSize: s(14),
    fontWeight: '700',
    lineHeight: s(22),
    textAlign: 'center',
  },
  getStartedButton: {
    flex: 1,
    height: s(56),
    paddingVertical: s(16),
    backgroundColor: '#111827',
    borderRadius: s(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: s(14),
    fontWeight: '700',
    lineHeight: s(22),
    textAlign: 'center',
  },

  /* ── Home Indicator ── */
  homeIndicator: {
    width: s(134),
    height: s(5),
    borderRadius: 100,
    backgroundColor: '#111827',
    alignSelf: 'center',
    marginBottom: s(8),
  },
});
