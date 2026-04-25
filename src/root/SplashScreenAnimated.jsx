import React, { useEffect } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useTheme } from "../utils/ThemeContext";

const { width, height } = Dimensions.get("window");

const SplashScreenAnimated = ({ onFinish }) => {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const prepare = async () => {
      // Hide the native splash screen as soon as our animated splash starts
      await SplashScreen.hideAsync();
      
      /**
       * IMPORTANT: Standard React Native Image component cannot detect the end of a GIF.
       * We use a timeout to signal completion. 
       * Please adjust the duration below (in ms) to match your splash_anim.gif exactly.
       */
      const GIF_DURATION = 800; 

      const timer = setTimeout(() => {
        onFinish?.();
      }, GIF_DURATION);

      return () => clearTimeout(timer);
    };

    prepare();
  }, [onFinish]);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#1A1820" : "#fff" }]}>
      <Image
        source={require("../../assets/splash_anim.gif")}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width,
    height: height,
  },
});

export default SplashScreenAnimated;