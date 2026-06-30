import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Border } from '../../constants/Theme';

export default function ForgotPassword() {
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme || 'light'];
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = () => {
    if (!email) {
      setMessage('Zəhmət olmasa e-poçt ünvanınızı daxil edin.');
      return;
    }
    setMessage('Şifrə sıfırlama linki e-poçtunuza göndərildi.');
  };

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: activeColors.text, fontFamily: 'PlusJakartaSans-Bold' }]}>
          Şifrə Sıfırlama
        </Text>
        <Text style={[styles.subtitle, { color: activeColors.textMuted, fontFamily: 'Inter-Regular' }]}>
          Qeydiyyatdan keçdiyiniz e-poçt ünvanını daxil edin
        </Text>
      </View>

      <View style={styles.form}>
        {message ? <Text style={[styles.messageText, { color: activeColors.text }]}>{message}</Text> : null}

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: activeColors.text, fontFamily: 'Inter-Medium' }]}>E-poçt</Text>
          <TextInput
            style={[styles.input, { borderColor: activeColors.border, color: activeColors.text }]}
            placeholder="e-poc-unvani@mail.com"
            placeholderTextColor={activeColors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: activeColors.primary }]} onPress={handleReset}>
          <Text style={[styles.buttonText, { color: activeColors.background, fontFamily: 'Inter-Medium' }]}>
            Göndər
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={[styles.backText, { color: activeColors.accent }]}>Geri qayıt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.space_24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: Spacing.space_32,
  },
  title: {
    fontSize: 28,
    marginBottom: Spacing.space_8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    marginBottom: Spacing.space_24,
  },
  messageText: {
    fontSize: 14,
    marginBottom: Spacing.space_16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: Spacing.space_20,
  },
  label: {
    fontSize: 14,
    marginBottom: Spacing.space_8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: Border.radius_md,
    paddingHorizontal: Spacing.space_16,
    fontSize: 16,
  },
  footer: {
    marginTop: Spacing.space_16,
  },
  button: {
    height: 56,
    borderRadius: Border.radius_md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.space_16,
  },
  buttonText: {
    fontSize: 18,
  },
  backButton: {
    alignSelf: 'center',
  },
  backText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
