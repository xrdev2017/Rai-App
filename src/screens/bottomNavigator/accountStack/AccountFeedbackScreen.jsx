// import { ArrowLeft } from "lucide-react-native";
// import React from "react";
// import { Controller, useFormContext } from "react-hook-form";
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   ScrollView,
//   StatusBar,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { responsiveWidth } from "react-native-responsive-dimensions";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useSendFeedbackMutation } from "../../../redux/slices/authSlice";

// const AccountFeedbackScreen = ({ navigation }) => {
//   const { control, handleSubmit, reset } = useFormContext();
//   const [title, setTitle] = React.useState("");
//   const [description, setDescription] = React.useState("");
//   const [isSubmitting, setIsSubmitting] = React.useState(false);

//   const handleGoBack = () => {
//     navigation?.goBack?.();
//   };
//   const [sendFeedback, { isLoading }] = useSendFeedbackMutation();
//   const handleFeedback = async (data) => {
//     console.log("LINE AT 30", data);

//     try {
//       const itemData = {
//         title: data?.feedbackTitle,
//         message: data?.feedbackDescription,
//       };
//       const response = await sendFeedback(itemData).unwrap();
//       reset({
//         feedbackTitle: "",
//         feedbackDescription: "",
//       });
//       console.log("LINE AT 39", response);
//     } catch (error) {
//       console.log("LINE AT 32", error);
//     }
//   };

//   return (
//     <SafeAreaView
//       className="flex-1 bg-white"
//       style={{
//         padding: responsiveWidth(5),
//       }}
//     >
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         className="flex-1 "
//       >
//         {/* Header */}
//         <View className="flex-row items-center  ">
//           <Pressable
//             onPress={handleGoBack}
//             activeOpacity={0.7}
//             className="w-10 h-10 justify-center items-center -ml-2"
//           >
//             <ArrowLeft color="#81739A" />
//           </Pressable>
//           <Text className="flex-1 text-center text-xl font-SemiBold text-textPrimary">
//             Feedback & Help
//           </Text>
//           <View
//             style={{
//               width: responsiveWidth(10),
//             }}
//           />
//         </View>

//         {/* Content */}
//         <ScrollView
//           className="flex-1"
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         >
//           <View className="pt-8">
//             <Text className="text-3xl font-SemiBold text-black text-center mb-3">
//               Did we forget something?
//             </Text>
//             <Text className="text-md text-gray-500 text-center leading-6 mb-10 px-2 font-Medium">
//               We don't bite. Get in touch with our support team if you've got
//               any.
//             </Text>

//             {/* Title Input */}

//             <View className="mb-2">
//               <Text className="text-[16px] font-Medium text-textPrimary mb-2">
//                 Title
//               </Text>
//               <Controller
//                 control={control}
//                 name="feedbackTitle"
//                 // rules={{
//                 //   required: "Email is required",
//                 //   pattern: {
//                 //     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                 //     message: "Enter a valid email address",
//                 //   },
//                 // }}
//                 render={({
//                   field: { onChange, onBlur, value },
//                   fieldState: { error },
//                 }) => (
//                   <>
//                     <TextInput
//                       className="border border-borderTertiary rounded-2xl px-4 py-4 text-base text-textPrimary font-Medium bg-white"
//                       placeholder="Enter email"
//                       placeholderTextColor="#A0A0A0"
//                       value={value}
//                       onChangeText={onChange}
//                       onBlur={onBlur}
//                       keyboardType="email-address"
//                       autoCapitalize="none"
//                     />
//                     {/* {error && (
//                         <Text className="text-red-500 text-sm mt-1">
//                           {error.message}
//                         </Text>
//                       )} */}
//                   </>
//                 )}
//               />
//             </View>

//             {/* Description Input */}

//             <View>
//               <Text className="text-[16px] font-Medium text-textPrimary mb-2">
//                 Description
//               </Text>
//               <Controller
//                 control={control}
//                 name="feedbackDescription"
//                 // rules={{
//                 //   required: "Email is required",
//                 //   pattern: {
//                 //     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                 //     message: "Enter a valid email address",
//                 //   },
//                 // }}
//                 render={({
//                   field: { onChange, onBlur, value },
//                   fieldState: { error },
//                 }) => (
//                   <>
//                     <TextInput
//                       className="border border-borderTertiary min-h-[120px] rounded-2xl px-4 py-4 text-base text-textPrimary font-Medium bg-white"
//                       placeholderTextColor="#A0A0A0"
//                       value={value}
//                       onChangeText={onChange}
//                       onBlur={onBlur}
//                       placeholder="Tell us more about your feedback..."
//                       multiline
//                       numberOfLines={8}
//                       textAlignVertical="top"
//                       maxLength={1000}
//                       returnKeyType="done"
//                     />
//                     {/* {error && (
//                         <Text className="text-red-500 text-sm mt-1">
//                           {error.message}
//                         </Text>
//                       )} */}
//                   </>
//                 )}
//               />
//             </View>

