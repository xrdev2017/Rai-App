import {
  View,
  Text,
  Pressable,
  ScrollView,
  FlatList,
  Platform,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, CopyCheck } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { Image } from "react-native";
import { useFormContext } from "react-hook-form";
import { useDeleteItemOutfitLookbookMutation } from "../redux/slices/createLookbook/createLookbookSlice";

const DeleteAccountModal = ({ visible, onCancel, onConfirm, isLoading }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center px-8"
        activeOpacity={1}
        onPress={onCancel}
      >
        <Pressable
          className="bg-white dark:bg-darkSurfacePrimary rounded-3xl p-6 w-full max-w-sm"
          activeOpacity={1}
          onPress={() => {}} // Prevent closing when touching modal content
        >
          {/* Modal Description */}
          <Text className="text-base font-Medium text-gray-600 dark:text-darkTextPrimary text-center mb-8 leading-6">
            Are you sure, you want to delete?
          </Text>

          {/* Action Buttons */}
          <View className="gap-3">
            {/* Delete Button */}
            <Pressable
              className="bg-red-500 rounded-2xl py-4 items-center"
              onPress={onConfirm}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-lg font-SemiBold">
                  Yes, delete it
                </Text>
              )}
            </Pressable>

            {/* Cancel Button */}
            <Pressable
              className="bg-gray-200 rounded-2xl py-4 items-center"
              onPress={onCancel}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text className="text-black text-lg font-SemiBold">Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const CreateLookbookEditDetailScreen = () => {
  const navigation = useNavigation();
  const [selectionMode, setSelectionMode] = useState(false);
  const { getValues, setValue } = useFormContext();
  const { updateLookbook } = getValues();

  const data =
    updateLookbook?.items?.length > 0
      ? updateLookbook?.items
      : updateLookbook?.outfits;

  const [selectedItems, setSelectedItems] = useState([]);
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const [deleteItemOutfitLookbook, { isLoading: isDeleting }] =
    useDeleteItemOutfitLookbookMutation();

  const toggleSelect = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  // console.log("LINE AT", selectedItems);

  // Complete handleDelete function
  const handleDelete = async () => {
    try {
      if (selectedItems.length === 0) {
        Alert.alert("Error", "Please select at least one item to delete");
        return;
      }

      const credentials = {
        items: updateLookbook?.items?.length > 0 ? selectedItems : [],
        outfits: updateLookbook?.outfits?.length > 0 ? selectedItems : [],
      };

      // console.log("Deleting items/outfits:", credentials);

      const response = await deleteItemOutfitLookbook({
        id: updateLookbook._id,
        ids: selectedItems,
      }).unwrap();

      // console.log("Delete successful:", response);

      // Show success message
      Alert.alert("Success", "Items successfully deleted");

      // Reset selection mode and selected items
      setSelectionMode(false);
      setSelectedItems([]);
      setShowUnblockModal(false);

      // Update the form context with the new data if needed
      if (response.data) {
        setValue("updateLookbook", response.data);
      }
      navigation.goBack();
    } catch (error) {
      console.error("Delete failed:", error);

      // Show error message
      const errorMessage =
        error?.data?.message || "Failed to delete items. Please try again.";
      Alert.alert("Error", errorMessage);
    }
  };

  const renderProductItem = ({ item, index }) => {
    const isSelected = selectedItems.includes(item._id);

    return (
      <Pressable
        className={`flex-1 max-w-[48%]`}
        onPress={() => {
          if (selectionMode) {
            toggleSelect(item._id);
          } else {
            navigation.navigate("CreateLookbookEditStack", {
              screen: "CreateLookbookEdit",
            });
            updateLookbook?.items?.length > 0
              ? setValue("updateItemLookbook", item)
              : setValue("updateOutfitLookbook", item);
          }
        }}
      >
        {/* Product Image Container */}
        <View className="bg-surfaceSecondary rounded-lg aspect-square items-center justify-center overflow-hidden relative">
          <Image
            source={{ uri: item?.image }}
            className="w-full h-full object-contain"
          />
          {selectionMode && (
            <View className="absolute inset-0 bg-black/40 items-center justify-center">
              {isSelected ? (
                <Image
                  source={require("../../assets/images/tick2.png")}
                  style={{
                    width: responsiveWidth(8),
                    height: responsiveWidth(8),
                    objectFit: "contain",
                  }}
                />
              ) : (
                <View className="w-[22px] h-[22px] rounded-full border border-gray-300 bg-white" />
              )}
            </View>
          )}
        </View>

        {/* Product Info */}
        <View className="space-y-1 mt-2">
          <Text
            className="text-lg text-textPrimary dark:text-darkTextPrimary font-SemiBold"
            numberOfLines={1}
          >
            {item?.name || item?.title}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white  dark:bg-darkSurfacePrimary/90"
      style={{
        paddingTop: Platform.OS === "android" ? 0 : 0,
        padding: responsiveWidth(5),
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row items-center py-5 ">
        <Pressable
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          className="w-10 h-10 justify-center items-center -ml-2"
        >
          <ArrowLeft color="#5700FE" />
        </Pressable>
        <Text className="flex-1 text-center text-xl font-SemiBold text-textPrimary dark:text-darkTextPrimary">
          {updateLookbook?.name}
        </Text>
        <Pressable onPress={() => setSelectionMode(!selectionMode)}>
          <CopyCheck color="#5700FE" />
        </Pressable>
      </View>

      {selectedItems.length > 0 && (
        <Text className="text-base font-Regular text-center mb-2 text-textPrimary dark:text-darkTextPrimary">
          {selectedItems.length} items selected
        </Text>
      )}

      <FlatList
        data={data}
        renderItem={renderProductItem}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          gap: responsiveWidth(4),
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          rowGap: responsiveWidth(3),
          paddingBottom: responsiveWidth(4),
        }}
      />

      {selectionMode && (
        <View className="flex-row justify-between gap-2">
          <Pressable
            onPress={() => setShowUnblockModal(true)}
            disabled={selectedItems.length === 0}
            className={`py-4 rounded-xl items-center mb-3 flex-1 ${
              selectedItems.length === 0 ? "bg-gray-300" : "bg-red-500"
            }`}
          >
            <Text
              className={`text-lg font-SemiBold ${
                selectedItems.length === 0 ? "text-gray-500" : "text-white"
              }`}
            >
              Delete
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setSelectionMode(false);
              setSelectedItems([]);
            }}
            className={`py-4 rounded-xl items-center mb-3 bg-white dark:bg-darkSurfaceSecondary flex-1 border border-gray-300`}
          >
            <Text className={`text-lg font-SemiBold text-textPrimary dark:text-darkTextPrimary`}>
              Cancel
            </Text>
          </Pressable>
        </View>
      )}

      <DeleteAccountModal
        visible={showUnblockModal}
        onCancel={() => setShowUnblockModal(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </SafeAreaView>
  );
};

export default CreateLookbookEditDetailScreen;
