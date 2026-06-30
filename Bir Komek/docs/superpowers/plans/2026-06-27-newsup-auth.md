# Newsup Authentication Flow & Topic Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the authentication screens (Login, Sign Up, Verify, Forgot Password) and the interactive Topic Picker screen to route users to the main application tabs.

**Architecture:** Use Expo Router group folder `app/(auth)/` to separate authentication layouts, styling with `constants/Theme.js` tokens, and React Native Context to simulate authenticated state.

**Tech Stack:** React Native, Expo Go, Expo Router, Javascript.

## Global Constraints
- Target Framework: Expo Go
- Navigation: Expo Router Stack routing inside `app/(auth)/` group
- Styling: React Native `StyleSheet` referencing `constants/Theme.js`
- Forms: State-managed form inputs (Email, Password, Name) with validations

---

### Task 1: Auth Group Layout & Routing Configuration

**Files:**
- Create: `app/(auth)/_layout.js`

**Interfaces:**
- Consumes: Theme colors and styling from `constants/Theme.js`
- Produces: Stack navigation layout configuration for all authentication screens.

- [ ] **Step 1: Write auth _layout.js**
  
  Write the stack navigation configuration inside `app/(auth)/_layout.js`:
  ```javascript
  import { Stack } from 'expo-router';
  import { useColorScheme } from 'react-native';

  export default function AuthLayout() {
    const colorScheme = useColorScheme();
    return (
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#FAFAFA',
          },
        }}
      />
    );
  }
  ```

- [ ] **Step 2: Commit routing configuration**
  
  Run: `git add app/(auth)/_layout.js`
  Run: `git commit -m "chore: setup authentication routing layout group"`
  Expected: Commit succeeds.

---

### Task 2: Login Screen Implementation

**Files:**
- Create: `app/(auth)/login.js`

**Interfaces:**
- Consumes: Colors, Spacing from `constants/Theme.js`
- Produces: A styled Login form screen navigating to Sign Up, Forgot Password, or Topic Picker upon success.

- [ ] **Step 1: Implement login screen**
  
  Write login form state, fields, validations, and custom styles inside `app/(auth)/login.js`:
  ```javascript
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
  ```

- [ ] **Step 2: Commit login screen**
  
  Run: `git add app/(auth)/login.js`
  Run: `git commit -m "feat: implement styled user login screen with validation"`
  Expected: Commit succeeds.

---

### Task 3: Sign Up and Password Reset Screens

**Files:**
- Create: `app/(auth)/signup.js`
- Create: `app/(auth)/forgot.js`

**Interfaces:**
- Consumes: Colors, Spacing from `constants/Theme.js`
- Produces: Sign Up form and Forgot Password interface.

- [ ] **Step 1: Implement signup screen**
  
  Write sign up form inside `app/(auth)/signup.js`:
  ```javascript
  import { useState } from 'react';
  import { StyleSheet, Text, View, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
  import { useRouter } from 'expo-router';
  import { Colors, Spacing, Border } from '../../constants/Theme';

  export default function SignUp() {
    const colorScheme = useColorScheme();
    const activeColors = Colors[colorScheme || 'light'];
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = () => {
      if (!name || !email || !password) {
        setError('Zəhmət olmasa bütün sahələri doldurun.');
        return;
      }
      if (!email.includes('@')) {
        setError('Düzgün e-poçt ünvanı daxil edin.');
        return;
      }
      setError('');
      router.push('/(auth)/topics');
    };

    return (
      <View style={[styles.container, { backgroundColor: activeColors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: activeColors.text, fontFamily: 'PlusJakartaSans-Bold' }]}>
            Qeydiyyat
          </Text>
          <Text style={[styles.subtitle, { color: activeColors.textMuted, fontFamily: 'Inter-Regular' }]}>
            Yeni Newsup hesabı yaradın
          </Text>
        </View>

        <View style={styles.form}>
          {error ? <Text style={[styles.errorText, { color: activeColors.error }]}>{error}</Text> : null}

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: activeColors.text, fontFamily: 'Inter-Medium' }]}>Ad Soyad</Text>
            <TextInput
              style={[styles.input, { borderColor: activeColors.border, color: activeColors.text }]}
              placeholder="Rufət Rəşidov"
              placeholderTextColor={activeColors.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>

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
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: activeColors.primary }]} onPress={handleSignUp}>
            <Text style={[styles.buttonText, { color: activeColors.background, fontFamily: 'Inter-Medium' }]}>
              Hesab Yarat
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: activeColors.textMuted }]}>Hesabınız var?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={[styles.loginLink, { color: activeColors.accent }]}> Giriş edin</Text>
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
      marginBottom: Spacing.space_24,
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
      marginBottom: Spacing.space_16,
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
    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginText: {
      fontSize: 14,
    },
    loginLink: {
      fontSize: 14,
      fontWeight: 'bold',
    },
  });
  ```

- [ ] **Step 2: Implement forgot password screen**
  
  Write password recovery flow inside `app/(auth)/forgot.js`:
  ```javascript
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
  ```

- [ ] **Step 3: Commit SignUp and Forgot Password screens**
  
  Run: `git add app/(auth)/signup.js app/(auth)/forgot.js`
  Run: `git commit -m "feat: implement user registration and password reset screens"`
  Expected: Commit succeeds.

---

### Task 4: Interactive Topic Picker (Mövzu Seçimi) Screen

**Files:**
- Create: `app/(auth)/topics.js`

**Interfaces:**
- Consumes: Colors, Spacing from `constants/Theme.js`
- Produces: Grid layout of topics allowing multiple selection and routing users to `(tabs)` root.

- [ ] **Step 1: Implement topics selection view**
  
  Write a multi-select grid inside `app/(auth)/topics.js`:
  ```javascript
  import { useState } from 'react';
  import { StyleSheet, Text, View, TouchableOpacity, FlatList, useColorScheme } from 'react-native';
  import { useRouter } from 'expo-router';
  import { Colors, Spacing, Border } from '../../constants/Theme';

  const TOPICS = [
    { id: '1', name: 'Texnologiya' },
    { id: '2', name: 'İdman' },
    { id: '3', name: 'Biznes' },
    { id: '4', name: 'Siyasət' },
    { id: '5', name: 'Mədəniyyət' },
    { id: '6', name: 'Elm' },
    { id: '7', name: 'Səhiyyə' },
    { id: '8', name: 'Səyahət' },
  ];

  export default function TopicPicker() {
    const colorScheme = useColorScheme();
    const activeColors = Colors[colorScheme || 'light'];
    const router = useRouter();
    const [selected, setSelected] = useState([]);

    const toggleSelect = (id) => {
      if (selected.includes(id)) {
        setSelected(selected.filter((item) => item !== id));
      } else {
        setSelected([...selected, id]);
      }
    };

    const handleFinish = () => {
      // Navigate to tabs main layout
      router.push('/(tabs)');
    };

    return (
      <View style={[styles.container, { backgroundColor: activeColors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: activeColors.text, fontFamily: 'PlusJakartaSans-Bold' }]}>
            Maraqlarınızı Seçin
          </Text>
          <Text style={[styles.subtitle, { color: activeColors.textMuted, fontFamily: 'Inter-Regular' }]}>
            Sizə ən uyğun xəbərləri seçmək üçün mövzuları qeyd edin
          </Text>
        </View>

        <FlatList
          data={TOPICS}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const isSelected = selected.includes(item.id);
            return (
              <TouchableOpacity
                style={[
                  styles.topicCard,
                  {
                    borderColor: isSelected ? activeColors.accent : activeColors.border,
                    backgroundColor: isSelected ? activeColors.accent + '20' : activeColors.surface,
                  },
                ]}
                onPress={() => toggleSelect(item.id)}
              >
                <Text
                  style={[
                    styles.topicText,
                    {
                      color: isSelected ? activeColors.accent : activeColors.text,
                      fontFamily: isSelected ? 'Inter-Bold' : 'Inter-Medium',
                    },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: selected.length > 0 ? activeColors.primary : activeColors.border,
              },
            ]}
            disabled={selected.length === 0}
            onPress={handleFinish}
          >
            <Text style={[styles.buttonText, { color: activeColors.background, fontFamily: 'Inter-Medium' }]}>
              Tamamla
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
      marginTop: Spacing.space_32,
      marginBottom: Spacing.space_32,
    },
    title: {
      fontSize: 26,
      marginBottom: Spacing.space_8,
    },
    subtitle: {
      fontSize: 16,
      lineHeight: 22,
    },
    list: {
      justifyContent: 'space-between',
    },
    topicCard: {
      flex: 1,
      height: 60,
      margin: Spacing.space_8,
      borderWidth: 1,
      borderRadius: Border.radius_md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    topicText: {
      fontSize: 16,
    },
    footer: {
      marginVertical: Spacing.space_24,
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
  ```

- [ ] **Step 2: Commit topics screen**
  
  Run: `git add app/(auth)/topics.js`
  Run: `git commit -m "feat: implement interactive topic selector picker screen"`
  Expected: Commit succeeds.
