import { useNavigation } from "@react-navigation/native";
import { Eye, EyeClosed } from "lucide-react-native";
import { useState, useEffect } from "react";
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
import { useFormContext, Controller } from "react-hook-form";
import {
  useRegisterMutation,
  useGoogleAppleSigninMutation,
} from "../../redux/slices/authSlice";
import {
  configureGoogleSignIn,
  handleGoogleLogin,
} from "../../utils/googleAuthService";
import {
  configureAppleSignIn,
  handleAppleLogin,
} from "../../utils/appleAuthService";
import { SafeAreaView } from "react-native-safe-area-context";

const SignupScreen = () => {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    clearErrors,
    reset,
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isAppleSupported, setIsAppleSupported] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();
  const [googleAppleSignin, { isLoading: socialLoading }] =
    useGoogleAppleSigninMutation();

  // ✅ handle signup
  const handleSignup = async (data) => {
    // console.log("📩 Signup Data:", data);
    clearErrors();

    try {
      const response = await register({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }).unwrap();

      // console.log("✅ Signup Success:", response);

      // 🧹 clear form + errors
      reset({
        email: "",
        password: "",
        confirmPassword: "",
      });

      // 👉 navigate on success
      navigation.navigate("SetProfile");
    } catch (err) {
      // console.log("❌ Signup Error:", err);

      // Handle different error formats
      const errorMessage =
        err?.data?.message || err?.error || "Signup failed. Please try again.";

      setError("root", {
        type: "manual",
        message: errorMessage,
        formType: "signup",
      });
    }
  };

  useEffect(() => {
    configureGoogleSignIn();

    const checkAppleSupport = async () => {
      const supported = await configureAppleSignIn();
      setIsAppleSupported(supported);
    };

    checkAppleSupport();
  }, []);

  const onGoogleSignIn = async () => {
    const result = await handleGoogleLogin();
    if (result.success) {
      const itemData = {
        profileImage: result?.user?.photo,
        email: result?.user?.email,
      };

      try {
        const response = await googleAppleSignin(itemData).unwrap();
        // console.log("✅ Google Signup Success:", response);

        // Navigate to SetProfile or directly to main app
        navigation.navigate("SetProfile");
      } catch (error) {
        // console.log("Google signup backend error:", error);
        setError("root", {
          type: "manual",
          message: "Google signup failed. Please try again.",
          formType: "social",
        });
      }
    } else {
      // console.log("Google Signup failed:", result.error);
    }
  };

  const onAppleSignIn = async () => {
    try {
      const result = await handleAppleLogin();

      if (result.success) {
        // Prepare data with only email and profile image
        const itemData = {
          email: result.user.email,
          profileImage: result.user.profileImage,
          authProvider: "apple",
        };

        console.log("Apple signup data:", itemData);

        const response = await googleAppleSignin(itemData).unwrap();

        console.log("✅ Apple Signup Success:", response);

        // Navigate to SetProfile or directly to main app
        navigation.navigate("SetProfile");
      } else {
        console.log("Apple Signup failed:", result.error);
        setError("root", {
          type: "manual",
          message: result.error || "Apple Sign In failed",
          formType: "social",
        });
      }
    } catch (error) {
      console.log("Apple Sign In error:", error);
      setError("root", {
        type: "manual",
        message: "Apple Sign In failed. Please try again.",
        formType: "social",
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surfacePrimary dark:bg-darkSurfacePrimary">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            paddingHorizontal: responsiveWidth(5),
            paddingTop: StatusBar.currentHeight || 0,
            paddingBottom: responsiveHeight(3),
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
                  Create an account
                </Text>
              </View>

              {/* Email */}
              <View>
                <Text className="text-[16px] font-Medium text-textPrimary dark:text-darkTextPrimary mb-2">
                  Email
                </Text>
                <Controller
                  control={control}
                  name="email"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextInput
                        className="border border-borderTertiary rounded-2xl px-4 py-4 text-base text-textPrimary dark:text-darkTextPrimary font-Medium bg-white dark:bg-zinc-600"
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

              {/* Password */}
              <View>
                <Text className="text-[16px] font-Medium text-textPrimary dark:text-darkTextPrimary mb-2">
                  New Password
                </Text>
                <Controller
                  control={control}
                  name="password"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <View className="flex-row items-center border border-borderTertiary rounded-2xl bg-white dark:bg-zinc-600">
                        <TextInput
                          className="flex-1 px-4 py-4 text-base text-textPrimary dark:text-darkTextPrimary"
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

              {/* Confirm Password */}
              <View>
                <Text className="text-[16px] font-Medium text-textPrimary dark:text-darkTextPrimary mb-2">
                  Confirm Password
                </Text>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <View className="flex-row items-center border border-borderTertiary rounded-2xl bg-white dark:bg-zinc-600">
                        <TextInput
                          className="flex-1 px-4 py-4 text-base text-textPrimary dark:text-darkTextPrimary"
                          placeholder="Re-type Password"
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
                      {error && (
                        <Text className="text-red-500 text-sm mt-1">
                          {error.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>
            </View>

            {errors?.root && (
              <View className="bg-red-50 p-3 rounded-lg border border-red-200">
                <Text className="text-red-700 text-sm font-Medium text-center">
                  {errors.root.message}
                </Text>
              </View>
            )}
          </ScrollView>
          <View
            style={{
              marginTop: responsiveHeight(2),
              // gap: responsiveHeight(2),
            }}
          >
            <Pressable
              onPress={handleSubmit(handleSignup)}
              disabled={isLoading}
              className={`py-4 rounded-xl flex-row items-center justify-center ${
                isLoading ? "bg-gray-300" : "bg-surfaceAction"
              }`}
            >
              <Text className="text-textPrimaryInverted font-SemiBold text-[16px]">
                {isLoading ? "Processing..." : "Sign up"}
              </Text>
            </Pressable>

            {/* Error Messages */}

            <View className="flex-row justify-center items-center ">
              <Text className="text-[14px] text-textSecondary font-Medium">
                Already have an account?{" "}
              </Text>
              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text className="text-[14px] text-textAction font-Medium">
                  Login
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SignupScreen;
