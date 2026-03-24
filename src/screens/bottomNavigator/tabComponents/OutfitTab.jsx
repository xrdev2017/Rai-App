import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { products } from "./ItemTab";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import { useGetAllOutfitQuery } from "../../../redux/slices/createOutfit/outfiltSlice";
import { useFormContext } from "react-hook-form";
import { useTheme } from "../../../utils/ThemeContext";
import { useTranslation } from "react-i18next";

const OutfitTab = ({ tab }) => {
  const { isDarkMode } = useTheme();
  // console.log("LINE AT 6", tab);
  const navigation = useNavigation();
  const { setValue } = useFormContext();
  const {
    data: allOutfit,
    isLoading: allOutfitLoading,
    isError: allOutfitError,
  } = useGetAllOutfitQuery();
  const { t } = useTranslation();

  // console.log("LINE AT 20", allOutfit, allOutfitError, allOutfitLoading);

  const renderProductItem = ({ item, index }) => (
    <Pressable
      onPress={() => {
        navigation.navigate("CreateOutfitEdit");
        setValue("updateOutfit", item);
      }}
      className={`flex-1 max-w-[48%] `}
    >
      {/* Product Image Container */}
      <View className="bg-surfaceSecondary rounded-lg aspect-square items-center justify-center  overflow-hidden relative">
        <Image
          source={{ uri: item?.image }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </View>

      {/* Product Info */}
      <View className="space-y-1">
        <Text
          className={`text-lg font-SemiBold ${
            isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
          }`}
        >
          {item?.title}
        </Text>
        <Text
          className={`text-md font-Medium ${
            isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
          }`}
        >
          {/* {item.description} */}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View
      style={{
        flex: 1,
        padding: responsiveWidth(5),
        gap: 5,
        // backgroundColor: "white",
      }}
    >
      {allOutfitLoading ? (
        <ActivityIndicator color="purple" size={20} />
      ) : allOutfitError ? (
        <View className="flex-1 justify-center items-center ">
          <Text className="text-red-500 font-Medium">
            Internal Server or Internet Issue!
          </Text>
        </View>
      ) : allOutfit && allOutfit.length > 0 ? (
        <FlatList
          data={allOutfit}
          renderItem={renderProductItem}
          keyExtractor={(item) => item?._id.toString()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            gap: responsiveWidth(4),
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ rowGap: responsiveWidth(3) }}
        />
      ) : (
        <View
          style={{
            flex: 1,
            // alignItems: "center",
            // justifyContent: "center",
            gap: 5,
            // backgroundColor: "white",
          }}
        >
          <Image
            source={require("../../../../assets/images/outfitTab.webp")}
            style={{
              width: responsiveWidth(90),
              height: responsiveHeight(40),
            }}
            resizeMode="contain"
          />
          <Text
            className={`font-Medium text-[16px] text-center ${
              isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
            }`}
          >
            {t("outfitTab.text1")}
          </Text>
          <Text
            className={`font-Regular text-[14px] text-center ${
              isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
            }`}
          >
            {t("outfitTab.text2")}
          </Text>
        </View>
      )}
    </View>
  );
};

export default OutfitTab;
