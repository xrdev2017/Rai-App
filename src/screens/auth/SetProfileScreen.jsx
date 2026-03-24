import { Upload, CheckCircle2, Trash2, Eye, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  Alert,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useFormContext } from "react-hook-form";

import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import CameraUI from "../../components/CameraUI";
import {
  useUpdateProfileInfoMutation,
  useUpdateProfileMutation,
} from "../../redux/slices/authSlice";
import { gender } from "../../../assets/data/data";

export const ViewImageModal = ({
  isImageViewVisible,
  setIsImageViewVisible,
  image,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isImageViewVisible}
      onRequestClose={() => setIsImageViewVisible(false)}
    >
      <View className="flex-1 bg-black/90 justify-center items-center">
        <Image
          source={{ uri: image }}
          resizeMode="contain"
          className="w-[90%] h-[70%] rounded-2xl"
        />
        <Pressable
          onPress={() => setIsImageViewVisible(false)}
          className="mt-6 p-4 rounded-2xl bg-red-300/50"
        >
          <X color="red" />
        </Pressable>
      </View>
    </Modal>
  );
};

const SuccessModal = ({ successVisible }) => {
  return (
    <Modal animationType="fade" transparent={true} visible={successVisible}>
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="bg-white dark:bg-darkSurfaceSecondary rounded-2xl w-[80%] p-6 items-center">
          <Image
            source={require("../../../assets/images/profile-success.webp")}
          />
          <Text className="text-3xl font-SemiBold text-textPrimary mt-4 text-center">
            Successfully created your profile
          </Text>
          <Text className="text-[16px] text-center font-Medium text-textPrimary mt-4 mb-4 px-3">
            Fill rest of the data into privacy & setting option
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const SetProfileScreen = () => {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
    trigger,
  } = useFormContext();

  const [successVisible, setSuccessVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);

  const [updateProfileInfo, { isLoading }] = useUpdateProfileInfoMutation();

  // Watch form values for conditional rendering or validation
  const selectedGender = watch("gender");
  const nameValue = watch("name");
  const usernameValue = watch("username");

  const handleImageSelect = (uri) => {
    if (uri) {
      setImage(uri);
      clearErrors("image");
    }
  };

  const handleNext = async (data) => {
    // console.log("Profile Data:", data);
    
    // Trigger validation for all fields
    const isValid = await trigger(["name", "username", "gender"]);
    
    if (!isValid) {
      return;
    }

    if (!image) {
      setError("image", {
        type: "manual",
        message: "Please upload a profile photo",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data?.name);
      formData.append("username", data?.username);
      formData.append("gender", data?.gender);

      if (image) {
        formData.append("image", {
          uri: image,
          type: "image/jpeg",
          name: "profile.jpg",
        });
      }
      // console.log("LINE AT 643", formData);

      const response = await updateProfileInfo(formData).unwrap();
      // console.log("✅ Profile Update Success:", response);

      setSuccessVisible(true);
      setTimeout(() => {
        setSuccessVisible(false);
        navigation.navigate("Login");
      }, 2000);
    } catch (err) {
      // console.log("❌ Profile Update Error:", err);
      const errorMessage =
        err?.data?.message || "Profile update failed. Please try again.";

      setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
    });
    // console.log("IMAGE PICKER RESULT:", result);
    if (!result.canceled) {
      handleImageSelect(result.assets[0].uri);
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
          }}
        >
          {/* Header */}
          <View
            className="items-center"
            style={{ marginVertical: responsiveHeight(3) }}
          >
            <Text className="text-[24px] font-SemiBold text-textPrimary dark:text-darkTextPrimary mb-2">
              Personal Data
            </Text>
            <Text className="text-[14px] font-Regular text-textSecondary dark:text-darkTextPrimary text-center">
              Please fill all the data to start organizing your wardrobe
            </Text>
          </View>

          {/* Root Error Message */}
          {errors.root && (
            <View className="bg-red-50 p-3 rounded-lg border border-red-200 mb-4">
              <Text className="text-red-700 text-sm font-Medium text-center">
                {errors.root.message}
              </Text>
            </View>
          )}

          {/* Photo Upload */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="mb-10">
              <View className="flex-row items-center mb-2">
                <Text className="text-[18px] font-SemiBold text-gray-900 dark:text-darkTextPrimary">
                  Add Profile Photo
                </Text>
                <Text className="text-red-500 ml-1">*</Text>
              </View>
              
              {/* Image error message */}
              {errors.image && (
                <View className="mb-3">
                  <Text className="text-red-500 text-sm font-Medium">
                    {errors.image.message}
                  </Text>
                </View>
              )}

              {image ? (
                <View
                  className="w-full border border-gray-400 border-dashed rounded-xl items-center justify-center"
                  style={{
                    gap: responsiveHeight(3),
                    paddingVertical: responsiveHeight(5),
                  }}
                >
                  <Image source={require("../../../assets/images/tick3.png")} />
                  <Text className="text-lg font-Medium text-gray-900 dark:text-darkTextPrimary ">
                    Photo is successfully uploaded
                  </Text>

                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => setImage(null)}
                      className="p-4 rounded-2xl bg-red-300/50"
                    >
                      <Trash2 color="red" />
                    </Pressable>
                    <Pressable
                      onPress={() => setIsImageViewVisible(true)}
                      className="p-4 rounded-2xl bg-green-300/50"
                    >
                      <Eye color="green" />
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View
                  className={`w-full border ${
                    errors.image ? "border-red-500" : "border-gray-400"
                  } border-dashed rounded-xl items-center justify-center`}
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
                      source={require("../../../assets/images/camera.png")}
                    />
                    <Text className="text-textSecondary text-center font-Medium text-[16px]">
                      Tap the camera to take a photo
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={pickImage}
                    className="bg-surfaceActionTertiary py-4 rounded-full flex-row items-center justify-center gap-3"
                    style={{ paddingHorizontal: responsiveWidth(5) }}
                  >
                    <Upload size={20} color="#f4f4f4" />
                    <Text className="text-[16px] text-textPrimaryInverted font-SemiBold">
                      Upload from Gallery
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>

            {/* Form */}
            <View>
              {/* Name */}
              <View style={{ marginBottom: responsiveHeight(2) }}>
                <View className="flex-row items-center mb-2">
                  <Text className="text-[16px] font-Medium text-textPrimary dark:text-darkTextPrimary">
                    Name
                  </Text>
                  <Text className="text-red-500 ml-1">*</Text>
                </View>
                <Controller
                  control={control}
                  name="name"
                  rules={{
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                    maxLength: {
                      value: 50,
                      message: "Name must be less than 50 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z\s]*$/,
                      message: "Name can only contain letters and spaces",
                    },
                  }}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextInput
                        className={`border rounded-2xl px-4 py-4 text-base text-textPrimary dark:text-darkTextPrimary font-Medium bg-white dark:bg-zinc-600 ${
                          error ? "border-red-500" : "border-borderTertiary"
                        }`}
                        placeholder="Enter Name"
                        placeholderTextColor="#A0A0A0"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                      />
                      {error && (
                        <Text className="text-red-500 text-sm mt-1 font-Medium">
                          {error.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>

              {/* Username */}
              <View style={{ marginBottom: responsiveHeight(2) }}>
                <View className="flex-row items-center mb-2">
                  <Text className="text-[16px] font-Medium text-textPrimary dark:text-darkTextPrimary">
                    Username
                  </Text>
                  <Text className="text-red-500 ml-1">*</Text>
                </View>
                <Controller
                  control={control}
                  name="username"
                  rules={{
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                    maxLength: {
                      value: 30,
                      message: "Username must be less than 30 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: "Username can only contain letters, numbers, and underscores",
                    },
                  }}
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextInput
                        className={`border rounded-2xl px-4 py-4 text-base text-textPrimary dark:text-darkTextPrimary font-Medium bg-white dark:bg-zinc-600 ${
                          error ? "border-red-500" : "border-borderTertiary"
                        }`}
                        placeholder="Enter Username"
                        placeholderTextColor="#A0A0A0"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="none"
                      />
                      {error && (
                        <Text className="text-red-500 text-sm mt-1 font-Medium">
                          {error.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>

              {/* Gender */}
              <View className="mb-6">
                <View className="flex-row items-center mb-2">
                  <Text className="text-[16px] font-Medium text-textPrimary dark:text-darkTextPrimary">
                    Gender
                  </Text>
                  <Text className="text-red-500 ml-1">*</Text>
                </View>
                <Controller
                  control={control}
                  name="gender"
                  rules={{ required: "Please select your gender" }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <View className="flex-row gap-4">
                        {gender.map((genderItem) => (
                          <Pressable
                            key={genderItem.id}
                            className="flex-row items-center"
                            onPress={() => onChange(genderItem.value)}
                          >
                            <View
                              className={`w-5 h-5 rounded-full 
                                  ${
                                    value === genderItem.value
                                      ? "border-4"
                                      : "border-2"
                                  }
                                  items-center justify-center mr-2 ${
                                    value === genderItem.value
                                      ? "border-purple-700"
                                      : "border-gray-300"
                                  }`}
                            >
                              <View
                                className={`w-2.5 h-2.5 rounded-full ${
                                  value === genderItem.value
                                    ? "bg-white"
                                    : "bg-gray-200"
                                }`}
                              />
                            </View>
                            <Text className="text-[16px] text-textPrimary dark:text-darkTextPrimary font-Regular">
                              {genderItem.title}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                      {error && (
                        <Text className="text-red-500 text-sm mt-1 font-Medium">
                          {error.message}
                        </Text>
                      )}
                    </>
                  )}
                />
              </View>
            </View>

            <View className="pb-5"></View>
          </ScrollView>

          {/* Next Button */}
          <View
            style={{
              paddingVertical: responsiveHeight(2),
            }}
          >
            <Pressable
              onPress={handleSubmit(handleNext)}
              disabled={isLoading}
              className={`py-4 rounded-xl flex-row items-center justify-center ${
                isLoading || !image ? "bg-gray-300" : "bg-surfaceAction"
              }`}
            >
              <Text className="text-textPrimaryInverted font-SemiBold text-[16px]">
                {isLoading ? "Updating..." : "Next"}
              </Text>
            </Pressable>
          </View>

          {/* Success Modal */}
          <SuccessModal successVisible={successVisible} />

          <ViewImageModal
            isImageViewVisible={isImageViewVisible}
            setIsImageViewVisible={setIsImageViewVisible}
            image={image}
          />

          <CameraUI
            isCameraActive={isCameraActive}
            setIsCameraActive={setIsCameraActive}
            setPhotoPath={handleImageSelect}
            setShowFolderModal={setShowFolderModal}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SetProfileScreen;