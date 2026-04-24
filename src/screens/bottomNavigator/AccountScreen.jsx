import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  I18nManager,
} from "react-native";
import {
  Bell,
  Languages,
  Settings,
  HelpCircle,
  Star,
  Share as ShareIcon,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomSwitch from "./tabComponents/CustomSwitch";
import CustomLanguageSelector from "./tabComponents/CustomLanguageSelector";
import { useNavigation } from "@react-navigation/native";

import { useLogoutMutation } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAuth,
  setNotificationsEnabled,
} from "../../redux/reducers/authReducer";
import Share from "react-native-share";
import i18n from "../../utils/languageSetup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useTheme } from "../../utils/ThemeContext"; // Add this import
import { responsiveHeight } from "react-native-responsive-dimensions";

const AccountScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(
    i18n.language || "en",
  );
  const navigation = useNavigation();

  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const notificationsEnabled = useSelector(
    (state) => state.auth.notificationsEnabled,
  );
  const user = useSelector((state) => state.auth.user);
  const googleApple = useSelector((state) => state.auth.googleApple);
  const token = useSelector((state) => state.auth.token);

  // Add dark mode hook
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Define available languages with proper language codes
  const availableLanguages = [
    { code: "en", displayName: "ENG" },
    // { code: "ru", displayName: "RUS" },
    { code: "es", displayName: "SPA" },
    { code: "fr", displayName: "FRE" },
  ];

  // Define languages for the CustomLanguageSelector component
  const languageDisplayNames = ["ENG", "SPA", "FRE"];

  const MenuItem = ({ Icon, title, rightElement, onPress }) => (
    <Pressable
      className={`flex-row items-center justify-between p-5 `}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1 gap-2">
        {Icon && <Icon size={20} stroke={isDarkMode ? "#F5F4F7" : "#000"} />}
        <Text
          className={`text-base font-Medium flex-1 ${
            isDarkMode ? "text-darkTextPrimary" : "text-black"
          }`}
        >
          {title}
        </Text>
      </View>
      {rightElement}
    </Pressable>
  );

  const handleShare = async () => {
    try {
      const message = i18n.t("account.shareProfileMessage", {
        username: user?.username,
      });
      await Share.open({ message, failOnCancel: false });
    } catch (err) {
      // if (err && err.message !== "User did not share")
      //   console.log("Share Error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearAuth());
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  const googleSignOut = async () => {
    try {
      if (token) {
        dispatch(clearAuth());
      } else {
        await GoogleSignin.signOut();
        dispatch(clearAuth());
      }
      // console.log("User signed out from Google");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleToggleNotification = (value) => {
    dispatch(setNotificationsEnabled(value));
  };

  const handleDarkModeToggle = (value) => {
    toggleDarkMode(value);
  };

  // Change language globally
  const handleLanguageChange = async (lang) => {
    // Find the language object based on display name
    const selectedLangObj = availableLanguages.find(
      (language) => language.displayName === lang,
    );

    if (!selectedLangObj) {
      // console.log("Language not found:", lang);
      return;
    }

    const languageCode = selectedLangObj.code;
    // console.log("Changing language to code:", languageCode);

    try {
      await AsyncStorage.setItem("appLanguage", languageCode);
      setSelectedLanguage(languageCode);

      // Change i18n language
      await i18n.changeLanguage(languageCode);

      // Handle RTL for languages that need it (Arabic, Hebrew, etc.)
      // For your current languages, none are RTL, but you can add if needed
      if (languageCode === "ar" || languageCode === "he") {
        I18nManager.forceRTL(true);
      } else {
        I18nManager.forceRTL(false);
      }

      // Force component re-render with new language
      // This might require app restart or navigation reset for some apps
      console.log("Language changed successfully to:", languageCode);
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("appLanguage");
        if (savedLanguage) {
          setSelectedLanguage(savedLanguage);
          i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.error("Failed to load language setting:", error);
      }
    };

    initializeLanguage();
  }, []);

  // Convert internal language code to display format for CustomLanguageSelector
  const getDisplayLanguage = () => {
    // Find the display name based on the current language code
    const currentLang = availableLanguages.find(
      (language) => language.code === selectedLanguage,
    );

    // Default to English if not found
    return currentLang ? currentLang.displayName : "ENG";
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-darkSurfacePrimary/90" : "bg-white"}`}
      style={{ paddingBottom: responsiveHeight(5) }}
    >
      {/* Header */}
      <View className={`p-5 items-center `}>
        <Text
          className={`text-xl font-SemiBold ${
            isDarkMode ? "text-darkTextPrimary" : "text-black"
          }`}
        >
          {i18n.t("account.title")}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: responsiveHeight(10) }}
      >
        {/* Profile Section */}
        <View className={`items-center px-5 `}>
          <Image
            source={{ uri: user?.profileImage }}
            className={`w-20 h-20 rounded-full mb-4 border ${
              isDarkMode ? "border-darkBorderAction" : "border-borderAction"
            }`}
          />
          <Text
            className={`text-lg font-SemiBold mb-1 ${
              isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
            }`}
          >
            {user?.name || user?.email}
          </Text>
          <Text
            className={`text-base font-Regular ${
              isDarkMode ? "text-darkTextSecondary" : "text-textSecondary"
            }`}
          >
            @{user?.username}
          </Text>
        </View>

        {/* Quick Settings */}
        <View
        // className={`${isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"}`}
        >
          <Text
            className={`text-lg font-SemiBold px-5 ${
              isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
            }`}
          >
            {i18n.t("account.quickSettings")}
          </Text>

          <MenuItem
            Icon={Bell}
            title={i18n.t("account.notifications")}
            rightElement={
              <CustomSwitch
                value={notificationsEnabled}
                onValueChange={handleToggleNotification}
                trackColor={{ false: "#E5E5E5", true: "#5700FE" }}
                thumbColor="#FFFFFF"
              />
            }
          />

          <MenuItem
            Icon={Moon}
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
            rightElement={
              <CustomSwitch
                value={isDarkMode}
                onValueChange={handleDarkModeToggle}
                trackColor={{ false: "#E5E5E5", true: "#5700FE" }}
                thumbColor="#FFFFFF"
              />
            }
          />

          <MenuItem
            Icon={Languages}
            title={i18n.t("account.language")}
            rightElement={
              <CustomLanguageSelector
                languages={languageDisplayNames}
                selectedLanguage={getDisplayLanguage()}
                onLanguageChange={handleLanguageChange}
                disabled={false}
              />
            }
          />
        </View>

        {/* Account Section */}
        <View
        // className={`${isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"}`}
        >
          <Text
            className={`text-lg font-SemiBold px-5 ${
              isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
            }`}
          >
            {i18n.t("account.accountSection")}
          </Text>

          <MenuItem
            Icon={Settings}
            title={i18n.t("account.privacySettings")}
            rightElement={
              <ChevronRight
                size={20}
                stroke={isDarkMode ? "#F5F4F7" : "#000"}
              />
            }
            onPress={() =>
              navigation.navigate("AccountStack", { screen: "AccountPrivacy" })
            }
          />

          <MenuItem
            Icon={HelpCircle}
            title={i18n.t("account.feedbackHelp")}
            rightElement={
              <ChevronRight
                size={20}
                stroke={isDarkMode ? "#F5F4F7" : "#000"}
              />
            }
            onPress={() =>
              navigation.navigate("AccountStack", { screen: "AccountFeedback" })
            }
          />

          <MenuItem
            Icon={ShareIcon}
            title={i18n.t("account.shareProfile")}
            onPress={handleShare}
          />

          <MenuItem
            Icon={LogOut}
            title={i18n.t("account.logout")}
            onPress={googleApple ? googleSignOut : handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountScreen;
