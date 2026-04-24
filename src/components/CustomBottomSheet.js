import { X, Search, ChevronsUp } from "lucide-react-native";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { responsiveWidth } from "react-native-responsive-dimensions";
import i18n from "../utils/languageSetup"; // import your i18n instance

const { height } = Dimensions.get("window");

// Bottom Sheet Modal (Reusable)

const SelectionBottomSheet = ({
  visible,
  onCancel,
  onApply,
  selectedItem,
  data = [],
  title = i18n.t("select"),
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(data);
  const [localSelected, setLocalSelected] = useState(selectedItem);
  const searchRef = useRef(null);

  // Sync localSelected when selectedItem prop changes
  useEffect(() => {
    setLocalSelected(selectedItem);
  }, [selectedItem]);

  // Update filtered items when data changes
  useEffect(() => {
    setFilteredItems(data);
  }, [data]);

  // Handle search
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.length > 0) {
      const filtered = data.filter((item) => {
        const label = item?.name || item;
        return label.toLowerCase().includes(text.toLowerCase());
      });
      setFilteredItems(filtered);
    } else {
      setFilteredItems(data);
    }
  };

  // Toggle selection
  const toggleSelection = (item) => {
    setLocalSelected(item);
  };

  // Reset everything
  const handleReset = () => {
    setLocalSelected(null);
    setSearchQuery("");
    setFilteredItems(data);
  };

  // Clear search only
  const clearSearch = () => {
    setSearchQuery("");
    setFilteredItems(data);
  };

  // Check if item is selected
  const isItemSelected = (item) => {
    if (!localSelected || !item) return false;

    const itemName = item?.name || item;
    const localName = localSelected?.name || localSelected;
    return localName === itemName;
  };

  // Handle apply
  const handleApply = () => {
    onApply(localSelected);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-white dark:bg-darkSurfacePrimary">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 pt-6 border-b border-gray-100">
          <TouchableOpacity onPress={onCancel} className="p-2">
            <X size={24} color="#5700FE" />
          </TouchableOpacity>
          <Text className="text-xl font-SemiBold text-textPrimary dark:text-darkTextPrimary">
            {title}
          </Text>
          <TouchableOpacity onPress={handleReset}>
            <Text className="text-base font-Medium text-textPrimary dark:text-darkTextPrimary">
              {i18n.t("reset")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="px-5">
          <View className="flex-row items-center border border-borderAction rounded-xl px-4 py-1 bg-white dark:bg-gray-600">
            <Search size={20} color="#8b5cf6" />
            <TextInput
              ref={searchRef}
              className="flex-1 ml-3 text-base font-Medium text-black dark:text-darkTextPrimary"
              value={searchQuery}
              onChangeText={handleSearch}
              placeholder={i18n.t("search_placeholder")}
              placeholderTextColor="#9ca3af"
              autoFocus={visible}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} className="p-1">
                <X size={16} color="#5700FE" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* List */}
        <View className="flex-1 mt-2">
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: responsiveWidth(5) }}
          >
            {filteredItems.map((item, index) => {
              const label = item?.name || item;
              const key = item?._id || index;
              const selected = isItemSelected(item);

              return (
                <TouchableOpacity
                  key={key}
                  className={`flex-row items-center justify-between py-4 border-b ${
                    selected
                      ? "border-surfaceAction bg-purple-50"
                      : "border-zinc-200"
                  }`}
                  onPress={() => toggleSelection(item)}
                >
                  <Text
                    className={`text-base font-Medium flex-1 ${
                      selected
                        ? "text-surfaceAction font-SemiBold"
                        : "text-textPrimary dark:text-darkTextPrimary"
                    }`}
                  >
                    {label}
                  </Text>
                  {selected && (
                    <View className="w-6 h-6 rounded-full bg-surfaceAction items-center justify-center">
                      <X size={14} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

            {filteredItems.length === 0 && (
              <View className="flex-1 justify-center items-center py-20">
                <Text className="text-gray-500 text-center mt-4">
                  {i18n.t("no_matches", { query: searchQuery })}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Apply Button */}
        <View className="p-4">
          <TouchableOpacity
            className={`rounded-2xl py-4 items-center ${
              localSelected ? "bg-surfaceAction" : "bg-gray-300"
            }`}
            onPress={handleApply}
            disabled={!localSelected}
            activeOpacity={0.8}
          >
            <Text
              className={`text-lg font-SemiBold ${
                localSelected ? "text-white" : "text-gray-500"
              }`}
            >
              {i18n.t("apply")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Main Bottom Sheet

const CustomBottomSheet = ({
  title = i18n.t("select_item"),
  data = [],
  initialSelected,
  onChange,
  isLoading = false,
  loadingText = i18n.t("loading"),
  error = null,
  errorText = i18n.t("load_error"),
  returnFullObject = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Update selectedItem when initialSelected or data changes
  useEffect(() => {
    if (initialSelected && initialSelected.length > 0 && data.length > 0) {
      const initial = initialSelected[0];
      const found = data.find((item) => {
        const itemName = item?.name || item;
        const itemId = item?._id || item;
        return itemName === initial || itemId === initial;
      });
      if (found) {
        setSelectedItem(found);
      }
    } else if (initialSelected === null || (initialSelected && initialSelected.length === 0)) {
      setSelectedItem(null);
    }
  }, [initialSelected, data]);

  const getSelectedLabel = () => {
    if (!selectedItem) return i18n.t("not_selected");
    return selectedItem?.name || selectedItem;
  };

  const handleApply = (items) => {
    console.log("handleApply called with items:", items);
    const selected = items;

    // If selected is an object, extract the name
    const selectedName =
      typeof selected === "object" ? selected?.name : selected;

    setSelectedItem(selected);
    setShowModal(false);
    if (onChange) onChange(returnFullObject ? selected : selectedName);
  };

  return (
    <View className="w-full">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-[16px] font-SemiBold text-textPrimary dark:text-darkTextPrimary mb-2">
          {title}
        </Text>
        <Text className="text-[16px] font-Medium text-textPrimary dark:text-darkTextPrimary mb-2 border-b border-zinc-300">
          {getSelectedLabel()}
        </Text>
      </View>

      {isLoading ? (
        <View className="w-full bg-gray-200 rounded-2xl py-3 px-6 flex-row items-center justify-center">
          <ActivityIndicator size="small" color="#666666" />
          <Text className="text-gray-600 text-base font-Medium ml-2">
            {loadingText}
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          className="w-full bg-surfaceActionTertiary rounded-2xl py-3 px-6 flex-row items-center justify-center"
          onPress={() => setShowModal(true)}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-Medium text-center">
            {i18n.t("select", { title })}
          </Text>
          <ChevronsUp size={20} color="white" />
        </TouchableOpacity>
      )}

      {!isLoading && !error && (
        <SelectionBottomSheet
          visible={showModal}
          onCancel={() => setShowModal(false)}
          onApply={handleApply}
          selectedItem={selectedItem}
          data={data}
          title={title}
        />
      )}
    </View>
  );
};

export default CustomBottomSheet;
