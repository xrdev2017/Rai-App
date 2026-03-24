// import { ArrowLeft, Eye, Trash2, Upload } from "lucide-react-native";
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   StatusBar,
//   Pressable,
//   Image,
// } from "react-native";
// import {
//   responsiveHeight,
//   responsiveWidth,
// } from "react-native-responsive-dimensions";
// import CustomDatePicker from "../tabComponents/CustomDatePicker";
// import { SafeAreaView } from "react-native-safe-area-context";
// import * as ImagePicker from "expo-image-picker";
// import { ViewImageModal } from "../../auth/SetProfileScreen";
// import CameraUI from "../../../components/CameraUI";
// import { Controller, useFormContext } from "react-hook-form";
// import { gender, locations } from "../../../../assets/data/data";
// import CustomBottomSheet from "../../../components/CustomBottomSheet";
// import { useUpdateProfileMutation } from "../../../redux/slices/authSlice";
// import { useDispatch } from "react-redux";
// import { setUser } from "../../../redux/reducers/authReducer";

// const AccountPrivacyEditScreen = ({ navigation }) => {
//   const {
//     control,
//     setValue,
//     watch,
//     handleSubmit,
//     formState: { errors },
//     setError,
//   } = useFormContext();
//   const location = watch("location");
//   const handleGoBack = () => navigation?.goBack();

//   const [image, setImage] = useState(null);
//   const [isCameraActive, setIsCameraActive] = useState(false);
//   const [showFolderModal, setShowFolderModal] = useState(false);
//   const [isImageViewVisible, setIsImageViewVisible] = useState(false);

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       allowsEditing: false,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const uri = result.assets[0].uri;
//       setImage(uri);
//     }
//   };

//   // console.log(image);

//   const handleLocationSelect = (selected) => {
//     setValue("location", selected[0] || "");
//   };

//   const dispatch = useDispatch();
//   const [updateProfile, { isLoading }] = useUpdateProfileMutation();

//   const handleUpdateProfile = async (data) => {
//     console.log("Profile Data:", data);
//     // clearErrors();

//     // if (!image) {
//     //   console.log('no image')
//     //   setError("root", {
//     //     type: "manual",
//     //     message: "Please upload a profile photo",
//     //   });
//     //   return;
//     // }

//     try {
//       const formData = new FormData();
//       formData.append("name", data?.name);
//       formData.append("username", data?.username);
//       formData.append("gender", data?.gender);
//       formData.append("bio", data?.bio);
//       formData.append("dob", data?.dob);
//       formData.append("location", data?.location);

//       if (image) {
//         formData.append("file", {
//           uri: image,
//           type: "image/jpeg",
//           name: "profile.jpg",
//         });
//       }
//       console.log("LINE AT 643", formData);

//       const response = await updateProfile(formData).unwrap();
//       dispatch(setUser(response));
//       console.log("✅ Profile Update Success:", response);

//       handleGoBack();
//     } catch (err) {
//       console.log("❌ Profile Update Error:", err);
//       const errorMessage =
//         err?.data?.message || "Profile update failed. Please try again.";

//       setError("root", {
//         type: "manual",
//         message: errorMessage,
//       });

//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={{
//           flex: 1,
//           paddingHorizontal: responsiveWidth(5),
//           paddingTop: StatusBar.currentHeight || 0,
//           paddingBottom: responsiveHeight(2),
//         }}
//       >
//         {/* Header */}
//         <View className="flex-row items-center pb-5 ">
//           <Pressable
//             onPress={handleGoBack}
//             activeOpacity={0.7}
//             className="w-10 h-10 justify-center items-center -ml-2"
//           >
//             <ArrowLeft color="#81739A" />
//           </Pressable>
//           <Text className="flex-1 text-center text-xl font-SemiBold text-textPrimary">
//             Profile
//           </Text>
//           <View
//             style={{
//               width: responsiveWidth(10),
//             }}
//           />
//         </View>
//         {errors.root && (
//           <View className="bg-red-50 p-3 rounded-lg border border-red-200 mb-4">
//             <Text className="text-red-700 text-sm font-Medium text-center">
//               {errors.root.message}
//             </Text>
//           </View>
//         )}

//         <ScrollView
//           className="flex-1"
//           contentContainerStyle={{ paddingBottom: 20 }}
//           showsVerticalScrollIndicator={false}
//         >
//           <View>
//             <Text className="text-[18px] font-Semibold text-textPrimary mb-5">
//               Add Profile Photo
//             </Text>

