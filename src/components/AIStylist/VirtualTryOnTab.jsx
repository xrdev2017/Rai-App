import React, { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
  Keyboard
} from "react-native"
import { ScrollView, FlatList } from "react-native-gesture-handler"
import * as ImagePicker from "expo-image-picker"
import {
  responsiveHeight,
  responsiveWidth
} from "react-native-responsive-dimensions"
import { Camera, Shirt, Image as ImageIcon, Plus, X } from "lucide-react-native"
import Svg, { Path, Circle } from "react-native-svg"
import { useTheme } from "../../utils/ThemeContext"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useVirtualTryOnMutation, useGetAiGeneratedOutfitsQuery } from "../../redux/slices/addItem/addItemSlice"
import { setLastVtoResult } from "../../redux/reducers/aiStylistReducer"
import { useDebounce } from "use-debounce"
import AnalyzingOverlay from "./AnalyzingOverlay"

const HangerIcon = ({ size, color }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M12 2v3M9 7c-2 1-3 3-3 5v8h12v-8c0-2-1-4-3-5M9 7a4 4 0 0 1 6 0" />
    <Path d="M6 15h12" />
  </Svg>
)

const CameraPlusIcon = ({ size, color }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10" />
    <Path d="M15 13a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z" />
    <Path d="M19 16v6" />
    <Path d="M16 19h6" />
    <Path d="M21 11.5a8.38 8.38 0 0 0-.9-3.38L18 4H14.5" />
  </Svg>
)

