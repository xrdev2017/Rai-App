import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { Slider } from "@miblanchard/react-native-slider";
import { useTranslation } from "react-i18next";

import ColorPalette from "../components/ColorPallete";
import PieChart from "../components/PieChart";

import {
  useGetColorCountQuery,
  useGetMostWardOutfitsQuery,
  useGetUsageStatsQuery,
} from "../redux/slices/authSlice";
import { useTheme } from "../utils/ThemeContext";

const AnalyticsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const [usageValue, setUsageValue] = useState(50);

  const { data: allUsages } = useGetUsageStatsQuery();
  const {
    data: allMostWard,
    isLoading: allMostWardLoading,
    isError: allMostWardError,
  } = useGetMostWardOutfitsQuery();
  const { data: allColors } = useGetColorCountQuery();

  const customData = [
    { value: 30, color: "#6366f1", label: t("pieChart.labels.technology") },
    { value: 25, color: "#f59e0b", label: t("pieChart.labels.healthcare") },
    { value: 20, color: "#ef4444", label: t("pieChart.labels.finance") },
    { value: 15, color: "#10b981", label: t("pieChart.labels.education") },
    { value: 10, color: "#8b5cf6", label: t("pieChart.labels.other") },
  ];

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-darkSurfacePrimary/90" : "bg-white"}`}
      style={{ padding: responsiveWidth(5) }}
    >
      {/* Header */}
      <View className="flex-row items-center pb-4">
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center -ml-2"
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} strokeWidth={2} color={"#5700FE"} />
        </Pressable>
        <Text
          className={`flex-1 text-center text-xl font-SemiBold ${
            isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
          }`}
        >
          {t("analyticsScreen.header")}
        </Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      <ScrollView
        contentContainerStyle={{ gap: responsiveHeight(3) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Wardrobe Usage */}
        <View>
          <View className="flex-row justify-between items-center mb-1">
            <Text
              className={`text-lg font-SemiBold ${
                isDarkMode ? "text-darkTextPrimary" : "text-black"
              }`}
            >
              {t("analyticsScreen.wardrobeUsage")}
            </Text>
            <Text className="text-base font-Medium text-violet-500">
              {(allUsages?.usage)?.toFixed(2)}%
            </Text>
          </View>

          <Slider
            value={allUsages?.usage}
            onValueChange={setUsageValue}
            disabled
            minimumValue={1}
            maximumValue={100}
            step={1}
            minimumTrackTintColor="#8B5CF6"
            maximumTrackTintColor={isDarkMode ? "#3D3843" : "#E5E7EB"}
            thumbTintColor="#5700FE"
            trackStyle={{
              height: 10,
              borderRadius: 5,
              backgroundColor: isDarkMode ? "#3D3843" : "#E5E7EB",
            }}
            thumbStyle={{
              width: 24,
              height: 24,
              borderRadius: 15,
              backgroundColor: "#5700FE",
            }}
          />

          <View className="flex-row justify-between">
            <Text
              className={`text-sm font-Medium ${
                isDarkMode ? "text-darkTextSecondary" : "text-gray-400"
              }`}
            >
              {t("analyticsScreen.sliderMin")}
            </Text>
            <Text
              className={`text-sm font-Medium ${
                isDarkMode ? "text-darkTextSecondary" : "text-gray-400"
              }`}
            >
              {t("analyticsScreen.sliderMax")}
            </Text>
          </View>

          <Text
            className={`text-base font-Medium text-center ${
              isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
            }`}
          >
            {t("analyticsScreen.wardrobeUsageInfo", {
              usage: (allUsages?.usage)?.toFixed(2),
            })}
          </Text>
        </View>

        {/* Pie Chart */}
        <PieChart radius={60} fontSize={14} centerText="17" numSlices={"20"} />

        {/* Most Worn Items */}
        <View className="flex-1">
          <Text
            className={`text-lg font-SemiBold ${
              isDarkMode ? "text-darkTextPrimary" : "text-black"
            }`}
          >
            {t("analyticsScreen.mostWornItems")}
          </Text>

          <FlatList
            data={allMostWard?.outfits || []}
            keyExtractor={(item, index) => item._id || index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                className={isDarkMode ? "bg-darkSurfaceSecondary" : "bg-white"}
                style={{
                  padding: 8,
                  borderRadius: 8,
                  marginRight: 8,
                  shadowColor: "gray",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  alignItems: "center",
                }}
              >
                {item?.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 96, height: 96, borderRadius: 6 }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: 6,
                      backgroundColor: isDarkMode ? "#2D2633" : "#f0f0f0",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      className={
                        isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
                      }
                    >
                      {t("analyticsScreen.noImage")}
                    </Text>
                  </View>
                )}

                <Text
                  className={
                    isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
                  }
                  style={{
                    textAlign: "center",
                    marginTop: 4,
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                >
                  {item?.title || t("analyticsScreen.untitled")}
                </Text>
              </View>
            )}
            ListEmptyComponent={
              <>
                {allMostWardLoading && (
                  <ActivityIndicator color="purple" size="small" />
                )}
                {allMostWardError && (
                  <Text
                    className={
                      isDarkMode ? "text-darkTextSecondary" : "text-textSecondary"
                    }
                  >
                    {t("analyticsScreen.error")}
                  </Text>
                )}
              </>
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;
