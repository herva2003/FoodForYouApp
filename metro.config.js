const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
module.exports = mergeConfig(getDefaultConfig(__dirname), {
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'], // Adicionar extensões relevantes
  },
});