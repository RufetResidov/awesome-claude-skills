import { NativeModules } from 'react-native';

let Voice = null;

if (NativeModules.Voice) {
  try {
    Voice = require('@react-native-voice/voice').default;
  } catch (e) {
    console.log("Voice native module exists but import failed:", e);
  }
}

// Fallback Mock object for Expo Go to prevent start-up crashes
if (!Voice) {
  Voice = {
    onSpeechStart: null,
    onSpeechEnd: null,
    onSpeechResults: null,
    onSpeechError: null,
    start: async () => {
      throw new Error("Native Voice module not found in Expo Go");
    },
    stop: async () => {},
    destroy: async () => {
      return Promise.resolve();
    },
    removeAllListeners: () => {},
  };
}

export default Voice;
