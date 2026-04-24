import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  Platform,
  Animated
} from "react-native"
import React, { useState, useRef, useEffect } from "react"
import WardrobeScreen from "./WardrobeScreen"
import CommunityScreen from "./CommunityScreen"
import PlannerScreen from "./PlannerScreen"
import AccountScreen from "./AccountScreen"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import {
  responsiveHeight,
  responsiveWidth
} from "react-native-responsive-dimensions"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { centralModalOption } from "../../../assets/data/data"
import {
  Calendar,
  Plus,
  BetweenVerticalEnd,
  UserRound,
  Globe,
  Wand2
} from "lucide-react-native"
import { useTranslation } from "react-i18next"
import AIStylistScreen from "./AIStylistScreen"
import { useTheme } from "../../utils/ThemeContext"

const Tab = createBottomTabNavigator()
const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
const AnimatedView = Animated.createAnimatedComponent(View)
const AnimatedText = Animated.createAnimatedComponent(Text)

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const { t } = useTranslation()
  const { isDarkMode } = useTheme()
  const openModal = () => setModalVisible(true)
  const closeModal = () => setModalVisible(false)
  const insets = useSafeAreaInsets()

  // Refs for animation values
  const animationValues = useRef({}).current
  const prevIndex = useRef(state.index)

  // Initialize animation values for each tab
  useEffect(() => {
    state.routes.forEach((route, index) => {
      if (!animationValues[route.key]) {
        animationValues[route.key] = {
          scale: new Animated.Value(index === state.index ? 1.1 : 1),
          opacity: new Animated.Value(index === state.index ? 1 : 0.8),
          translateY: new Animated.Value(0)
        }
      }
    })
  }, [state.routes])

  // Animate tab on change
  useEffect(() => {
    // Animate previous tab back to normal
    const prevRoute = state.routes[prevIndex.current]
    if (prevRoute && animationValues[prevRoute.key]) {
      Animated.parallel([
        Animated.spring(animationValues[prevRoute.key].scale, {
          toValue: 1,
          tension: 150,
          friction: 12,
          useNativeDriver: true
        }),
        Animated.timing(animationValues[prevRoute.key].opacity, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.spring(animationValues[prevRoute.key].translateY, {
          toValue: 0,
          tension: 150,
          friction: 12,
          useNativeDriver: true
        })
      ]).start()
    }

    // Animate current tab to active state
    const currentRoute = state.routes[state.index]
    if (currentRoute && animationValues[currentRoute.key]) {
      Animated.parallel([
        Animated.spring(animationValues[currentRoute.key].scale, {
          toValue: 1.1,
          tension: 150,
          friction: 12,
          useNativeDriver: true
        }),
        Animated.timing(animationValues[currentRoute.key].opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.spring(animationValues[currentRoute.key].translateY, {
          toValue: -3,
          tension: 150,
          friction: 12,
          useNativeDriver: true
        })
      ]).start()
    }

    prevIndex.current = state.index
  }, [state.index])

  const labelRu = {
    Wardrobe: t("bottomTabs.wardrobe"),
    Community: t("bottomTabs.community"),
    AIStylist: t("bottomTabs.styleHub"), // Figma says Style Hub
    // Planner: "Style Hub", // Figma says Style Hub
    Account: t("bottomTabs.account")
  }

  // Animation for plus button press
  const plusButtonScale = useRef(new Animated.Value(1)).current
  const plusButtonRotate = useRef(new Animated.Value(0)).current

  const animatePlusButton = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(plusButtonScale, {
          toValue: 0.9,
          tension: 150,
          friction: 8,
          useNativeDriver: true
        }),
        Animated.timing(plusButtonRotate, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]),
      Animated.parallel([
        Animated.spring(plusButtonScale, {
          toValue: 1.1,
          tension: 150,
          friction: 8,
          useNativeDriver: true
        }),
        Animated.timing(plusButtonRotate, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        })
      ]),
      Animated.spring(plusButtonScale, {
        toValue: 1,
        tension: 150,
        friction: 12,
        useNativeDriver: true
      })
    ]).start()
  }

  const handlePlusPress = () => {
    animatePlusButton()
    openModal()
  }

  const plusButtonRotateInterpolate = plusButtonRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "135deg"]
  })

  // Design colors from Figma
  const transparentBg = "transparent"
  const glassBackgroundColor = isDarkMode ? "rgba(45, 38, 51, 0.95)" : "#F8F8F8" // Very light gray for the tab bar background
  const borderColor = isDarkMode
    ? "rgba(139, 84, 254, 0.25)"
    : "rgba(0, 0, 0, 0.05)"
  const activeTabBg = isDarkMode ? "rgba(139, 84, 254, 0.15)" : "#EDEDED" // Subtle gray for active tab highlight
  const activePurple = "#8E54FE"
  const inactiveGray = isDarkMode ? "rgba(255, 255, 255, 0.5)" : "#A4A4A4"

  const modalBgColor = isDarkMode ? "#2D2633" : "#fff"
  const modalBorderColor = isDarkMode
    ? "rgba(139, 84, 254, 0.2)"
    : "rgba(255, 255, 255, 0.3)"
  const modalTextColor = isDarkMode ? "#F5F4F7" : "#333"
  const modalBorderBottomColor = isDarkMode
    ? "rgba(139, 84, 254, 0.1)"
    : "rgba(0, 0, 0, 0.05)"

  const renderTabItem = (route, index) => {
    const isFocused = state.index === index

    const animation = animationValues[route.key] || {
      scale: new Animated.Value(1),
      opacity: new Animated.Value(0.8),
      translateY: new Animated.Value(0)
    }

    const onPress = () => {
      // Add press feedback animation
      Animated.sequence([
        Animated.spring(animation.scale, {
          toValue: 0.95,
          tension: 250,
          friction: 5,
          useNativeDriver: true
        }),
        Animated.spring(animation.scale, {
          toValue: isFocused ? 1.1 : 1,
          tension: 150,
          friction: 12,
          useNativeDriver: true
        })
      ]).start()

      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true
      })

      if (!event.defaultPrevented) {
        if (route.name === "AIStylist") {
          navigation.navigate("AIStylist", { resetTab: true })
        } else {
          navigation.navigate(route.name)
        }
      }
    }

    const iconColor = isFocused ? activePurple : inactiveGray

    // No changes needed to icons object as we use renderIcon now

    const renderIcon = (name) => {
      if (name === "Wardrobe")
        return <BetweenVerticalEnd size={18} color={iconColor} />
      if (name === "Community") return <Globe size={18} color={iconColor} />
      if (name === "AIStylist") {
        return <Wand2 size={18} color={iconColor} />
      }
      if (name === "Account") return <UserRound size={18} color={iconColor} />
      return null
    }

    const tabLabelColor = isFocused ? activePurple : inactiveGray

    return (
      <View key={route.key} style={styles.tabItemWrapper}>
        <AnimatedPressable
          onPress={onPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={[
            styles.tabItem,
            isFocused && {
              backgroundColor: activeTabBg,
              borderRadius: 30
            },
            {
              transform: [{ scale: animation.scale }]
            }
          ]}
        >
          <AnimatedView
            style={[
              styles.iconWrapper,
              {
                opacity: animation.opacity
              }
            ]}
          >
            {renderIcon(route.name)}
          </AnimatedView>
          <AnimatedText
            style={[
              styles.tabLabel,
              {
                color: tabLabelColor,
                opacity: animation.opacity
              }
            ]}
          >
            {labelRu[route.name]}
          </AnimatedText>
        </AnimatedPressable>
      </View>
    )
  }

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          paddingBottom:
            Platform.OS === "ios" ? insets.bottom : insets.bottom + responsiveHeight(2)
        }
      ]}
    >
      {/* Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <View
            style={[
              styles.modalContainer,
              {
                marginBottom:
                  Platform.OS === "ios"
                    ? responsiveHeight(9) + insets.bottom
                    : responsiveHeight(8) + insets.bottom + responsiveHeight(2)
              }
            ]}
          >
            <View
              style={[
                styles.glassModalContent,
                {
                  backgroundColor: modalBgColor,
                  borderColor: modalBorderColor
                }
              ]}
            >
              {centralModalOption.map((item, i) => (
                <Pressable
                  key={i}
                  style={[
                    styles.modalItem,
                    { borderBottomColor: modalBorderBottomColor }
                  ]}
                  onPress={() => {
                    closeModal()
                    navigation.navigate(item?.path)
                  }}
                >
                  <Text style={[styles.modalText, { color: modalTextColor }]}>
                    {`${t(item?.title)}`}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View
              style={[
                styles.modalTriangle,
                {
                  backgroundColor: modalBgColor
                  // borderColor: modalBorderColor,
                }
              ]}
            />
          </View>
        </Pressable>
      </Modal>

      {/* Bottom Tab Container */}
      <View style={styles.tabBarWrapper}>
        {/* Main tabs container */}
        <View
          style={[
            styles.tabsContainer,
            {
              backgroundColor: glassBackgroundColor,
              borderColor: borderColor
            }
          ]}
        >
          {state.routes.map((route, index) => renderTabItem(route, index))}
        </View>

        {/* Plus Button Container */}
        <View style={styles.plusContainer}>
          <AnimatedPressable
            onPress={handlePlusPress}
            style={[
              styles.plusButton,
              {
                backgroundColor: activePurple,
                transform: [
                  { scale: plusButtonScale },
                  { rotate: plusButtonRotateInterpolate }
                ]
              }
            ]}
          >
            <Plus size={responsiveHeight(3.5)} color="#fff" strokeWidth={2} />
          </AnimatedPressable>
        </View>
      </View>
    </View>
  )
}

