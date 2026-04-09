
import {
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft, Search, SlidersHorizontal, X } from "lucide-react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import CustomBottomSheet from "../../components/CustomBottomSheet";
import { seasons } from "../../../assets/data/data";
import ColorPalette from "../../components/ColorPallete";
import { useForm, FormProvider, Controller, useFormContext } from "react-hook-form";
import { useDebounce } from "use-debounce";
import {
  useGetAllCategoryQuery,
  useGetAllItemQuery,
  useGetAllStyleQuery,
} from "../../redux/slices/addItem/addItemSlice";
import MultiOptionSelector from "../../components/MultiOptionSelector";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../utils/ThemeContext";

const FilterBottomSheet = ({ visible, onCancel }) => {
  const { watch, setValue, reset } = useFormContext();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const brand = watch("filterBrand");
  const selectedSeasons = watch("filterSeasons") || [];
  const selectedStyles = watch("filterStyles") || [];

  const {
    data: allStyles,
    isError: allStylesError,
    isLoading: allStylesLoading,
  } = useGetAllStyleQuery();

  const handleToggleSeason = (season) => {
    const newSeasons = selectedSeasons.includes(season)
      ? selectedSeasons.filter((s) => s !== season)
      : [...selectedSeasons, season];
    setValue("filterSeasons", newSeasons, { shouldValidate: true });
  };

  const handleToggleStyle = (style) => {
    const newStyles = selectedStyles.includes(style)
      ? selectedStyles.filter((s) => s !== style)
      : [...selectedStyles, style];
    setValue("filterStyles", newStyles, { shouldValidate: true });
  };

  const handleBrandSelect = (selected) => {
    setValue("filterBrand", selected[0] || "");
  };

  const resetFilters = () => {
    reset({
      filterSeasons: [],
      filterStyles: [],
      filterColors: [],
      filterBrand: "",
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <SafeAreaView className="flex-1">
        <View
          className={`flex-1 ${isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"} h-full`}
          style={{ padding: responsiveWidth(5) }}
        >
          {/* Header */}
          <View className={`flex-row items-center justify-between border-b ${isDarkMode ? "border-darkBorderTertiary" : "border-gray-100"}`}>
            <Pressable onPress={onCancel} className="p-2">
              <X size={24} color="#5700FE" />
            </Pressable>
            <Text className={`text-xl font-semibold ${isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"}`}>
              {t("filtersSheet.title")}
            </Text>
            <Pressable onPress={resetFilters}>
              <Text className={`text-base font-medium ${isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"}`}>
                {t("filtersSheet.reset")}
              </Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={{ gap: responsiveHeight(2) }}
            showsVerticalScrollIndicator={false}
          >
            <ColorPalette name="filterColors" />

            {/* Season */}
            <View>
              <Text className={`text-lg font-SemiBold ${isDarkMode ? "text-darkTextPrimary" : "text-black"}`}>
                {t("filtersSheet.season")}
              </Text>
              <View className="flex-row flex-wrap gap-2 mt-2">
                {seasons.map((season) => (
                  <MultiOptionSelector
                    key={season}
                    title={t(`filtersSheet.seasons.${season}`)}
                    selectedValues={selectedSeasons}
                    onSelect={handleToggleSeason}
                  />
                ))}
              </View>
            </View>

            {/* Style */}
            <View>
              <Text className={`text-lg font-SemiBold ${isDarkMode ? "text-darkTextPrimary" : "text-black"}`}>
                {t("filtersSheet.style")}
              </Text>
              <View className="flex-row gap-4 flex-wrap">
                {allStylesLoading ? (
                  <ActivityIndicator size="small" color="#5700FE" />
                ) : allStylesError ? (
                  <Text className="text-red-500">
                    {t("filtersSheet.failedToLoadStyles")}
                  </Text>
                ) : (
                  allStyles?.styles.map((opt) => (
                    <MultiOptionSelector
                      key={opt?.name}
                      title={opt?.name}
                      selectedValues={selectedStyles}
                      onSelect={handleToggleStyle}
                    />
                  ))
                )}
              </View>
            </View>
          </ScrollView>

          {/* Apply Button */}
          <View>
            <Pressable
              className="bg-surfaceAction rounded-2xl py-4 items-center"
              onPress={onCancel}
            >
              <Text className="text-white text-lg font-SemiBold">
                {t("filtersSheet.apply")}
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const SelectItemsContent = () => {
  const navigation = useNavigation();
  const { watch, control, setValue } = useFormContext();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const searchTerm = watch("searchText");
  const filterSeasons = watch("filterSeasons");
  const filterStyles = watch("filterStyles");
  const filterColors = watch("filterColors");
  const selectedItem = watch("selectedItem");

  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const queryArgs = {
    ...(debouncedSearch?.trim() && { title: debouncedSearch }),
    ...(filterSeasons &&
      filterSeasons.length > 0 && { seasons: filterSeasons.join(",") }),
    ...(filterStyles &&
      filterStyles.length > 0 && { styles: filterStyles.join(",") }),
    ...(filterColors &&
      filterColors.length > 0 && { colors: filterColors.join(",") }),
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
  } = useGetAllCategoryQuery();

  const [selectedTab, setSelectedTab] = useState("All");
  const [showFilterModal, setShowFilterModal] = useState(false);

  const filteredItems = useMemo(() => {
    if (selectedTab === "All") return allItem;
    return allItem?.filter(item => {
        const itemCategory = item.category;
        if (!itemCategory) return false;
        if (Array.isArray(itemCategory)) return itemCategory.includes(selectedTab);
        return itemCategory === selectedTab;
    });
  }, [allItem, selectedTab]);

  const handleApply = () => {
    if (selectedItem) {
      navigation.navigate("BottomNavigator", {
        screen: "AI Stylist",
        params: { selectedItem: selectedItem }
      });
    }
  };

  const renderProductItem = ({ item }) => {
    const isSelected = selectedItem?._id === item._id;

    return (
      <Pressable
        onPress={() => setValue("selectedItem", isSelected ? null : item)}
        className="flex-1 max-w-[48%]"
      >
        <View className="bg-surfaceSecondary rounded-lg aspect-square items-center justify-center overflow-hidden relative">
          {item?.image ? (
            <Image
              source={{ uri: item?.image }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-gray-200 items-center justify-center">
              <Text className="text-gray-500">No Image</Text>
            </View>
          )}

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
            className={`text-lg font-SemiBold ${isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"}`}
            numberOfLines={1}
          >
            {item?.title || "Untitled Item"}
          </Text>
          <Text
            className={`text-md font-Medium ${isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"}`}
            numberOfLines={1}
          >
            {item?.brand || "No Brand"}
          </Text>
        </View>
      </Pressable>
    );
  };

  const categoryData = [{ _id: "all", name: "All" }, ...(allCategory?.categories || [])];

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? "bg-darkSurfacePrimary/90" : "bg-white"}`} style={{ padding: responsiveWidth(5) }}>
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-10 h-10 justify-center items-center -ml-2"
        >
          <ArrowLeft size={20} color="#5700FE" />
        </Pressable>
        <Text className={`flex-1 text-center text-xl font-Bold ${isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"}`}>
          Select Items
        </Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      {/* Search + Filter */}
      <View className="flex-row items-center py-2 gap-3 mb-6">
        <View className={`flex-1 flex-row items-center border rounded-2xl px-4 ${isDarkMode ? "border-darkBorderTertiary bg-darkSurfaceSecondary" : "border-[#C5BFD1] bg-white"}`}
          style={{ height: responsiveHeight(5.5) }}
        >
          <Search size={20} color="#C5BFD1" />
          <Controller
            control={control}
            name="searchText"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`flex-1 text-[16px] px-3 font-Medium ${isDarkMode ? "text-darkTextPrimary" : "text-[#100D1F]"}`}
                placeholder={"Search"}
                placeholderTextColor="#C5BFD1"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="search"
              />
            )}
          />
        </View>
        <Pressable
          onPress={() => setShowFilterModal(true)}
          className="bg-surfaceAction rounded-2xl items-center justify-center"
          style={{ width: responsiveHeight(6), height: responsiveHeight(6) }}
        >
          <SlidersHorizontal size={24} color="white" />
        </Pressable>
      </View>

      {/* Categories */}
      <View className="mb-6">
        {allCategoryLoading ? (
          <ActivityIndicator size="small" color="#5700FE" />
        ) : (
          <FlatList
            data={categoryData}
            renderItem={({ item }) => (
              <Pressable
                className={`px-6 py-2.5 rounded-full border ${selectedTab === item.name ? "bg-surfaceAction border-surfaceAction" : "bg-white border-[#E5E5E5]"}`}
                onPress={() => setSelectedTab(item.name)}
              >
                <Text className={`text-[16px] font-Medium ${selectedTab === item.name ? "text-white" : "text-[#100D1F]"}`}>
                  {item.name}
                </Text>
              </Pressable>
            )}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: responsiveWidth(3) }}
          />
        )}
      </View>

      {/* Items Grid */}
      <View className="flex-1">
        {allItemLoading ? (
          <ActivityIndicator size="large" color="#5700FE" />
        ) : allItemError ? (
          <Text className="text-red-500 text-center">Failed to load items</Text>
        ) : (
          <FlatList
            data={filteredItems}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between", gap: responsiveWidth(4) }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ rowGap: responsiveWidth(3), paddingBottom: responsiveWidth(5) }}
          />
        )}
      </View>

      {/* Apply Button */}
      <Pressable
        onPress={handleApply}
        disabled={!selectedItem}
        className={`p-4 rounded-2xl justify-center items-center shadow-md ${selectedItem ? "bg-surfaceAction" : "bg-gray-300"}`}
      >
        <Text className={`text-xl font-Medium ${selectedItem ? "text-white" : "text-gray-500"}`}>
          Apply
        </Text>
      </Pressable>

      <FilterBottomSheet visible={showFilterModal} onCancel={() => setShowFilterModal(false)} />
    </SafeAreaView>
  );
};

const SelectItemsScreen = () => {
  const methods = useForm({
    defaultValues: {
      searchText: "",
      filterSeasons: [],
      filterStyles: [],
      filterColors: [],
      filterBrand: "",
      selectedItem: null,
    }
  });

  return (
    <FormProvider {...methods}>
      <SelectItemsContent />
    </FormProvider>
  );
};

export default SelectItemsScreen;
