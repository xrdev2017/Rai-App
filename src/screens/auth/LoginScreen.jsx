import { CommonActions, useNavigation } from "@react-navigation/native";
import { Eye, EyeClosed } from "lucide-react-native";
import React, { useEffect, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useFormContext, Controller } from "react-hook-form";
import {
  useGoogleAppleSigninMutation,
  useLoginMutation,
} from "../../redux/slices/authSlice";
import {
  configureGoogleSignIn,
  handleGoogleLogin,
} from "../../utils/googleAuthService";
import {
  configureAppleSignIn,
  handleAppleLogin,
} from "../../utils/appleAuthService";
import { appleAuth } from "@invertase/react-native-apple-authentication";

const LoginScreen = () => {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid },
    clearErrors,
    reset,
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);
  const [isAppleSupported, setIsAppleSupported] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  // ✅ handle login
  const handleLogin = async (data) => {
    // console.log("📩 Login Data:", data);
    clearErrors();

    try {
      const response = await login({
        email: data.loginEmail,
        password: data.loginPassword,
      }).unwrap();

      // console.log("✅ Login Success:", response);

      // 🧹 clear form
      reset({
        email: "",
        password: "",
      });

      // 👉 navigate on success
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "BottomNavigator" }],
        })
      );
    } catch (err) {
      // console.log("❌ Login Error:", err);

      const errorMessage =
        err?.data?.message || err?.error || "Login failed. Please try again.";

      setError("root", {
        type: "manual",
        message: errorMessage,
        formType: "login",
      });
    }
  };

  useEffect(() => {
    configureGoogleSignIn(); // set up Google login once

    // Check if Apple Sign In is supported
    const checkAppleSupport = async () => {
      const supported = await configureAppleSignIn();
      setIsAppleSupported(supported);
    };

    checkAppleSupport();
  }, []);

  const [googleAppleSignin, { isLoading: googleLoading }] =
    useGoogleAppleSigninMutation();

  const onGoogleSignIn = async () => {
    const result = await handleGoogleLogin();
    if (result.success) {
      const itemData = {
        profileImage: result?.user?.photo,
        email: result?.user?.email,
      };

      const response = await googleAppleSignin(itemData).unwrap();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "BottomNavigator" }],
        })
      );
    } else {
      // console.log("Google Login failed:", result.error);
    }
  };

  // const onAppleSignIn = async () => {
  //   try {
  //     const result = await handleAppleLogin();

  //     if (result.success) {
  //       // Prepare data for your backend
  //       const itemData = {
  //         // identityToken: result.idToken,
  //         email: result.user.email,
  //         fullName: result.user.fullName,
  //         // authProvider: 'apple',
  //       };

  //       // Call your social signin mutation
  //       const response = await googleAppleSignin(itemData).unwrap();

  //       // console.log("✅ Apple Login Success:", response);

  //       navigation.dispatch(
  //         CommonActions.reset({
  //           index: 0,
  //           routes: [{ name: "BottomNavigator" }],
  //         })
  //       );
  //     } else {
  //       // console.log("Apple Login failed:", result.error);
  //       setError("root", {
  //         type: "manual",
  //         message: result.error || "Apple Sign In failed",
  //         formType: "apple",
  //       });
  //     }
  //   } catch (error) {
  //     // console.log("Apple Sign In error:", error);
  //     setError("root", {
  //       type: "manual",
  //       message: "Apple Sign In failed. Please try again.",
  //       formType: "apple",
  //     });
  //   }
  // };

  return (
    <SafeAreaView className="flex-1 bg-surfacePrimary dark:bg-darkSurfacePrimary">
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
          <ScrollView
            contentContainerStyle={{
              // flex: 1,

              gap: responsiveHeight(2),
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Form Content */}
            <View style={{ gap: responsiveHeight(2) }}>
              {/* Logo Section */}
              <View className="items-center">
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
              <View className="items-center">
                <Text className="text-[24px] font-SemiBold text-textPrimary dark:text-darkTextPrimary mb-2">
                  Welcome Back!
                </Text>
                <Text className="text-[14px] font-Regular text-textSecondary dark:text-darkTextSecondary text-center">
                  To login, enter your email address
                </Text>
              </View>

              {/* Email */}
              <View>
                <Text className="text-[16px] font-Medium text-textPrimary dark:text-darkTextPrimary mb-2">
                  Email
                </Text>
                <Controller
                  control={control}
                  name="loginEmail"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextInput
                        className="border border-borderTertiary dark:border-borderTertiary rounded-2xl px-4 py-4 text-base text-textPrimary dark:text-gray-200 font-Medium bg-white dark:bg-zinc-600"
                        placeholder="Enter email"
                        placeholderTextColor="#A0A0A0"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </>
                  )}
                />
              </View>

              {/* Password */}
              <View>
                <Text className="text-[16px] font-Medium text-textPrimary dark:text-darkTextPrimary mb-2">
                  Password
                </Text>
                <Controller
                  control={control}
                  name="loginPassword"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <View className="flex-row items-center border border-borderTertiary dark:bg-zinc-600 rounded-2xl bg-white">
                        <TextInput
                          className="flex-1 px-4 py-4 text-base text-gray-900 dark:text-gray-200"
                          placeholder="Enter Password"
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
                      {error && (
                        <Text className="text-red-500 text-sm mt-1">
                          {error.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>

              {/* Forgot Password */}
              <Pressable
                onPress={() => navigation.navigate("ForgotPassword")}
                className="items-end"
              >
                <Text className="text-[16px] text-textAction font-Medium">
                  Forgot Password?
                </Text>
              </Pressable>
            </View>

            {/* Submit + Extras */}
          </ScrollView>
          <View
            style={{
              gap: responsiveHeight(2),
            }}
          >
            <Pressable
              onPress={handleSubmit(handleLogin)}
              disabled={isLoading}
              className={`py-4 rounded-xl flex-row items-center justify-center ${
                isLoading ? "bg-gray-300" : "bg-surfaceAction"
              }`}
            >
              <Text className="text-textPrimaryInverted font-SemiBold text-[16px]">
                {isLoading ? "Logging in..." : "Login"}
              </Text>
            </Pressable>

            {/* login Error Message */}
            {errors?.root?.formType === "login" && (
              <View className="bg-red-50 p-3 rounded-lg border border-red-200">
                <Text className="text-red-700 text-sm font-Medium text-center">
                  {errors?.root.message}
                </Text>
              </View>
            )}

            <View className="flex-row justify-center items-center">
              <Text className="text-[14px] text-textSecondary font-Medium">
                Don't have an account?{" "}
              </Text>
              <Pressable onPress={() => navigation.navigate("Signup")}>
                <Text className="text-[14px] text-textAction font-Medium">
                  Create an account
                </Text>
              </Pressable>
            </View>

            {/* Divider */}
            <View className="flex-row items-center">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="mx-4 text-base text-textTertiary font-Medium">
                OR
              </Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            {/* Social Buttons */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={onGoogleSignIn}
                disabled={googleLoading}
                className="flex-1 bg-surfaceSecondary dark:bg-zinc-500 rounded-xl py-4 items-center flex-row justify-center gap-2"
              >
                <Image
                  source={require("../../../assets/images/google.webp")}
                  style={{
                    width: responsiveWidth(7),
                    height: responsiveWidth(7),
                  }}
                />
                <Text className="text-xl text-textAction font-SemiBold">
                  {googleLoading ? "Loading..." : "Google"}
                </Text>
              </Pressable>

              {/* Only show Apple button on supported devices (primarily iOS) */}
              {/* {isAppleSupported && (
                <Pressable
                  onPress={onAppleSignIn}
                  className="flex-1 bg-surfaceSecondary dark:bg-zinc-500 rounded-xl py-4 items-center flex-row justify-center gap-2"
                >
                  <Image
                    source={require("../../../assets/images/apple.webp")}
                    style={{
                      width: responsiveWidth(7),
                      height: responsiveWidth(7),
                    }}
                  />
                  <Text className="text-xl text-textAction font-SemiBold">
                    Apple
                  </Text>
                </Pressable>
              )} */}
            </View>

            {/* Apple login error */}
            {/* {errors?.root?.formType === "apple" && (
              <View className="bg-red-50 p-3 rounded-lg border border-red-200">
                <Text className="text-red-700 text-sm font-Medium text-center">
                  {errors?.root.message}
                </Text>
              </View>
            )} */}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default LoginScreen;
