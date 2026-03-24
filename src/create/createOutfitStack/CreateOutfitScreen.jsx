import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  GestureDetector,
  GestureHandlerRootView,
  Gesture,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import {
  ArrowLeft,
  ChevronsUp,
  FastForward,
  RotateCcw,
  Save,
  Search,
  SlidersHorizontal,
  Trash2,
  Upload,
  X,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import {
  initialWindowMetrics,
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import { categories, seasons } from "../../../assets/data/data";
import { Slider } from "@miblanchard/react-native-slider";
import CustomBottomSheet from "../../components/CustomBottomSheet";
import ColorPalette from "../../components/ColorPallete";
import {
  useGetAllCategoryQuery,
  useGetAllItemQuery,
  useGetAllStyleQuery,
} from "../../redux/slices/addItem/addItemSlice";
import { Controller, useFormContext } from "react-hook-form";
import { useDebounce } from "use-debounce";
import MultiOptionSelector from "../../components/MultiOptionSelector";
import { useTranslation } from "react-i18next";
import { useTheme as useAppTheme } from "../../utils/ThemeContext";

const { width, height } = Dimensions.get("window");

const DraggableImage = ({ uri, onTransformChange, id, initialTransform }) => {
  const scale = useSharedValue(initialTransform?.scale || 1);
  const translateX = useSharedValue(initialTransform?.translateX || 0);
  const translateY = useSharedValue(initialTransform?.translateY || 0);
  const rotation = useSharedValue(initialTransform?.rotation || 0);

  const pan = Gesture.Pan().onChange((e) => {
    translateX.value += e.changeX;
    translateY.value += e.changeY;
    if (onTransformChange) {
      runOnJS(onTransformChange)(id, {
        translateX: translateX.value,
        translateY: translateY.value,
        scale: scale.value,
        rotation: rotation.value,
      });
    }
  });

  const pinch = Gesture.Pinch().onChange((e) => {
    scale.value = e.scale;
    if (onTransformChange) {
      runOnJS(onTransformChange)(id, {
        translateX: translateX.value,
        translateY: translateY.value,
        scale: scale.value,
        rotation: rotation.value,
      });
    }
  });

  const rotate = Gesture.Rotation().onChange((e) => {
    rotation.value += e.rotation * 0.3;
    if (onTransformChange) {
      runOnJS(onTransformChange)(id, {
        translateX: translateX.value,
        translateY: translateY.value,
        scale: scale.value,
        rotation: rotation.value,
      });
    }
  });

  const composedGesture = Gesture.Simultaneous(pan, pinch, rotate);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotateZ: `${rotation.value}rad` },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.Image
        source={{ uri }}
        style={[styles.image, animatedStyle]}
        resizeMode="contain"
      />
    </GestureDetector>
  );
};

