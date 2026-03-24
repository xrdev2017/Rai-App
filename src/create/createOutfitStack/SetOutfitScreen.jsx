import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Eye, Trash2, X } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { seasons } from "../../../assets/data/data";
import OptionSelector from "../../components/OptionSelector";
import { Controller, useFormContext } from "react-hook-form";
import { useGetAllStyleQuery } from "../../redux/slices/addItem/addItemSlice";
import { useCreateOutfitMutation } from "../../redux/slices/createOutfit/outfiltSlice";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../utils/ThemeContext";

const ViewImageModal = ({
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

const SetOutfitScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const {
    getValues,
    setValue,
    control,
    watch,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext();
  const outfitImage = watch("outfitImage");
  const outfitStyle = watch("outfitStyle");
  const outfitSeason = watch("outfitSeason");

  const { data: allStyles } = useGetAllStyleQuery();
  const [createOutfit, { isLoading }] = useCreateOutfitMutation();

  const handleSeasonSelect = (selectedSeason) =>
    setValue("outfitSeason", selectedSeason);
  const handleStyleSelect = (selectedStyle) =>
    setValue("outfitStyle", selectedStyle);

  const handleSave = async (data) => {
    clearErrors();
    try {
      const formData = new FormData();
      formData.append("title", data.outfitTitle);
      formData.append("season", data.outfitSeason);
      formData.append("style", data.outfitStyle);

      if (outfitImage) {
        const filename = outfitImage.split("/").pop();
        const match = /\.(\w+)$/.exec(filename || "");
        const type = match ? `image/${match[1]}` : "image/jpeg";
        formData.append("image", {
          uri: outfitImage,
          type,
          name: filename || "item.jpg",
        });
      }

      const response = await createOutfit(formData).unwrap();
      setValue("outfit", response);
      navigation.navigate("SaveOutfit");
    } catch (err) {
      console.log("LINE AT V466", err);
      const message = err?.data?.message || err?.data?.error;
      setError("root", {
        type: "createOutfit",
        message: message,
      });
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-darkSurfacePrimary/90" : "bg-white"}`}
      style={{ padding: responsiveWidth(5) }}
    >
      {/* Header */}
      <View className="flex-row items-center mb-5">
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-10 h-10 justify-center items-center -ml-2"
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#5700FE" />
        </Pressable>
        <Text
          className={`flex-1 text-center text-xl font-SemiBold ${
            isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
          }`}
        >
          {t("setOutfit.title")}
        </Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      {errors?.root && errors?.root.type === "createOutfit" && (
        <View className="bg-red-50 p-3 rounded-lg border border-red-200 mb-4">
          <Text className="text-red-700 text-sm font-Medium text-center">
            {errors?.root.message}
          </Text>
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          // paddingHorizontal: responsiveWidth(5),
          paddingTop: StatusBar.currentHeight || 0,
          // paddingBottom: responsiveHeight(2),
        }}
      >
        <ScrollView
          contentContainerStyle={{
            gap: responsiveHeight(2),
            paddingBottom: responsiveHeight(2),
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Outfit Image */}
          <View className="mb-10 relative">
            <View
              className={`w-full border rounded-lg items-center justify-center ${
                isDarkMode
                  ? "border-darkBorderTertiary bg-darkSurfaceSecondary"
                  : "border-borderTertiary"
              }`}
              style={{
                gap: responsiveHeight(3),
                paddingVertical: responsiveHeight(5),
              }}
            >
              {outfitImage ? (
                <View
                  className="items-center justify-center "
                  style={{ gap: responsiveHeight(3) }}
                >
                  <Image source={require("../../../assets/images/tick3.png")} />
                  <Text className="text-lg font-Medium text-textPrimary dark:text-darkTextPrimary">
                    {t("setOutfit.photoUploaded")}
                  </Text>
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => setIsImageViewVisible(true)}
                      className="p-4 rounded-2xl bg-green-300/50"
                    >
                      <Eye color="green" />
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Image source={require("../../../assets/images/shirt.png")} />
              )}
            </View>
          </View>

          {/* Title Input */}
          <View>
            <Text className="text-[16px] font-SemiBold text-textPrimary dark:text-darkTextPrimary mb-2">
              {t("setOutfit.titleLabel")}
            </Text>
            <Controller
              control={control}
              name="outfitTitle"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`border focus:border-borderAction rounded-2xl px-4 py-4 text-base font-Medium ${
                    isDarkMode
                      ? "border-darkBorderTertiary bg-darkSurfaceSecondary text-darkTextPrimary"
                      : "border-borderTertiary bg-white text-textPrimary"
                  }`}
                  placeholder={t("setOutfit.placeholderTitle")}
                  placeholderTextColor="#A0A0A0"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>

          {/* Season Selector */}
          <View>
            <Text className="text-[16px] font-SemiBold text-textPrimary dark:text-darkTextPrimary mb-2">
              {t("setOutfit.seasonLabel")}
            </Text>
            <View className="flex-row gap-4 flex-wrap">
              {seasons.map((opt) => (
                <OptionSelector
                  key={opt}
                  title={opt}
                  selectedValue={outfitSeason}
                  onSelect={handleSeasonSelect}
                />
              ))}
            </View>
          </View>

          {/* Style Selector */}
          <View>
            <Text className="text-[16px] font-SemiBold text-textPrimary dark:text-darkTextPrimary mb-2">
              {t("setOutfit.styleLabel")}
            </Text>
            <View className="flex-row gap-4 flex-wrap">
              {allStyles?.styles.map((opt) => (
                <OptionSelector
                  key={opt?._id}
                  title={opt?.name}
                  selectedValue={outfitStyle}
                  onSelect={handleStyleSelect}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <Pressable
          className={`${isLoading ? "bg-gray-300" : "bg-surfaceAction"} py-4 rounded-xl my-4`}
          onPress={handleSubmit(handleSave)}
        >
          <Text className="text-white font-SemiBold text-[16px] text-center">
            {t("setOutfit.saveButton")}
          </Text>
        </Pressable>
      </KeyboardAvoidingView>

      <ViewImageModal
        isImageViewVisible={isImageViewVisible}
        setIsImageViewVisible={setIsImageViewVisible}
        image={outfitImage}
      />
    </SafeAreaView>
  );
};

export default SetOutfitScreen;
