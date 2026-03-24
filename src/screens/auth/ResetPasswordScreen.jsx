import { useNavigation } from "@react-navigation/native";
import { Eye, EyeClosed } from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
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
import { useResetPasswordMutation } from "../../redux/slices/authSlice";
import { Controller, useFormContext } from "react-hook-form";

const ResetPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { errors },
    setError,
    reset,
    getValues,
  } = useFormContext();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const { forgotEmail } = getValues();
  // console.log("LINJE AT 45", forgotEmail);

  const handleResetPassword = async (data) => {
    // console.log("Forgot Data:", data);
    clearErrors();

    try {
      const response = await resetPassword({
        email: forgotEmail,
        newPassword: data.resetPassword,
        confirmPassword: data.resetConfirmPassword,
      }).unwrap();

      // console.log("✅ Signup Success:", response);

      // 🧹 clear form + errors
      // reset({
      //   email: "",
      // });

      // 👉 navigate on success
      navigation.navigate("ResetPasswordSuccess");
    } catch (err) {
      // console.log("❌ Reset Error:", err);

      // Handle different error formats
      const errorMessage =
        err?.data?.message || err?.error || "Signup failed. Please try again.";

      setError("root", {
        type: "manual",
        message: errorMessage,
        formType: "resetPassword",
      });

      // Show alert for better user feedback
      // Alert.alert("Signup Failed", errorMessage);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-darkSurfacePrimary">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            paddingHorizontal: responsiveWidth(5),
            paddingTop: StatusBar.currentHeight || 0,
            paddingBottom: responsiveHeight(2),
          }}
        >
          {/* Logo Section */}

          {/* Form Section */}
          <ScrollView
            contentContainerStyle={{
              justifyContent: "center",
              gap: responsiveHeight(2),
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
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
              <Text className="text-[24px] font-SemiBold text-textPrimary dark:text-darkTextPrimary mb-2">
                Set new password
              </Text>
              <Text className="text-[14px] font-Regular text-textSecondary dark:text-darkTextPrimary text-center">
                Set a new password and continue your journey
              </Text>
            </View>
            <View>
              <Text className="text-[16px] font-Medium text-textPrimary dark:text-darkTextPrimary mb-2">
                New Password
              </Text>
              <Controller
                control={control}
                name="resetPassword"
                // rules={{
                //   required: "Password is required",
                //   minLength: {
                //     value: 6,
                //     message: "Password must be at least 6 characters",
                //   },
                // }}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <>
                    <View className="flex-row items-center border border-borderTertiary rounded-2xl bg-white dark:bg-gray-600">
                      <TextInput
                        className="flex-1 px-4 py-4 text-base text-gray-900 dark:text-darkTextPrimary"
                        placeholder="Type a strong password"
                        placeholderTextColor="#A0A0A0"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showPassword}
                      />
                      <Pressable
                        className="px-4 py-4"
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye size={20} color={"#C5BFD1"} />
                        ) : (
                          <EyeClosed size={20} color={"#C5BFD1"} />
                        )}
                      </Pressable>
                    </View>
                    {/* {error && (
                <Text className="text-red-500 text-sm mt-1">
                  {error.message}
                </Text>
              )} */}
                  </>
                )}
              />
            </View>

            <View>
              <Text className="text-[16px] font-Medium text-textPrimary dark:text-darkTextPrimary mb-2">
                Confirm Password
              </Text>
              <Controller
                control={control}
                name="resetConfirmPassword"
                // rules={{
                //   required: "Please confirm your password",
                //   validate: (value) =>
                //     value === getValues().password || "Passwords do not match",
                // }}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <>
                    <View className="flex-row items-center border border-borderTertiary rounded-2xl bg-white dark:bg-gray-600">
                      <TextInput
                        className="flex-1 px-4 py-4 text-base text-gray-900 dark:text-darkTextPrimary"
                        placeholder="Re-type password"
                        placeholderTextColor="#A0A0A0"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showPassword2}
                      />
                      <Pressable
                        className="px-4 py-4"
                        onPress={() => setShowPassword2(!showPassword2)}
                      >
                        {showPassword2 ? (
                          <Eye size={20} color={"#C5BFD1"} />
                        ) : (
                          <EyeClosed size={20} color={"#C5BFD1"} />
                        )}
                      </Pressable>
                    </View>
                    {/* {error && (
                <Text className="text-red-500 text-sm mt-1">
                  {error.message}
                </Text>
              )} */}
                  </>
                )}
              />
            </View>

            {/* Forgot Password */}

            {/* Login Button */}
            <Pressable
              onPress={handleSubmit(handleResetPassword)}
              // className="bg-surfaceAction py-4 rounded-xl flex-row items-center justify-center"
              className={`py-4 rounded-xl flex-row items-center justify-center ${
                isLoading ? "bg-gray-300" : "bg-surfaceAction"
              }`}
              style={{ marginBottom: responsiveHeight(3) }}
            >
              {/* <Text className="text-textPrimaryInverted font-SemiBold text-[16px]">
                Save
              </Text> */}
              <Text className="text-textPrimaryInverted font-SemiBold text-[16px]">
                {isLoading ? "Processing..." : "Save"}
              </Text>
            </Pressable>

            {errors?.root?.formType === "resetPassword" && (
              <View className="bg-red-50 p-3 rounded-lg border border-red-200">
                <Text className="text-red-700 text-sm font-Medium text-center">
                  {errors.root.message}
                </Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;
