import { MoveRight } from "lucide-react-native"
import React, { useRef, useState } from "react"
import {
  StatusBar,
  Animated,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
  StyleSheet,
  Dimensions
} from "react-native"
import {
  responsiveHeight,
  responsiveWidth
} from "react-native-responsive-dimensions"
import { onboardingInfo } from "../../assets/data/data"
import { useNavigation } from "@react-navigation/native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useTranslation } from "react-i18next"
import { useTheme } from "../utils/ThemeContext"

const { width, height } = Dimensions.get("window")

export default function OnboardingScreen() {
  const scrollX = useRef(new Animated.Value(0)).current
  const [activeIndex, setActiveIndex] = useState(0)
  const flatListRef = useRef()
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { isDarkMode } = useTheme()

  const handleNext = () => {
    if (activeIndex < onboardingInfo.length - 1) {
      flatListRef?.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true
      })
    } else {
      // console.log("Navigate to main app");
    }
  }

  const handleLogin = () => {
    navigation.navigate("Login")
  }

  const handleSignUp = () => {
    navigation.navigate("Signup")
  }

  const renderOnboardingItem = ({ item }) => {
    return (
      <View style={styles.slideContainer}>
        {/* Image */}
        <View
          style={[
            styles.imageContainer,
            { backgroundColor: isDarkMode ? "#1A1A1A" : "#FCF6F5" }
          ]}
        >
          <Image
            source={item.image}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Content */}
        <View
          className={`flex-1 ${isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"}`}
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
                    : styles.inactiveDot
                ]}
              />
            ))}
          </View>

          {/* Title & Subtitle */}
          <View style={styles.textContainer}>
            <Text
              className="font-Bold text-4xl text-center text-textPrimary dark:text-darkTextPrimary"
              style={{ width: 275 }}
            >
              {t(item.titleKey)}
            </Text>
            <Text className="font-Regular text-center text-textPrimary dark:text-darkTextPrimary">
              {t(item.subtitleKey)}
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {item.showLoginButtons ? (
              <View 
                className="flex-row justify-between items-center w-full"
                style={{ gap: responsiveWidth(2) }}
              >
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
                className="bg-surfaceAction py-4 rounded-xl flex-row items-center justify-center gap-2 w-full"
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
                className="bg-surfaceAction py-4 rounded-xl flex-row items-center justify-center gap-2 w-full"
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
        </View>
      </View>
    )
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? "#1A1A1A" : "#FCF6F5"
      }}
    >
      <StatusBar
        backgroundColor={isDarkMode ? "#1A1A1A" : "#FCF6F5"}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
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
          const index = Math.round(event.nativeEvent.contentOffset.x / width)
          setActiveIndex(index)
        }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOnboardingItem}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  slideContainer: { width, height },
  imageContainer: {
    height: height * 0.55,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  image: { width: "100%", height: "100%", marginTop: 50 },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: responsiveWidth(8),
    borderTopRightRadius: responsiveWidth(8),
    paddingHorizontal: responsiveWidth(8),
    paddingTop: responsiveHeight(5),
    paddingBottom: responsiveHeight(8) // Extra padding for bottom home indicator
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  dot: { height: 8, borderRadius: 4, marginHorizontal: 4 },
  activeDot: { width: 30, backgroundColor: "#8E54FE" },
  inactiveDot: { width: 8, backgroundColor: "#B28AFF" },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: responsiveHeight(2)
  },
  buttonContainer: {
    width: "100%"
  }
})
