import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

const { width } = Dimensions.get("window");

const ProcessingOverlay = ({ 
  visible, 
  onCancel, 
  current = 1, 
  total = 1, 
  message = "Processing" 
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const indeterminateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation;
    if (visible) {
      // Slide in from top
      Animated.spring(slideAnim, {
        toValue: responsiveHeight(6),
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();

      // Indeterminate slider animation
      animation = Animated.loop(
        Animated.timing(indeterminateAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        })
      );
      animation.start();
    } else {
      // Slide out to top
      Animated.timing(slideAnim, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
      }).start();
      if (animation) animation.stop();
      indeterminateAnim.setValue(0);
    }
    return () => {
      if (animation) animation.stop();
    };
  }, [visible]);

  const translateX = indeterminateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["-100%", "100%"],
  });

  if (!visible && slideAnim._value === -150) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View className="bg-[#101010] rounded-[30px] px-5 py-4 w-full shadow-2xl border border-white/10">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-white font-SemiBold text-[15px]">
            {message}...
          </Text>
          <TouchableOpacity 
            onPress={onCancel}
            className="bg-white/10 px-3 py-1.5 rounded-full"
          >
            <Text className="text-white/80 font-Bold text-[12px]">Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Slider */}
        <View className="w-full h-[6px] bg-white/10 rounded-full overflow-hidden">
          <Animated.View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#3498db", 
              borderRadius: 3,
              transform: [{ translateX }],
            }}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: responsiveWidth(5),
    right: responsiveWidth(5),
    zIndex: 9999,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
      },
      android: {
        elevation: 20,
      },
    }),
  },
});

export default ProcessingOverlay;
