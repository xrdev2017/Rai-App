import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  FlatList,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft, CheckCircle, CopyCheck } from "lucide-react-native";
import {
  responsiveWidth,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import { useCreateLookbookMutation } from "../../redux/slices/createLookbook/createLookbookSlice";
import { useFormContext } from "react-hook-form";

const OutfitCreatedScreen = () => {
  const navigation = useNavigation();
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const route = useRoute();
  const { handleSubmit } = useFormContext();

  const outfitData = route.params || {};

  const allItemIds = outfitData.groups.flatMap((group) =>
    group.items.map((item) => item._id)
  );

  // console.log(allItemIds);

  // console.log("LINE AT 26", outfitData, allItemIds);

  const toggleSelect = (groupId) => {
    if (selectedItems.includes(groupId)) {
      setSelectedItems(selectedItems.filter((id) => id !== groupId));
    } else {
      setSelectedItems([...selectedItems, groupId]);
    }
  };

  const renderProductItem = ({ item: group, index }) => {
    const isSelected = selectedItems.includes(group._id);

    return (
      <Pressable
        className={`flex-1 mb-4`}
        onPress={() => {
          if (selectionMode) toggleSelect(group._id);
        }}
      >
        {/* Group Title */}
        <Text className="text-lg font-SemiBold text-textPrimary dark:text-darkTextPrimary  mb-2">
          {group.title}
        </Text>

        {/* Items Container - Horizontal Scroll for multiple items */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: responsiveWidth(3) }}
        >
          {group.items.map((item, itemIndex) => (
            <View key={item._id} className="max-w-[48%]">
              {/* Product Image Container */}
              <View
                className="bg-surfaceSecondary rounded-lg aspect-square items-center justify-center overflow-hidden relative"
                style={{
                  width: responsiveWidth(40),
                  height: responsiveWidth(40),
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
                {selectionMode && (
                  <View className="absolute inset-0 bg-black/40 items-center justify-center">
                    {isSelected ? (
                      <Image
                        source={require("../../../assets/images/tick2.png")}
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
                  className="text-base text-textPrimary dark:text-darkTextPrimary font-SemiBold"
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text className="text-sm text-textSecondary" numberOfLines={1}>
                  {item.brand}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </Pressable>
    );
  };

  const DeleteAccountModal = ({ visible, onCancel, onConfirm }) => {
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
            className="bg-white dark:bg-darkSurfacePrimary  rounded-3xl p-6 w-full max-w-sm"
            activeOpacity={1}
            onPress={() => {}}
          >
            <Text className="text-base font-Medium text-gray-600 text-center mb-8 leading-6">
              Are you sure, you want to delete?
            </Text>

            <View className="gap-3">
              <Pressable
                className="bg-red-500 rounded-2xl py-4 items-center"
                onPress={onConfirm}
                activeOpacity={0.8}
              >
                <Text className="text-white text-lg font-SemiBold">
                  Yes, delete it
                </Text>
              </Pressable>

              <Pressable
                className="bg-gray-200 rounded-2xl py-4 items-center"
                onPress={onCancel}
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

  const [createLookbook, { isLoading }] = useCreateLookbookMutation();
  const handleLookbookSave = async (data) => {
    try {
      // console.log("Form Data:", data);
      const lookbookData = {
        name: outfitData?.title,
        items: allItemIds,
      };
      const response = await createLookbook(lookbookData).unwrap();
      // console.log("✅ Lookbook created successfully:", response);
      // setShowLocationModal(false);
      navigation.navigate("BottomNavigator", {
        screen: "Wardrobe",
        params: { tab: "Lookbooks" },
      });
    } catch (error) {
      // console.log("❌ Add Item Error:", err);
      const errorMessage =
        err?.data?.message || "Add Item failed. Please try again.";

      setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-darkSurfacePrimary "
      style={{
        padding: responsiveWidth(5),
      }}
    >
      {/* Header */}
      <View className="flex-row items-center">
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-10 h-10 justify-center items-center -ml-2"
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#5700FE" />
        </Pressable>
        <Text className="flex-1 text-center text-xl font-SemiBold text-textPrimary dark:text-darkTextPrimary">
          Lookbook Created
        </Text>
        <Pressable onPress={() => setSelectionMode(!selectionMode)}>
          <CopyCheck size={20} color="#5700FE" />
        </Pressable>
      </View>

      <Text className="text-center font-Medium text-lg text-textPrimary dark:text-darkTextPrimary">
        {outfitData?.title}
      </Text>

      {/* <ScrollView className="flex-1 bg-white pt-5"> */}
      {/* Product Grid */}
      <FlatList
        data={outfitData?.groups}
        renderItem={renderProductItem}
        keyExtractor={(item) => item._id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: responsiveHeight(10) }}
      />
      {/* </ScrollView> */}

      {selectionMode ? (
        <View className="flex-row justify-between gap-2">
          <Pressable
            onPress={() => setShowUnblockModal(true)}
            className={`py-4 rounded-xl items-center mb-3  bg-red-500 flex-1`}
          >
            <Text className={`text-lg font-SemiBold text-white`}>Delete</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("DressMe")}
            className={`py-4 rounded-xl items-center mb-3  bg-white flex-1`}
          >
            <Text className={`text-lg font-SemiBold text-textPrimary`}>
              Cancel
            </Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={handleSubmit(handleLookbookSave)}
          className={`py-4 rounded-xl items-center mb-3  ${isLoading ? "bg-gray-300" : "bg-surfaceAction"}`}
        >
          <Text className={`text-lg font-SemiBold text-white`}>Save</Text>
        </Pressable>
      )}
      <DeleteAccountModal
        visible={showUnblockModal}
        onCancel={() => setShowUnblockModal(false)}
        onConfirm={() => setShowUnblockModal(false)}
      />
    </SafeAreaView>
  );
};

export default OutfitCreatedScreen;
