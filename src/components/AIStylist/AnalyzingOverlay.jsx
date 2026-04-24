import React, { useEffect, useRef } from "react"
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions
} from "react-native"
import { Sparkles } from "lucide-react-native"
import { useTheme } from "../../utils/ThemeContext"
import { useTranslation } from "react-i18next"

const { width } = Dimensions.get("window")

const AnalyzingOverlay = ({ visible, onCancel }) => {
  const { t } = useTranslation()
  const { isDarkMode } = useTheme()
  const progressAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(progressAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false
          }),
          Animated.timing(progressAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false
          })
        ])
      ).start()
    } else {
      progressAnim.setValue(0)
    }
  }, [visible])

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"]
  })

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View
        className="flex-1 items-center justify-center px-8"
        style={{ backgroundColor: isDarkMode ? "#1A1820" : "#FFFFFF" }}
      >
        <View className="items-center w-full">
          {/* Concentric AI Icon Circles */}
          <View className="items-center justify-center mb-12">
            {/* Outer Ring 2 */}
            <View 
              className="w-56 h-56 rounded-full items-center justify-center"
              style={{ backgroundColor: isDarkMode ? "rgba(142, 84, 254, 0.03)" : "rgba(142, 84, 254, 0.02)" }}
            >
              {/* Outer Ring 1 */}
              <View 
                className="w-44 h-44 rounded-full items-center justify-center"
                style={{ backgroundColor: isDarkMode ? "rgba(142, 84, 254, 0.08)" : "rgba(142, 84, 254, 0.05)" }}
              >
                {/* Central Circle */}
                <View
                  className="w-24 h-24 rounded-full items-center justify-center shadow-2xl"
                  style={{ backgroundColor: "#8E54FE", elevation: 8 }}
                >
                  <Sparkles size={40} color="white" />
                </View>
              </View>
            </View>
          </View>

          {/* Text Content */}
          <Text
            className="text-lg font-Bold text-center mb-8"
            style={{ color: isDarkMode ? "#F5F4F7" : "#08002B" }}
          >
            {t("aiStylist.analyzing.title", "Analyzing your style preferences...")}
          </Text>

          {/* Progress Bar Container */}
          <View className="w-full max-w-[200px] items-center">
            <View
              className="w-full h-[3px] bg-[#F0F0F0] dark:bg-[#2D2633] rounded-full overflow-hidden"
            >
              <Animated.View
                style={{
                  width: progressWidth,
                  height: "100%",
                  backgroundColor: "#8E54FE"
                }}
              />
            </View>
            <Text
              className="text-[10px] font-Bold mt-2 tracking-[2px]"
              style={{ color: isDarkMode ? "#B8AFCC" : "#A0A0A0" }}
            >
              {t("aiStylist.analyzing.label", "GENERATING").toUpperCase()}
            </Text>

            {/* Repositioned Cancel Button */}
            <TouchableOpacity
              onPress={onCancel}
              className="mt-8 py-3 px-6"
              activeOpacity={0.7}
            >
              <Text className="text-base font-Bold text-[#8E54FE]">
                {t("aiStylist.analyzing.cancel", "Cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default AnalyzingOverlay
