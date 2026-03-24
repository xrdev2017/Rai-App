import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Edit, Plus, X } from "lucide-react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import AddButton from "./AddButton";
import { Image } from "react-native";
import { Controller, useFormContext } from "react-hook-form";
import { useGetAllStyleQuery } from "../../../redux/slices/addItem/addItemSlice";
import MultiOptionSelector from "../../../components/MultiOptionSelector";
import { useCreateDressMeMutation } from "../../../redux/slices/dressMe/dressMeSlice";
import { useTranslation } from "react-i18next";

export const imageSources = [
  require("../../../../assets/images/shirt.png"),
  require("../../../../assets/images/shirt.png"),
  require("../../../../assets/images/shirt.png"),
  require("../../../../assets/images/shirt.png"),
];


export const StyleSelectionModal = ({
  visible,
  onClose,
  onSave,
  isLoading,
  errors,
}) => {
  const navigation = useNavigation();
  const { watch, setValue, control, handleSubmit } = useFormContext();

  const selectedStyles = watch("filterStyles") || [];
  const dressMeTitle = watch("dressName") || "";

  const {
    data: allStyles,
    isError: allStylesError,
    isLoading: allStylesLoading,
    refetch,
  } = useGetAllStyleQuery();

  const [localErrors, setLocalErrors] = useState({});

  // Validate before saving
  const validateForm = () => {
    const newErrors = {};

    // Check if at least one style is selected
    if (selectedStyles.length === 0) {
      newErrors.styles = "Please select at least one style";
    }

    // Check if look name is provided
    if (!dressMeTitle.trim()) {
      newErrors.dressName = "Look name is required";
    } else if (dressMeTitle.trim().length < 2) {
      newErrors.dressName = "Look name must be at least 2 characters";
    } else if (dressMeTitle.trim().length > 50) {
      newErrors.dressName = "Look name must be less than 50 characters";
    }

    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (data) => {
    if (!validateForm()) {
      // Show error message
      Alert.alert("Validation Error", "Please fix the errors before saving");
      return;
    }

    // If validation passes, call the onSave callback
    onSave?.(data);
  };

  const handleToggleStyle = (style) => {
    const newStyles = selectedStyles.includes(style)
      ? selectedStyles.filter((s) => s !== style)
      : [...selectedStyles, style];

    setValue("filterStyles", newStyles, { shouldValidate: true });

    // Clear style error when user selects at least one style
    if (newStyles.length > 0 && localErrors.styles) {
      setLocalErrors((prev) => ({ ...prev, styles: undefined }));
    }
  };

  const handleCancel = () => {
    // Reset local errors
    setLocalErrors({});
    onClose();
  };

  // Reset errors when modal becomes visible
  useEffect(() => {
    if (visible) {
      setLocalErrors({});
    }
  }, [visible]);

  // Retry loading styles if there was an error
  const handleRetry = () => {
    refetch();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="w-full max-w-md max-h-[80%] bg-white dark:bg-darkSurfacePrimary rounded-2xl overflow-hidden">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
            <Pressable
              onPress={handleCancel}
              className="w-8 h-8 items-center justify-center"
              disabled={isLoading}
            >
              <X color="#5700FE" />
            </Pressable>
            <Text className="text-lg font-SemiBold text-textPrimary dark:text-darkTextPrimary">
              Choose your Style
            </Text>
            <View className="w-8" />
          </View>

          {/* Scrollable Content */}
          <ScrollView
            className="px-5 pt-3"
            showsVerticalScrollIndicator={false}
          >
            {/* Styles Selection */}
            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-base font-SemiBold text-textPrimary dark:text-darkTextPrimary">
                  Select Styles ({selectedStyles.length})
                </Text>
                {selectedStyles.length === 0 && (
                  <Text className="text-base font-SemiBold text-red-500">
                    Select at least 1 style
                  </Text>
                )}
              </View>

              <View>
                <Text className="text-lg font-SemiBold text-black dark:text-darkTextPrimary mb-2">
                  Style
                </Text>

                {allStylesLoading ? (
                  <View className="py-4 items-center">
                    <ActivityIndicator size="small" color="#5700FE" />
                    <Text className="text-gray-500 mt-2">
                      Loading styles...
                    </Text>
                  </View>
                ) : allStylesError ? (
                  <View className="py-4 items-center">
                    <Text className="text-red-500 mb-2">
                      Failed to load styles
                    </Text>
                    <Pressable
                      onPress={handleRetry}
                      className="bg-surfaceAction rounded-lg px-4 py-2"
                    >
                      <Text className="text-white">Retry</Text>
                    </Pressable>
                  </View>
                ) : allStyles?.styles?.length === 0 ? (
                  <Text className="text-gray-500 py-4 text-center">
                    No styles available
                  </Text>
                ) : (
                  <View className="flex-row flex-wrap gap-2">
                    {allStyles.styles.map((opt) => (
                      <MultiOptionSelector
                        key={opt?.name}
                        title={opt?.name}
                        selectedValues={selectedStyles}
                        onSelect={handleToggleStyle}
                        disabled={isLoading}
                      />
                    ))}
                  </View>
                )}
              </View>

              {localErrors.styles && (
                <Text className="text-red-500 text-sm mt-1">
                  {localErrors.styles}
                </Text>
              )}
            </View>

            {/* Look Name Input */}
            <View className="py-2">
              <Controller
                control={control}
                name="dressName"
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
                      placeholder="Your look, Your label!"
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

            {/* Error Display */}
            {(errors?.root?.type === "dressMe" || localErrors.general) && (
              <View className="bg-red-50 p-3 rounded-lg border border-red-200 mb-4">
                <Text className="text-red-700 text-sm font-Medium text-center">
                  {errors?.root?.message || localErrors.general}
                </Text>
              </View>
            )}

            {/* Buttons */}
            <View className="gap-3 pb-6">
              <Pressable
                className={`${
                  isLoading ? "bg-gray-400" : "bg-surfaceAction"
                } rounded-xl py-4 items-center`}
                onPress={handleSubmit(handleSave)}
                disabled={isLoading || allStylesLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-lg font-SemiBold">Save</Text>
                )}
              </Pressable>

              <Pressable
                className="py-4 items-center rounded-xl border border-gray-200"
                onPress={handleCancel}
                disabled={isLoading}
              >
                <Text className="text-textPrimary dark:text-darkTextPrimary text-lg font-SemiBold">
                  Cancel
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export const itemsRef = {
  current: {
    It2FB: [],
    It2F: [],
    It3T: [],
    It3B: [],
    It3F: [],
    It4O: [], // Outwear for 4 items
    It4T: [], // Tops for 4 items
    It4B: [], // Bottoms for 4 items
    It4F: [], // Footwear for 4 items
  },
};

const Item2Tab = ({ id }) => {
  const navigation = useNavigation();
  // console.log("LINE AT 13", id);
  const [modalVisible, setModalVisible] = useState(false);

  // const handleSave = (data) => {
  //   // console.log("Saved data:", data);
  //   navigation.navigate("OutfitCreated");
  // };

  const {
    getValues,
    reset,
    setError,
    formState: { errors },
  } = useFormContext();

  const selectedItemsKey = `selectedItems${id}`;
  const selectedItems = getValues()[selectedItemsKey] || [];

  const items = Array.isArray(selectedItems)
    ? selectedItems.map((entry) => entry?.item || entry).filter(Boolean)
    : [];

  // Update the ref without causing a re-render
  itemsRef.current[id] = items;

  const [createDressMe, { isLoading }] = useCreateDressMeMutation();

  const handleCreateDressMe = async (data) => {
    // console.log("LINE AT 1110", data);

    try {
      const selectedItemsData = {};

      // Define the categories you want to include
      const categories = ["It2FB", "It2F"]; // Add more as needed

      // Get items for each category
      categories.forEach((category) => {
        const selectedItemsKey = `selectedItems${category}`;
        const selectedItems = getValues()[selectedItemsKey] || [];
        selectedItemsData[category] = selectedItems
          .map((entry) => entry?.item || entry)
          .filter(Boolean);
      });

      // Convert to groupsData format
      const categoryToGroupMap = {
        It2FB: "Add Full Body",
        It2F: "Add Footwear",
        // Add more mappings:
        // "It2B": "Bottom Group",
        // "It2A": "Accessories Group"
      };

      const groupsData = [];

      Object.entries(selectedItemsData).forEach(([category, items]) => {
        const groupTitle = categoryToGroupMap[category];

        if (groupTitle && items && items.length > 0) {
          let group = groupsData.find((g) => g.title === groupTitle);

          if (!group) {
            group = { title: groupTitle, itemIds: [] };
            groupsData.push(group);
          }

          group.itemIds = [...group.itemIds, ...items.map((item) => item._id)];
        }
      });

      // Check if we have at least one group with items
      const dressMeData = {
        groupsData: groupsData,
        // Add other fields as needed by your API
        title: data?.dressName,
        styles: data?.filterStyles,
      };

      // console.log("Creating DressMe with data:", dressMeData);
      if (groupsData.length === 0) {
        Alert.alert(
          "Error",
          "Please select at least one item to create an outfit."
        );
        return;
      }

      const response = await createDressMe(dressMeData).unwrap();

      reset({
        selectedItemsIt2F: null,
        selectedItemsIt2FB: null,
      });
      setModalVisible(false);
      navigation.navigate("OutfitCreated", response);
      // console.log("LINE AT 170", response);
    } catch (error) {
      // console.log("LINE AT 111", error);
      const errorMessage = error?.data?.error || "Creating Wishlist Failed!";
      setError("root", {
        type: "dressMe",
        message: errorMessage,
      });
    }
  };

  const { t } = useTranslation();

  return (
    <View className="flex-1 justify-between">
      <ScrollView
        contentContainerStyle={{
          paddingTop: responsiveHeight(4),
          gap: responsiveHeight(10),
        }}
        showsVerticalScrollIndicator={false}
      >
        {id === "It2FB" || itemsRef?.current?.It2FB.length > 0 ? (
          <View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-textPrimary dark:text-darkTextPrimary text-lg font-SemiBold">
                Add Full Body
              </Text>
              <Pressable
                onPress={() => {
                  // console.log("CLIKE");

                  navigation.navigate("AddItem", {
                    title: "Add Full Body",
                    id: "It2FB",
                    tab: "2 Items",
                  });
                }}
                className="bg-surfaceAction p-2 rounded-md"
              >
                <Edit size={18} color={"white"} />
              </Pressable>
            </View>
            <View className="flex-row flex-wrap justify-start gap-2">
              {itemsRef?.current?.It2FB.map((item, index) => (
                <View
                  key={index}
                  className="bg-surfaceSecondary rounded-lg aspect-square items-center justify-center overflow-hidden relative"
                  style={{
                    width: responsiveWidth(20),
                  }}
                >
                  <Image
                    source={{ uri: item?.image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <Text
                    className="text-xs mt-1 text-textPrimary dark:text-darkTextPrimary"
                    numberOfLines={1}
                  >
                    {item?.title}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View>
            <AddButton
              title={t("dressMe.fullBody")}
              path="AddItem"
              id="It2FB"
              tab="2 Items"
            />
          </View>
        )}

        {id === "It2F" || itemsRef?.current?.It2F.length > 0 ? (
          <View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-textPrimary dark:text-darkTextPrimary text-lg font-SemiBold">
                Add Footwear
              </Text>
              <Pressable
                onPress={() => {
                  // console.log("CLIKE");

                  navigation.navigate("AddItem", {
                    title: `${t("dressMe.footwear")}`,
                    id: "It2F",
                    tab: "2 Items",
                  });
                }}
                className="bg-surfaceAction p-2 rounded-md"
              >
                <Edit size={18} color={"white"} />
              </Pressable>
            </View>
            <View className="flex-row flex-wrap  gap-2">
              {itemsRef?.current?.It2F.map((item, index) => (
                <View
                  key={index}
                  className="bg-surfaceSecondary rounded-lg aspect-square items-center justify-center overflow-hidden relative"
                  style={{
                    width: responsiveWidth(20),
                  }}
                >
                  <Image
                    source={{ uri: item?.image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <Text
                    className="text-xs mt-1 text-textPrimary dark:text-darkTextPrimary"
                    numberOfLines={1}
                  >
                    {item?.title}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <AddButton
            title={t("dressMe.footwear")}
            path="AddItem"
            id="It2F"
            tab="2 Items"
          />
        )}
      </ScrollView>

      <Pressable
        onPress={() => setModalVisible(true)}
        className={`py-4 rounded-xl items-center mb-3 bg-surfaceAction`}
      >
        <Text className={`text-lg font-SemiBold text-white`}>
          {t("dressMe.generate")}
        </Text>
      </Pressable>

      <StyleSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleCreateDressMe}
        isLoading={isLoading}
        errors={errors}
      />
    </View>
  );
};

export default Item2Tab;
