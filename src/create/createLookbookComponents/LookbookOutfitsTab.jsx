import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState } from "react";
import { ScrollView } from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { X } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { Controller, useFormContext } from "react-hook-form";
import { useCreateLookbookMutation } from "../../redux/slices/createLookbook/createLookbookSlice";
import { useGetAllOutfitQuery } from "../../redux/slices/createOutfit/outfiltSlice";
import { useDebounce } from "use-debounce";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../utils/ThemeContext";

const BottomSheet = ({ visible, onCancel, onSave, isSaving, isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const clearSearch = () => setSearchQuery("");
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View
          className={`${isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"} rounded-t-3xl`}
          style={{ maxHeight: responsiveHeight(85) }}
        >
          {/* Header */}
          <View className="flex-row items-center p-4 pt-6 border-b border-gray-100">
            <Pressable onPress={onCancel} className="p-2">
              <X size={24} color="#5700FE" />
            </Pressable>
            <Text
              className={`text-center text-xl font-SemiBold ${
                isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
              } `}
              style={{ paddingLeft: responsiveWidth(23) }}
            >
              {t("lookName")}
            </Text>
          </View>

          {/* Lookbook Title Input */}
          <View className="p-4">
            <Controller
              name="lookbookTitle"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  className={`border border-borderTertiary focus:border-borderAction rounded-2xl px-4 py-4 text-base ${isDarkMode ? "bg-darkSurfaceSecondary text-darkTextPrimary" : "bg-white text-textPrimary"}`}
                  placeholder={t("feedback.form.titlePlaceholder")}
                  placeholderTextColor="#A0A0A0"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>

          {/* Apply Button */}
          <View className="p-4 pt-2">
            <Pressable
              className={`${isSaving ? "bg-gray-300" : "bg-surfaceAction"} rounded-2xl py-4 items-center`}
              onPress={onSave}
              activeOpacity={0.8}
            >
              <Text className="text-white text-lg font-SemiBold">
                {isSaving ? t("saving") : t("save")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const LookbookOutfitsTab = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const navigation = useNavigation();
  const { watch, setValue, control, handleSubmit, setError } = useFormContext();
  const searchTextLookbook = watch("searchTextLookbook");
  const [debouncedSearch] = useDebounce(searchTextLookbook, 500);

  const { t } = useTranslation();

  const { isDarkMode } = useTheme();

  const queryArgs = {
    // Debounced search term
    ...(debouncedSearch?.trim() && { title: debouncedSearch }),
  };
  const {
    data: allItem,
    isLoading: allItemLoading,
    isError: allItemError,
  } = useGetAllOutfitQuery(queryArgs);
  const selectedFormOutfits = watch("selectedOutfits") || [];
  const [createLookbook, { isLoading: isSaving }] = useCreateLookbookMutation();

  const handleToggleItem = (item) => {
    const isAlreadySelected = selectedFormOutfits.some(
      (selected) => selected._id === item._id,
    );
    if (isAlreadySelected) {
      setValue(
        "selectedOutfits",
        selectedFormOutfits.filter((selected) => selected._id !== item._id),
      );
    } else {
      setValue("selectedOutfits", [...selectedFormOutfits, item]);
    }
  };

  const handleLookbookSave = async (data) => {
    // console.log("LINE AT 347", data);

    try {
      const itemIds = selectedFormOutfits.map((item) => item._id);
      await createLookbook({
        name: data.lookbookTitle,
        outfits: itemIds,
      }).unwrap();
      navigation.navigate("BottomNavigator", {
        screen: "Wardrobe",
        params: { tab: "Lookbooks" },
      });
    } catch (err) {
      // console.log("❌ Lookbook Save Error:", err);
      const errorMessage =
        err?.data?.message || "Add Item failed. Please try again.";

      setError("root", {
        type: "lookbookError",
        message: errorMessage,
      });
    }
  };

  const renderProductItem = ({ item }) => {
    const isSelected = selectedFormOutfits.some(
      (selected) => selected._id === item._id,
    );
    return (
      <Pressable
        onPress={() => handleToggleItem(item)}
        className="flex-1 max-w-[48%]"
      >
        <View className="bg-surfaceSecondary rounded-lg aspect-square items-center justify-center overflow-hidden relative">
          <Image
            source={{ uri: item.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
          {isSelected && (
            <View className="absolute inset-0 bg-black/40 items-center justify-center">
              <Image
                source={require("../../../assets/images/tick2.png")}
                style={{
                  width: responsiveWidth(8),
                  height: responsiveWidth(8),
                  objectFit: "contain",
                }}
              />
            </View>
          )}
        </View>
        <View className="space-y-1 mt-2">
          <Text
            className="text-lg text-textPrimary dark:text-darkTextPrimary font-SemiBold"
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text
            className="text-md text-textPrimary dark:text-darkTextPrimary font-Medium"
            numberOfLines={1}
          >
            {item.brand}
          </Text>
        </View>
      </Pressable>
    );
  };

  const renderItemsGrid = () => {
    if (allItemLoading) return <ActivityIndicator color="purple" size={20} />;
    if (allItemError)
      return (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 font-Medium">
            Internal Server or Internet Issue!
          </Text>
        </View>
      );
    if (allItem && allItem.length > 0)
      return (
        <FlatList
          data={allItem}
          renderItem={renderProductItem}
          keyExtractor={(item) => item._id.toString()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "center",
            gap: responsiveWidth(4),
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            rowGap: responsiveWidth(3),
            paddingBottom: responsiveWidth(2),
          }}
        />
      );
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-textSecondary">No items available</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 justify-center">
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
          padding: responsiveWidth(5),
        }}
      >
        {renderItemsGrid()}
        <Pressable
          onPress={() => setShowLocationModal(true)}
          activeOpacity={0.8}
          className="p-4 rounded-2xl justify-center items-center bg-surfaceAction"
        >
          <Text className="text-xl font-Medium text-white">
            {t("create")}
            {selectedFormOutfits.length > 0
              ? `(${selectedFormOutfits.length})`
              : ""}
          </Text>
        </Pressable>
        <BottomSheet
          visible={showLocationModal}
          onSave={handleSubmit(handleLookbookSave)}
          onCancel={() => setShowLocationModal(false)}
          isSaving={isSaving}
          isDarkMode={isDarkMode}
        />
      </ScrollView>
    </View>
  );
};

export default LookbookOutfitsTab;
