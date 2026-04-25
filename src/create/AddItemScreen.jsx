import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  Upload,
  CheckCircle2,
  ArrowLeft,
  Eye,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  StatusBar,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomBottomSheet from "../components/CustomBottomSheet";
import { seasons } from "../../assets/data/data";
import OptionSelector from "../components/OptionSelector";
import ColorPalette from "../components/ColorPallete";
import * as ImagePicker from "expo-image-picker";
import CameraUI from "../components/CameraUI";
import { Controller, useFormContext } from "react-hook-form";
import {
  useCreateAddItemMutation,
  useGetAllCategoryQuery,
  useGetAllMaterialQuery,
  useGetAllStyleQuery,
} from "../redux/slices/addItem/addItemSlice.js";
import { useTranslation } from "react-i18next";
import ProcessingOverlay from "../components/ProcessingOverlay";

const ViewImageModal = ({
  isImageViewVisible,
  setIsImageViewVisible,
  image,
}) => {
  const { t } = useTranslation();
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

const AddItemScreen = () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    clearErrors,
    setError,
    reset,
    formState: { errors },
  } = useFormContext();

  const { t } = useTranslation();

  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const mutationPromiseRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      reset();
      setImage(null);
      setProgress(0);
      setShowProcessing(false);
    }, [reset])
  );

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImage(uri);
      }
    } catch (error) {
      // console.log("LINE AT 99", error);
    }
  };

  const {
    data: allStyles,
    isError: allStylesError,
    isLoading: allStylesLoading,
  } = useGetAllStyleQuery();

  const itemStyle = watch("itemStyle");
  const itemTitle = watch("itemTitle");
  const itemBrand = watch("itemBrand");

  const category = watch("category");
  const material = watch("material");
  const season = watch("season");

  const [createAddItem, { isLoading }] = useCreateAddItemMutation();

  const handleCategorySelect = (selected) => {
    // If selected is an object, store its ID
    const categoryValue = typeof selected === "object" ? selected?._id : selected;
    setValue("category", categoryValue || "");
  };

  const handleMaterialSelect = (selected) => {
    // If selected is an object, store its ID
    const materialValue = typeof selected === "object" ? selected?._id : selected;
    setValue("material", materialValue || "");
  };

  const handleSeasonSelect = (selectedSeason) => {
    setValue("season", selectedSeason);
  };

  const handleStyleSelect = (selectedStyle) => {
    setValue("itemStyle", selectedStyle);
  };

  const {
    data: categories,
    isLoading: categoryLoading,
    error: categoryError,
  } = useGetAllCategoryQuery();
  const {
    data: materials,
    isLoading: materialLoading,
    error: materialError,
  } = useGetAllMaterialQuery();

  const handleCancelProcessing = () => {
    if (mutationPromiseRef.current) {
      mutationPromiseRef.current.abort();
      mutationPromiseRef.current = null;
    }
    setShowProcessing(false);
    setProgress(0);
  };

  const handleApply = async (data) => {
    try {
      const formData = new FormData();

      formData.append("title", data.itemTitle);
      formData.append("brand", data.itemBrand);
      formData.append("category", data.category);
      formData.append("material", data.material);
      formData.append("season", data.season);
      formData.append("style", data.itemStyle);

      if (data.itemColors && data.itemColors.length > 0) {
        formData.append("colors", data.itemColors);
      }

      if (image) {
        const filename = image.split("/").pop();
        const match = /\.(\w+)$/.exec(filename || "");
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("image", {
          uri: image,
          type: type,
          name: filename || "item.jpg",
        });
      }

      console.log("Submitting CreateItem FormData (with IDs):", {
        title: data.itemTitle,
        brand: data.itemBrand,
        category: data.category,
        material: data.material,
        season: data.season,
        style: data.itemStyle,
        colors: data.itemColors,
        hasImage: !!image
      });

      setShowProcessing(true);
      setProgress(0);

      const promise = createAddItem(formData);
      mutationPromiseRef.current = promise;
      
      const response = await promise.unwrap();
      mutationPromiseRef.current = null;
      
      setProgress(1);
      setTimeout(() => {
        setShowProcessing(false);
        navigation.navigate("BottomNavigator", {
          screen: "Wardrobe",
          params: { tab: "Items" },
        });
      }, 500);
    } catch (err) {
      const errorMessage = err?.data?.message || t("addItem.errorMessage");
      setError("root", {
        type: "addItem",
        message: errorMessage,
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-darkSurfacePrimary/90">
      <ProcessingOverlay 
        visible={showProcessing} 
        current={progress === 1 ? 1 : 0} 
        total={1} 
        onCancel={handleCancelProcessing}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            paddingHorizontal: responsiveWidth(5),
            paddingBottom: responsiveHeight(2),
          }}
        >
          {/* Header */}
          <View
            className="flex-row items-center"
            style={{
              paddingVertical: responsiveHeight(3),
            }}
          >
            <Pressable
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              className="w-10 h-10 justify-center items-center -ml-2"
            >
              <ArrowLeft color="#81739A" />
            </Pressable>
            <Text className="flex-1 text-center text-xl font-SemiBold text-textPrimary dark:text-darkTextPrimary">
              {t("addItem.title")}
            </Text>
            <View style={{ width: responsiveWidth(10) }} />
          </View>

          {errors.root && errors.root.type === "addItem" && (
            <View className="bg-red-50 p-3 rounded-lg border border-red-200 mb-4">
              <Text className="text-red-700 text-sm font-Medium text-center">
                {errors.root.message}
              </Text>
            </View>
          )}

          {/* Photo Upload */}
          <ScrollView
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              gap: responsiveHeight(3),
            }}
          >
            <View>
              <Text className="text-[18px] font-semibold text-gray-900 dark:text-darkTextPrimary mb-5">
                {t("addItem.addProfilePhoto")}
              </Text>

              {image ? (
                <View
                  className="w-full border border-gray-400 border-dashed rounded-xl items-center justify-center"
                  style={{
                    gap: responsiveHeight(3),
                    paddingVertical: responsiveHeight(5),
                  }}
                >
                  <Image source={require("../../assets/images/tick3.png")} />
                  <Text className="text-lg font-Medium text-gray-900 dark:text-darkTextPrimary">
                    {t("addItem.photoUploaded")}
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
                  className="w-full border border-gray-400 border-dashed rounded-xl items-center justify-center"
                  style={{
                    gap: responsiveHeight(3),
                    paddingVertical: responsiveHeight(5),
                  }}
                >
                  <Pressable
                    onPress={() => setIsCameraActive(true)}
                    className="items-center justify-center gap-2"
                  >
                    <Image source={require("../../assets/images/camera.png")} />
                    <Text className="text-textSecondary text-center font-Medium text-[16px]">
                      {t("addItem.tapCamera")}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={pickImage}
                    className="bg-surfaceActionTertiary py-4 rounded-full flex-row items-center justify-center gap-3"
                    style={{ paddingHorizontal: responsiveWidth(5) }}
                  >
                    <Upload size={20} color="#f4f4f4" />
                    <Text className="text-[16px] text-textPrimaryInverted font-SemiBold">
                      {t("addItem.uploadFromGallery")}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>

            <View
              style={{
                gap: responsiveHeight(2),
                paddingBottom: responsiveHeight(1),
              }}
            >
              {/* Title */}
              <View>
                <Text className="text-[16px] font-SemiBold text-textPrimary dark:text-darkTextPrimary mb-2">
                  {t("addItem.titleLabel")}
                </Text>
                <Controller
                  control={control}
                  name="itemTitle"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="border border-borderTertiary focus:border-borderAction rounded-2xl px-4 py-4 text-base text-textPrimary dark:text-darkTextPrimary  font-Medium bg-white dark:bg-gray-600"
                      placeholder={t("addItem.titlePlaceholder")}
                      placeholderTextColor="#A0A0A0"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
              </View>

              {/* Brand */}
              <View>
                <Text className="text-[16px] font-SemiBold text-textPrimary dark:text-darkTextPrimary  mb-2">
                  {t("addItem.brandLabel")}
                </Text>
                <Controller
                  control={control}
                  name="itemBrand"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="border border-borderTertiary focus:border-borderAction rounded-2xl px-4 py-4 text-base text-textPrimary dark:text-darkTextPrimary font-Medium bg-white dark:bg-gray-600"
                      placeholder={t("addItem.brandPlaceholder")}
                      placeholderTextColor="#A0A0A0"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
              </View>

              {/* Category */}
              <CustomBottomSheet
                title={t("addItem.category")}
                data={categories?.categories}
                initialSelected={category ? [category] : []}
                onChange={handleCategorySelect}
                isLoading={categoryLoading}
                loadingText={t("addItem.loadingCategories")}
                error={categoryError}
                errorText={t("addItem.failedCategories")}
                returnFullObject={true}
              />

              {/* Material */}
              <CustomBottomSheet
                title={t("addItem.material")}
                data={materials?.Metarial}
                initialSelected={material ? [material] : []}
                onChange={handleMaterialSelect}
                isLoading={materialLoading}
                loadingText={t("addItem.loadingMaterials")}
                error={materialError}
                errorText={t("addItem.failedMaterials")}
                returnFullObject={true}
              />

              {/* Colors */}
              <ColorPalette name="itemColors" />

              {/* Season */}
              <View>
                <Text className="text-[16px] font-SemiBold text-textPrimary dark:text-darkTextPrimary mb-2">
                  {t("addItem.season")}
                </Text>
                <View className="flex-row gap-4 flex-wrap">
                  {seasons.map((opt , index) => (
                    <OptionSelector
                      key={index}
                      title={opt}
                      selectedValue={season}
                      onSelect={handleSeasonSelect}
                    />
                  ))}
                </View>
              </View>

              {/* Style */}
              {allStyles?.styles.length > 0 && (
                <View>
                  <Text className="text-[16px] font-SemiBold text-textPrimary dark:text-darkTextPrimary mb-2">
                    {t("addItem.style")}
                  </Text>
                  <View className="flex-row gap-4 flex-wrap">
                    {allStyles?.styles.map((opt , index) => (
                      <OptionSelector
                        key={index}
                        title={opt?.name}
                        selectedValue={itemStyle}
                        onSelect={handleStyleSelect}
                      />
                    ))}
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Apply Button */}
          <Pressable
            className={`${isLoading ? "bg-gray-300" : "bg-surfaceAction"}  py-4 rounded-xl flex-row items-center justify-center`}
            disabled={isLoading}
            style={{ marginTop: responsiveHeight(1) }}
            onPress={handleSubmit(handleApply)}
          >
            <Text className="text-textPrimaryInverted font-SemiBold text-[16px]">
              {t("addItem.apply")}
            </Text>
          </Pressable>

          {/* Success Modal */}
          <ViewImageModal
            isImageViewVisible={isImageViewVisible}
            setIsImageViewVisible={setIsImageViewVisible}
            image={image}
          />

          {/* Camera UI */}
          <CameraUI
            isCameraActive={isCameraActive}
            setIsCameraActive={setIsCameraActive}
            setPhotoPath={setImage}
            setShowFolderModal={setShowFolderModal}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default AddItemScreen;
