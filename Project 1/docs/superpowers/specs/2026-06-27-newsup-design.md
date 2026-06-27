# Newsup Mobile App - Dizayn Spesifikasiyası (Spec)

Bu sənəd **Newsup** xəbər tətbiqinin (React Native / Expo Go) dizayn arxitekturasını, naviqasiya axınını və məlumat bazası strukturunu müəyyən edir.

## 1. ÜMUMİ BAXIŞ VƏ MƏQSƏD
Newsup – istifadəçilərə fərqli mövzularda (texnologiya, idman, biznes və s.) real-time xəbərləri oxumaq, bəyənmək, saxlamaq və şərhlər yazmaq imkanı verən mobil tətbiqdir. Tətbiq 45 ekranlı Figma UI Kit dizaynı əsasında mobil cihazlar üçün optimallaşdırılmış şəkildə hazırlanacaq.

---

## 2. TEXNOLOGİYA STEKİ (TECH STACK)
*   **Karkas:** React Native (Expo SDK / Expo Go)
*   **Naviqasiya:** `expo-router` (File-based routing)
*   **Dizayn Sistemi:** React Native `StyleSheet` (Bölüşülən dizayn tokenləri ilə)
*   **Şriftlər:** `Inter` (Gövde metin), `Plus Jakarta Sans` (Başlıqlar) - `expo-font` vasitəsilə
*   **Verilənlər Bazası:** Firebase Auth, Cloud Firestore (Real-time synchronization)
*   **Media Saxlanılması:** Firebase Storage

---

## 3. NAVİQASİYA VƏ EKRAN QURULUŞU (EXPO ROUTER APPS)
Expo Router strukturuna uyğun olaraq tətbiqin qovluq strukturu aşağıdakı kimi olacaq:

```text
app/
├── (auth)/
│   ├── login.js          # Giriş ekranı
│   ├── signup.js         # Qeydiyyat ekranı
│   ├── verify.js         # İdentifikasiya (doğrulama) ekranı
│   ├── forgot.js         # Şifrəmi unutdum ekranı
│   └── topics.js         # Mövzu seçimi (Topic Picker)
├── (tabs)/
│   ├── _layout.js        # Bottom Tab Navigator
│   ├── index.js          # Home - Xəbərlər Lenti
│   ├── explore.js        # Axtarış və Kateqoriyalar
│   ├── bookmarks.js      # Saxlanılan xəbərlər
│   └── profile.js        # Profil və Tənzimləmələr
├── onboarding/
│   ├── index.js          # Onboarding 1
│   └── second.js         # Onboarding 2
├── news/
│   ├── [id].js           # Xəbər detalı ekranı
│   └── comments.js       # Şərhlər bölməsi
├── _layout.js            # Ana tətbiq wrapper (Fonts loading, Firebase initialization)
└── index.js              # Splash Screen və Onboarding yönləndirmə məntiqi
```

---

## 4. DİZAYN TOKENLƏRİ VƏ MÖVZULAR (THEME)
`constants/Theme.js` faylı vasitəsilə tətbiqdə Açıq/Qaranlıq (Light/Dark) rejimlər dəstəklənəcək:

```javascript
export const Colors = {
  light: {
    primary: '#111111',
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

---

## 5. MƏLUMAT MODELLƏRİ (DATA MODELS)

### 5.1. Users (İstifadəçilər) - `/users/{userId}`
```json
{
  "uid": "string",
  "email": "string",
  "displayName": "string",
  "avatarUrl": "string",
  "selectedTopics": ["string"],
  "bookmarkedArticles": ["string"],
  "createdAt": "timestamp"
}
```

### 5.2. Articles (Məqalələr) - `/articles/{articleId}`
```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "imageUrl": "string",
  "category": "string",
  "viewsCount": "number",
  "likesCount": "number",
  "publishedAt": "timestamp",
  "author": {
    "name": "string",
    "avatar": "string"
  }
}
```

### 5.3. Comments (Şərhlər) - `/articles/{articleId}/comments/{commentId}`
```json
{
  "id": "string",
  "userId": "string",
  "userName": "string",
  "userAvatar": "string",
  "text": "string",
  "createdAt": "timestamp"
}
```

---

## 6. VERİFİKASİYA PLANI (VERIFICATION PLAN)
*   **Cihazda Test:** Expo Go vasitəsilə fiziki iOS və Android smartfonlarında naviqasiya və ekran görüntülərinin test edilməsi.
*   **Məlumat Testi:** Firebase qoşulana qədər mock (keçici) data ilə interfeysin doldurulması və oxunması testi.
*   **Əlçatanlıq:** Form elementlərinin, butonların fokus və aktiv/passiv vəziyyətlərinin yoxlanılması.
