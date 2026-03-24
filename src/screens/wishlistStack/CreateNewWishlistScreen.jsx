import { View, Text, Pressable, TextInput } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { Controller, useFormContext } from "react-hook-form";
import { useCreateWishlistMutation } from "../../redux/slices/wishlist/wishlistSlice";
import { useTranslation } from "react-i18next";

const CreateNewWishlistScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const {
    control,
    getValues,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useFormContext();
  const { photoFieldName, galleryPhoto } = getValues();

  const [createWishlist, { isLoading }] = useCreateWishlistMutation();
  // console.log("LINE AT 20", photoFieldName, galleryPhoto);

  const handleSaveWishlist = async (data) => {
    // console.log("LINE AT 22", data);

    try {
      const formData = new FormData();

      // ✅ Append all text fields
      formData.append("name", data.wislistName);
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

          // Append each image with a unique field name
          formData.append("images", {
            uri: photoUri,
            type: type,
            name: filename || `item_${index}.jpg`,
          });
        });
      }
      const response = await createWishlist(formData).unwrap();
      navigation.navigate("WishlistFolder");
      // console.log("✅ Item created successfully:", response);
      reset({
        name: null,
        photoFieldName: null,
        galleryPhoto: null,
      });
    } catch (error) {
      // console.log("LINE AT 24", error?.data?.error);
      const errorMessage = error?.data?.error || "Creating Wishlist Failed!";

      setError("root", {
        type: "wishlist",
        message: errorMessage,
      });
    }
  };

  const { t } = useTranslation();

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-darkSurfacePrimary"
      style={{
        padding: responsiveWidth(5),
        gap: responsiveHeight(4),
      }}
    >
      <View className="flex-row items-center  pt-5">
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center -ml-2"
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} strokeWidth={2} color={"#5700FE"} />
        </Pressable>
        <Text className="flex-1 text-center text-xl font-SemiBold text-textPrimary dark:text-darkTextPrimary">
          {t("createLookbook.nameFolder")}
        </Text>
        <View
          style={{
            width: responsiveWidth(10),
          }}
        />
      </View>

      <View>
        <Controller
          control={control}
          name="wislistName"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <>
              <TextInput
                className="border border-borderTertiary rounded-2xl px-4 py-4 text-base text-textPrimary dark:text-darkTextPrimary font-Medium bg-white dark:bg-gray-600"
                placeholder={t("createLookbook.titlePlaceholder")}
                placeholderTextColor="#A0A0A0"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </>
          )}
        />
      </View>

      <Pressable
        // onPress={() => navigation.navigate("WishlistFolder")}
        onPress={handleSubmit(handleSaveWishlist)}
        className={`${isLoading ? "bg-gray-300" : "bg-surfaceAction"}  py-4 rounded-xl flex-row items-center justify-center`}
        // style={{ marginBottom: responsiveHeight(3) }}
      >
        <Text className="text-textPrimaryInverted font-SemiBold text-[16px]">
          {t("createLookbook.save")}
        </Text>
      </Pressable>

      <Pressable
        // onPress={() => navigation.navigate("WishlistFolder")}
        onPress={() => navigation.goBack()}
        className=" rounded-xl flex-row items-center justify-center"
        // style={{ marginBottom: responsiveHeight(3) }}
      >
        <Text className="text-red-500 font-SemiBold text-[16px]">
          {t("createLookbook.cancel")}
        </Text>
      </Pressable>

      {errors?.root && errors?.root.type === "wishlist" && (
        <View className="bg-red-50 p-3 rounded-lg border border-red-200 mb-4">
          <Text className="text-red-700 text-sm font-Medium text-center">
            {errors?.root.message}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CreateNewWishlistScreen;
