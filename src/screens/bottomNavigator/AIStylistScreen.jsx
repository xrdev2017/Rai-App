import React, { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import AIStylistTab from "../../components/AIStylist/AIStylistTab"
import VirtualTryOnTab from "../../components/AIStylist/VirtualTryOnTab"
import { useTheme } from "../../utils/ThemeContext"
import { useTranslation } from "react-i18next"
import { useRoute, useFocusEffect, useNavigation } from "@react-navigation/native"
import { useLazyGetProfileUpdateQuery } from "../../redux/slices/authSlice"
import { useSelector } from "react-redux"

const AIStylistScreen = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const route = useRoute()
  const [activeTab, setActiveTab] = useState("aiStylist")
  const { isDarkMode } = useTheme()
  const user = useSelector((state) => state.auth.user)

  const [resetKey, setResetKey] = useState(0)

  const [triggerProfileUpdate, { data: profileData, isFetching: isRefreshingProfile, isError: isProfileError, error: profileError }] = useLazyGetProfileUpdateQuery()

  useEffect(() => {
    // Component level side effects if any
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      // Manual trigger for profile refresh on every focus, bypassing cache
      triggerProfileUpdate(undefined, false)

      const shouldReset = !route.params?.selectedItem;
      
      if (shouldReset) {
        setResetKey(prev => prev + 1)
      }

      if (route.params?.activeTab) {
        setActiveTab(route.params.activeTab)
        navigation.setParams({ activeTab: undefined })
      } else if (route.params?.selectedItem) {
        setActiveTab("virtualTryOn")
      } else if (route.params?.resetTab) {
        setActiveTab("aiStylist")
        navigation.setParams({ resetTab: undefined })
      }
    }, [triggerProfileUpdate, route.params?.activeTab, route.params?.selectedItem, route.params?.resetTab])
  )

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: isDarkMode ? "#1A1820" : "#fff" }}
    >
      {/* Header */}
      <View className="items-center px-5 py-3">
        <Text
          className="text-xl font-Bold"
          style={{ color: isDarkMode ? "#F5F4F7" : "#08002B" }}
        >
          {t(`aiStylist.tabs.${activeTab}`)}
        </Text>
      </View>

      <View className="px-5 mb-4">
        {/* Toggle Tabs */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: isDarkMode ? "#2D2633" : "#EAEAEA",
            borderRadius: 25,
            padding: 3,
            width: "100%"
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab("aiStylist")}
            style={{
              flex: 1,
              paddingVertical: 7,
              borderRadius: 20,
              backgroundColor:
                activeTab === "aiStylist"
                  ? isDarkMode
                    ? "#3D3843"
                    : "#FFFFFF"
                  : "transparent",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                color:
                  activeTab === "aiStylist"
                    ? isDarkMode
                      ? "#fff"
                      : "#000"
                    : "#888",
                fontWeight: activeTab === "aiStylist" ? "600" : "normal"
              }}
            >
              {t("aiStylist.tabs.aiStylist")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("virtualTryOn")}
            style={{
              flex: 1,
              paddingVertical: 7,
              borderRadius: 20,
              backgroundColor:
                activeTab === "virtualTryOn"
                  ? isDarkMode
                    ? "#3D3843"
                    : "#FFFFFF"
                  : "transparent",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                color:
                  activeTab === "virtualTryOn"
                    ? isDarkMode
                      ? "#fff"
                      : "#000"
                    : "#888",
                fontWeight: activeTab === "virtualTryOn" ? "600" : "normal"
              }}
            >
              {t("aiStylist.tabs.virtualTryOn")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === "aiStylist" ? (
        <AIStylistTab key={`ai-${resetKey}`} />
      ) : (
        <VirtualTryOnTab />
      )}
    </SafeAreaView>
  )
}

export default AIStylistScreen

const styles = StyleSheet.create({})
