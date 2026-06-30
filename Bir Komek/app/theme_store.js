import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

let currentTheme = 'day'; // 'day' | 'night' | 'system'
const listeners = new Set();

export const getTheme = () => currentTheme;

export const setTheme = (theme) => {
  currentTheme = theme;
  listeners.forEach(listener => listener(theme));
};

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const [theme, setInternalTheme] = useState(currentTheme);

  useEffect(() => {
    const handleUpdate = (newTheme) => setInternalTheme(newTheme);
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  const activeMode = theme === 'system' ? systemColorScheme || 'light' : (theme === 'night' ? 'dark' : 'light');

  // Unified color tokens for both Light and Dark modes
  const colors = activeMode === 'dark' ? {
    background: '#11151C',       // deep dark background
    cardBackground: '#1F2937',   // dark cards
    text: '#FFFFFF',             // white text
    subText: '#9CA3AF',          // lighter grey subtext
    border: '#374151',           // dark borders
    headerBackground: '#11151C',
    statusBar: 'light-content',
    statusBarBg: '#11151C',
    tabBarBg: '#1F2937',
    greyText: '#9CA3AF',
    lightBg: '#1F2937',
    textHeading: '#FFFFFF',
    divider: '#374151',
    inputBg: '#1F2937',
  } : {
    background: '#FFFFFF',       // white background
    cardBackground: '#FFFFFF',   // white cards
    text: '#111827',             // dark text
    subText: '#4B5563',          // grey text
    border: '#E5E7EB',           // light borders
    headerBackground: '#FFFFFF',
    statusBar: 'dark-content',
    statusBarBg: '#FFFFFF',
    tabBarBg: '#FFFFFF',
    greyText: '#4B5563',
    lightBg: '#F3F4F6',
    textHeading: '#11151C',
    divider: '#F3F4F6',
    inputBg: '#F9FAFB',
  };

  return { theme, activeMode, colors, setTheme };
};
