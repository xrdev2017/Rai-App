import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  Platform,
  Animated,
  Image,
} from "react-native"
import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation"
import { createBottomTabNavigator, BottomTabBar } from "@react-navigation/bottom-tabs"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation, useNavigationState } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import {
  responsiveHeight,
  responsiveWidth
} from "react-native-responsive-dimensions"
import {
  Plus,
  Shirt,
  UserRound,
  Globe,
  Wand2
} from "lucide-react-native"

import WardrobeScreen from "./WardrobeScreen"
import CommunityScreen from "./CommunityScreen"
import AIStylistScreen from "./AIStylistScreen"
import AccountScreen from "./AccountScreen"
import { centralModalOption } from "../../../assets/data/data"
import { useTheme } from "../../utils/ThemeContext"

const NativeTab = createNativeBottomTabNavigator()
const JSTab = createBottomTabNavigator()
const Tab = Platform.OS === "ios" ? NativeTab : JSTab

const CustomTabBar = (props) => {
  const { state } = props;
  const { isDarkMode } = useTheme();
  
  const animatedValue = useRef(new Animated.Value(state.index)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [tabBarWidth, setTabBarWidth] = useState(0);

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: state.index,
      useNativeDriver: true,
      friction: 8,
      tension: 50,
    }).start();

    // Bubble effect: quick scale up and then spring back to 1
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.15,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      })
    ]).start();
  }, [state.index]);

  const tabWidth = tabBarWidth > 0 ? tabBarWidth / state.routes.length : 0;

  const translateX = animatedValue.interpolate({
    inputRange: state.routes.map((_, i) => i),
    outputRange: state.routes.map((_, i) => i * tabWidth),
  });

  return (
    <View 
      onLayout={(e) => setTabBarWidth(e.nativeEvent.layout.width)}
      style={{
        position: 'absolute',
        bottom: 15,
        left: 20,
        right: 20,
        height: 60,
        borderRadius: 35,
        backgroundColor: isDarkMode ? "#3A3241" : "#F5F4F7",
      }}
    >
      {tabBarWidth > 0 && (
        <Animated.View
          style={{
            position: 'absolute',
            width: tabWidth-6 ,
            height: 52,
            borderRadius: 28,
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
            top: 4,
            left: 3,
            transform: [{ translateX }, { scale: scaleValue }],
          }}
        />
      )}
      <BottomTabBar 
        {...props} 
        style={{
          backgroundColor: 'transparent',
          elevation: 0,
          borderTopWidth: 0,
          height: 60,
        }} 
      />
    </View>
  );
};

