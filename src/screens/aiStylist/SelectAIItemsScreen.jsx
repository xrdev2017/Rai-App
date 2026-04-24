
import {
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useMemo, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { useGetAiGeneratedOutfitsQuery } from "../../redux/slices/addItem/addItemSlice";
import { useDispatch } from "react-redux";
import { updateVtoOutfit } from "../../redux/reducers/aiStylistReducer";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../utils/ThemeContext";

const SelectAIItemsContent = () => {
  const navigation = useNavigation();
  const { watch, control, setValue } = useForm({
    defaultValues: {
      searchText: "",
      selectedItem: null,
    }
  });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const route = useRoute();
  const originScreen = route?.params?.originScreen;

  const searchTerm = watch("searchText");
  const selectedItem = watch("selectedItem");

  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: aiData,
    isLoading,
    isFetching,
    isError,
    error: queryError
  } = useGetAiGeneratedOutfitsQuery({ 
    page, 
    limit: 10, 
    search: debouncedSearch 
  });

  // Reset pagination and items when search term changes
  useEffect(() => {
    setPage(1);
    setItems([]); // Clear current items to show new search results
  }, [debouncedSearch]);

  useEffect(() => {
    if (aiData?.items) {
      if (page === 1) {
        setItems(aiData.items);
      } else {
        setItems((prev) => [...prev, ...aiData.items]);
      }
      
      if (aiData.pagination) {
        setHasMore(aiData.pagination.page < aiData.pagination.totalPages);
      }
    }
  }, [aiData]);

  const handleLoadMore = () => {
    if (hasMore && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  const handleApply = () => {
    if (selectedItem) {
      if (originScreen === "TryOnResult") {
        dispatch(updateVtoOutfit(selectedItem.image));
        navigation.navigate({
          name: "TryOnResult",
          params: { refresh: true },
          merge: true
        });
      } else {
        navigation.navigate("BottomNavigator", {
          screen: "AIStylist",
          params: { selectedItem: selectedItem, activeTab: "virtualTryOn" }
        });
      }
    }
  };

  const renderProductItem = ({ item }) => {
    const isSelected = selectedItem?._id === item._id;

    return (
      <Pressable
        onPress={() => setValue("selectedItem", isSelected ? null : item)}
        className="flex-1 max-w-[48%]"
      >
        <View className={`${isDarkMode ? "bg-darkSurfaceSecondary" : "bg-surfaceSecondary"} rounded-lg aspect-square items-center justify-center overflow-hidden relative`}>
          {item?.image ? (
            <Image
              source={{ uri: item?.image }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <View className={`w-full h-full ${isDarkMode ? "bg-darkSurfaceTertiary" : "bg-gray-200"} items-center justify-center`}>
              <Text className="text-gray-500">{t("common.noImage")}</Text>
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
            {item?.title}
          </Text>
        </View>
      </Pressable>
    );
  };

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
          {t("common.selectItems")}
        </Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      {/* Search Bar - Filter removed */}
      <View className="flex-row items-center py-2 mb-6">
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
                placeholder={t("common.search")}
                placeholderTextColor="#C5BFD1"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="search"
              />
            )}
          />
        </View>
      </View>

      {/* Items Grid */}
      <View className="flex-1">
        {isLoading && page === 1 ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#5700FE" />
          </View>
        ) : isError ? (
          <Text className="text-red-500 text-center">{t("common.failedToLoad")}</Text>
        ) : (
          <FlatList
            data={items}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between", gap: responsiveWidth(4) }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ 
              rowGap: responsiveWidth(3), 
              paddingBottom: responsiveWidth(5),
              flexGrow: 1
            }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => 
              isFetching && page > 1 ? (
                <ActivityIndicator size="small" color="#5700FE" style={{ marginVertical: 10 }} />
              ) : null
            }
            ListEmptyComponent={
              !isLoading && (
                <View className="flex-1 items-center justify-center">
                  <Text className={`text-lg font-Medium ${isDarkMode ? "text-darkTextSecondary" : "text-gray-500"}`}>
                    No items found
                  </Text>
                </View>
              )
            }
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
          {t("common.apply")}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

const SelectAIItemsScreen = () => {
  return (
    <SelectAIItemsContent />
  );
};

export default SelectAIItemsScreen;