//             {image ? (
//               <View
//                 className="w-full border border-gray-400 border-dashed rounded-xl items-center justify-center"
//                 style={{
//                   gap: responsiveHeight(3),
//                   paddingVertical: responsiveHeight(5),
//                 }}
//               >
//                 <Image
//                   source={require("../../../../assets/images/tick3.png")}
//                 />
//                 <Text className="text-lg font-Medium">
//                   Photo is successfully uploaded
//                 </Text>

//                 <View className="flex-row gap-2">
//                   <Pressable
//                     onPress={() => setImage(null)}
//                     className="p-4 rounded-2xl bg-red-300/50"
//                   >
//                     <Trash2 color="red" />
//                   </Pressable>
//                   {/* view image */}
//                   <Pressable
//                     onPress={() => setIsImageViewVisible(true)}
//                     className="p-4 rounded-2xl bg-green-300/50"
//                   >
//                     <Eye color="green" />
//                   </Pressable>
//                 </View>
//               </View>
//             ) : (
//               <View
//                 className="w-full border border-gray-400 border-dashed rounded-xl items-center justify-center"
//                 style={{
//                   gap: responsiveHeight(3),
//                   paddingVertical: responsiveHeight(5),
//                 }}
//               >
//                 <Pressable
//                   onPress={() => setIsCameraActive(true)}
//                   className="items-center justify-center gap-2"
//                 >
//                   <Image
//                     source={require("../../../../assets/images/camera.png")}
//                   />
//                   <Text className="text-textSecondary text-center font-Medium text-[16px]">
//                     Tap the camera to take a photo
//                   </Text>
//                 </Pressable>

//                 <Pressable
//                   onPress={pickImage}
//                   className="bg-surfaceActionTertiary py-4 rounded-full flex-row items-center justify-center gap-3"
//                   style={{ paddingHorizontal: responsiveWidth(5) }}
//                 >
//                   <Upload size={20} color="#f4f4f4" />
//                   <Text className="text-[16px] text-textPrimaryInverted font-SemiBold">
//                     Upload from Gallery
//                   </Text>
//                 </Pressable>
//               </View>
//             )}
//           </View>

//           {/* Form Fields */}
//           <View
//             style={{
//               gap: responsiveHeight(2),
//             }}
//           >
//             {/* Name */}
//             <View>
//               <Text className="text-[16px] font-Medium text-textPrimary mb-2">
//                 Name
//               </Text>
//               <Controller
//                 control={control}
//                 name="name"
//                 render={({
//                   field: { onChange, onBlur, value },
//                   fieldState: { error },
//                 }) => (
//                   <>
//                     <TextInput
//                       className="border border-borderTertiary rounded-2xl px-4 py-4 text-base text-textPrimary font-Medium bg-white"
//                       placeholder="Enter Name"
//                       placeholderTextColor="#A0A0A0"
//                       value={value}
//                       onChangeText={onChange}
//                       onBlur={onBlur}
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

//             {/* Username */}
//             <View>
//               <Text className="text-[16px] font-Medium text-textPrimary mb-2">
//                 Username
//               </Text>
//               <Controller
//                 control={control}
//                 name="username"
//                 render={({
//                   field: { onChange, onBlur, value },
//                   fieldState: { error },
//                 }) => (
//                   <>
//                     <TextInput
//                       className="border border-borderTertiary rounded-2xl px-4 py-4 text-base text-textPrimary font-Medium bg-white"
//                       placeholder="Enter Username"
//                       placeholderTextColor="#A0A0A0"
//                       value={value}
//                       onChangeText={onChange}
//                       onBlur={onBlur}
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

//             <Controller
//               control={control}
//               name="dob"
//               render={({ field: { onChange, value } }) => (
//                 <CustomDatePicker value={value} onChange={onChange} />
//               )}
//             />

//             <View>
//               <Text className="text-[16px] font-Medium text-textPrimary mb-2">
//                 Bio
//               </Text>
//               <Controller
//                 control={control}
//                 name="bio"
//                 render={({
//                   field: { onChange, onBlur, value },
//                   fieldState: { error },
//                 }) => (
//                   <>
//                     <TextInput
//                       className="border border-borderTertiary rounded-2xl px-4 py-4 text-base text-textPrimary font-Medium bg-white"
//                       placeholder="Enter your bio"
//                       placeholderTextColor="#A0A0A0"
//                       value={value}
//                       onChangeText={onChange}
//                       onBlur={onBlur}
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
//             {/* Gender */}