const BottomNavigatorScreen = () => {
  const { isDarkMode } = useTheme()
  const { t } = useTranslation()
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  const [modalVisible, setModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("Wardrobe") // Track active tab
  
  const openModal = () => setModalVisible(true)
  const closeModal = () => setModalVisible(false)

  const activePurple = "#8E54FE"
  const inactiveGray = isDarkMode ? "#8E8E93" : "#8E8E93"
  const tabBarBgColor = isDarkMode ? "#3A3241" : "#F8F8F8"

  const modalBgColor = isDarkMode ? "#2D2633" : "#fff"
  const modalBorderColor = isDarkMode ? "rgba(139, 84, 254, 0.2)" : "rgba(255, 255, 255, 0.3)"
  const modalTextColor = isDarkMode ? "#F5F4F7" : "#333"

  return (
    <SafeAreaView 
      style={[styles.safeArea, { backgroundColor: tabBarBgColor }]} 
      edges={Platform.OS === 'ios' ? ["left", "right"] : ["left", "right", "bottom"]}
    >
      
      {/* Modal for Plus Button */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <Pressable style={styles.modalOverlay} activeOpacity={1} onPress={closeModal}>
          {/* Modal Dialog shifted down by 10px */}
          <View style={[styles.modalContainer, { marginBottom: Platform.OS === "ios" ? insets.bottom + 130 : 150 }]}>
            <View style={[styles.glassModalContent, { backgroundColor: modalBgColor, borderColor: modalBorderColor }]}>
              {centralModalOption.map((item, i) => (
                <Pressable
                  key={i}
                  style={[styles.modalItem, { borderBottomColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }]}
                  onPress={() => {
                    closeModal()
                    navigation.navigate(item?.path)
                  }}
                >
                  <Text style={[styles.modalText, { color: modalTextColor }]}>{`${t(item?.title)}`}</Text>
                </Pressable>
              ))}
            </View>
            <View style={[styles.modalTriangle, { backgroundColor: modalBgColor }]} />
          </View>
        </Pressable>
      </Modal>

      <Tab.Navigator
        initialRouteName="Wardrobe"
        labeled={true}
        activeColor={activePurple}
        inactiveColor={inactiveGray}
        tabBarActiveTintColor={activePurple}
        tabBarInactiveTintColor={inactiveGray}
        // Native Bottom Tabs config (iOS only)
        {...(Platform.OS === "ios" ? {
          // Native configuration moved to screenOptions above
        } : {
          // JS Bottom Tabs config (Android)
          tabBar: (props) => <CustomTabBar {...props} />,
          screenOptions: {
            headerShown: false,
            tabBarStyle: {
              backgroundColor: 'transparent',
              elevation: 0,
              borderTopWidth: 0,
              height: 60,
            },
            tabBarItemStyle: {
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: 60,
              marginHorizontal: 5,
              paddingTop: 4,
            },
            tabBarActiveTintColor: activePurple,
            tabBarInactiveTintColor: "#8E8E93",
            tabBarLabelStyle: {
              fontSize: 9,
              fontWeight: '500',
              marginTop: 0, 
            },
            tabBarRippleColor: 'transparent',
            tabBarButton: (props) => (
              <Pressable {...props} android_ripple={null} style={[props.style, { flex: 1, zIndex: 1 }]} />
            ),
          }
        })}
      >
        <Tab.Screen
          name="Wardrobe"
          component={WardrobeScreen}
          listeners={{
            focus: () => setActiveTab("Wardrobe"),
          }}
          options={{
            title: t("bottomTabs.wardrobe"),
            tabBarIcon: ({ color, size, focused }) => {
              return Platform.OS === 'ios' 
                ? { sfSymbol: 'tshirt' } 
                : <Shirt size={size} color={color} />;
            }
          }}
        />
        <Tab.Screen
          name="Community"
          component={CommunityScreen}
          listeners={{
            focus: () => setActiveTab("Community"),
          }}
          options={{
            title: t("bottomTabs.community"),
            tabBarIcon: ({ color, size, focused }) => {
              return Platform.OS === 'ios' 
                ? { sfSymbol: 'globe' } 
                : <Globe size={size} color={color} />;
            }
          }}
        />
        <Tab.Screen
          name="AIStylist"
          component={AIStylistScreen}
          listeners={{
            focus: () => setActiveTab("AIStylist"),
          }}
          options={{
            title: t("bottomTabs.styleHub"),
            tabBarIcon: ({ color, size, focused }) => {
              return Platform.OS === 'ios' 
                ? { sfSymbol: 'wand.and.stars' } 
                : <Wand2 size={size} color={color} />;
            }
          }}
        />
        <Tab.Screen
          name="Account"
          component={AccountScreen}
          listeners={{
            focus: () => setActiveTab("Account"),
          }}
          options={{
            title: t("bottomTabs.account"),
            tabBarIcon: ({ color, size, focused }) => {
              return Platform.OS === 'ios' 
                ? { sfSymbol: focused ? 'person.crop.circle.fill' : 'person.crop.circle' } 
                : <UserRound size={size} color={color} />;
            }
          }}
        />
      </Tab.Navigator>

      {/* Floating Plus Button (Conditionally rendered) */}
      {activeTab === "Wardrobe" && (
        <View style={[
          styles.floatingPlusContainer, 
          { 
            // Positioned higher to clear the tab bar properly on Android
            bottom: insets.bottom + 90,
            right: 20
          }
        ]}>
          <Pressable
            onPress={openModal}
            style={[styles.plusButton, { backgroundColor: activePurple }]}
          >
            <Plus size={responsiveHeight(3.5)} color="#fff" strokeWidth={2} />
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  modalOverlay: { 
    flex: 1, 
    justifyContent: "flex-end", 
    alignItems: "flex-end", 
    paddingRight: 10, // Reduced to 10 as requested
    backgroundColor: "rgba(0, 0, 0, 0.4)" 
  },
  modalContainer: { 
    alignItems: "flex-end", // Align bubble and triangle to the right
    width: 200, 
  },
  glassModalContent: { 
    borderRadius: 20, 
    width: 200, 
    overflow: "hidden", 
    borderWidth: 1, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 }, 
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
    marginTop: -responsiveHeight(1.2), 
    borderRadius: 4,
    // Shifting it more to the left to perfectly center on the purple button
    marginRight: responsiveHeight(3.1) - 6, 
  },
  floatingPlusContainer: {
    position: "absolute",
    zIndex: 1000,
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
  }
})

export default BottomNavigatorScreen