const VirtualTryOnTab = () => {
  const { t } = useTranslation()
  const { isDarkMode } = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [virtualTryOn, { reset: resetVto }] = useVirtualTryOnMutation()
  const [showAnalyzing, setShowAnalyzing] = useState(false)

  // New States for Search and Selection
  const [searchText, setSearchText] = useState("")
  const [debouncedSearch] = useDebounce(searchText, 500)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [tempSelectedOutfit, setTempSelectedOutfit] = useState(null)
  const [activeOutfit, setActiveOutfit] = useState(null)

  const [selectedImage, setSelectedImage] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      inputRef.current?.blur()
      setShowSuggestions(false)
    })

    return () => {
      keyboardDidHideListener.remove()
    }
  }, [])

  // API Call for suggestions
  const { data: suggestions, isLoading: isSearching } = useGetAiGeneratedOutfitsQuery(
    { search: debouncedSearch, limit: 5 },
    { skip: !debouncedSearch || debouncedSearch.length < 2 }
  )

  // Log Search Params and Response
  useEffect(() => {
    console.log("⌨️ Search Input:", searchText)
    if (debouncedSearch) {
      console.log("🔍 Outfit Search Params:", { search: debouncedSearch, limit: 5 })
    }
  }, [searchText, debouncedSearch])

  useEffect(() => {
    console.log("📡 Search Status:", { isSearching, hasData: !!suggestions })
    if (suggestions) {
      console.log("📦 Raw Search Response:", JSON.stringify(suggestions, null, 2))
      if (suggestions.items) {
        console.log("👗 Found Outfits:", suggestions.items.length)
      }
    }
  }, [suggestions, isSearching])

  // Sync navigation params with activeOutfit
  useEffect(() => {
    if (route.params?.selectedItem) {
      setActiveOutfit(route.params.selectedItem)
      setSearchText("")
      setTempSelectedOutfit(null)
      // Clear the param after use so it doesn't persist on remount
      navigation.setParams({ selectedItem: undefined })
    }
  }, [route.params?.selectedItem])

  const handleSuggestionSelect = (outfit) => {
    setSearchText(outfit.title)
    setTempSelectedOutfit(outfit)
    setShowSuggestions(false)
    inputRef.current?.blur()
  }

  const handleAddManualOutfit = () => {
    if (tempSelectedOutfit) {
      setActiveOutfit(tempSelectedOutfit)
      setSearchText("")
      setTempSelectedOutfit(null)
      setShowSuggestions(false)
      inputRef.current?.blur()
    } else {
      Alert.alert(
        t("common.info", "Select Item"),
        t("aiStylist.virtualTryOnTab.selectOutfitError", "Please select an outfit from the suggestions first.")
      )
    }
  }

  const handleTryOutfit = async () => {
    if (!activeOutfit) {
      Alert.alert(
        t("aiStylist.virtualTryOnTab.alertTitle"),
        t("aiStylist.virtualTryOnTab.selectOutfitError")
      )
      return
    }
    if (!selectedImage) {
      Alert.alert(
        t("aiStylist.virtualTryOnTab.alertTitle"),
        t("aiStylist.virtualTryOnTab.selectPhotoError")
      )
      return
    }

    const remainingCredits = (user?.credits?.vto?.limit || 0) - (user?.credits?.vto?.used || 0)
    if (remainingCredits <= 0) {
      Alert.alert(
        t("common.info", "Info"),
        t("aiStylist.aiStylistTab.error.limitReached", "You've reached your daily limit. Please upgrade your plan for more generations.")
      )
      return
    }

    try {
      const formData = new FormData()
      
      // Add user image
      const userImageFile = {
        uri: selectedImage,
        name: "user_image.jpg",
        type: "image/jpeg"
      }
      formData.append("user_image", userImageFile)

      // Add outfit image URL (either from selected item or manual ID/URL if applicable)
      // Based on curl, it expects outfit_image_url
      formData.append("outfit_image_url", activeOutfit?.image)

      console.log("🚀 VTO API Params:", {
        userId: user?._id || user?.id,
        user_image: userImageFile,
        outfit_image_url: activeOutfit?.image
      })

      setShowAnalyzing(true)

      const response = await virtualTryOn({
        formData,
        userId: user?._id || user?.id
      }).unwrap()

      console.log("✅ VTO API Response:", response)

      if (response?.data?.tryOnImage) {
        const resultData = {
          originalImage: selectedImage,
          resultImage: response.data.tryOnImage,
          outfitImageUrl: activeOutfit?.image
        }

        dispatch(setLastVtoResult(resultData))
        navigation.navigate("TryOnResult")
        
        // Hide overlay after navigation starts
        setTimeout(() => setShowAnalyzing(false), 500)
      } else {
        setShowAnalyzing(false)
        Alert.alert(t("common.error"), t("common.failedToLoad"))
      }
    } catch (error) {
      setShowAnalyzing(false)
      console.error("Virtual Try-On Error:", error)
      Alert.alert(t("common.error"), error?.data?.message || t("common.somethingWentWrong"))
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1
    })

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
    }
  }

  return (
    <View className="flex-1">
      <AnalyzingOverlay visible={showAnalyzing} onCancel={() => {
        setShowAnalyzing(false)
        resetVto()
      }} />
      <ScrollView
        className="flex-1 px-5"
      showsVerticalScrollIndicator={false}
      style={{ zIndex: 1 }}
      contentContainerStyle={{ paddingBottom: responsiveHeight(15) }}
      keyboardShouldPersistTaps="always"
    >
      <View className="mt-4" />

      {/* Section 1: The Outfit */}
      <View className="mb-4" style={{ zIndex: 100 }}>
        <Text
          className="text-base font-Bold mb-2"
          style={{ color: isDarkMode ? "#F5F4F7" : "#08002B" }}
        >
          {t("aiStylist.virtualTryOnTab.outfitSection")}
        </Text>

        {!activeOutfit && (
          <>
            <View className="flex-row items-center mb-4" style={{ zIndex: 110 }}>
              <View className="flex-1 mr-2">
                <View
                  className="rounded-lg px-4 justify-center border"
                  style={{
                    height: responsiveHeight(6),
                    backgroundColor: isDarkMode ? "#2D2633" : "#fff",
                    borderColor: isDarkMode ? "#3D3843" : "#E5E5E5"
                  }}
                >
                  <TextInput
                    placeholder={t("aiStylist.virtualTryOnTab.outfitIdPlaceholder")}
                    placeholderTextColor={isDarkMode ? "#5C526D" : "#C5BFD1"}
                    value={searchText}
                    onChangeText={(text) => {
                      setSearchText(text)
                      setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="text-sm font-Medium"
                    style={{ color: isDarkMode ? "#F5F4F7" : "#08002B" }}
                  />
                </View>

                {/* Suggestions Dropdown */}
                {showSuggestions && searchText.length > 0 && (suggestions || isSearching) && (
                  <View 
                    className="absolute top-[105%] left-0 right-0 rounded-lg shadow-lg border overflow-hidden"
                    style={{ 
                      backgroundColor: isDarkMode ? "#2D2633" : "#fff",
                      borderColor: isDarkMode ? "#3D3843" : "#E5E5E5",
                      zIndex: 200,
                      elevation: 5,
                      maxHeight: responsiveHeight(25)
                    }}
                  >
                    {isSearching ? (
                      <View className="p-4 items-center">
                        <ActivityIndicator size="small" color="#8E54FE" />
                      </View>
                    ) : (
                      <FlatList
                        data={suggestions?.items || []}
                        keyExtractor={(item) => item._id}
                        keyboardShouldPersistTaps="always"
                        nestedScrollEnabled={true}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() => handleSuggestionSelect(item)}
                            className="flex-row items-center p-3 border-b"
                            style={{ borderBottomColor: isDarkMode ? "#3D3843" : "#F2F1F5" }}
                          >
                            <Image 
                              source={{ uri: item.image }} 
                              className="w-10 h-10 rounded mr-3"
                              resizeMode="cover"
                            />
                            <Text 
                              className="text-xs font-Medium flex-1"
                              style={{ color: isDarkMode ? "#F5F4F7" : "#08002B" }}
                              numberOfLines={1}
                            >
                              {item.title}
                            </Text>
                          </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                          !isSearching && searchText?.length > 0 ? (
                            <View className="p-4 items-center">
                              <Text className="text-xs text-gray-400">{t("aiStylist.virtualTryOnTab.noMatchingOutfits")}</Text>
                            </View>
                          ) : null
                        }
                      />
                    )}
                  </View>
                )}
              </View>

              <TouchableOpacity
                onPress={handleAddManualOutfit}
                className="rounded-lg px-6 justify-center items-center"
                style={{
                  height: responsiveHeight(6),
                  backgroundColor: isDarkMode ? "#3D3843" : "#05001D"
                }}
              >
                <Text className="text-white font-Bold text-sm">
                  {t("aiStylist.virtualTryOnTab.addButton")}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center mb-4">
              <View
                className="flex-1 border-b"
                style={{ borderColor: isDarkMode ? "#2D2633" : "#E5E5E5" }}
              />
              <Text
                className="mx-4 text-[10px] font-Bold tracking-[1.5px]"
                style={{ color: isDarkMode ? "#B8AFCC" : "#A0A0A0" }}
              >
                {t("aiStylist.virtualTryOnTab.or")}
              </Text>
              <View
                className="flex-1 border-b"
                style={{ borderColor: isDarkMode ? "#2D2633" : "#E5E5E5" }}
              />
            </View>
          </>
        )}

        {/* Select from Wardrobe or Selected Item */}
        {activeOutfit ? (
          <Pressable
            onPress={() => navigation.navigate("SelectAIItems")}
            className={`flex-row items-center p-4 rounded-xl border relative ${
              isDarkMode
                ? "bg-darkSurfaceSecondary border-darkBorderTertiary"
                : "bg-white border-[#E5E5E5]"
            }`}
          >
            <TouchableOpacity
              onPress={() => setActiveOutfit(null)}
              className="absolute top-2 right-2 bg-black/40 p-1.5 rounded-full"
              style={{ zIndex: 50 }}
            >
              <X size={12} color="white" />
            </TouchableOpacity>

            <View
              className="rounded-lg w-16 h-16 items-center justify-center overflow-hidden mr-4"
              style={{ backgroundColor: isDarkMode ? "#3D3843" : "#F2F1F5" }}
            >
              <Image
                source={{ uri: activeOutfit.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1">
              <Text
                className={`text-[16px] font-Bold mb-1 ${isDarkMode ? "text-darkTextPrimary" : "text-[#05001D]"}`}
              >
                {t("aiStylist.virtualTryOnTab.selectedItem")}
              </Text>
              <Text 
                className="text-[12px] font-Medium"
                style={{ color: isDarkMode ? "#B8AFCC" : "#C5BFD1" }}
              >
                {t("aiStylist.virtualTryOnTab.tapToReplace")}
              </Text>
            </View>
          </Pressable>
        ) : (
          <TouchableOpacity
            style={[
              styles.dashedBox,
              { borderColor: isDarkMode ? "#3D3843" : "#E5E5E5" }
            ]}
            onPress={() => navigation.navigate("SelectAIItems")}
            className="flex-row items-center justify-center py-8 rounded-xl"
          >
            <Shirt
              size={24}
              color={isDarkMode ? "#CBD5E1" : "#C5BFD1"}
              style={{ marginRight: 10 }}
            />
            <Text
              className="text-base font-Medium"
              style={{ color: isDarkMode ? "#CBD5E1" : "#C5BFD1" }}
            >
              {t("aiStylist.virtualTryOnTab.selectFromWardrobe")}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Section 2: Your Photo */}
      <View className="mb-4">
        <Text
          className="text-base font-Bold mb-2"
          style={{ color: isDarkMode ? "#F5F4F7" : "#08002B" }}
        >
          {t("aiStylist.virtualTryOnTab.photoSection")}
        </Text>

        <View
          style={[
            styles.dashedBoxLarge,
            { borderColor: isDarkMode ? "#3D3843" : "#E5E5E5" }
          ]}
          className="rounded-xl overflow-hidden"
        >
          {selectedImage ? (
            <View className="flex-1">
              <Image
                source={{ uri: selectedImage }}
                className="w-full h-full"
              />
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-black/50 p-2 rounded-full"
              >
                <X size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-1 items-center justify-center py-12">
              <TouchableOpacity
                onPress={pickImage}
                className="bg-[#8E54FE] w-16 h-16 rounded-full items-center justify-center mb-5"
              >
                <CameraPlusIcon size={30} color="white" />
              </TouchableOpacity>

              <Text
                className="text-[18px] font-Bold mb-2 text-center"
                style={{ color: isDarkMode ? "#F5F4F7" : "#05001D" }}
              >
                {t("aiStylist.virtualTryOnTab.uploadFullBody")}
              </Text>
              <Text
                className="text-[13px] font-Medium text-center mb-7 px-10"
                style={{ color: isDarkMode ? "#B8AFCC" : "#C5BFD1" }}
              >
                {t("aiStylist.virtualTryOnTab.lightingAdvice")}
              </Text>

              <TouchableOpacity onPress={pickImage}>
                <Text className="text-[#8E54FE] font-Medium text-[14px] text-center">
                  {t("aiStylist.virtualTryOnTab.selectFromLibrary")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Try This Outfit Button */}
      <TouchableOpacity
        className="mt-2 mb-10"
        onPress={handleTryOutfit}
        disabled={showAnalyzing}
      >
        <View
          className="flex-row items-center justify-center bg-[#8E54FE] rounded-xl"
          style={{ paddingVertical: 10 }}
        >
          {showAnalyzing ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <HangerIcon size={24} color="white" />
              <View className="ml-3" />
              <Text className="text-lg text-white">
                {t("aiStylist.virtualTryOnTab.tryButton")}
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    </ScrollView>
    </View>
  )
}

export default VirtualTryOnTab

const styles = StyleSheet.create({
  dashedLine: {
    borderStyle: "dashed",
    borderBottomWidth: 1
  },
  dashedBox: {
    borderStyle: "dashed",
    borderWidth: 1
  },
  dashedBoxLarge: {
    borderStyle: "dashed",
    borderWidth: 1,
    minHeight: responsiveHeight(35)
  }
})