const BottomNavigatorScreen = () => {
  const { isDarkMode } = useTheme()

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: isDarkMode ? "#1A1820" : "#fff"
        }
      ]}
      edges={["left", "right"]}
    >
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false
        }}
        initialRouteName="Wardrobe"
      >
        <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
        <Tab.Screen name="Community" component={CommunityScreen} />
        <Tab.Screen name="AIStylist" component={AIStylistScreen} />
        {/* <Tab.Screen name="Planner" component={PlannerScreen} /> */}
        <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: responsiveWidth(4),
    paddingBottom: Platform.OS === "ios" ? 0 : responsiveHeight(2),
    backgroundColor: "transparent",
    zIndex: 1000
  },
  tabBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%"
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    flex: 1,
    borderRadius: 50,
    height: responsiveHeight(7),
    paddingHorizontal: 5,
    marginRight: 10
  },
  tabItemWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%"
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    width: "80%", // Leave some space for the bubble
    height: "75%",
    borderRadius: 30
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center"
  },
  tabLabel: {
    fontSize: 8,
    fontWeight: "500",
    marginTop: 2,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-medium"
  },
  plusContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  plusButton: {
    width: responsiveHeight(6.2),
    height: responsiveHeight(6.2),
    borderRadius: responsiveHeight(3.1),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8E54FE",
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end", // Align to the right
    paddingRight: responsiveWidth(4), // Match the tab bar padding
    backgroundColor: "rgba(0, 0, 0, 0.4)"
  },
  modalContainer: {
    alignItems: "flex-end", // Align contents to the right
    width: 210 // Wider for the bubble appearance
  },
  glassModalContent: {
    borderRadius: 20,
    width: 200,
    overflow: "hidden",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 12
  },
  modalItem: {
    paddingVertical: responsiveHeight(1.8),
    paddingHorizontal: 20,
    borderBottomWidth: 1
  },
  modalText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16
  },
  modalTriangle: {
    width: 25,
    height: 25,
    transform: [{ rotate: "45deg" }],
    marginTop: -responsiveHeight(2.2),
    borderRadius: 4,
    marginRight: responsiveWidth(7) - 12.5 // Center triangle on the plus button
  }
})

export default BottomNavigatorScreen