//             <View>
//               <Text className="text-[16px] font-Medium text-textPrimary mb-2">
//                 Gender
//               </Text>
//               <Controller
//                 control={control}
//                 name="gender"
//                 // rules={{ required: "Please select your gender" }}
//                 render={({
//                   field: { onChange, value },
//                   fieldState: { error },
//                 }) => (
//                   <>
//                     <View className="flex-row gap-4">
//                       {gender.map((gender) => (
//                         <Pressable
//                           key={gender.id}
//                           className="flex-row items-center"
//                           onPress={() => onChange(gender.value)}
//                         >
//                           <View
//                             className={`w-5 h-5 rounded-full
//                                                 ${value === gender.value ? "border-4" : "border-2"}
//                                                 items-center justify-center mr-2 ${
//                                                   value === gender.value
//                                                     ? "border-purple-700"
//                                                     : "border-gray-300"
//                                                 }`}
//                           >
//                             <View
//                               className={`w-2.5 h-2.5 rounded-full ${
//                                 value === gender.value
//                                   ? "bg-white"
//                                   : "bg-gray-200"
//                               }`}
//                             />
//                           </View>
//                           <Text className="text-[16px] text-textPrimary font-Regular">
//                             {gender.title}
//                           </Text>
//                         </Pressable>
//                       ))}
//                     </View>
//                   </>
//                 )}
//               />
//             </View>

//             <CustomBottomSheet
//               title="Location"
//               data={locations}
//               initialSelected={location ? [location] : []}
//               onChange={handleLocationSelect}
//               // isLoading={categoryLoading}
//               loadingText="Loading categories..."
//               // error={categoryError}
//               errorText="Failed to load categories"
//             />
//           </View>
//         </ScrollView>

//         {/* Save Button */}
//         <View>
//           <TouchableOpacity
//             className={`h-12 rounded-xl justify-center items-center ${isLoading ? "bg-gray-300" : "bg-surfaceAction"}`}
//             onPress={handleSubmit(handleUpdateProfile)}
//             disabled={isLoading}
//           >
//             <Text className="text-white text-lg font-SemiBold">
//               {isLoading ? "Saving..." : "Save"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//         <ViewImageModal
//           isImageViewVisible={isImageViewVisible}
//           setIsImageViewVisible={setIsImageViewVisible}
//           image={image}
//         />

//         <CameraUI
//           isCameraActive={isCameraActive}
//           setIsCameraActive={setIsCameraActive}
//           setPhotoPath={setImage}
//           setShowFolderModal={setShowFolderModal}
//         />
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default AccountPrivacyEditScreen;

import { ArrowLeft, Eye, Trash2, Upload } from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Image,
  StatusBar,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Controller, useFormContext } from "react-hook-form";
import i18n from "../../../utils/languageSetup";
import CustomDatePicker from "../tabComponents/CustomDatePicker";
import CustomBottomSheet from "../../../components/CustomBottomSheet";
import CameraUI from "../../../components/CameraUI";
import { ViewImageModal } from "../../auth/SetProfileScreen";
import { gender, locations } from "../../../../assets/data/data";
import {
  useUpdateProfileInfoMutation,
  useUpdateProfileMutation,
} from "../../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/reducers/authReducer";
import { useTheme } from "../../../utils/ThemeContext";

