// import React, { useEffect, useRef } from "react";
// import { View, Animated, StyleSheet, Dimensions } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import * as SplashScreen from "expo-splash-screen";
// import { responsiveWidth } from "react-native-responsive-dimensions";
// import { useTheme } from "../utils/ThemeContext";

// const { width, height } = Dimensions.get("window");

// const IMG1_WIDTH = 150;
// const IMG2_WIDTH = 80;
// const GAP = -20; // no gap between img1 and img2

// const SplashScreenAnimated = ({ onFinish }) => {
//   const navigation = useNavigation();
//   const { isDarkMode } = useTheme();

//   const img1Opacity = useRef(new Animated.Value(0)).current;
//   const containerX = useRef(new Animated.Value(0)).current;
//   const img1Scale = useRef(new Animated.Value(0.5)).current;
//   const img2X = useRef(new Animated.Value(IMG1_WIDTH)).current;
//   const img2Scale = useRef(new Animated.Value(1.5)).current;

//   useEffect(() => {
//     const startAnimation = async () => {
//       await SplashScreen.hideAsync(); // hide native splash before animation starts

//       Animated.sequence([
//         Animated.timing(img1Opacity, {
//           toValue: 1,
//           duration: 800,
//           useNativeDriver: true,
//         }),
//         Animated.timing(img2X, {
//           toValue: 0,
//           duration: 500,
//           useNativeDriver: true,
//         }),
//         Animated.timing(containerX, {
//           toValue: -(IMG2_WIDTH + GAP),
//           duration: 500,
//           useNativeDriver: true,
//         }),
//         Animated.timing(img2X, {
//           toValue: width,
//           duration: 500,
//           delay: 300,
//           useNativeDriver: true,
//         }),
//         Animated.sequence([
//           Animated.timing(containerX, {
//             toValue: 0,
//             duration: 500,
//             useNativeDriver: true,
//           }),
//           Animated.timing(img1Scale, {
//             toValue: 2.2,
//             duration: 500,
//             useNativeDriver: true,
//           }),
//         ]),
//       ]).start(() => {
//         onFinish?.();
//       });
//     };

//     startAnimation();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Animated.View
//         style={{
//           flexDirection: "row",
//           alignItems: "center",
//           opacity: img1Opacity,
//           transform: [{ translateX: containerX }],
//           position: "absolute",
//           top: height / 2 - IMG1_WIDTH / 2,
//           left: width / 2 - IMG1_WIDTH / 2,
//         }}
//       >
//         <Animated.Image
//           source={require("../../assets/images/img1.png")}
//           style={{
//             width: IMG1_WIDTH,
//             height: IMG1_WIDTH,
//             transform: [{ scale: img1Scale }],
//           }}
//           resizeMode="contain"
//         />

//         <Animated.Image
//           source={require("../../assets/images/img2.png")}
//           style={{
//             width: IMG2_WIDTH,
//             height: IMG2_WIDTH,
//             transform: [{ translateX: img2X }, { scale: img2Scale }],
//           }}
//           resizeMode="contain"
//         />
//       </Animated.View>
//     </View>
//   );
// };
// const styles = getStyles(isDarkMode);

// const getStyles = (isDarkMode) =>
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: isDarkMode ? "#000" : "#fff",
//       padding: responsiveWidth(5),
//     },
//   });

// export default SplashScreenAnimated;


import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { useTheme } from "../utils/ThemeContext";

const { width, height } = Dimensions.get("window");

const IMG1_WIDTH = 150;
const IMG2_WIDTH = 80;
const GAP = -20; // no gap between img1 and img2

const SplashScreenAnimated = ({ onFinish }) => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();

  const img1Opacity = useRef(new Animated.Value(0)).current;
  const containerX = useRef(new Animated.Value(0)).current;
  const img1Scale = useRef(new Animated.Value(0.5)).current;
  const img2X = useRef(new Animated.Value(IMG1_WIDTH)).current;
  const img2Scale = useRef(new Animated.Value(1.3)).current;

  useEffect(() => {
    const startAnimation = async () => {
      await SplashScreen.hideAsync(); // hide native splash before animation starts

      Animated.sequence([
        Animated.timing(img1Opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(img2X, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(containerX, {
          toValue: -(IMG2_WIDTH + GAP),
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(img2X, {
          toValue: width,
          duration: 500,
          delay: 300,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(containerX, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(img1Scale, {
            toValue: 2,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        onFinish?.();
      });
    };

    startAnimation();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#1A1820" : "#fff",
      padding: responsiveWidth(5),
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          flexDirection: "row",
          alignItems: "center",
          opacity: img1Opacity,
          transform: [{ translateX: containerX }],
          position: "absolute",
          top: height / 2 - IMG1_WIDTH / 2,
          left: width / 2 - IMG1_WIDTH / 2,
        }}
      >
        <Animated.Image
          source={require("../../assets/images/img1.png")}
          style={{
            width: IMG1_WIDTH,
            height: IMG1_WIDTH,
            transform: [{ scale: img1Scale }],
          }}
          resizeMode="contain"
        />

        <Animated.Image
          source={require("../../assets/images/img2.png")}
          style={{
            width: IMG2_WIDTH,
            height: IMG2_WIDTH,
            transform: [{ translateX: img2X }, { scale: img2Scale }],
          }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

export default SplashScreenAnimated;