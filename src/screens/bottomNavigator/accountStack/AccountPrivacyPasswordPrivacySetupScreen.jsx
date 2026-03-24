import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, ChevronRight } from "lucide-react-native";
import { responsiveWidth } from "react-native-responsive-dimensions";
import {
  useGetProfileUpdateQuery,
  useUpdateProfileMutation,
  authApi,
} from "../../../redux/slices/authSlice";
import i18n from "../../../utils/languageSetup";
import { useDispatch } from "react-redux";
import { useTheme } from "../../../utils/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

// Privacy Selection Modal Component
const PrivacySelectionModal = ({
  visible,
  onCancel,
  onSelect,
  currentSelection,
  title,
}) => {
  const { isDarkMode } = useTheme();
  const [selectedOption, setSelectedOption] = useState(currentSelection);

  useEffect(() => {
    setSelectedOption(currentSelection);
  }, [currentSelection, visible]);

  const options = [
    { id: "only_me", label: i18n.t("privacy.onlyYou") },
    { id: "everyone", label: i18n.t("privacy.everyone") },
    { id: "followers", label: i18n.t("privacy.followers") },
  ];

  const handleSelect = (optionId) => {
    setSelectedOption(optionId);
    onSelect(optionId);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center px-8"
        activeOpacity={1}
        onPress={onCancel}
      >
        <Pressable
          className={`rounded-2xl p-6 w-full max-w-sm ${
            isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"
          }`}
          activeOpacity={1}
          onPress={() => {}}
        >
          <View className="items-center mb-6">
            <Text className={`text-center text-xl font-SemiBold ${isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"}`}>
              {title}
            </Text>
          </View>

          <View className="space-y-1">
            {options.map((option) => (
              <Pressable
                key={option.id}
                className="flex-row items-center justify-between py-4"
                onPress={() => handleSelect(option.id)}
                activeOpacity={0.7}
              >
                <Text className={`text-base font-normal ${isDarkMode ? "text-darkTextPrimary" : "text-black"}`}>
                  {option.label}
                </Text>
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                    selectedOption === option.id
                      ? "border-surfaceAction"
                      : isDarkMode
                        ? "border-darkBorderTertiary"
                        : "border-gray-300"
                  }`}
                >
                  {selectedOption === option.id && (
                    <View className="w-3 h-3 rounded-full bg-surfaceAction" />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// Main Screen Component
const AccountPrivacyPasswordPrivacySetupScreen = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [currentModalType, setCurrentModalType] = useState("");
  const [optimisticUpdates, setOptimisticUpdates] = useState({});

  // Get profile data from RTK Query with more frequent polling
  const { data: profileData, refetch } = useGetProfileUpdateQuery(undefined, {
    pollingInterval: 30000, // Refetch every 30 seconds
  });

  const [updateProfile] = useUpdateProfileMutation();

  const privacyOptions = {
    only_me: i18n.t("privacy.onlyYou"),
    everyone: i18n.t("privacy.everyone"),
    followers: i18n.t("privacy.followers"),
  };

  const handleGoBack = () => navigation.goBack();

  const handleSettingPress = (type) => {
    setCurrentModalType(type);
    setShowModal(true);
  };

  const handleSelectionChange = async (optionId) => {
    try {
      // Apply optimistic update
      setOptimisticUpdates((prev) => ({
        ...prev,
        [currentModalType]: optionId,
      }));

      // Update the profile
      await updateProfile({ [currentModalType]: optionId }).unwrap();

      // Clear optimistic update
      setOptimisticUpdates((prev) => {
        const newUpdates = { ...prev };
        delete newUpdates[currentModalType];
        return newUpdates;
      });

      // Force refetch to get latest data
      refetch();

      // Invalidate the cache for profile data
      dispatch(authApi.util.invalidateTags(["Profile"]));

      setShowModal(false);
    } catch (error) {
      console.error("Error updating privacy settings:", error);
      // Revert optimistic update on error
      setOptimisticUpdates((prev) => {
        const newUpdates = { ...prev };
        delete newUpdates[currentModalType];
        return newUpdates;
      });
    }
  };

  const getSettingTitle = (type) => {
    const titles = {
      profile: i18n.t("privacy.profile"),
      items: i18n.t("privacy.items"),
      outfits: i18n.t("privacy.outfits"),
      lookbooks: i18n.t("privacy.lookbooks"),
    };
    return titles[type] || "";
  };

  // Get the current privacy value with optimistic updates
  const getPrivacyValue = (type) => {
    // Use optimistic update if available
    if (optimisticUpdates[type]) {
      return optimisticUpdates[type];
    }

    // Otherwise use the actual data
    return profileData?.privacy?.[type] || "everyone";
  };

  if (!profileData) {
    return (
      <View
        className={`flex-1 justify-center items-center ${
          isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"
        }`}
      >
        <Text
          className={`font-Medium ${
            isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
          }`}
        >
          {i18n.t("loading")}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"}`}>
      {/* Header */}
      <View className="flex-row items-center p-5 ">
        <Pressable
          onPress={handleGoBack}
          className="w-10 h-10 items-center justify-center -ml-2"
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} strokeWidth={2} color={isDarkMode ? "#F5F4F7" : "#000"} />
        </Pressable>
        <Text
          className={`flex-1 text-center text-xl font-SemiBold ${
            isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
          }`}
        >
          {i18n.t("privacy.title")}
        </Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      {/* Content */}
      <View className="flex-1 px-4 pt-6">
        <Text
          className={`text-xl font-SemiBold mb-4 ${
            isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
          }`}
        >
          {i18n.t("privacy.whereYouAppear")}
        </Text>

        {["profile", "items", "outfits", "lookbooks"].map((type) => (
          <Pressable
            key={type}
            className={`flex-row items-center justify-between py-4 border-b ${isDarkMode ? "border-darkBorderTertiary" : "border-gray-200"}`}
            onPress={() => handleSettingPress(type)}
            activeOpacity={0.7}
          >
            <View className="flex-1">
              <Text
                className={`text-lg font-SemiBold mb-1 ${
                  isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
                }`}
              >
                {i18n.t(`privacy.${type}`)}
              </Text>
              <Text
                className={`text-base font-Medium ${
                  isDarkMode ? "text-darkTextSecondary" : "text-textPrimary"
                }`}
              >
                {i18n.t("privacy.whoCanSee")}:{" "}
                {privacyOptions[getPrivacyValue(type)]}
                {optimisticUpdates[type] && " (Updating...)"}
              </Text>
            </View>
            <ChevronRight size={20} color={isDarkMode ? "#B8AFCC" : "#9ca3af"} />
          </Pressable>
        ))}
      </View>

      {/* Modal */}
      <PrivacySelectionModal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onSelect={handleSelectionChange}
        currentSelection={getPrivacyValue(currentModalType)}
        title={getSettingTitle(currentModalType)}
      />
    </SafeAreaView>
  );
};

export default AccountPrivacyPasswordPrivacySetupScreen;
