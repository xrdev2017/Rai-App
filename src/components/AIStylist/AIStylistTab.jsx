import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
  Platform
} from "react-native"
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg"
import {
  Sparkles,
  ArrowRight,
  Sun,
  CloudRain,
  Snowflake,
  Thermometer,
  Droplets,
  Wind
} from "lucide-react-native"
import {
  responsiveHeight,
  responsiveWidth
} from "react-native-responsive-dimensions"
import { useTheme } from "../../utils/ThemeContext"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { useGetOutfitMutation } from "../../redux/slices/createOutfit/outfiltSlice"
import AnalyzingOverlay from "./AnalyzingOverlay"

const GradientBackground = ({
  children,
  style,
  colors = ["#BA97FF", "#8E54FE"],
  borderRadius = 0
}) => (
  <View style={[{ overflow: "hidden", borderRadius }, style]}>
    <View style={StyleSheet.absoluteFill}>
      <Svg height="100%" width="100%">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors[0]} stopOpacity="1" />
            <Stop offset="1" stopColor={colors[1]} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
      </Svg>
    </View>
    {children}
  </View>
)

const AIStylistTab = () => {
  const { t } = useTranslation()
  const { isDarkMode } = useTheme()
  const navigation = useNavigation()
  const user = useSelector((state) => state.auth.user)
  const [prompt, setPrompt] = useState("")
  const [selectedOccasions, setSelectedOccasions] = useState([])
  const [selectedMoods, setSelectedMoods] = useState([])
  const [selectedWeather, setSelectedWeather] = useState([])

  const [getOutfit, { reset: resetOutfit }] = useGetOutfitMutation()
  const [showAnalyzing, setShowAnalyzing] = useState(false)

  useEffect(() => {
    if (user) {
      console.log("AIStylistTab User Response:", user)
    }
  }, [user])

  const occasions = [
    "School",
    "Date",
    "Party",
    "Work",
    "Gym",
    "Brunch",
    "Travel",
    "Wedding"
  ]

  const moods = [
    "Clean",
    "Edgy",
    "Relaxed",
    "Bold",
    "Vintage",
    "Romantic",
    "Sporty"
  ]

  const weatherOptions = [
    { name: "Sunny", Icon: Sun },
    { name: "Rainy", Icon: CloudRain },
    { name: "Cold", Icon: Thermometer },
    { name: "Snowy", Icon: Snowflake },
    { name: "Humid", Icon: Droplets },
    { name: "Windy", Icon: Wind }
  ]

  const toggleSelection = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item))
    } else {
      setList([...list, item])
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim() && selectedOccasions.length === 0 && selectedMoods.length === 0 && selectedWeather.length === 0) {
      Alert.alert(
        t("common.info", "Info"),
        t("aiStylist.aiStylistTab.validationError", "Please describe what you want or select some quick ideas.")
      )
      return
    }

    const remainingCredits = (user?.credits?.aiStylist?.limit || 0) - (user?.credits?.aiStylist?.used || 0)
    if (remainingCredits <= 0) {
      Alert.alert(
        t("common.info", "Info"),
        t("aiStylist.aiStylistTab.error.limitReached", "You've reached your daily limit. Please upgrade your plan for more generations.")
      )
      return
    }

    const payload = {}
    if (prompt.trim()) payload.query = prompt.trim()
    if (selectedOccasions.length > 0) payload.occasion = selectedOccasions.join(",")
    if (selectedMoods.length > 0) payload.mood = selectedMoods.join(",")
    if (selectedWeather.length > 0) payload.weather = selectedWeather.join(",")

    console.log("AI Outfit Request Payload 👉", payload)
    setShowAnalyzing(true)

    try {
      const response = await getOutfit(payload).unwrap()
      console.log("AI Outfit Response ✅", response)
      
      if (response.status) {
        navigation.navigate("AIOutfitResult", {
          ...response,
          payload,
          query: prompt.trim() || payload.occasion || payload.mood || payload.weather
        })
        
        // Hide overlay and reset form after a delay to ensure smooth navigation transition
        setTimeout(() => {
          setShowAnalyzing(false)
          setPrompt("")
          setSelectedOccasions([])
          setSelectedMoods([])
          setSelectedWeather([])
        }, 500)
      } else {
        setShowAnalyzing(false)
        Alert.alert(
          t("common.error", "Error"),
          response.detail || response.message || t("aiStylist.error.failed", "Failed to generate outfit. Please try again.")
        )
      }
    } catch (error) {
      setShowAnalyzing(false)
      console.error("AI Generation Error ❌", error)
      const errorMessage = error?.data?.detail || error?.data?.message || error?.message || t("aiStylist.error.failed", "Failed to generate outfit. Please try again.")
      Alert.alert(
        t("common.error", "Error"),
        errorMessage
      )
    }
  }

  const CustomTag = ({ title, isSelected, onSelect }) => (
    <TouchableOpacity
      onPress={() => onSelect(title)}
      className={`border rounded-full items-center justify-center mr-2 mb-2 px-4 py-2.5 min-w-[70px] ${
        isSelected
          ? "bg-[#8E54FE] border-[#8E54FE]"
          : isDarkMode
            ? "bg-darkSurfaceSecondary border-darkBorderTertiary"
            : "bg-white border-[#E5E5E5]"
      }`}
    >
      <Text
        className={`text-sm font-Medium ${isSelected ? "text-white" : ""}`}
        style={{ color: isSelected ? "#fff" : isDarkMode ? "#CBD5E1" : "#5C526D" }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )

  const WeatherTag = ({ name, Icon, isSelected, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center border rounded-full mr-2 mb-2 px-4 py-2.5 ${
        isSelected
          ? "bg-[#8E54FE] border-[#8E54FE]"
          : isDarkMode
            ? "bg-darkSurfaceSecondary border-darkBorderTertiary"
            : "bg-white border-[#E5E5E5]"
      }`}
    >
      <Icon
        size={16}
        color={isSelected ? "white" : isDarkMode ? "#B8AFCC" : "#5C526D"}
        style={{ marginRight: 6 }}
      />
      <Text
        className={`text-sm font-Medium ${isSelected ? "text-white" : ""}`}
        style={{ color: isSelected ? "#fff" : isDarkMode ? "#CBD5E1" : "#5C526D" }}
      >
        {name}
      </Text>
    </TouchableOpacity>
  )

  return (
    <View className="flex-1">
      <AnalyzingOverlay visible={showAnalyzing} onCancel={() => {
        setShowAnalyzing(false)
        resetOutfit()
      }} />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Title */}
        <View className="mb-6 mt-2">
          <Text
            className="text-[32px] font-Bold leading-[40px]"
            style={{ color: isDarkMode ? "#F5F4F7" : "#08002B" }}
          >
            {t("aiStylist.aiStylistTab.titleLine1")}
          </Text>
          <Text className="text-[32px] font-Bold text-[#8E54FE] leading-[40px]">
            {t("aiStylist.aiStylistTab.titleLine2")}
          </Text>
        </View>

        {/* Input Area */}
        <GradientBackground
          colors={["#BA97FF", "#8E54FE"]}
          borderRadius={10}
          style={{ marginBottom: 32 }}
        >
          <View className="px-4 py-3">
            <Text className="text-[13px] font-Medium text-white">
              {t("aiStylist.aiStylistTab.description")}
            </Text>
          </View>
          <View
            className="flex-row items-end rounded-[10px] p-3 m-[3px]"
            style={{ backgroundColor: isDarkMode ? "#1A1820" : "#fff" }}
          >
            <TextInput
              multiline
              placeholder={t("aiStylist.aiStylistTab.placeholder")}
              placeholderTextColor={isDarkMode ? "#5C526D" : "#C5BFD1"}
              value={prompt}
              onChangeText={setPrompt}
              className="flex-1 text-base font-Medium h-20"
              style={{ 
                textAlignVertical: "top",
                color: isDarkMode ? "#F5F4F7" : "#08002B" 
              }}
            />
            <TouchableOpacity className="ml-2" onPress={handleGenerate}>
              <GradientBackground
                colors={["#BA97FF", "#8E54FE"]}
                borderRadius={20}
                style={{
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Sparkles size={20} color="white" />
              </GradientBackground>
            </TouchableOpacity>
          </View>
        </GradientBackground>

        {/* Quick Ideas Divider */}
        <View className="flex-row items-center mb-6">
          <View
            className="flex-1 h-[1px]"
            style={{ backgroundColor: isDarkMode ? "#3D3843" : "#F0F0F0" }}
          />
          <Text
            className="mx-4 text-[10px] font-Bold tracking-[1.5px]"
            style={{ color: isDarkMode ? "#B8AFCC" : "#A0A0A0" }}
          >
            {t("aiStylist.aiStylistTab.quickIdeas")}
          </Text>
          <View
            className="flex-1 h-[1px]"
            style={{ backgroundColor: isDarkMode ? "#3D3843" : "#F0F0F0" }}
          />
        </View>

        {/* Categories */}
        <View className="mb-6">
          <Text
            className="text-base font-Bold mb-4"
            style={{ color: isDarkMode ? "#F5F4F7" : "#08002B" }}
          >
            {t("aiStylist.aiStylistTab.occasion")}
          </Text>
          <View className="flex-row flex-wrap">
            {occasions.map((occasion) => (
              <CustomTag
                key={occasion}
                title={t(`aiStylist.aiStylistTab.occasions.${occasion}`)}
                isSelected={selectedOccasions.includes(occasion)}
                onSelect={() =>
                  toggleSelection(selectedOccasions, setSelectedOccasions, occasion)
                }
              />
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text
            className="text-base font-Bold mb-4"
            style={{ color: isDarkMode ? "#F5F4F7" : "#08002B" }}
          >
            {t("aiStylist.aiStylistTab.mood")}
          </Text>
          <View className="flex-row flex-wrap">
            {moods.map((mood) => (
              <CustomTag
                key={mood}
                title={t(`aiStylist.aiStylistTab.moods.${mood}`)}
                isSelected={selectedMoods.includes(mood)}
                onSelect={() =>
                  toggleSelection(selectedMoods, setSelectedMoods, mood)
                }
              />
            ))}
          </View>
        </View>

        <View className="mb-8">
          <Text
            className="text-base font-Bold mb-4"
            style={{ color: isDarkMode ? "#F5F4F7" : "#08002B" }}
          >
            {t("aiStylist.aiStylistTab.weather")}
          </Text>
          <View className="flex-row flex-wrap">
            {weatherOptions.map((option) => (
              <WeatherTag
                key={option.name}
                name={t(`aiStylist.aiStylistTab.weatherOptions.${option.name}`)}
                Icon={option.Icon}
                isSelected={selectedWeather.includes(option.name)}
                onPress={() =>
                  toggleSelection(
                    selectedWeather,
                    setSelectedWeather,
                    option.name
                  )
                }
              />
            ))}
          </View>
        </View>

        {/* Footer / Usage Limit Card */}
        <View
          className="flex-row items-center justify-between mb-8 p-3 rounded-[10px]"
          style={{ backgroundColor: isDarkMode ? "#2D2633" : "#F8F8F8" }}
        >
          <View>
            <Text className="text-[10px] font-Bold text-[#8E54FE] mb-1">
              {t("aiStylist.aiStylistTab.usageLimit")}
            </Text>
            <Text
              className="text-sm font-Bold"
              style={{ color: isDarkMode ? "#F5F4F7" : "#101010" }}
            >
              {t("aiStylist.aiStylistTab.generationsLeft", { 
                remaining: (user?.credits?.aiStylist?.limit || 0) - (user?.credits?.aiStylist?.used || 0),
                total: user?.credits?.aiStylist?.limit || 0
              })}
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => navigation.navigate("Subscription")}
            className="flex-row items-center rounded-full px-4 py-2 bg-[#05001D] dark:bg-black"
          >
            <Text className="text-[10px] font-Bold text-white mr-2">
              {t("aiStylist.aiStylistTab.upgrade")}
            </Text>
            <ArrowRight size={12} color="white" />
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Sticky Bottom Button */}
      <View 
        className="px-5 pt-3"
        style={{ 
          paddingBottom:  Platform.OS === "ios" ? responsiveHeight(8) :responsiveHeight(5), // Clear the bottom tab bar
        }}
      >
        <TouchableOpacity onPress={handleGenerate}>
          <View className="items-center bg-[#8E54FE] rounded-[10px] py-3.5">
            <Text className="text-base font-Bold text-white">
              {t("aiStylist.aiStylistTab.generate")}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AIStylistTab
