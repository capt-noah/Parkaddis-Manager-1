module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // jsxImportSource "nativewind" → nativewind/jsx-runtime → react-native-css-interop
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
    ],
    // NativeWind needs this plugin; do not use the full `nativewind/babel` preset here — it also
    // adds `react-native-worklets/plugin`, which duplicates babel-preset-expo’s injection and
    // breaks Reanimated at runtime (Exception in HostFunction).
    plugins: [require("react-native-css-interop/dist/babel-plugin").default],
  };
};
