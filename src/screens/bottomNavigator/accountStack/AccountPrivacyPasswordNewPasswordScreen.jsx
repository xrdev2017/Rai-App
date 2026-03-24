
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useUpdatePasswordMutation } from "../../../redux/slices/authSlice";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../utils/ThemeContext";

const AccountPrivacyPasswordNewPasswordScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useFormContext();
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const handleGoBack = () => {
    navigation?.goBack?.();
  };

  const handleUpdatePassword = async (data) => {
    try {
      const itemData = {
        currentPassword: data?.currentPassword,
        newPassword: data?.resetNewPassword,
        confirmPassword: data?.resetConfirmPassword,
      };
      const response = await updatePassword(itemData).unwrap();
      console.log("Update Password", response);
      navigation?.goBack?.();
    } catch (err) {
      console.log(err);
      const errorMessage =
        err?.data?.message ||
        err?.error ||
        err?.data?.error ||
        "Login failed. Please try again.";
      // err.data.errorMessages.forEach(({ path, message }) => {
      //           const field = path || 'root'; // use 'root' if no specific field
      //           setError(field, {
      //             type: 'server',
      //             message,
      //           });
      //         });
      setError("root", {
        type: "manual",
        message: errorMessage,
        formType: "newpassword",
      });
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          paddingHorizontal: responsiveWidth(5),
          paddingTop: StatusBar.currentHeight || 0,
          paddingBottom: responsiveHeight(2),
        }}
      >
        {/* Header */}
        <View className="flex-row items-center py-5 ">
          <Pressable
            onPress={handleGoBack}
            activeOpacity={0.7}
            className="w-10 h-10 justify-center items-center -ml-2"
          >
            <ArrowLeft color={isDarkMode ? "#F5F4F7" : "#81739A"} />
          </Pressable>
          <Text className={`flex-1 text-center text-xl font-SemiBold ${isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"}`}>
            {t("accountPrivacyPasswordNewPassword.title")}
          </Text>
          <View style={{ width: responsiveWidth(10) }} />
        </View>

        {/* Content */}
        <ScrollView
          // className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 , gap:responsiveHeight(2)}}
        >
          {/* <View
            style={{
              paddingHorizontal: responsiveWidth(4),
              // paddingTop: responsiveHeight(4),
              gap: responsiveHeight(2),
            }}
          > */}
          {/* Current Password */}
          <View>
            <Text className="text-[16px] font-Medium text-textPrimary mb-2">
              {t("accountPrivacyPasswordNewPassword.currentPassword")}
            </Text>
            <Controller
              control={control}
              name="currentPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`border rounded-2xl px-4 py-4 text-base font-Medium ${isDarkMode ? "border-darkBorderTertiary bg-darkSurfaceSecondary text-darkTextPrimary" : "border-borderTertiary bg-white text-textPrimary"}`}
                  placeholder={t(
                    "accountPrivacyPasswordNewPassword.placeholders.currentPassword"
                  )}
                  placeholderTextColor="#A0A0A0"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                />
              )}
            />
          </View>

          {/* New Password */}
          <View>
            <Text className="text-[16px] font-Medium text-textPrimary mb-2">
              {t("accountPrivacyPasswordNewPassword.newPassword")}
            </Text>
            <Controller
              control={control}
              name="resetNewPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`border rounded-2xl px-4 py-4 text-base font-Medium ${isDarkMode ? "border-darkBorderTertiary bg-darkSurfaceSecondary text-darkTextPrimary" : "border-borderTertiary bg-white text-textPrimary"}`}
                  placeholder={t(
                    "accountPrivacyPasswordNewPassword.placeholders.newPassword"
                  )}
                  placeholderTextColor="#A0A0A0"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                />
              )}
            />
          </View>

          {/* Confirm Password */}
          <View>
            <Text className="text-[16px] font-Medium text-textPrimary mb-2">
              {t("accountPrivacyPasswordNewPassword.confirmPassword")}
            </Text>
            <Controller
              control={control}
              name="resetConfirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`border rounded-2xl px-4 py-4 text-base font-Medium ${isDarkMode ? "border-darkBorderTertiary bg-darkSurfaceSecondary text-darkTextPrimary" : "border-borderTertiary bg-white text-textPrimary"}`}
                  placeholder={t(
                    "accountPrivacyPasswordNewPassword.placeholders.confirmPassword"
                  )}
                  placeholderTextColor="#A0A0A0"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                />
              )}
            />
          </View>

          {/* Submit Button */}
          <View className="py-5">
            <Pressable
              onPress={handleSubmit(handleUpdatePassword)}
              disabled={isLoading}
              activeOpacity={0.8}
              className={`p-4 rounded-2xl justify-center items-center shadow-md ${
                isLoading ? "bg-gray-300" : "bg-surfaceAction"
              }`}
            >
              <Text className="text-xl font-Medium text-white">
                {isLoading
                  ? t("accountPrivacyPasswordNewPassword.button.sending")
                  : t("accountPrivacyPasswordNewPassword.button.send")}
              </Text>
            </Pressable>
          </View>

          {errors?.root?.formType === "newpassword" && (
            <View className="bg-red-50 p-3 rounded-lg border border-red-200">
              <Text className="text-red-700 text-sm font-Medium text-center">
                {errors?.root.message}
              </Text>
            </View>
          )}
          {/* </View> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AccountPrivacyPasswordNewPasswordScreen;
