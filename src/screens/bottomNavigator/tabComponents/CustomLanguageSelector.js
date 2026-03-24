import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Text,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { ChevronDown } from "lucide-react-native";
import { useTheme } from "../../../utils/ThemeContext";

const CustomLanguageSelector = ({
  languages = ["ENG", "SPA", "FRE"],
  selectedLanguage, // Controlled by parent
  onLanguageChange, // Callback to parent
  size = "default",
  style,
  containerStyle,
  textStyle,
  activeTextStyle,
  disabled = false,
  showDropdown = true, // New prop to enable/disable dropdown
}) => {
  const { isDarkMode } = useTheme();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showAllLanguages, setShowAllLanguages] = useState(false);

  // Show only first 2 languages initially, rest in dropdown
  const displayedLanguages = showAllLanguages
    ? languages
    : languages.slice(0, 2);
  const hiddenLanguages = languages.slice(2);

  const animatedValue = useRef(
    new Animated.Value(languages.indexOf(selectedLanguage))
  ).current;

  const sizeConfig = {
    small: {
      containerWidth: 80,
      containerHeight: 28,
      fontSize: 10,
      paddingHorizontal: 8,
      paddingVertical: 4,
      dropdownIconSize: 14,
    },
    default: {
      containerWidth: responsiveWidth(showAllLanguages ? 28 : 20),
      containerHeight: responsiveHeight(4.5),
      fontSize: 12,
      paddingHorizontal: 12,
      paddingVertical: 6,
      dropdownIconSize: 16,
    },
    large: {
      containerWidth: 120,
      containerHeight: 36,
      fontSize: 14,
      paddingHorizontal: 16,
      paddingVertical: 8,
      dropdownIconSize: 18,
    },
  };

  const config = sizeConfig[size] || sizeConfig.default;
  const segmentWidth = config.containerWidth / displayedLanguages.length;

  useEffect(() => {
    const index = languages.indexOf(selectedLanguage);
    if (index !== -1) {
      Animated.timing(animatedValue, {
        toValue: index,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  }, [selectedLanguage]);

  const handleLanguagePress = (lang) => {
    if (!disabled && lang !== selectedLanguage) {
      onLanguageChange(lang);
      setDropdownVisible(false);
    }
  };

  const toggleDropdown = () => {
    if (showDropdown && hiddenLanguages.length > 0) {
      setShowAllLanguages(!showAllLanguages);
    }
  };

  const toggleFullDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const indicatorPosition = animatedValue.interpolate({
    inputRange: languages.map((_, index) => index),
    outputRange: languages.map((_, index) => index * segmentWidth),
    extrapolate: "clamp",
  });

  const renderLanguageItem = ({ item }) => (
    <Pressable
      style={[
        styles.dropdownItem,
        item === selectedLanguage && styles.dropdownItemActive,
        {
          borderBottomColor: isDarkMode ? "rgba(139, 84, 254, 0.1)" : "#F0F0F0",
        },
      ]}
      onPress={() => handleLanguagePress(item)}
    >
      <Text
        style={[
          styles.dropdownItemText,
          item === selectedLanguage && styles.dropdownItemTextActive,
          {
            color:
              item === selectedLanguage
                ? "#5700FE"
                : isDarkMode
                  ? "#B8AFCC"
                  : "#333",
          },
        ]}
      >
        {item}
      </Text>
      {item === selectedLanguage && (
        <View style={[styles.selectedDot, { backgroundColor: "#5700FE" }]} />
      )}
    </Pressable>
  );

  return (
    <>

      {/* Full Dropdown Modal */}
      {showDropdown && (
        <Modal
          transparent
          visible={dropdownVisible}
          animationType="fade"
          onRequestClose={() => setDropdownVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setDropdownVisible(false)}
          >
            <View
              className={`${isDarkMode ? 'dark:bg-darkSurfacePrimary' : 'bg-white'}  `}
              style={styles.modalContent}
            >
              <Text
                className={`${isDarkMode ? 'text-darkTextPrimary' : 'text-textPrimary'}  `}
                style={styles.modalTitle}
              >
                Select Language
              </Text>
              <FlatList
                data={languages}
                renderItem={renderLanguageItem}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Full Dropdown Toggle (Alternative - Shows all languages in dropdown) */}
      {showDropdown && (
        <TouchableOpacity
          style={styles.fullDropdownButton}
          onPress={toggleFullDropdown}
        >
          <Text style={styles.fullDropdownButtonText}>
            {selectedLanguage} ▼
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  container: {
    backgroundColor: "#F4F4F4",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  containerDisabled: {
    opacity: 0.5,
    backgroundColor: "#E0E0E0",
  },
  activeIndicator: {
    position: "absolute",
    backgroundColor: "#5700FE",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1,
  },
  optionsContainer: {
    flexDirection: "row",
    flex: 1,
    zIndex: 2,
  },
  languageOption: {
    justifyContent: "center",
    alignItems: "center",
  },
  languageText: {
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  dropdownToggle: {
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdownToggleActive: {
    backgroundColor: "#E8E6FF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    width: responsiveWidth(70),
    maxHeight: responsiveHeight(50),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dropdownItemActive: {
    backgroundColor: "rgba(87, 0, 254, 0.05)",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownItemTextActive: {
    color: "#5700FE",
    fontWeight: "600",
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#5700FE",
  },
  fullDropdownButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#F4F4F4",
    borderRadius: 12,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  fullDropdownButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#5700FE",
  },
});

export default CustomLanguageSelector;
