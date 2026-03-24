
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
import { categories, seasons, stylesList } from "../../../assets/data/data";
import ColorPalette from "../../components/ColorPallete";
import { Controller, useFormContext } from "react-hook-form";
import { useDebounce } from "use-debounce";
import {
  useGetAllCategoryQuery,
  useGetAllItemQuery,
  useGetAllStyleQuery,
} from "../../redux/slices/addItem/addItemSlice";
import MultiOptionSelector from "../../components/MultiOptionSelector";
import { useTranslation } from "react-i18next";


const BottomSheet = ({ visible, onCancel }) => {
  const [usageValue, setUsageValue] = useState(50);
  const { watch, setValue, reset } = useFormContext();
  const { t } = useTranslation();

  const brand = watch("brand");
  const selectedSeasons = watch("filterSeasons") || [];
  const selectedStyles = watch("filterStyles") || [];
  const dressMeFilter = watch("dressMeFilter");

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
    setValue("brand", selected[0] || "");
  };

  const resetFilters = () => {
    reset({
      usage: 50,
      filterSeasons: [],
      filterStyles: [],
      dressMeFilter: [],
      brand: "",
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View className="flex-1">
        <View
          className="flex-1 bg-white dark:bg-darkSurfacePrimary  h-full"
          style={{ padding: responsiveWidth(5) }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-gray-100">
            <Pressable onPress={onCancel} className="p-2">
              <X size={24} color="#5700FE" />
            </Pressable>
            <Text className="text-xl font-semibold text-textPrimary dark:text-darkTextPrimary">
              {t("filtersSheet.title")}
            </Text>
            <Pressable onPress={resetFilters}>
              <Text className="text-base font-medium text-textPrimary dark:text-darkTextPrimary">
                {t("filtersSheet.reset")}
              </Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={{ gap: responsiveHeight(2) }}
            showsVerticalScrollIndicator={false}
          >
            {/* Brand + Color Palette */}
            <CustomBottomSheet
              title={t("filtersSheet.brand")}
              data={categories}
              initialSelected={brand ? [brand] : []}
              onChange={handleBrandSelect}
            />
            <ColorPalette name="dressMeFilter" />

            {/* Season */}
            <View>
              <Text className="text-lg font-SemiBold text-black dark:text-darkTextPrimary">
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
              <Text className="text-lg font-SemiBold text-black dark:text-darkTextPrimary">
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
      </View>
    </Modal>
  );
};

const AddItemScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    data: allCategory,
    isLoading: allCategoryLoading,
    isError: allCategoryError,
  } = useGetAllCategoryQuery();

  const { watch, control, setValue } = useFormContext();
  const searchTerm = watch("searchTextDress");
  const filterSeasons = watch("filterSeasons");
  const filterStyles = watch("filterStyles");
  const dressMeFilter = watch("dressMeFilter");

  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const queryArgs = {
    page: 1,
    limit: 10,
    ...(debouncedSearch?.trim() && { title: debouncedSearch }),
    ...(filterSeasons &&
      filterSeasons.length > 0 && { seasons: filterSeasons.join(",") }),
    ...(filterStyles &&
      filterStyles.length > 0 && { styles: filterStyles.join(",") }),
    ...(dressMeFilter &&
      dressMeFilter.length > 0 && { colors: dressMeFilter.join(",") }),
  };

  const {
    data: allItem,
    isLoading: allItemLoading,
    isError: allItemError,
  } = useGetAllItemQuery(queryArgs, {
    refetchOnMountOrArgChange: true,
  });

  const { title, id: typeId, tab } = route.params;
  const selectedItems = watch(`selectedItems${typeId}`) || [];

  const selectedIds = useMemo(() => {
    return new Set(selectedItems?.map((item) => item.id));
  }, [selectedItems]);

  // Check if at least one item is selected
  const isAtLeastOneItemSelected = selectedItems.length > 0;

  const toggleSelect = (id, item) => {
    const currentSelected = [...selectedItems];

    if (selectedIds.has(id)) {
      // Remove if already selected
      const index = currentSelected.findIndex((selected) => selected.id === id);
      if (index > -1) {
        currentSelected.splice(index, 1);
      }
    } else {
      // Add if not selected
      currentSelected.push({ id, item });
    }

    setValue(`selectedItems${typeId}`, currentSelected);
  };

  const renderProductItem = ({ item, index }) => {
    const isSelected = selectedIds.has(item._id);

    return (
      <Pressable
        onPress={() => toggleSelect(item._id, item)}
        className={`flex-1 max-w-[48%]`}
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
            <View className="w-full h-full bg-gray-200 items-center justify-center">
              <Text className="text-gray-500">No Image</Text>
            </View>
          )}

          {/* Overlay + Tick */}
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

        {/* Product Info */}
        <View className="space-y-1 mt-2">
          <Text
            className="text-lg text-textPrimary dark:text-darkTextPrimary font-SemiBold"
            numberOfLines={1}
          >
            {item?.title || "Untitled Item"}
          </Text>
          <Text
            className="text-md text-textPrimary dark:text-darkTextPrimary font-Medium"
            numberOfLines={1}
          >
            {item?.brand || "No Brand"}
          </Text>
        </View>
      </Pressable>
    );
  };

  const [selectedTab, setSelectedTab] = useState("");
  const [showModal, setShowModal] = useState(false);

  const renderTab = ({ item }) => {
    const isSelected = selectedTab === item?.name;

    return (
      <Pressable
        className={`px-4 py-2 rounded-full  border ${
          isSelected
            ? "bg-surfaceAction border-surfaceAction"
            : "bg-white border-gray-200"
        }`}
        onPress={() => setSelectedTab(item?.name)}
      >
        <Text
          className={`text-base font-Medium ${
            isSelected ? "text-white" : "text-gray-600"
          }`}
          numberOfLines={1}
        >
          {item?.name || "Unnamed Category"}
        </Text>
      </Pressable>
    );
  };

  const { t } = useTranslation();

  return (
    <SafeAreaView
      className="flex-1 bg-white dark:bg-darkSurfacePrimary/90"
      style={{
        padding: responsiveWidth(5),
      }}
    >
      <View className="flex-row items-center">
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-10 h-10 justify-center items-center -ml-2"
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#5700FE" />
        </Pressable>
        <Text className="flex-1 text-center text-xl font-SemiBold text-textPrimary dark:text-darkTextPrimary">
          {title}
        </Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      <View
        style={{
          flex: 1,
          gap: responsiveHeight(2),
        }}
      >
        <View className="flex-row items-center py-2 gap-3">
          <View className="flex-1 flex-row items-center border border-gray-200 rounded-2xl px-4 py-1">
            <Search size={18} color="#C5BFD1" />

            <Controller
              control={control}
              name="searchTextDress"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <>
                  <TextInput
                    className="flex-1 text-base px-2 text-textPrimary dark:text-darkTextPrimary font-Medium"
                    placeholder={t("search_placeholder")}
                    placeholderTextColor="#9ca3af"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="search"
                  />
                </>
              )}
            />
          </View>

          <Pressable
            onPress={() => setShowModal(true)}
            className="p-4 bg-surfaceAction rounded-xl items-center justify-center"
          >
            <SlidersHorizontal size={20} color={"white"} />
          </Pressable>
        </View>

        <View>
          {allCategoryLoading ? (
            <ActivityIndicator size="small" color="#5700FE" />
          ) : allCategoryError ? (
            <Text className="text-red-500">Failed to load categories</Text>
          ) : (
            <FlatList
              data={allCategory?.categories}
              renderItem={renderTab}
              keyExtractor={(item) => item._id || Math.random().toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: responsiveWidth(3) }}
            />
          )}
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-textPrimary dark:text-darkTextPrimary font-SemiBold text-base">
            Select Items ({selectedItems?.length})
          </Text>
          {!isAtLeastOneItemSelected && (
            <Text className="text-red-500 font-SemiBold text-base">
              You need to add at least 1 item
            </Text>
          )}
        </View>

        <Controller
          control={control}
          name={`selectedItems${typeId}`}
          render={({ field: { value } }) => (
            <>
              {allItemLoading ? (
                <View className="flex-1 justify-center items-center">
                  <ActivityIndicator size="large" color="#5700FE" />
                  <Text className="mt-2 text-textPrimary">
                    Loading items...
                  </Text>
                </View>
              ) : allItemError ? (
                <View className="flex-1 justify-center items-center">
                  <Text className="text-red-500">Failed to load items</Text>
                  <Pressable
                    onPress={() => navigation.goBack()}
                    className="mt-4 bg-surfaceAction rounded-xl px-4 py-2"
                  >
                    <Text className="text-white">Go Back</Text>
                  </Pressable>
                </View>
              ) : allItem?.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                  <Text className="text-textPrimary">No items found</Text>
                  <Text className="text-gray-500 mt-2">
                    Try changing your filters or search term
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={allItem}
                  renderItem={renderProductItem}
                  keyExtractor={(item) => item._id.toString()}
                  numColumns={2}
                  columnWrapperStyle={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    gap: responsiveWidth(4),
                  }}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    rowGap: responsiveWidth(3),
                    paddingBottom: responsiveWidth(4),
                  }}
                />
              )}
            </>
          )}
        />
      </View>

      <Pressable
        onPress={() => navigation.navigate("DressMe", { tab: tab, id: typeId })}
        disabled={!isAtLeastOneItemSelected}
        activeOpacity={isAtLeastOneItemSelected ? 0.8 : 1}
        className={`p-4 rounded-2xl justify-center items-center shadow-md ${
          isAtLeastOneItemSelected ? "bg-surfaceAction" : "bg-gray-300"
        }`}
      >
        <Text
          className={`text-xl font-Medium ${
            isAtLeastOneItemSelected ? "text-white" : "text-gray-500"
          }`}
        >
          Apply
        </Text>
      </Pressable>

      <BottomSheet visible={showModal} onCancel={() => setShowModal(false)} />
    </SafeAreaView>
  );
};

export default AddItemScreen;
