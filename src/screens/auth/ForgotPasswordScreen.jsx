import { useNavigation } from "@react-navigation/native";
import { Eye, EyeClosed, MoveLeft } from "lucide-react-native";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useForgotPasswordEmailMutation } from "../../redux/slices/authSlice";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { errors },
    setError,
    reset,
  } = useFormContext();

  const [forgotPasswordEmail, { isLoading }] = useForgotPasswordEmailMutation();

  const handleForgotPassword = async (data) => {
    // console.log("Forgot Data:", data);
    clearErrors();

    try {
      const response = await forgotPasswordEmail({
        email: data.forgotEmail,
      }).unwrap();

      // console.log("✅ Signup Success:", response);

      // 🧹 clear form + errors
      // reset({
      //   email: "",
      // });

      // 👉 navigate on success
      navigation.navigate("VerifyCode");
    } catch (err) {
      // console.log("❌ Signup Error:", err);

      // Handle different error formats
      const errorMessage =
        err?.data?.message || err?.error || "Signup failed. Please try again.";

      setError("root", {
        type: "manual",
        message: errorMessage,
        formType: "forgotPassword",
      });

      // Show alert for better user feedback
      // Alert.alert("Signup Failed", errorMessage);
    }
  };
  // console.log(errors.root);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-darkSurfacePrimary">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            // flex: 1,
            paddingHorizontal: responsiveWidth(5),
            paddingTop: StatusBar.currentHeight || 0,
            paddingBottom: responsiveHeight(2),
          }}
        >
          {/* Logo Section */}
          <View className="items-center ">
            <Image
              source={require("../../../assets/images/logo.webp")}
              style={{
                width: responsiveWidth(40),
                height: responsiveHeight(15),
              }}
              resizeMode="contain"
            />
          </View>

          {/* Welcome */}
          <View
            className="items-center "
            style={{ marginBottom: responsiveHeight(3) }}
          >
            <Text className="text-[24px] font-SemiBold text-textPrimary dark:text-darkTextPrimary  mb-2">
              Forgot Password
            </Text>
            <Text className="text-[14px] font-Regular text-textSecondary dark:text-darkTextPrimary text-center">
              Enter your email to reset password
            </Text>
          </View>

          {/* Form Section */}
          <ScrollView
            contentContainerStyle={{
              justifyContent: "center",
              gap: responsiveHeight(2),
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Email */}
            <View>
              <Text className="text-[16px] font-Medium text-textPrimary dark:text-darkTextPrimary mb-2">
                Email
              </Text>
              <Controller
                control={control}
                name="forgotEmail"
                // rules={{
                //   required: "Email is required",
                //   pattern: {
                //     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                //     message: "Enter a valid email address",
                //   },
                // }}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <>
                    <TextInput
                      className="border border-borderTertiary rounded-2xl px-4 py-4 text-base text-textPrimary dark:text-darkTextPrimary font-Medium bg-white dark:bg-gray-600"
                      placeholder="Enter email"
                      placeholderTextColor="#A0A0A0"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {error && (
                      <Text className="text-red-500 text-sm mt-1">
                        {error.message}
                      </Text>
                    )}
                  </>
                )}
              />
            </View>

            {/* Send Email */}
            <Pressable
              onPress={handleSubmit(handleForgotPassword)}
              className={`py-4 rounded-xl flex-row items-center justify-center ${
                isLoading ? "bg-gray-300" : "bg-surfaceAction"
              }`}
            >
              <Text className="text-textPrimaryInverted font-SemiBold text-[16px]">
                {isLoading ? "Processing..." : "Next"}
              </Text>
            </Pressable>

            {errors?.root?.formType === "forgotPassword" && (
              <View className="bg-red-50 p-3 rounded-lg border border-red-200">
                <Text className="text-red-700 text-sm font-Medium text-center">
                  {errors.root.message}
                </Text>
              </View>
            )}

            {/* Move to Login */}

            <Pressable
              onPress={() => navigation.navigate("Login")}
              className="flex-row justify-center items-center gap-3 mb-8"
            >
              <MoveLeft size={20} color={"#5700FE"} />

              <Text className="text-[16px] text-textPrimary dark:text-darkTextPrimary font-SemiBold">
                Back To Login
              </Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
