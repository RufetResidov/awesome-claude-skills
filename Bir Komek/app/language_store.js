import { useState, useEffect } from 'react';

let currentLanguage = 'az';
const listeners = new Set();

const translations = {
  az: {
    // HomeScreen
    greeting: 'Salam Rufat',
    subGreeting: 'Təkrar xoş gəldiniz 😊',
    
    // Banners
    banner1Title: 'Onların təhlükəsizliyi\nbizim borcumuzdur !',
    banner1Subtitle: 'Bir toxunuşla qayğı və dəstək',
    banner2Title: 'Çətin anda bir kömək,\nHər addımda bir dəstək.',
    banner2Subtitle: 'Siz tək deyilsiniz',
    
    // Services
    ambulance: 'Təcili tibbi yardım',
    ambulanceSub: 'Ambulans çağırışı',
    police: 'Polis / Təhlükəsizlik',
    policeSub: 'Şəxsi təhlükəsizlik',
    fire: 'FHN / Yanğın',
    fireSub: 'Yanğın və məişət',
    familySos: 'Ailə SOS',
    familySosSub: 'Yaxınlarıma bildir',
    
    // Settings & Navigation
    settings: 'Tənzimləmələr',
    general: 'Ümumi',
    support: 'Dəstək',
    privacy: 'Məxfilik siyasəti',
    faq: 'Tez-tez verilən suallar',
    logout: 'Çıxış',
    logoutConfirm: 'Çıxış etməyə eminsiniz mi?',
    logoutConfirmDesc: 'Hesabınızdan çıxış etmək istədiyinizə əminsiniz? Yenidən daxil olmaq üçün telefon nömrəniz lazım olacaq.',
    cancel: 'İmtina et',
    confirm: 'Təsdiq et',
    
    // Sub-Settings
    theme: 'Tətbiq rəngi',
    themeDay: 'Gündüz',
    themeNight: 'Gecə',
    themeSystem: 'Sistem',
    screenshotPermission: 'Ekran görüntüsü üçün icazə',
    biometricLogin: 'Biometrik giriş',
    changePin: 'PİN-i dəyiş',
    activeSessions: 'Aktiv sessiyalar',
    language: 'Tətbiqin dili',
  },
  en: {
    greeting: 'Hello Rufat',
    subGreeting: 'Welcome back 😊',
    
    // Banners
    banner1Title: 'Their safety is\nour responsibility !',
    banner1Subtitle: 'Care and support with a single touch',
    banner2Title: 'Help in difficult times,\nSupport at every step.',
    banner2Subtitle: 'You are not alone',
    
    ambulance: 'Emergency Medical',
    ambulanceSub: 'Ambulance call',
    police: 'Police / Security',
    policeSub: 'Personal security',
    fire: 'FHN / Fire Dept',
    fireSub: 'Fire and safety',
    familySos: 'Family SOS',
    familySosSub: 'Notify relatives',
    
    settings: 'Settings',
    general: 'General',
    support: 'Support',
    privacy: 'Privacy Policy',
    faq: 'FAQ',
    logout: 'Log Out',
    logoutConfirm: 'Are you sure you want to log out?',
    logoutConfirmDesc: 'Are you sure you want to log out? You will need your phone number to sign back in.',
    cancel: 'Cancel',
    confirm: 'Confirm',
    
    theme: 'App Theme',
    themeDay: 'Light',
    themeNight: 'Dark',
    themeSystem: 'System',
    screenshotPermission: 'Screenshot Permission',
    biometricLogin: 'Biometric Login',
    changePin: 'Change PIN',
    activeSessions: 'Active Sessions',
    language: 'App Language',
  },
  ru: {
    greeting: 'Привет, Руфат',
    subGreeting: 'С возвращением 😊',
    
    // Banners
    banner1Title: 'Их безопасность —\nнаш долг !',
    banner1Subtitle: 'Забота и поддержка в одно касание',
    banner2Title: 'Помощь в трудную минуту,\nПоддержка на каждом шагу.',
    banner2Subtitle: 'Вы не одни',
    
    ambulance: 'Скорая помощь',
    ambulanceSub: 'Вызов скорой',
    police: 'Полиция / Охрана',
    policeSub: 'Личная безопасность',
    fire: 'МЧС / Пожарные',
    fireSub: 'Пожары и быт',
    familySos: 'Семейный SOS',
    familySosSub: 'Сообщить близким',
    
    settings: 'Настройки',
    general: 'Общие',
    support: 'Поддержка',
    privacy: 'Политика конфиденциальности',
    faq: 'Частые вопросы',
    logout: 'Выйти',
    logoutConfirm: 'Вы уверены, что хотите выйти?',
    logoutConfirmDesc: 'Вы действительно хотите выйти из аккаунта? Для повторного входа понадобится номер телефона.',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    
    theme: 'Цвет приложения',
    themeDay: 'Дневной',
    themeNight: 'Ночной',
    themeSystem: 'Системный',
    screenshotPermission: 'Разрешение на скриншот',
    biometricLogin: 'Биометрический вход',
    changePin: 'Изменить PIN-код',
    activeSessions: 'Активные сессии',
    language: 'Язык приложения',
  }
};

export const getLanguage = () => currentLanguage;

export const setLanguage = (lang) => {
  if (translations[lang]) {
    currentLanguage = lang;
    listeners.forEach(listener => listener(lang));
  }
};

export const t = (key) => {
  return translations[currentLanguage]?.[key] || key;
};

export const useLanguage = () => {
  const [lang, setLang] = useState(currentLanguage);
  
  useEffect(() => {
    const handleUpdate = (newLang) => setLang(newLang);
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);
  
  return { lang, t };
};
