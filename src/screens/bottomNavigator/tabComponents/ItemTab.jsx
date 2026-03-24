import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import {
  useGetAllCategoryQuery,
  useGetAllItemQuery,
} from "../../../redux/slices/addItem/addItemSlice";
import { useFormContext } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../utils/ThemeContext";

const ItemTab = ({ tab }) => {
  const { watch, setValue } = useFormContext();
  const { t } = useTranslation();

  const searchTerm = watch("searchTextWardrobe");
  const filterSeasons = watch("filterSeasons");
  const filterStyles = watch("filterStyles");
  const filterColors = watch("filterColors");
  const filterBrand = watch("filterBrand");

  // Debounce search term and filters
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [debouncedSeasons] = useDebounce(filterSeasons, 500);
  const [debouncedStyles] = useDebounce(filterStyles, 500);
  const [debouncedColors] = useDebounce(filterColors, 500);
  const [debouncedBrand] = useDebounce(filterBrand, 500);

  // Build query arguments using debounced values
  const queryArgs = {
    // page: 1,
    // limit: 10,

    // Debounced search term
    ...(debouncedSearch?.trim() && { title: debouncedSearch }),

    // Debounced seasons filter
    ...(debouncedSeasons &&
      debouncedSeasons.length > 0 && {
        seasons: debouncedSeasons.join(","),
      }),

    // Debounced styles filter
    ...(debouncedStyles &&
      debouncedStyles.length > 0 && {
        styles: debouncedStyles.join(","),
      }),

    // Debounced colors filter
    ...(debouncedColors &&
      debouncedColors.length > 0 && {
        colors: debouncedColors.join(","),
      }),

    ...(debouncedBrand?.trim() && { brand: debouncedBrand }),
  };

  const {
    data: allItem,
    isLoading: allItemLoading,
    isError: allItemError,
  } = useGetAllItemQuery(queryArgs, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: allCategory,
    isLoading: allCategoryLoading,
    isError: allCategoryError,
  } = useGetAllCategoryQuery();

  console.log("first", allItem, allItemLoading, allItemError);

  const categoryList = [
    { _id: "All", name: "All" },
    ...(allCategory?.categories || []),
  ];

  const [activeCategory, setActiveCategory] = useState("All");
  const navigation = useNavigation();

  // FIXED: Add null check for product.category
  const filteredProducts =
    activeCategory === "All"
      ? allItem
      : allItem?.filter((product) => {
          // Check if category exists and is an array/string before calling includes
          const productCategory = product.category;
          if (!productCategory) return false;

          // Handle both array and string formats
          if (Array.isArray(productCategory)) {
            return productCategory.includes(activeCategory);
          } else if (typeof productCategory === "string") {
            return productCategory === activeCategory;
          }
          return false;
        });

  // Render each category button
  const renderCategoryItem = ({ item }) => {
    const categoryId = item.name;
    return (
      <Pressable
        onPress={() => setActiveCategory(categoryId)}
        className="items-center gap-2"
      >
        <View
          className={`rounded-full items-center justify-center ${
            activeCategory === categoryId
              ? "border border-surfaceActionTertiary bg-purple-50"
              : "bg-gray-100"
          }`}
          style={{
            width: responsiveWidth(16),
            height: responsiveWidth(16),
          }}
        >
          <Text>{item?.name?.charAt(0).toUpperCase()}</Text>
        </View>
        <Text
          className={`text-md font-Medium ${
            activeCategory === categoryId
              ? isDarkMode
                ? "text-darkTextPrimary"
                : "text-gray-900"
              : isDarkMode
                ? "text-darkTextSecondary"
                : "text-gray-500"
          }`}
        >
          {item?.name}
        </Text>
      </Pressable>
    );
  };

  const renderProductItem = ({ item }) => (
    <Pressable
      onPress={() => {
        navigation.navigate("AddItemEdit");
        setValue("updateItem", item);
      }}
      className="flex-1 max-w-[48%]"
    >
      {/* Product Image Container */}
      <View className="bg-surfaceSecondary rounded-lg aspect-square items-center justify-center overflow-hidden relative">
        {item?.image ? (
          <Image
            source={{ uri: item?.image }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full items-center justify-center bg-gray-200">
            <Text>No Image</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View className="space-y-1 mt-1">
        <Text
          className={`text-lg font-SemiBold ${
            isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
          }`}
          numberOfLines={1}
        >
          {item?.title || "Untitled Item"}
        </Text>
        <Text
          className={`text-md font-Medium ${
            isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
          }`}
          numberOfLines={1}
        >
          {item?.brand || "No Brand"}
        </Text>
      </View>
    </Pressable>
  );

  const { isDarkMode } = useTheme();

  return (
    <View
      className=""
      style={{
        flex: 1,
        padding: responsiveWidth(5),
        gap: responsiveHeight(2),
      }}
    >
      {/* Category Filter */}
      <View>
        {allCategoryLoading ? (
          <ActivityIndicator color="purple" size={20} />
        ) : allCategoryError ? (
          <Text className="text-red-500 font-Medium">
            Failed to load categories
          </Text>
        ) : allCategory?.categories && allCategory?.categories.length > 0 ? (
          <FlatList
            data={categoryList}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item._id || item.id || item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              columnGap: responsiveWidth(4),
            }}
          />
        ) : null}
      </View>

      {/* Product Grid */}
      {allItemLoading ? (
        <ActivityIndicator color="purple" size={20} />
      ) : allItemError ? (
        <View className="flex-1 justify-center items-center ">
          <Text className="text-red-500 font-Medium">
            Internal Server or Internet Issue!
          </Text>
        </View>
      ) : allItem && allItem.length > 0 ? (
        <FlatList
          data={filteredProducts || []}
          renderItem={renderProductItem}
          keyExtractor={(item) =>
            item?._id?.toString() || Math.random().toString()
          }
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            rowGap: responsiveWidth(3),
            paddingBottom: responsiveWidth(4),
          }}
        />
      ) : (
        // <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            // gap: 5,
            // backgroundColor: "green",
          }}
        >
          <Image
            source={require("../../../../assets/images/itemTab.webp")}
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
            {t("itemTab.text1")}
          </Text>
          <Text
            className={`font-Regular text-[14px] text-center ${
              isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
            }`}
          >
            {t("itemTab.text2")}
          </Text>
        </View>
        // </ScrollView>
      )}
    </View>
  );
};

export default ItemTab;