const AccountPrivacyEditScreen = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
    setError,
  } = useFormContext();
  const location = watch("location");
  const handleGoBack = () => navigation?.goBack();

  const [image, setImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleLocationSelect = (selected) => {
    setValue("location", selected[0] || "");
  };

  const dispatch = useDispatch();
  const [updateProfileInfo, { isLoading }] = useUpdateProfileInfoMutation();

  const handleUpdateProfile = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data?.name);
      formData.append("username", data?.username);
      formData.append("gender", data?.gender);
      formData.append("bio", data?.bio);
      formData.append("dob", data?.dob);
      formData.append("location", data?.location);

      if (image) {
        formData.append("image", {
          uri: image,
          type: "image/jpeg",
          name: "profile.jpg",
        });
      }

      const response = await updateProfileInfo(formData).unwrap();
      dispatch(setUser(response));
      handleGoBack();
      console.log("LINE AT 528", response);
    } catch (err) {
      const errorMessage =
        err?.data?.message || i18n.t("accountPrivacyEdit.profileUpdateFailed");
      setError("root", {
        type: "manual",
        message: errorMessage,
        formType: "editprofile",
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
        <View className="flex-row items-center pb-5">
          <Pressable
            onPress={handleGoBack}
            activeOpacity={0.7}
            className="w-10 h-10 justify-center items-center -ml-2"
          >
            <ArrowLeft color={isDarkMode ? "#F5F4F7" : "#81739A"} />
          </Pressable>
          <Text className={`flex-1 text-center text-xl font-SemiBold ${isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"}`}>
            {i18n.t("accountPrivacyEdit.title")}
          </Text>
          <View style={{ width: responsiveWidth(10) }} />
        </View>

        {/* Error Message */}
        {errors.root && errors.root.formType === "editprofile" && (
          <View
            className={`p-3 rounded-lg border mb-4 ${
              isDarkMode
                ? "bg-red-950/40 border-red-900"
                : "bg-red-50 border-red-200"
            }`}
          >
            <Text
              className={`text-sm font-Medium text-center ${
                isDarkMode ? "text-red-200" : "text-red-700"
              }`}
            >
              {errors.root.message}
            </Text>
          </View>
        )}

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Photo Section */}
          <View>
            <Text className={`text-[18px] font-Semibold mb-5 ${isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"}`}>
              {i18n.t("accountPrivacyEdit.addProfilePhoto")}
            </Text>

            {image ? (
              <View
                className={`w-full border border-dashed rounded-xl items-center justify-center ${isDarkMode ? "border-darkBorderTertiary bg-darkSurfaceSecondary" : "border-gray-400"}`}
                style={{
                  gap: responsiveHeight(3),
                  paddingVertical: responsiveHeight(5),
                }}
              >
                <Image
                  source={require("../../../../assets/images/tick3.png")}
                />
                <Text className={`text-lg font-Medium ${isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"}`}>
                  {i18n.t("accountPrivacyEdit.photoUploaded")}
                </Text>
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={() => setImage(null)}
                    className={`p-4 rounded-2xl ${
                      isDarkMode ? "bg-red-950/40" : "bg-red-300/50"
                    }`}
                  >
                    <Trash2 color={isDarkMode ? "#FCA5A5" : "red"} />
                  </Pressable>
                  <Pressable
                    onPress={() => setIsImageViewVisible(true)}
                    className={`p-4 rounded-2xl ${
                      isDarkMode ? "bg-emerald-950/40" : "bg-green-300/50"
                    }`}
                  >
                    <Eye color={isDarkMode ? "#6EE7B7" : "green"} />
                  </Pressable>
                </View>
              </View>
            ) : (
              <View
                className={`w-full border border-dashed rounded-xl items-center justify-center ${isDarkMode ? "border-darkBorderTertiary bg-darkSurfaceSecondary" : "border-gray-400"}`}
                style={{
                  gap: responsiveHeight(3),
                  paddingVertical: responsiveHeight(5),
                }}
              >
                <Pressable
                  onPress={() => setIsCameraActive(true)}
                  className="items-center justify-center gap-2"
                >
                  <Image
                    source={require("../../../../assets/images/camera.png")}
                  />
                  <Text
                    className={`text-center font-Medium text-[16px] ${
                      isDarkMode ? "text-darkTextSecondary" : "text-textSecondary"
                    }`}
                  >
                    {i18n.t("accountPrivacyEdit.tapCamera")}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={pickImage}
                  className="bg-surfaceActionTertiary py-4 rounded-full flex-row items-center justify-center gap-3"
                  style={{ paddingHorizontal: responsiveWidth(5) }}
                >
                  <Upload size={20} color="#f4f4f4" />
                  <Text className="text-[16px] text-textPrimaryInverted font-SemiBold">
                    {i18n.t("accountPrivacyEdit.uploadGallery")}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Form Fields */}
          <View style={{ gap: responsiveHeight(2) }}>
            {/** Name */}
            <View>
              <Text
                className={`text-[16px] font-Medium mb-2 ${
                  isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
                }`}
              >
                {i18n.t("accountPrivacyEdit.name")}
              </Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`border rounded-2xl px-4 py-4 text-base font-Medium ${isDarkMode ? "border-darkBorderTertiary bg-darkSurfaceSecondary text-darkTextPrimary" : "border-borderTertiary bg-white text-textPrimary"}`}
                    placeholder={i18n.t("accountPrivacyEdit.enterName")}
                    placeholderTextColor={isDarkMode ? "#8D859B" : "#A0A0A0"}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>

            {/** Username */}
            <View>
              <Text
                className={`text-[16px] font-Medium mb-2 ${
                  isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
                }`}
              >
                {i18n.t("accountPrivacyEdit.username")}
              </Text>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`border rounded-2xl px-4 py-4 text-base font-Medium ${isDarkMode ? "border-darkBorderTertiary bg-darkSurfaceSecondary text-darkTextPrimary" : "border-borderTertiary bg-white text-textPrimary"}`}
                    placeholder={i18n.t("accountPrivacyEdit.enterUsername")}
                    placeholderTextColor={isDarkMode ? "#8D859B" : "#A0A0A0"}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                  />
                )}
              />
            </View>

            {/** Date of Birth */}
            <Controller
              control={control}
              name="dob"
              render={({ field: { onChange, value } }) => (
                <CustomDatePicker value={value} onChange={onChange} />
              )}
            />

            {/** Bio */}
            <View>
              <Text
                className={`text-[16px] font-Medium mb-2 ${
                  isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
                }`}
              >
                {i18n.t("accountPrivacyEdit.bio")}
              </Text>
              <Controller
                control={control}
                name="bio"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`border rounded-2xl px-4 py-4 text-base font-Medium ${isDarkMode ? "border-darkBorderTertiary bg-darkSurfaceSecondary text-darkTextPrimary" : "border-borderTertiary bg-white text-textPrimary"}`}
                    placeholder={i18n.t("accountPrivacyEdit.enterBio")}
                    placeholderTextColor={isDarkMode ? "#8D859B" : "#A0A0A0"}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                  />
                )}
              />
            </View>

            {/** Gender */}
            <View>
              <Text
                className={`text-[16px] font-Medium mb-2 ${
                  isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
                }`}
              >
                {i18n.t("accountPrivacyEdit.gender")}
              </Text>
              <Controller
                control={control}
                name="gender"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row gap-4">
                    {gender.map((g) => (
                      <Pressable
                        key={g.id}
                        className="flex-row items-center"
                        onPress={() => onChange(g.value)}
                      >
                        <View
                          className={`w-5 h-5 rounded-full ${
                            value === g.value ? "border-4" : "border-2"
                          } items-center justify-center mr-2 ${
                            value === g.value
                              ? "border-purple-700"
                              : isDarkMode
                                ? "border-darkBorderTertiary"
                                : "border-gray-300"
                          }`}
                        >
                          <View
                            className={`w-2.5 h-2.5 rounded-full ${value === g.value ? (isDarkMode ? "bg-darkSurfacePrimary" : "bg-white") : (isDarkMode ? "bg-darkSurfaceSecondary" : "bg-gray-200")}`}
                          />
                        </View>
                        <Text
                          className={`text-[16px] font-Regular ${
                            isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
                          }`}
                        >
                          {g.title}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              />
            </View>

            {/** Location */}
            <CustomBottomSheet
              title={i18n.t("accountPrivacyEdit.location")}
              data={locations}
              initialSelected={location ? [location] : []}
              onChange={handleLocationSelect}
              loadingText={i18n.t("accountPrivacyEdit.loading")}
              errorText={i18n.t("accountPrivacyEdit.error")}
            />
          </View>
        </ScrollView>

        {/* Save Button */}
        <View>
          <TouchableOpacity
            className={`h-12 rounded-xl justify-center items-center ${isLoading ? "bg-gray-300" : "bg-surfaceAction"}`}
            onPress={handleSubmit(handleUpdateProfile)}
            disabled={isLoading}
          >
            <Text className="text-white text-lg font-SemiBold">
              {isLoading
                ? i18n.t("accountPrivacyEdit.saving")
                : i18n.t("accountPrivacyEdit.save")}
            </Text>
          </TouchableOpacity>
        </View>

        <ViewImageModal
          isImageViewVisible={isImageViewVisible}
          setIsImageViewVisible={setIsImageViewVisible}
          image={image}
        />

        <CameraUI
          isCameraActive={isCameraActive}
          setIsCameraActive={setIsCameraActive}
          setPhotoPath={setImage}
          setShowFolderModal={setShowFolderModal}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AccountPrivacyEditScreen;
