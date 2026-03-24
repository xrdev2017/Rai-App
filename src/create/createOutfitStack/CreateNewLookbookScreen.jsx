import { View, Text, Pressable, TextInput } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { Controller, useFormContext } from "react-hook-form";
import { useCreateLookbookMutation } from "../../redux/slices/createLookbook/createLookbookSlice";
import { useTranslation } from "react-i18next";

const CreateNewLookbookScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const {
    control,
    getValues,
    handleSubmit,
    setError,
    formState: { errors },
  } = useFormContext();
  const { outfit } = getValues();

  const [createLookbook, { isLoading }] = useCreateLookbookMutation();

  const handleLookbookSave = async (data) => {
    try {
      const lookbookData = {
        name: data.lookbookTitle,
        outfits: outfit?._id,
      };
      const response = await createLookbook(lookbookData).unwrap();
      // console.log("✅ Lookbook created successfully:", response);

      navigation.navigate("BottomNavigator", {
        screen: "Wardrobe",
        params: { tab: "Lookbooks" },
      });
    } catch (err) {
      // console.log("❌ Add Lookbook Error:", err);
      const errorMessage = err?.data?.error;

      setError("root", {
        type: "lookbook",
        message: errorMessage,
      });
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-darkSurfacePrimary/90"
      style={{
        padding: responsiveWidth(5),
        gap: responsiveHeight(4),
      }}
    >
      {/* Header */}
      <View className="flex-row items-center pt-5">
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
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      {/* Lookbook Title Input */}
      <Controller
        control={control}
        name="lookbookTitle"
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
              autoCapitalize="none"
            />
            {error && (
              <Text className="text-red-600 mt-1">{error.message}</Text>
            )}
          </>
        )}
      />

      {/* Save Button */}
      <Pressable
        onPress={handleSubmit(handleLookbookSave)}
        className={`${isLoading ? "bg-gray-300" : "bg-surfaceAction"} py-4 rounded-xl flex-row items-center justify-center`}
      >
        <Text className="text-textPrimaryInverted font-SemiBold text-[16px]">
          {t("createLookbook.save")}
        </Text>
      </Pressable>

      {/* Cancel Button */}
      <Pressable
        onPress={() => navigation.goBack()}
        className="  rounded-xl flex-row items-center justify-center"
      >
        <Text className="text-red-500 font-SemiBold text-[16px]">
          {t("createLookbook.cancel")}
        </Text>
      </Pressable>

      {errors?.root && errors?.root.type === "lookbook" && (
        <View className="bg-red-50 p-3 rounded-lg border border-red-200 mb-4">
          <Text className="text-red-700 text-sm font-Medium text-center">
            {errors?.root.message}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CreateNewLookbookScreen;
