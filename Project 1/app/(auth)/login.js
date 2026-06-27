import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Border } from '../../constants/Theme';

export default function Login() {
  const colorScheme = useColorScheme();
  const activeColors = Colors[colorScheme || 'light'];
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setError('Zəhmət olmasa bütün sahələri doldurun.');
      return;
    }
    if (!email.includes('@')) {
      setError('Düzgün e-poçt ünvanı daxil edin.');
      return;
    }
    setError('');
    // Navigate to Topic Picker
    router.push('/(auth)/topics');
  };

  return (
    <View style={[styles.container, { backgroundColor: activeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: activeColors.text, fontFamily: 'PlusJakartaSans-Bold' }]}>
          Giriş Et
        </Text>
        <Text style={[styles.subtitle, { color: activeColors.textMuted, fontFamily: 'Inter-Regular' }]}>
          Newsup hesabınıza daxil olun
        </Text>
      </View>

      <View style={styles.form}>
        {error ? <Text style={[styles.errorText, { color: activeColors.error }]}>{error}</Text> : null}

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

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: activeColors.text, fontFamily: 'Inter-Medium' }]}>Şifrə</Text>
          <TextInput
            style={[styles.input, { borderColor: activeColors.border, color: activeColors.text }]}
            placeholder="••••••••"
            placeholderTextColor={activeColors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.forgotButton} onPress={() => router.push('/(auth)/forgot')}>
          <Text style={[styles.forgotText, { color: activeColors.accent }]}>Şifrəni unutmusunuz?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: activeColors.primary }]} onPress={handleLogin}>
          <Text style={[styles.buttonText, { color: activeColors.background, fontFamily: 'Inter-Medium' }]}>
            Daxil Ol
          </Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={[styles.signupText, { color: activeColors.textMuted }]}>Hesabınız yoxdur?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={[styles.signupLink, { color: activeColors.accent }]}> Qeydiyyatdan keçin</Text>
          </TouchableOpacity>
        </View>
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
  errorText: {
    fontSize: 14,
    marginBottom: Spacing.space_16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: Spacing.space_24,
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
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: Spacing.space_4,
  },
  forgotText: {
    fontSize: 14,
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
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
