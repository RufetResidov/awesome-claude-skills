import { StyleSheet, Text, View, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Border } from '../../constants/Theme';

export default function Onboarding() {
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme || 'light'];
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.logo, { color: activeColors.accent, fontFamily: 'PlusJakartaSans-Bold' }]}>
          Newsup
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80' }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: activeColors.text, fontFamily: 'PlusJakartaSans-Bold' }]}>
          Geleceğin Dijital Dünyasını Keşfet
        </Text>
        <Text style={[styles.description, { color: activeColors.textMuted, fontFamily: 'Inter-Regular' }]}>
          Fikirleri kullanıcı odaklı arayüzlere ve yüksek performanslı uygulamalara dönüştürüyoruz.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: activeColors.primary }]}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={[styles.buttonText, { color: activeColors.background, fontFamily: 'Inter-Medium' }]}>
            Başla
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.space_24,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.space_32,
  },
  logo: {
    fontSize: 24,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.space_24,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: Border.radius_lg,
  },
  content: {
    alignItems: 'center',
    marginBottom: Spacing.space_32,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: Spacing.space_12,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.space_16,
  },
  footer: {
    marginBottom: Spacing.space_24,
  },
  button: {
    height: 56,
    borderRadius: Border.radius_md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
  },
});
