import React, { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable
} from "react-native"
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

  const [outfitId, setOutfitId] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)

  const selectedWardrobeItem = route.params?.selectedItem

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
    <ScrollView
      className="flex-1 px-5"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: responsiveHeight(15) }}
    >
      <View className="mt-4" />

      {/* Section 1: The Outfit */}
      <View className="mb-4">
        <Text
          className="text-base font-Bold mb-2"
          style={{ color: isDarkMode ? "#F5F4F7" : "#08002B" }}
        >
          {t("aiStylist.virtualTryOnTab.outfitSection")}
        </Text>

        <View className="flex-row items-center mb-4">
          <View
            className="flex-1 rounded-lg px-4 mr-2 justify-center border"
            style={{
              height: responsiveHeight(6),
              backgroundColor: isDarkMode ? "#2D2633" : "#fff",
              borderColor: isDarkMode ? "#3D3843" : "#E5E5E5"
            }}
          >
            <TextInput
              placeholder={t("aiStylist.virtualTryOnTab.outfitIdPlaceholder")}
              placeholderTextColor={isDarkMode ? "#5C526D" : "#C5BFD1"}
              value={outfitId}
              onChangeText={setOutfitId}
              className="text-sm font-Medium"
              style={{ color: isDarkMode ? "#F5F4F7" : "#08002B" }}
            />
          </View>
          <TouchableOpacity
            className="rounded-lg px-6 justify-center items-center"
            style={{ 
              height: responsiveHeight(6),
              backgroundColor: isDarkMode ? "#3D3843" : "#05001D" 
            }}
          >
            <Text className="text-white font-Bold text-sm">{t("aiStylist.virtualTryOnTab.addButton")}</Text>
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

        {/* Select from Wardrobe or Selected Item */}
        {selectedWardrobeItem ? (
          <Pressable
            onPress={() => navigation.navigate("SelectItems")}
            className={`flex-row items-center p-4 rounded-xl border ${
              isDarkMode
                ? "bg-darkSurfaceSecondary border-darkBorderTertiary"
                : "bg-white border-[#E5E5E5]"
            }`}
          >
            <View
              className="rounded-lg w-16 h-16 items-center justify-center overflow-hidden mr-4"
              style={{ backgroundColor: isDarkMode ? "#3D3843" : "#F2F1F5" }}
            >
              <Image
                source={{ uri: selectedWardrobeItem.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1">
              <Text
                className={`text-[17px] font-Bold mb-1 ${isDarkMode ? "text-darkTextPrimary" : "text-[#05001D]"}`}
              >
                {t("aiStylist.virtualTryOnTab.selectedItem")}
              </Text>
              <Text className="text-[14px] font-Medium text-[#C5BFD1]">
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
            onPress={() => navigation.navigate("SelectItems")}
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
      <TouchableOpacity className="mt-2 mb-10">
        <View
          className="flex-row items-center justify-center bg-[#8E54FE] rounded-xl"
          style={{ paddingVertical: 10 }}
        >
          <HangerIcon size={24} color="white" />
          <View className="ml-3" />
          <Text className="text-lg text-white">{t("aiStylist.virtualTryOnTab.tryButton")}</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
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
