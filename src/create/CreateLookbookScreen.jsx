import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react-native";
import { responsiveWidth } from "react-native-responsive-dimensions";

import LookbookItemsTab from "./createLookbookComponents/LookbookItemsTab";
import LookbookOutfitsTab from "./createLookbookComponents/LookbookOutfitsTab";

import { TabView, SceneMap } from "react-native-tab-view";
import { Controller, useFormContext } from "react-hook-form";
import { useTheme } from "../utils/ThemeContext";
import { useTranslation } from "react-i18next";

const TAB_IDS = {
  LookbookItems: "Items",
  LookbookOutfits: "Outfit",
};

const TAB_OPTIONS = [
  { key: "items", title: "Items" },
  { key: "outfit", title: "Outfit" },
];

const CreateLookbookScreen = () => {
  const { control } = useFormContext({});
  const layout = useWindowDimensions();
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState("");
  const [index, setIndex] = useState(0);

  const [routes] = useState(TAB_OPTIONS);

  const handleGoBack = () => {
    if (navigation) navigation.goBack();
    // else console.log("Go back pressed");
  };

  const renderScene = SceneMap({
    items: LookbookItemsTab,
    outfit: LookbookOutfitsTab,
  });

  const handleTabPress = (i) => setIndex(i);

  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-darkSurfacePrimary/90" : "bg-white"}`}
    >
      {/* Header */}
      <View className="flex-row items-center  p-5 ">
        <Pressable
          onPress={handleGoBack}
          className="w-10 h-10 items-center justify-center -ml-2"
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} strokeWidth={2} color={"#5700FE"} />
        </Pressable>
        <Text
          className={`flex-1 text-center text-xl font-SemiBold ${isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"}`}
        >
          Lookbooks
        </Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      {/* Tab Header */}
      <View className="px-4 py-2 flex-row">
        {routes.map((tab, i) => (
          <Pressable
            key={tab.key}
            className="flex-1 py-3"
            onPress={() => handleTabPress(i)}
          >
            <Text
              className={`text-center text-base font-Medium ${
                index === i
                  ? isDarkMode
                    ? "text-darkTextPrimary border-b-2 border-darkBorderAction"
                    : "text-textPrimary border-b-2 border-borderAction"
                  : isDarkMode
                    ? "text-darkTextPrimary"
                    : "text-textPrimary"
              }`}
              style={index === i ? styles.activeTab : {}}
            >
              {t(`tabs.${tab.key}`)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Search & Filter */}
      <View className="flex-row items-center px-4 py-2  gap-3">
        <View className=" flex-row items-center border border-gray-200 rounded-2xl px-4 py-1">
          <Search size={18} color="#C5BFD1" />
          <Controller
            control={control}
            name="searchTextLookbook"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`flex-1 text-base ${isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"} p-2 font-Medium`}
                placeholder={t("searchPlaceholder")}
                placeholderTextColor="#9ca3af"
                value={value}
                onChangeText={onChange}
                returnKeyType="search"
              />
            )}
          />
        </View>
      </View>

      {/* Swipeable Tabs */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled
        renderTabBar={() => null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#7c3aed",
    paddingBottom: 8,
  },
});

export default CreateLookbookScreen;
