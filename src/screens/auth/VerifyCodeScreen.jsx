import { useNavigation } from "@react-navigation/native";
import { MoveLeft } from "lucide-react-native";
import { useRef, useState, useEffect } from "react";
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
import OTPTextInput from "react-native-otp-textinput";
import {
  useForgotPasswordEmailMutation,
  useVerifyCodeMutation,
} from "../../redux/slices/authSlice";
import { Controller, useFormContext } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../utils/ThemeContext";

const VerifyCodeScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const otpInput = useRef(null);
  const {
    control,
    handleSubmit,
    clearErrors,
    formState: { errors },
    setError,
    reset,
    getValues,
  } = useFormContext();

  const [forgotPasswordEmail, { isLoading }] = useForgotPasswordEmailMutation();
  const [verifyCode, { isLoading: verifyCodeLoading }] =
    useVerifyCodeMutation();
  const { forgotEmail } = getValues();

  // ✅ Timer state
  const [timer, setTimer] = useState(300); // 5 minutes in seconds (5 * 60 = 300)
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  // ✅ Timer effect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // ✅ Format timer to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleForgotPassword = async () => {
    if (isResendDisabled) return; // ✅ Prevent resend if timer is active

    clearErrors();

    try {
      const response = await forgotPasswordEmail({
        email: forgotEmail,
      }).unwrap();

      // console.log("✅ Resend Success:", response);

      // ✅ Reset timer to 5 minutes
      setTimer(300);
      setIsResendDisabled(true);
    } catch (err) {
      // console.log("❌ Resend Error:", err);
      const errorMessage =
        err?.data?.message ||
        err?.data?.error ||
        "Failed to resend code. Please try again.";

      setError("root", {
        type: "manual",
        message: errorMessage,
        formType: "resendOtp",
      });
    }
  };

  const handleVerifyCode = async (data) => {
    // console.log("Verification Data:", data);
    clearErrors();

    try {
      const response = await verifyCode({
        email: forgotEmail,
        otp: data.otp,
      }).unwrap();

      // console.log("✅ Verification Success:", response);

      // 🧹 clear form + errors
      // reset({
      //   // email: "",
      //   otp: "",
      // });

      // 👉 navigate on success
      navigation.navigate("ResetPassword");
    } catch (err) {
      // console.log("❌ Verification Error:", err);

      // Handle different error formats
      const errorMessage =
        err?.data?.message || err?.data?.error || "Please try again.";

      setError("root", {
        type: "manual",
        message: errorMessage,
        formType: "verifyOtp",
      });
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"}`}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
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
            <Text
              className={`text-[24px] font-SemiBold mb-2 ${
                isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
              }`}
            >
              Verify Code
            </Text>
            <Text
              className={`text-[14px] font-Regular text-center ${
                isDarkMode ? "text-darkTextSecondary" : "text-textSecondary"
              }`}
            >
              We Sent OTP code to your email {forgotEmail}. Enter the code below
              to verify
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
            <View className="items-center ">
              <Controller
                control={control}
                name="otp"
                // rules={{
                //   required: "OTP is required",
                //   minLength: {
                //     value: 4,
                //     message: "OTP must be 4 digits",
                //   },
                //   maxLength: {
                //     value: 4,
                //     message: "OTP must be 4 digits",
                //   },
                // }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <>
                    <OTPTextInput
                      ref={otpInput}
                      inputCount={4}
                      handleTextChange={(otp) => {
                        // console.log("Entered OTP:", otp);
                        onChange(otp);
                      }}
                      containerStyle={{
                        width: "80%",
                        justifyContent: "space-between",
                      }}
                      textInputStyle={{
                        backgroundColor: isDarkMode ? "#2D2633" : "#fff",
                        borderRadius: 10,
                        borderWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: isDarkMode ? "#8E54FE" : "#5700FE",
                        color: isDarkMode ? "#F5F4F7" : "#111827",
                        fontSize: 18,
                        fontWeight: "600",
                      }}
                      tintColor={isDarkMode ? "#8E54FE" : "#5700FE"}
                    />
                  </>
                )}
              />
            </View>

            {/* Login Button */}
            <Pressable
              onPress={handleSubmit(handleVerifyCode)}
              className={`py-4 rounded-xl flex-row items-center justify-center ${
                verifyCodeLoading ? "bg-gray-300" : "bg-surfaceAction"
              }`}
              disabled={verifyCodeLoading}
            >
              <Text className="text-textPrimaryInverted font-SemiBold text-[16px]">
                {verifyCodeLoading ? "Processing..." : "Next"}
              </Text>
            </Pressable>

            {/* Resend OTP Section */}
            <View className="flex-row justify-center items-center ">
              <Text
                className={`text-[14px] font-Medium ${
                  isDarkMode ? "text-darkTextSecondary" : "text-textSecondary"
                }`}
              >
                Don't receive OTP?{" "}
              </Text>
              <Pressable
                onPress={handleForgotPassword}
                disabled={isResendDisabled || isLoading}
              >
                <Text
                  className={`text-[14px] ${
                    isResendDisabled || isLoading
                      ? "text-gray-300"
                      : "text-textAction"
                  } font-Medium`}
                >
                  Resend again
                </Text>
              </Pressable>
            </View>

            {/* Timer Display */}
            {isResendDisabled && (
              <View className="items-center">
                <Text
                  className={`text-[14px] font-Medium ${
                    isDarkMode ? "text-darkTextSecondary" : "text-textSecondary"
                  }`}
                >
                  Resend available in: {formatTime(timer)}
                </Text>
              </View>
            )}

            {/* Error Messages */}
            {errors?.root?.formType === "verifyOtp" && (
              <View className="bg-red-50 p-3 rounded-lg border border-red-200">
                <Text className="text-red-700 text-sm font-Medium text-center">
                  {errors.root.message}
                </Text>
              </View>
            )}

            {errors?.root?.formType === "resendOtp" && (
              <View className="bg-red-50 p-3 rounded-lg border border-red-200">
                <Text className="text-red-700 text-sm font-Medium text-center">
                  {errors.root.message}
                </Text>
              </View>
            )}

            {/* Back to Login */}
            <Pressable
              onPress={() => navigation.navigate("Login")}
              className="flex-row justify-center items-center gap-3 "
            >
              <MoveLeft size={20} color={isDarkMode ? "#F5F4F7" : "#09020D"} />
              <Text
                className={`text-[16px] font-SemiBold ${
                  isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
                }`}
              >
                Back To Login
              </Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default VerifyCodeScreen;
