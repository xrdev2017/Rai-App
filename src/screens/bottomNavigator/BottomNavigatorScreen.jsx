import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import WardrobeScreen from "./WardrobeScreen";
import CommunityScreen from "./CommunityScreen";
import PlannerScreen from "./PlannerScreen";
import AccountScreen from "./AccountScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { centralModalOption } from "../../../assets/data/data";
import {
  Calendar,
  Plus,
  BetweenVerticalEnd,
  UserRound,
  Globe,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../utils/ThemeContext";

const Tab = createBottomTabNavigator();
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const insets = useSafeAreaInsets();

  // Refs for animation values
  const animationValues = useRef({}).current;
  const prevIndex = useRef(state.index);

  // Initialize animation values for each tab
  useEffect(() => {
    state.routes.forEach((route, index) => {
      if (!animationValues[route.key]) {
        animationValues[route.key] = {
          scale: new Animated.Value(index === state.index ? 1.1 : 1),
          opacity: new Animated.Value(index === state.index ? 1 : 0.8),
          translateY: new Animated.Value(0),
        };
      }
    });
  }, [state.routes]);

  // Animate tab on change
  useEffect(() => {
    // Animate previous tab back to normal
    const prevRoute = state.routes[prevIndex.current];
    if (prevRoute && animationValues[prevRoute.key]) {
      Animated.parallel([
        Animated.spring(animationValues[prevRoute.key].scale, {
          toValue: 1,
          tension: 150,
          friction: 12,
          useNativeDriver: true,
        }),
        Animated.timing(animationValues[prevRoute.key].opacity, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(animationValues[prevRoute.key].translateY, {
          toValue: 0,
          tension: 150,
          friction: 12,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Animate current tab to active state
    const currentRoute = state.routes[state.index];
    if (currentRoute && animationValues[currentRoute.key]) {
      Animated.parallel([
        Animated.spring(animationValues[currentRoute.key].scale, {
          toValue: 1.1,
          tension: 150,
          friction: 12,
          useNativeDriver: true,
        }),
        Animated.timing(animationValues[currentRoute.key].opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(animationValues[currentRoute.key].translateY, {
          toValue: -3,
          tension: 150,
          friction: 12,
          useNativeDriver: true,
        }),
      ]).start();
    }

    prevIndex.current = state.index;
  }, [state.index]);

  const labelRu = {
    Wardrobe: t("bottomTabs.wardrobe"),
    Community: t("bottomTabs.community"),
    Planner: t("bottomTabs.planner"),
    Account: t("bottomTabs.account"),
  };

  // Animation for plus button press
  const plusButtonScale = useRef(new Animated.Value(1)).current;
  const plusButtonRotate = useRef(new Animated.Value(0)).current;

  const animatePlusButton = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(plusButtonScale, {
          toValue: 0.9,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(plusButtonRotate, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(plusButtonScale, {
          toValue: 1.1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(plusButtonRotate, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(plusButtonScale, {
        toValue: 1,
        tension: 150,
        friction: 12,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePlusPress = () => {
    animatePlusButton();
    openModal();
  };

  const plusButtonRotateInterpolate = plusButtonRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "135deg"],
  });

  // Dark mode colors
  const glassBackgroundColor = isDarkMode
    ? "rgba(45, 38, 51, 0.75)"
    : "rgba(220, 215, 230, 0.75)";
  const borderColor = isDarkMode
    ? "rgba(139, 84, 254, 0.25)"
    : "rgba(200, 190, 210, 0.75)";
  const activeTabBg = isDarkMode
    ? "rgba(139, 84, 254, 0.08)"
    : "rgba(79, 70, 229, 0.05)";
  const modalBgColor = isDarkMode ? "#2D2633" : "#fff";
  const modalBorderColor = isDarkMode
    ? "rgba(139, 84, 254, 0.2)"
    : "rgba(255, 255, 255, 0.3)";
  const modalTextColor = isDarkMode ? "#F5F4F7" : "#333";
  const modalBorderBottomColor = isDarkMode
    ? "rgba(139, 84, 254, 0.1)"
    : "rgba(0, 0, 0, 0.05)";

  const renderTabItem = (route, index, isLeftGroup = true) => {
    const { options } = descriptors[route.key];
    const isFocused = isLeftGroup
      ? state.index === index
      : state.index === index + 2;

    const animation = animationValues[route.key] || {
      scale: new Animated.Value(1),
      opacity: new Animated.Value(0.8),
      translateY: new Animated.Value(0),
    };

    const onPress = () => {
      // Add press feedback animation
      Animated.sequence([
        Animated.spring(animation.scale, {
          toValue: 0.95,
          tension: 250,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(animation.scale, {
          toValue: isFocused ? 1.1 : 1,
          tension: 150,
          friction: 12,
          useNativeDriver: true,
        }),
      ]).start();

      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    const iconColor = isFocused
      ? isDarkMode
        ? "#8E54FE"
        : "#4f46e5"
      : isDarkMode
        ? "rgba(142, 84, 254, 0.6)"
        : "rgba(79, 70, 229, 0.4)";

    const icons = {
      Wardrobe: <BetweenVerticalEnd size={20} color={iconColor} />,
      Community: <Globe size={20} color={iconColor} />,
      Planner: <Calendar size={20} color={iconColor} />,
      Account: <UserRound size={20} color={iconColor} />,
    };

    const tabLabelColor = isFocused
      ? isDarkMode
        ? "#8E54FE"
        : "#4f46e5"
      : isDarkMode
        ? "rgba(142, 84, 254, 0.6)"
        : "rgba(79, 70, 229, 0.4)";

    return (
      <AnimatedPressable
        key={route.key}
        onPress={onPress}
        style={[
          styles.tabItem,
          isFocused && {
            ...styles.activeTabItem,
            backgroundColor: activeTabBg,
          },
          {
            transform: [
              { scale: animation.scale },
              { translateY: animation.translateY },
            ],
          },
        ]}
      >
        <AnimatedView
          style={[
            styles.iconWrapper,
            {
              opacity: animation.opacity,
            },
          ]}
        >
          {icons[route.name]}
        </AnimatedView>
        <AnimatedText
          style={[
            styles.tabLabel,
            {
              color: tabLabelColor,
              opacity: animation.opacity,
              transform: [
                {
                  scale: animation.scale.interpolate({
                    inputRange: [1, 1.1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {labelRu[route.name]}
        </AnimatedText>
      </AnimatedPressable>
    );
  };

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom }]}>
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
              { marginBottom: responsiveHeight(10) + insets.bottom },
            ]}
          >
            <View
              style={[
                styles.glassModalContent,
                {
                  backgroundColor: modalBgColor,
                  borderColor: modalBorderColor,
                },
              ]}
            >
              {centralModalOption.map((item, i) => (
                <Pressable
                  key={i}
                  style={[
                    styles.modalItem,
                    { borderBottomColor: modalBorderBottomColor },
                  ]}
                  onPress={() => {
                    closeModal();
                    navigation.navigate(item?.path);
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
                  backgroundColor: modalBgColor,
                  // borderColor: modalBorderColor,
                },
              ]}
            />
          </View>
        </Pressable>
      </Modal>

      {/* Glass Morphism Bottom Tab */}
      <View style={styles.tabBarWrapper}>
        {/* Glass morphism background */}
        <View
          style={[
            styles.glassBackground,
            {
              backgroundColor: glassBackgroundColor,
              borderColor: borderColor,
            },
          ]}
        />

        {/* Plus Button with animation */}
        <AnimatedPressable
          onPress={handlePlusPress}
          style={[
            styles.plusButtonContainer,
            {
              transform: [
                { scale: plusButtonScale },
                { rotate: plusButtonRotateInterpolate },
              ],
            },
          ]}
        >
          <View style={styles.plusButton}>
            <Plus size={20} color="#fff" />
          </View>
        </AnimatedPressable>

        {/* Tab Items */}
        <View style={styles.tabBarContent}>
          {/* Left Group: Wardrobe + Community */}
          <View style={styles.tabGroup}>
            {state.routes
              .slice(0, 2)
              .map((route, index) => renderTabItem(route, index, true))}
          </View>

          {/* Spacer for plus button area */}
          <View style={styles.plusButtonSpacer} />

          {/* Right Group: Planner + Account */}
          <View style={styles.tabGroup}>
            {state.routes
              .slice(2, 4)
              .map((route, index) => renderTabItem(route, index, false))}
          </View>
        </View>
      </View>
    </View>
  );
};

const BottomNavigatorScreen = () => {
  const { isDarkMode } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: isDarkMode ? "#1A1820" : "#fff",
        },
      ]}
      edges={["left", "right"]}
    >
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Wardrobe"
      >
        <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
        <Tab.Screen name="Community" component={CommunityScreen} />
        <Tab.Screen name="Planner" component={PlannerScreen} />
        <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    zIndex: 1000,
  },
  tabBarWrapper: {
    marginHorizontal: responsiveWidth(5),
    borderRadius: responsiveWidth(10),
    overflow: "hidden",
    height: responsiveHeight(9),

  },
  glassBackground: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderRadius: 30,
    shadowColor: "#8E54FE",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  tabBarContent: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  tabGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 2,
  },
  plusButtonSpacer: {
    width: responsiveWidth(10),
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: responsiveHeight(1.5),
    borderRadius: 20,
  },
  activeTabItem: {
    backgroundColor: "rgba(79, 70, 229, 0.05)",
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  activeDot: {
    position: "absolute",
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#4f46e5",
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
    marginTop: 2,
  },
  plusButtonContainer: {
    position: "absolute",
    left: "44%",
    paddingVertical: responsiveHeight(1),
    zIndex: 1001,
  },
  plusButton: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: 35,
    backgroundColor: "#8E54FE",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8E54FE",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContainer: {
    alignItems: "center",
  },
  glassModalContent: {
    borderRadius: 20,
    width: 200,
    overflow: "hidden",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 12,
  },
  modalItem: {
    paddingVertical: responsiveHeight(1.8),
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  modalText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  modalTriangle: {
    width: 25,
    height: 25,
    transform: [{ rotate: "45deg" }],
    marginTop: -responsiveHeight(2.2),
    borderRadius: 4,
    // borderTopWidth: 1,
    // borderLeftWidth: 1,
  },
});

export default BottomNavigatorScreen;