const AddItemBottomSheet = ({ visible, onCancel, openFilter }) => {
  const { control, setValue, watch } = useFormContext();
  const searchTerm = watch("searchTextCreateOutfit");
  const filterSeasons = watch("filterSeasons");
  const filterStyles = watch("filterStyles");
  const filterColors = watch("filterColors");
  const filterBrand = watch("filterBrand");
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  console.log(
    "LINE AT 139",
    filterColors,
    filterSeasons,
    filterStyles,
    filterBrand,
  );

  const queryArgs = {
    page: 1,
    limit: 10,
    ...(debouncedSearch?.trim() && { title: debouncedSearch }),
    ...(filterSeasons &&
      filterSeasons.length > 0 && { seasons: filterSeasons.join(",") }),
    ...(filterStyles &&
      filterStyles.length > 0 && { styles: filterStyles.join(",") }),
    ...(filterColors &&
      filterColors.length > 0 && { colors: filterColors.join(",") }),
    ...(filterBrand && filterBrand.length > 0 && { brand: filterBrand }),
  };

  const {
    data: allItem,
    isLoading: allItemLoading,
    isError: allItemError,
  } = useGetAllItemQuery(queryArgs, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: categories,
    isLoading: categoryLoading,
    error: categoryError,
    refetch,
  } = useGetAllCategoryQuery();

  const selectedCategoryIds = watch("selectedCategory") || [];
  const selectedFormItems = watch("selectedItems") || [];
  const { t } = useTranslation();
  const toggleArrayItem = (array, item) => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  const handleToggleCategory = (categoryId) => {
    const newSelectedCategories = toggleArrayItem(
      selectedCategoryIds,
      categoryId,
    );
    setValue("selectedCategory", newSelectedCategories);
  };

  const handleToggleItem = (item) => {
    const isAlreadySelected = selectedFormItems.some(
      (selectedItem) => selectedItem?._id === item?._id,
    );

    if (isAlreadySelected) {
      setValue(
        "selectedItems",
        selectedFormItems.filter(
          (selectedItem) => selectedItem?._id !== item?._id,
        ),
      );
    } else {
      setValue("selectedItems", [...selectedFormItems, item]);
    }
  };

  const renderCategoryChips = () => {
    if (categoryLoading) {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: responsiveWidth(3) }}
        >
          {[1, 2, 3, 4, 5].map((item) => (
            <View
              key={item}
              className="py-2 px-5 rounded-full mb-2 bg-gray-200 animate-pulse"
            >
              <View className="w-16 h-4 bg-gray-300 rounded" />
            </View>
          ))}
        </ScrollView>
      );
    }

    if (categoryError) {
      return (
        <View className="py-3 mb-2 items-center">
          <Text className="text-textSecondary text-sm">
            Failed to load categories.{" "}
            <Text
              className="text-surfaceAction underline"
              onPress={() => refetch()}
            >
              Try again
            </Text>
          </Text>
        </View>
      );
    }

    if (categories?.categories?.length > 0) {
      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: responsiveWidth(3) }}
        >
          {categories.categories.map((category) => {
            const isSelected = selectedCategoryIds.includes(category?._id);
            return (
              <Pressable
                key={category._id}
                onPress={() => handleToggleCategory(category?._id)}
                className={`py-2 px-5 rounded-full mb-2 ${
                  isSelected ? "bg-surfaceAction" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`text-base font-Medium ${
                    isSelected ? "text-white" : "text-textPrimary"
                  }`}
                >
                  {category?.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      );
    }

    return (
      <View className="py-3 mb-2 items-center">
        <Text className="text-textSecondary text-sm">
          No categories available
        </Text>
      </View>
    );
  };

  const renderProductItem = ({ item }) => {
    const isSelected = selectedFormItems.some(
      (selectedItem) => selectedItem?._id === item?._id,
    );

    return (
      <Pressable
        onPress={() => handleToggleItem(item)}
        className="flex-1 max-w-[48%]"
      >
        <View className="bg-surfaceSecondary rounded-lg aspect-square items-center justify-center overflow-hidden relative">
          <Image
            source={{ uri: item?.image }}
            className="w-full h-full"
            resizeMode="cover"
          />

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
            className="text-lg text-textPrimary dark:text-darkTextPrimary font-SemiBold"
            numberOfLines={1}
          >
            {item?.title}
          </Text>
          <Text
            className="text-md text-textPrimary dark:text-darkTextPrimary font-Medium"
            numberOfLines={1}
          >
            {item?.brand}
          </Text>
        </View>
      </Pressable>
    );
  };

  const renderItemsGrid = () => {
    return (
      <FlatList
        data={allItem}
        renderItem={renderProductItem}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: responsiveWidth(4),
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          rowGap: responsiveWidth(3),
          paddingBottom: responsiveWidth(2),
        }}
        ListEmptyComponent={
          <View>
            {allItemLoading && <ActivityIndicator color="purple" size={20} />}
            {allItemError && (
              <Text className="text-red-500 font-Medium">
                Internal Server or Internet Issue!
              </Text>
            )}
          </View>
        }
      />
    );
  };

  if (!visible) return null;
  const { isDarkMode } = useAppTheme();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
          <View
            className={`flex-1 ${isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"} `}
            style={{
              padding: responsiveWidth(5),
              gap: responsiveHeight(2),
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <View
              className={`flex-row items-center border-b ${
                isDarkMode ? "border-darkBorderTertiary" : "border-gray-100"
              }`}
            >
              <Pressable onPress={onCancel} className="p-2">
                <X size={24} color="#5700FE" />
              </Pressable>
              <Text
                className={`text-xl font-SemiBold ${isDarkMode ? "text-darkTextPrimary" : " text-textPrimary"}   text-center`}
                style={{ paddingLeft: responsiveWidth(23) }}
              >
                Add Items
              </Text>
            </View>

            <View className="flex-row items-center  py-2 gap-3">
              <View
                className={`flex-1 flex-row items-center border rounded-2xl px-4 py-1 ${
                  isDarkMode
                    ? "border-darkBorderTertiary bg-darkSurfaceSecondary"
                    : "border-gray-200 bg-white"
                }`}
              >
                <Search size={18} color="#C5BFD1" />
                <Controller
                  name="searchTextCreateOutfit"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className={`flex-1 text-base p-2 ${isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"} font-Medium`}
                      placeholder={t("searchPlaceholder")}
                      placeholderTextColor="#9ca3af"
                      value={value}
                      onChangeText={onChange}
                      returnKeyType="search"
                    />
                  )}
                />
              </View>
              <Pressable
                className="p-4 bg-surfaceAction rounded-xl items-center justify-center"
                onPress={openFilter}
              >
                <SlidersHorizontal size={20} color="white" />
              </Pressable>
            </View>

            <View>{renderCategoryChips()}</View>

            <View className="flex-1">{renderItemsGrid()}</View>

            <Pressable
              className="bg-surfaceAction py-4 rounded-xl"
              onPress={onCancel}
            >
              <Text className="text-textPrimaryInverted font-SemiBold text-[16px] text-center">
                Apply
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};

const FilterBottomSheet = ({ visible, onCancel }) => {
  const { watch, setValue, reset } = useFormContext();
  const { isDarkMode } = useAppTheme();

  const {
    data: allStyles,
    isError: allStylesError,
    isLoading: allStylesLoading,
  } = useGetAllStyleQuery();

  const selectedSeasons = watch("filterSeasons") || [];
  const selectedStyles = watch("filterStyles") || [];
  const filterColors = watch("filterColors");
  const brand = watch("brand");

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
    setValue("filterBrand", selected || "");
  };

  const resetFilters = () => {
    reset({
      usage: 50,
      selectedSeasons: [],
      selectedStyles: [],
      filterColors: [],
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
          <View
            className={`flex-1 ${isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"}`}
            style={{
              padding: responsiveWidth(5),
            }}
          >
            <View
              className={`flex-row items-center justify-between border-b ${
                isDarkMode ? "border-darkBorderTertiary" : "border-gray-100"
              }`}
            >
              <Pressable onPress={onCancel} className="p-2">
                <X size={24} color="#5700FE" />
              </Pressable>
              <Text
                className={`text-xl font-semibold ${
                  isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
                }`}
              >
                Filters
              </Text>
              <Pressable onPress={resetFilters}>
                <Text
                  className={`text-base font-medium ${
                    isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
                  }`}
                >
                  Reset
                </Text>
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={{
                gap: responsiveHeight(2),
              }}
              showsVerticalScrollIndicator={false}
            >
              <CustomBottomSheet
                title="Brand"
                data={categories}
                initialSelected={brand ? [brand] : []}
                onChange={handleBrandSelect}
                errorText="Failed to load categories"
              />

              <ColorPalette name="filterColors" />

              <View className="">
                <Text
                  className={`text-lg font-SemiBold ${
                    isDarkMode ? "text-darkTextPrimary" : "text-black"
                  }`}
                >
                  Season
                </Text>
                <View className="flex-row flex-wrap gap-2 mt-2">
                  {seasons.map((season) => (
                    <MultiOptionSelector
                      key={season}
                      title={season}
                      selectedValues={selectedSeasons}
                      onSelect={handleToggleSeason}
                    />
                  ))}
                </View>
              </View>
            </ScrollView>

            <View>
              <Pressable
                className="bg-surfaceAction rounded-2xl py-4 items-center"
                onPress={onCancel}
              >
                <Text className="text-white text-lg font-SemiBold">Apply</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};

export default function CreateOutfitScreen() {
  const [images, setImages] = useState([]);
  const viewShotRef = useRef();
  const navigation = useNavigation();

  const [transformHistory, setTransformHistory] = useState([]);
  const animatedValuesRef = useRef({});
  const [forceUpdate, setForceUpdate] = useState(0);

  const { getValues, setValue } = useFormContext();
  const { selectedItems, selectedCategory, searchTextCreateOutfit } =
    getValues();

  // const pickImage = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     allowsEditing: false,
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     const uri = result.assets[0].uri;
  //     setImages((prev) => [...prev, uri]);
  //   }
  // };

  const saveCanvas = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow media library access");
      return;
    }

    try {
      const uri = await viewShotRef.current.capture();
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success", "Canvas saved to gallery!");
      setValue("outfitImage", uri);
      navigation.navigate("SetOutfit");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to save image");
    }
  };

  const handleTransformChange = (id, transform) => {
    animatedValuesRef.current[id] = transform;

    setTransformHistory((prev) => [
      ...prev,
      { id, transform, timestamp: Date.now() },
    ]);
  };

  const undoLastPosition = () => {
    if (transformHistory.length === 0) return;

    const lastTransform = transformHistory[transformHistory.length - 1];

    setTransformHistory((prev) => prev.slice(0, -1));

    // Remove the last transform from the ref
    if (transformHistory.length === 1) {
      animatedValuesRef.current = {};
    } else {
      delete animatedValuesRef.current[lastTransform.id];
    }

    setForceUpdate((prev) => prev + 1);
  };

  const undoLast = () => {
    const { selectedItems } = getValues();

    if (selectedItems.length === 0) return;

    const updatedItems = selectedItems.slice(0, -1);

    setValue("selectedItems", updatedItems, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const clearCanvas = () => {
    Alert.alert("Clear Canvas", "Are you sure you want to remove all images?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          setValue("selectedItems", []);
          setTransformHistory([]);
          animatedValuesRef.current = {};
          setForceUpdate((prev) => prev + 1);
        },
      },
    ]);
  };

  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const { t } = useTranslation();
  // console.log("LINE AT 2061", selectedItems);
  const { isDarkMode } = useAppTheme();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          className={`flex-1 ${isDarkMode ? "bg-darkSurfacePrimary/90" : "bg-white"}  items-center`}
        >
          <View
            className="flex-row items-center"
            style={{ padding: responsiveWidth(5) }}
          >
            <Pressable
              onPress={() => navigation.goBack()}
              className="w-10 h-10 justify-center items-center -ml-2"
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#5700FE" />
            </Pressable>
            <Text
              className={`flex-1 text-center text-xl font-SemiBold ${isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"}`}
            >
              {t("canvas.title")}
            </Text>

            <View
              style={{
                width: responsiveWidth(10),
              }}
            />
          </View>

          <ViewShot
            ref={viewShotRef}
            style={[
              styles.canvas,
              {
                backgroundColor: isDarkMode ? "#2D2633" : "#F5F4F7",
                borderWidth: 1,
                borderColor: isDarkMode ? "#3D3843" : "#D8D4E0",
              },
            ]}
            options={{ format: "png", quality: 1 }}
          >
            <View
              style={[
                styles.canvas,
                {
                  backgroundColor: isDarkMode ? "#2D2633" : "#F5F4F7",
                },
              ]}
            >
              {selectedItems?.map((item, index) => (
                <DraggableImage
                  key={`${index}-${forceUpdate}`}
                  uri={item.image}
                  id={index}
                  onTransformChange={handleTransformChange}
                  initialTransform={animatedValuesRef.current[index]}
                />
              ))}
            </View>
          </ViewShot>

          <View
            className="absolute flex-row gap-4"
            style={{ bottom: responsiveHeight(13) }}
          >
            <Pressable
              onPress={undoLastPosition}
              className={`p-3 rounded-full border-2 ${
                isDarkMode ? "border-darkBorderTertiary bg-darkSurfaceSecondary" : "border-gray-300 bg-white"
              }`}
              disabled={transformHistory.length === 0}
            >
              <FastForward
                color={transformHistory.length === 0 ? "lightgray" : "gray"}
              />
            </Pressable>

            <Pressable
              disabled={!(selectedItems?.length > 0)}
              className={`py-3 px-3.5 rounded-full ${
                selectedItems?.length > 0 ? "bg-surfaceAction" : "bg-gray-300"
              }`}
              onPress={saveCanvas}
            >
              <Save color="white" />
            </Pressable>

            <Pressable
              onPress={undoLast}
              className={`p-3 rounded-full border-2 ${
                isDarkMode ? "border-darkBorderTertiary bg-darkSurfaceSecondary" : "border-gray-300 bg-white"
              }`}
              disabled={selectedItems?.length === 0}
            >
              <RotateCcw
                color={selectedItems?.length === 0 ? "lightgray" : "gray"}
              />
            </Pressable>

            <Pressable
              onPress={clearCanvas}
              className={`p-3 rounded-full border-2 ${
                isDarkMode ? "border-darkBorderTertiary bg-darkSurfaceSecondary" : "border-gray-300 bg-white"
              }`}
              disabled={selectedItems?.length === 0}
            >
              <Trash2
                color={selectedItems?.length === 0 ? "lightgray" : "gray"}
              />
            </Pressable>
          </View>

          <Pressable
            className="absolute bg-surfaceActionTertiary py-4 rounded-xl w-11/12 flex-row items-center justify-center gap-2"
            onPress={() => setShowModal(true)}
            style={{ bottom: responsiveHeight(3) }}
          >
            <Text className="text-textPrimaryInverted font-SemiBold text-[16px] text-center">
              {t("canvas.button")}
            </Text>
            <ChevronsUp color="white" />
          </Pressable>
        </View>

        <AddItemBottomSheet
          visible={showModal}
          onCancel={() => setShowModal(false)}
          openFilter={() => setShowFilterModal(true)}
        />
        <FilterBottomSheet
          visible={showFilterModal}
          onCancel={() => setShowFilterModal(false)}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  canvas: {
    width: width * 0.9,
    height: height * 0.65,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: 150,
    height: 150,
    position: "absolute",
  },
});
