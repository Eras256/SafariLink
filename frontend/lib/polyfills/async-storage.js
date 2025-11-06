// Polyfill for @react-native-async-storage/async-storage
// This module is not needed in browser environment
// It's only required by @metamask/sdk for React Native compatibility

export default {
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
  clear: async () => {},
  getAllKeys: async () => [],
  multiGet: async () => [],
  multiSet: async () => {},
  multiRemove: async () => {},
};

