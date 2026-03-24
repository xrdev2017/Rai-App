import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { useSelector } from "react-redux";
import i18n from "../../../utils/languageSetup";
import { useTheme } from "../../../utils/ThemeContext";

const AccountPrivacyPersonalScreen = ({ navigation }) => {
  const user = useSelector((state) => state.auth.user);
  const { isDarkMode } = useTheme();

  console.log("LINE AT 18", user);

  const handleGoBack = () => {
    if (navigation) navigation.goBack();
  };

  const InfoField = ({ labelKey, value, onPress, className }) => {
    const label = i18n.t(`accountPrivacyPersonal.${labelKey}`);
    return (
      <Pressable
        className={`px-5 py-5 min-h-[70px] ${className || ""}`}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: isDarkMode ? "rgba(139, 84, 254, 0.1)" : "#F0F0F0",
        }}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text
          className={`text-base font-SemiBold mb-2 ${
            isDarkMode ? "text-darkTextPrimary" : "text-black"
          }`}
        >
          {label}
        </Text>
        <Text
          className={`text-base font-Regular leading-[22px] ${
            value
              ? isDarkMode
                ? "text-darkTextSecondary"
                : "text-[#333]"
              : isDarkMode
                ? "text-darkTextTertiary italic"
                : "text-[#C7C7CC] italic"
          }`}
        >
          {value ||
            i18n.t("accountPrivacyPersonal.enterField", { field: label })}
        </Text>
      </Pressable>
    );
  };

  const handleFieldPress = (fieldKey) => {
    console.log(`Edit ${fieldKey} pressed`);
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-darkSurfacePrimary/90" : "bg-white"}`}
    >
      {/* Header */}
      <View className={`flex-row items-center p-5 `}>
        <Pressable
          onPress={handleGoBack}
          className="w-10 h-10 justify-center items-center -ml-2"
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={isDarkMode ? "#F5F4F7" : "#000"} />
        </Pressable>
        <Text
          className={`flex-1 text-center text-xl font-SemiBold ${
            isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
          }`}
        >
          {i18n.t("accountPrivacyPersonal.title")}
        </Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      {/* Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View>
          <InfoField
            labelKey="name"
            value={user?.name}
            onPress={() => handleFieldPress("name")}
          />
          <InfoField
            labelKey="username"
            value={user?.username}
            onPress={() => handleFieldPress("username")}
          />
          <InfoField
            labelKey="email"
            value={user?.email}
            onPress={() => handleFieldPress("email")}
          />
          <InfoField
            labelKey="dob"
            value={user?.dob}
            onPress={() => handleFieldPress("dob")}
          />
          <InfoField
            labelKey="gender"
            value={user?.gender}
            onPress={() => handleFieldPress("gender")}
          />
          <InfoField
            labelKey="bio"
            value={user?.bio}
            onPress={() => handleFieldPress("bio")}
          />
          <InfoField
            labelKey="location"
            value={user?.location}
            onPress={() => handleFieldPress("location")}
            className="border-b-0"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountPrivacyPersonalScreen;
