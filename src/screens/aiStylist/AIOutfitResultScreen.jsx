import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation, useRoute } from "@react-navigation/native"
import {
  ArrowLeft,
  Heart,
  RefreshCw,
  Shirt
} from "lucide-react-native"
import {
  responsiveHeight,
  responsiveWidth
} from "react-native-responsive-dimensions"
import { useTheme } from "../../utils/ThemeContext"
import { useTranslation } from "react-i18next"
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg"
import { useGetOutfitMutation, useUpdateOutfitFavoriteMutation } from "../../redux/slices/createOutfit/outfiltSlice"
import AnalyzingOverlay from "../../components/AIStylist/AnalyzingOverlay"

const AIOutfitResultScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const route = useRoute()
  const { isDarkMode } = useTheme()
  
  // Use state to manage outfit data so it can be refreshed
  const [outfitData, setOutfitData] = useState(route.params || {})
  const { outfit_id, image_url, title, payload, favorite } = outfitData
  const [imageLoading, setImageLoading] = useState(false)
  const [isFavorite, setIsFavorite] = useState(favorite || false)

  const [getOutfit, { isLoading: isRefreshing, reset: resetMutation }] = useGetOutfitMutation()
  const [updateFavorite] = useUpdateOutfitFavoriteMutation()

  // Sync isFavorite when outfitData changes (e.g. after refresh)
  useEffect(() => {
    setIsFavorite(outfitData.favorite || false)
  }, [outfitData])

  const handleFavoriteToggle = async () => {
    if (!outfit_id) return

    const newFavoriteStatus = !isFavorite
    setIsFavorite(newFavoriteStatus) // Optimistic update

    try {
      const response = await updateFavorite({ 
        id: outfit_id, 
        favorite: newFavoriteStatus 
      }).unwrap()
      
      // Update local data with the server response to keep it in sync
      if (response) {
        setOutfitData(prev => ({ ...prev, favorite: newFavoriteStatus }))
      }
    } catch (error) {
      console.error("Favorite Toggle Error:", error)
      setIsFavorite(!newFavoriteStatus) // Revert on error
      Alert.alert(
        t("common.error", "Error"),
        t("aiStylist.error.favoriteFailed", "Failed to update favorite status. Please try again.")
      )
    }
  }

  const handleRefresh = async () => {
    if (!payload) {
      console.warn("No payload found for refresh")
      return
    }

    try {
      const response = await getOutfit(payload).unwrap()
      if (response.status) {
        setOutfitData({
          ...response,
          payload // Preserve payload for future refreshes
        })
      }
    } catch (error) {
      console.error("Refresh Error:", error)
      Alert.alert(
        t("common.error", "Error"),
        t("aiStylist.error.failed", "Failed to get a new recommendation. Please try again.")
      )
    }
  }

  const handleTryOn = () => {
    navigation.navigate("BottomNavigator", {
      screen: "AIStylist",
      params: { 
        activeTab: "virtualTryOn",
        selectedItem: {
          image: image_url,
          _id: outfit_id,
          title: title
        }
      }
    });
  };

  return (
    <SafeAreaView 
      className="flex-1 bg-white dark:bg-darkSurfacePrimary"
    >
      <AnalyzingOverlay visible={isRefreshing} onCancel={() => resetMutation()} />
      {/* Fixed Header */}
      <View className="flex-row items-center px-5 py-4 my-2">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="items-center justify-center"
        >
          <ArrowLeft size={20} color={isDarkMode ? "white" : "black"} />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-Bold text-black dark:text-white mr-10">
          Outfit Result
        </Text>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="p-5">
          {/* Main Image Container */}
          <View 
            className="rounded-[30px] overflow-hidden relative shadow-sm items-center justify-center"
            style={{ 
              height: responsiveHeight(60),
              backgroundColor: isDarkMode ? "#1A1820" : "#F8F8F8"
            }}
          >
            {image_url ? (
              <>
                <Image
                  source={{ uri: image_url }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                  onLoadStart={() => setImageLoading(true)}
                  onLoadEnd={() => setImageLoading(false)}
                />
                {imageLoading && (
                  <View className="absolute inset-0 items-center justify-center">
                    <ActivityIndicator size="large" color="#8E54FE" />
                  </View>
                )}
              </>
            ) : (
              <View className="w-full h-full bg-gray-200 items-center justify-center">
                <Text>No Image</Text>
              </View>
            )}
            
            {/* Figma-Matched Smooth Gradient Overlay (72px height, 0-80% opacity) */}
            <View className="absolute inset-x-0 bottom-0 pointer-events-none">
              <Svg height="100" width="100%">
                <Defs>
                  <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#000000" stopOpacity={0} />
                    <Stop offset="0.2" stopColor="#000000" stopOpacity={0} />
                    <Stop offset="0.4" stopColor="#000000" stopOpacity={0.1} />
                    <Stop offset="0.6" stopColor="#000000" stopOpacity={0.2} />
                    <Stop offset="0.8" stopColor="#000000" stopOpacity={0.5} />
                    <Stop offset="1" stopColor="#000000" stopOpacity={0.7} />
                  </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
              </Svg>
              <View className="absolute bottom-[20px] left-[20px] right-[20px]">
                <Text className="text-white text-[20px] font-Bold">
                  {title}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Bar */}
          <View className="flex-row items-center gap-x-4 mt-6 mb-8">
            <TouchableOpacity 
              onPress={handleFavoriteToggle}
              className="w-12 h-12 items-center justify-center rounded-2xl"
              style={{ backgroundColor: isDarkMode ? "#1A1820" : "#F9F8FF" }}
            >
              <Heart 
                size={18} 
                color={isFavorite ? "#FF4B4B" : (isDarkMode ? "#F5F4F7" : "#08002B")} 
                fill={isFavorite ? "#FF4B4B" : "transparent"}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleRefresh}
              className="w-12 h-12 items-center justify-center rounded-2xl"
              style={{ backgroundColor: isDarkMode ? "#1A1820" : "#F9F8FF" }}
            >
              <RefreshCw size={18} color={isDarkMode ? "#F5F4F7" : "#08002B"} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleTryOn}
              className="flex-1 h-12 bg-[#8E54FE] rounded-2xl items-center justify-center flex-row"
            >
              <Shirt size={18} color="white" className="mr-2" />
              <Text className="text-white text-base font-SemiBold ml-2">Try On</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AIOutfitResultScreen