//             <View className="py-5">
//               <Pressable
//                 onPress={handleSubmit(handleFeedback)}
//                 disabled={isLoading}
//                 activeOpacity={0.8}
//                 className={`p-4 rounded-2xl justify-center items-center shadow-md ${
//                   isLoading ? "bg-gray-300" : "bg-surfaceAction"
//                 }`}
//               >
//                 <Text
//                   className={`text-xl font-Medium
//                     text-white
//                   `}
//                 >
//                   {isLoading ? "Sending..." : "Send"}
//                 </Text>
//               </Pressable>
//             </View>
//           </View>
//         </ScrollView>

//         {/* Send Button */}
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default AccountFeedbackScreen;

import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSendFeedbackMutation } from "../../../redux/slices/authSlice";
import i18n from "../../../utils/languageSetup"; // adjust import
import { useTheme } from "../../../utils/ThemeContext";

const AccountFeedbackScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useFormContext();
  const [sendFeedback, { isLoading }] = useSendFeedbackMutation();

  const handleGoBack = () => {
    navigation?.goBack?.();
  };

  const handleFeedback = async (data) => {
    try {
      const itemData = {
        title: data?.feedbackTitle,
        message: data?.feedbackDescription,
      };
      await sendFeedback(itemData).unwrap();
      reset({
        feedbackTitle: "",
        feedbackDescription: "",
      });
      navigation?.goBack?.();
    } catch (err) {
      // console.log("Feedback error:", err);
      const errorMessage =
        err?.data?.message || err?.error ||  err?.data?.error ||  "Login failed. Please try again.";
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
        formType: "feedback",
      });
    }
  };

// console.log('LINE AT 269', errors);


  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"}`}
      style={{ padding: responsiveWidth(5) }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center">
          <Pressable
            onPress={handleGoBack}
            activeOpacity={0.7}
            className="w-10 h-10 justify-center items-center -ml-2"
          >
            <ArrowLeft color={isDarkMode ? "#F5F4F7" : "#81739A"} />
          </Pressable>
          <Text className={`flex-1 text-center text-xl font-SemiBold ${isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"}`}>
            {i18n.t("feedback.title")}
          </Text>
          <View style={{ width: responsiveWidth(10) }} />
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="pt-8">
            <Text className={`text-3xl font-SemiBold text-center mb-3 ${isDarkMode ? "text-darkTextPrimary" : "text-black"}`}>
              {i18n.t("feedback.heading")}
            </Text>
            <Text className="text-md text-gray-500 text-center leading-6 mb-10 px-2 font-Medium">
              {i18n.t("feedback.subHeading")}
            </Text>

            {/* Title Input */}
            <View className="mb-2">
              <Text className="text-[16px] font-Medium text-textPrimary mb-2">
                {i18n.t("feedback.form.title")}
              </Text>
              <Controller
                control={control}
                name="feedbackTitle"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`border rounded-2xl px-4 py-4 text-base font-Medium ${isDarkMode ? "border-darkBorderTertiary bg-darkSurfaceSecondary text-darkTextPrimary" : "border-borderTertiary bg-white text-textPrimary"}`}
                    placeholder={i18n.t("feedback.form.titlePlaceholder")}
                    placeholderTextColor="#A0A0A0"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>

            {/* Description Input */}
            <View>
              <Text className="text-[16px] font-Medium text-textPrimary mb-2">
                {i18n.t("feedback.form.description")}
              </Text>
              <Controller
                control={control}
                name="feedbackDescription"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`border min-h-[120px] rounded-2xl px-4 py-4 text-base font-Medium ${isDarkMode ? "border-darkBorderTertiary bg-darkSurfaceSecondary text-darkTextPrimary" : "border-borderTertiary bg-white text-textPrimary"}`}
                    placeholder={i18n.t("feedback.form.descriptionPlaceholder")}
                    placeholderTextColor="#A0A0A0"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    numberOfLines={8}
                    textAlignVertical="top"
                    maxLength={1000}
                    returnKeyType="done"
                  />
                )}
              />
            </View>

            {/* Send Button */}
            <View className="py-5">
              <Pressable
                onPress={handleSubmit(handleFeedback)}
                disabled={isLoading}
                activeOpacity={0.8}
                className={`p-4 rounded-2xl justify-center items-center shadow-md ${
                  isLoading ? "bg-gray-300" : "bg-surfaceAction"
                }`}
              >
                <Text className="text-xl font-Medium text-white">
                  {isLoading
                    ? i18n.t("feedback.sending")
                    : i18n.t("feedback.send")}
                </Text>
              </Pressable>
            </View>

            {errors?.root?.formType === "feedback" && (
              <View className="bg-red-50 p-3 rounded-lg border border-red-200">
                <Text className="text-red-700 text-sm font-Medium text-center">
                  {errors?.root.message}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AccountFeedbackScreen;
