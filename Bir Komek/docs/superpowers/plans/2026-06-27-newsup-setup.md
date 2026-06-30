# Newsup Project Setup & Core Structure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize the React Native Expo Go project, setup the styling theme, load custom fonts, and configure the basic onboarding screen routing.

**Architecture:** Use Expo's file-based `expo-router` with stack navigation, loading fonts asynchronously on the Splash Screen, and styling via a shared `Theme.js` system.

**Tech Stack:** React Native, Expo Go, Expo Router, Expo Font, Expo Splash Screen, JavaScript.

## Global Constraints
- Target Framework: Expo Go (Expo SDK 51+)
- Navigation: Expo Router (File-based routing under `app/` directory)
- Styling: React Native `StyleSheet` referencing `constants/Theme.js`
- Custom Fonts: `Inter` (regular/medium/bold) and `Plus Jakarta Sans` (bold)

---

### Task 1: Expo App Initialization

**Files:**
- Create: `package.json`
- Create: `app.json`
- Create: `babel.config.js`
- Create: `app/_layout.js`
- Create: `app/index.js`

**Interfaces:**
- Consumes: None (Starting from scratch)
- Produces: Initial Expo App scaffold with file-based routing config.

- [ ] **Step 1: Scaffold Expo application**
  
  Run this command in the `Project 1` directory to initialize Expo with a blank JavaScript template:
  Run: `npx -y create-expo-app@latest . --template blank --yes`
  Expected: Success output indicating Expo project initialized.

- [ ] **Step 2: Add Expo Router dependencies**
  
  Run: `npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar`
  Expected: Installation of dependencies completes successfully.

- [ ] **Step 3: Update package.json entry point**
  
  Modify the `package.json` to change the main entry point to expo-router:
  ```json
  {
    "main": "expo-router/entry"
  }
  ```

- [ ] **Step 4: Configure app.json for routing**
  
  Add the scheme and router configuration to `app.json`:
  ```json
  {
    "expo": {
      "name": "Newsup",
      "slug": "newsup",
      "scheme": "newsup",
      "version": "1.0.0",
      "orientation": "portrait",
      "icon": "./assets/icon.png",
      "userInterfaceStyle": "automatic",
      "splash": {
        "image": "./assets/splash.png",
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      },
      "plugins": [
        "expo-router"
      ]
    }
  }
  ```

- [ ] **Step 5: Verify setup and commit**
  
  Run: `git add package.json app.json babel.config.js`
  Run: `git commit -m "chore: initialize expo go project with expo-router"`
  Expected: Commit succeeds.

---

### Task 2: Design Tokens & Styling System

**Files:**
- Create: `constants/Theme.js`

**Interfaces:**
- Consumes: None
- Produces: Global Colors, Spacing, and Border Radius token values for styling screens.

- [ ] **Step 1: Create constants directory and Theme.js file**
  
  Write the design tokens to `constants/Theme.js`:
  ```javascript
  export const Colors = {
    light: {
      primary: '#111111',
      primaryRgb: '17, 17, 17',
      accent: '#00E5FF',
      accentHover: '#00B2CC',
      background: '#FAFAFA',
      surface: '#FFFFFF',
      text: '#1F2937',
      textMuted: '#4B5563',
      border: '#E5E7EB',
      error: '#EF4444',
      success: '#10B981',
    },
    dark: {
      primary: '#FFFFFF',
      primaryRgb: '255, 255, 255',
      accent: '#00E5FF',
      accentHover: '#00B2CC',
      background: '#121212',
      surface: '#1E1E1E',
      text: '#F3F4F6',
      textMuted: '#9CA3AF',
      border: '#374151',
      error: '#EF4444',
      success: '#10B981',
    }
  };

  export const Spacing = {
    space_2: 2,
    space_4: 4,
    space_8: 8,
    space_12: 12,
    space_16: 16,
    space_24: 24,
    space_32: 32,
    space_48: 48,
    space_64: 64,
  };

  export const Border = {
    radius_sm: 4,
    radius_md: 8,
    radius_lg: 16,
    radius_full: 9999,
  };
  ```

- [ ] **Step 2: Commit theme settings**
  
  Run: `git add constants/Theme.js`
  Run: `git commit -m "feat: add global theme and design tokens"`
  Expected: Commit succeeds.

---

### Task 3: Font Loading and Root Layout Setup

**Files:**
- Create: `app/_layout.js`

**Interfaces:**
- Consumes: Colors, Spacing from `constants/Theme.js`
- Produces: Root Layout Context loading custom Fonts (`Inter`, `Plus Jakarta Sans`) and managing theme mode dynamically.

- [ ] **Step 1: Install font loading dependencies**
  
  Run: `npx expo install expo-font expo-splash-screen`
  Expected: Font and Splash Screen packages are installed.

- [ ] **Step 2: Write root _layout.js file**
  
  Implement asynchronous loading of fonts in `app/_layout.js`:
  ```javascript
  import { useEffect } from 'react';
  import { useColorScheme } from 'react-native';
  import { Stack } from 'expo-router';
  import * as SplashScreen from 'expo-splash-screen';
  import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
  import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';

  // Keep the splash screen visible while loading resources
  SplashScreen.preventAutoHideAsync();

  export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded, error] = useFonts({
      'Inter-Regular': Inter_400Regular,
      'Inter-Medium': Inter_500Medium,
      'Inter-Bold': Inter_700Bold,
      'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    });

    useEffect(() => {
      if (loaded || error) {
        SplashScreen.hideAsync();
      }
    }, [loaded, error]);

    if (!loaded && !error) {
      return null;
    }

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

- [ ] **Step 3: Install Google Fonts packages**
  
  Run: `npm install @expo-google-fonts/inter @expo-google-fonts/plus-jakarta-sans`
  Expected: Font packages install successfully.

- [ ] **Step 4: Commit layout settings**
  
  Run: `git add app/_layout.js`
  Run: `git commit -m "feat: setup root layout and async font loading"`
  Expected: Commit succeeds.

---

### Task 4: Splash / Onboarding Router & Welcome Screen

**Files:**
- Create: `app/index.js`
- Create: `app/onboarding/index.js`

**Interfaces:**
- Consumes: Colors, Spacing from `constants/Theme.js`
- Produces: Initial entry screen navigating users to the onboarding screens.

- [ ] **Step 1: Create entry router (app/index.js)**
  
  Write a clean Entry screen routing the user to the onboarding flow:
  ```javascript
  import { Redirect } from 'expo-router';

  export default function Index() {
    // Redirect immediately to Onboarding Screen 1
    return <Redirect href="/onboarding" />;
  }
  ```

- [ ] **Step 2: Create first onboarding screen (app/onboarding/index.js)**
  
  Write onboarding view with custom styles:
  ```javascript
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
          <p style={[styles.description, { color: activeColors.textMuted, fontFamily: 'Inter-Regular' }]}>
            Fikirleri kullanıcı odaklı arayüzlere ve yüksek performanslı uygulamalara dönüştürüyoruz.
          </p>
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
  ```

- [ ] **Step 3: Verify navigation screens structure and commit**
  
  Run: `git add app/index.js app/onboarding/index.js`
  Run: `git commit -m "feat: add splash route redirection and welcome onboarding screen"`
  Expected: Commit succeeds.
