import { MoveRight } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { onboardingInfo } from "../../assets/data/data";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "../utils/ThemeContext";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const handleNext = () => {
    if (activeIndex < onboardingInfo.length - 1) {
      flatListRef?.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    } else {
      // console.log("Navigate to main app");
    }
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleSignUp = () => {
    navigation.navigate("Signup");
  };

  const renderOnboardingItem = ({ item }) => {
    const isActive = activeIndex === onboardingInfo.indexOf(item);

    return (
      <View style={styles.slideContainer}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.image} resizeMode="cover" />
        </View>

        {/* Content */}
        <View
          className={`absolute left-0 right-0 bottom-0 ${isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"}`}
          style={styles.contentContainer}
        >
          {/* Dot Indicator */}

          <View style={styles.dotContainer}>
            {onboardingInfo.map((_, dotIndex) => (
              <View
                key={dotIndex}
                style={[
                  styles.dot,
                  activeIndex === dotIndex
                    ? styles.activeDot
                    : styles.inactiveDot,
                ]}
              />
            ))}
          </View>

          {/* Title & Subtitle */}
          <View style={styles.textContainer}>
            <Text className="font-Bold text-4xl text-center text-textPrimary dark:text-darkTextPrimary">
              {" "}
              {t(item.titleKey)}
            </Text>
            <Text className="font-Regular text-center text-textPrimary dark:text-darkTextPrimary">
              {t(item.subtitleKey)}
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {item.showLoginButtons ? (
              <View className="flex-row justify-between items-center">
                <Pressable
                  className="bg-surfaceAction py-4 rounded-xl flex-row items-center justify-center"
                  style={{ width: responsiveWidth(43) }}
                  onPress={handleLogin}
                  android_ripple={{ color: "rgba(255,255,255,0.1)" }}
                >
                  <Text className="text-textPrimaryInverted font-SemiBold text-[16px]">
                    {t("onboarding.login")}
                  </Text>
                </Pressable>
                <Pressable
                  className="bg-surfaceSecondary py-4 rounded-xl flex-row items-center justify-center"
                  style={{ width: responsiveWidth(43) }}
                  onPress={handleSignUp}
                  android_ripple={{ color: "rgba(109,40,217,0.1)" }}
                >
                  <Text className="text-textAction font-SemiBold text-[16px]">
                    {t("onboarding.signup")}
                  </Text>
                </Pressable>
              </View>
            ) : item.isFinal ? (
              <Pressable
                className="bg-surfaceAction py-4 rounded-xl flex-row items-center justify-center gap-2"
                onPress={handleNext}
                android_ripple={{ color: "rgba(255,255,255,0.1)" }}
              >
                <Text className="text-textPrimaryInverted font-SemiBold text-[16px]">
                  {t("onboarding.getStarted")}
                </Text>
                <MoveRight size={20} color="white" />
              </Pressable>
            ) : (
              <Pressable
                className="bg-surfaceAction py-4 rounded-xl flex-row items-center justify-center gap-2"
                onPress={handleNext}
                android_ripple={{ color: "rgba(255,255,255,0.1)" }}
              >
                <Text className="text-textPrimaryInverted font-SemiBold text-[16px]">
                  {t("onboarding.next")}
                </Text>
                <MoveRight size={20} color="white" />
              </Pressable>
            )}
          </View>

          {/* Footer */}
          <View
            className="flex-1 justify-center items-center"
            style={{
              position: "absolute",
              bottom: responsiveHeight(10),
              left: responsiveWidth(5),
              right: responsiveWidth(5),
            }}
          >
            <Text className="font-Regular mb-1 text-center text-textPrimary dark:text-darkTextPrimary">@2025 Rai</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        ref={flatListRef}
        data={onboardingInfo}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOnboardingItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  slideContainer: { width, height, flex: 1 },
  imageContainer: { height: height * 0.5, width: "100%" },
  image: { width: "100%", height: "100%" },
  contentContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: responsiveHeight(55),
    // backgroundColor: "white",
    borderTopLeftRadius: responsiveWidth(5),
    borderTopRightRadius: responsiveWidth(5),
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(3),
    // gap: responsiveHeight(3),
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: { height: 10, borderRadius: 6, marginHorizontal: 4 },
  activeDot: { width: 32, backgroundColor: "#8E54FE" },
  inactiveDot: { width: 10, backgroundColor: "#B28AFF" },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: responsiveHeight(3),
  },
  buttonContainer: {
    position: "absolute",
    top: responsiveHeight(30),
    left: responsiveWidth(5),
    right: responsiveWidth(5),
  },
});
