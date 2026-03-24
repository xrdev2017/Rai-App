
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { responsiveWidth } from "react-native-responsive-dimensions";
import {
  useAddImageWishlistMutation,
  useGetAllWishlistQuery,
} from "../../redux/slices/wishlist/wishlistSlice";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const AddExistingWishlistScreen = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { getValues, handleSubmit, reset } = useFormContext();

  const renderFolderItem = ({ item }) => (
    <Pressable
      className={`py-4 px-5 mb-[1px] rounded ${
        selectedFolder === item._id ? "bg-gray-200" : ""
      }`}
      onPress={() => setSelectedFolder(item._id)}
    >
      <Text className="text-base font-Medium text-textPrimary">
        {item.name}
      </Text>
    </Pressable>
  );

  const {
    data: allWishlist,
    isLoading: allWishlistLoading,
    isError: allWishlistError,
  } = useGetAllWishlistQuery();

  const { photoFieldName, galleryPhoto } = getValues();

  const [addImageWishlist, { isLoading }] = useAddImageWishlistMutation();

  const handleSaveWishlist = async () => {
    try {
      const formData = new FormData();

      if (photoFieldName) {
        const filename = photoFieldName.split("/").pop();
        const match = /\.(\w+)$/.exec(filename || "");
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("images", {
          uri: photoFieldName,
          type: type,
          name: filename || "item.jpg",
        });
      }

      if (galleryPhoto) {
        galleryPhoto.forEach((photoUri, index) => {
          const filename = photoUri.split("/").pop();
          const match = /\.(\w+)$/.exec(filename || "");
          const type = match ? `image/${match[1]}` : "image/jpeg";

          formData.append("images", {
            uri: photoUri,
            type: type,
            name: filename || `item_${index}.jpg`,
          });
        });
      }

      const response = await addImageWishlist({
        id: selectedFolder,
        data: formData,
      }).unwrap();

      // console.log("✅ Item created successfully:", response);

      reset({
        photoFieldName: null,
        galleryPhoto: null,
      });

      navigation.navigate("WishlistFolder");
    } catch (error) {
      // console.log("LINE AT 45", error);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{
        padding: responsiveWidth(5),
      }}
    >
      {/* Header */}
      <View className="flex-row items-center py-5">
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center -ml-2"
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} strokeWidth={2} />
        </Pressable>
        <Text className="flex-1 text-center text-xl font-SemiBold text-textPrimary">
          {t("wishlist.addExistingTitle")}
        </Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      {/* Content */}
      <View className="flex-1">
        <Text className="text-2xl font-SemiBold text-textPrimary text-center mt-2 mb-6">
          {t("wishlist.chooseExisting")}
        </Text>

        <FlatList
          data={allWishlist}
          renderItem={renderFolderItem}
          keyExtractor={(item) => item._id.toString()}
          className="flex-1"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <>
              {allWishlistLoading && (
                <ActivityIndicator color={"purple"} size="20" />
              )}
              {allWishlistError && (
                <Text className="text-red-500 font-Medium">
                  {t("wishlist.loadError")}
                </Text>
              )}
            </>
          }
        />
      </View>

      {/* Bottom Buttons */}
      <View className="pt-4 pb-9 bg-white">
        <Pressable
          onPress={handleSubmit(handleSaveWishlist)}
          className={`py-4 rounded-xl items-center mb-3 ${
            selectedFolder !== null && !isLoading
              ? "bg-surfaceAction"
              : "bg-gray-200"
          }`}
          disabled={selectedFolder === null || isLoading}
        >
          <Text
            className={`text-lg font-SemiBold ${
              selectedFolder !== null && !isLoading
                ? "text-white"
                : "text-gray-400"
            }`}
          >
            {isLoading ? t("wishlist.saving") : t("wishlist.save")}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.goBack()}
          className="py-4 items-center"
        >
          <Text className="text-lg font-SemiBold text-textPrimary">
            {t("wishlist.cancel")}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default AddExistingWishlistScreen;
