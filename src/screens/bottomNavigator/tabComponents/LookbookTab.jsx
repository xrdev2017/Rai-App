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
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import { useGetAllLookbookQuery } from "../../../redux/slices/createLookbook/createLookbookSlice";
import ItemImageGrid from "../../../components/ItemImageGrid";
import { useFormContext } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../utils/ThemeContext";

const LookbookTab = ({ tab }) => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { watch, setValue } = useFormContext();

  const searchTerm = watch("searchTextWardrobe");
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const queryArgs = debouncedSearch?.trim()
    ? { page: 1, limit: 10, searchTerm: debouncedSearch }
    : { page: 1, limit: 10 };

  const {
    data: allLookbook,
    isLoading: allLookbookLoading,
    isError: allLookbookError,
  } = useGetAllLookbookQuery(queryArgs, {
    refetchOnMountOrArgChange: true,
  });

  // console.log("LINE AT 123", allLookbook);

  const renderProductItem = ({ item }) => (
    <Pressable
      onPress={() => {
        navigation.navigate("CreateLookbookEditStack");
        setValue("updateLookbook", item);
      }}
      className="flex-1 max-w-[48%]"
    >
      {/* Product Image Container */}

      <ItemImageGrid item={item} />

      {/* Product Info */}
      <View className="space-y-1 mt-1">
        <Text
          className={`text-lg font-SemiBold ${
            isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
          }`}
        >
          {item?.name || "Untitled Lookbook"}
        </Text>
      </View>
    </Pressable>
  );

  // 🔹 Handle loading state
  if (allLookbookLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator color="purple" size={20} />
      </View>
    );
  }

  // 🔹 Handle error state
  if (allLookbookError) {
    return (
      <View className="flex-1 justify-center items-center ">
        <Text className="text-red-500 font-Medium">
          Internal Server or Internet Issue!
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        padding: responsiveWidth(5),
        gap: 5,
        // backgroundColor: "white",
      }}
    >
      {allLookbook && allLookbook.length > 0 ? (
        <ScrollView
          className="flex-1 "
          showsVerticalScrollIndicator={false}
        >
          {/* Product Grid */}
          <FlatList
            data={allLookbook}
            renderItem={renderProductItem}
            keyExtractor={(item) =>
              item?._id?.toString() || Math.random().toString()
            }
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: "space-between",
              gap: responsiveWidth(4),
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ rowGap: responsiveWidth(3) }}
          />
        </ScrollView>
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
            source={require("../../../../assets/images/lookbookTab.webp")}
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
            {t("lookbookTab.text1")}
          </Text>
          <Text
            className={`font-Regular text-[14px] text-center ${
              isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
            }`}
          >
            {t("lookbookTab.text2")}
          </Text>
        </View>
      )}
    </View>
  );
};

export default LookbookTab;
