import React, { useEffect, useRef, useState } from "react"
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
import { responsiveHeight } from "react-native-responsive-dimensions"

const { width } = Dimensions.get("window")

const AnalyzingOverlay = ({ visible, onCancel }) => {
  const { t } = useTranslation()
  const { isDarkMode } = useTheme()
  const progressAnim = useRef(new Animated.Value(0)).current
  const [textIndex, setTextIndex] = useState(0)
  
  const messages = [
    t("aiStylist.aiStylistTab.analyzing.label1", "GENERATING"),
    t("aiStylist.aiStylistTab.analyzing.label2", "ANALYZING"),
    t("aiStylist.aiStylistTab.analyzing.label3", "PREPARING"),
    t("aiStylist.aiStylistTab.analyzing.label4", "PICKING FABRICS"),
    t("aiStylist.aiStylistTab.analyzing.label5", "MATCHING COLORS"),
    t("aiStylist.aiStylistTab.analyzing.label6", "STYLING OUTFIT"),
    t("aiStylist.aiStylistTab.analyzing.label7", "CURATING LOOK"),
    t("aiStylist.aiStylistTab.analyzing.label8", "FINALIZING"),
    t("aiStylist.aiStylistTab.analyzing.label9", "SCANNING WARDROBE"),
    t("aiStylist.aiStylistTab.analyzing.label10", "OPTIMIZING FIT"),
    t("aiStylist.aiStylistTab.analyzing.label11", "POLISHING LOOK"),
    t("aiStylist.aiStylistTab.analyzing.label12", "ALMOST DONE")
  ]

  useEffect(() => {
    let listenerId = null
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

      listenerId = progressAnim.addListener(({ value }) => {
        if (value === 0) {
          setTextIndex((prev) => {
            if (prev < messages.length - 1) {
              return prev + 1
            }
            return prev
          })
        }
      })
    } else {
      progressAnim.setValue(0)
      setTextIndex(0)
      if (listenerId) progressAnim.removeListener(listenerId)
    }

    return () => {
      if (listenerId) progressAnim.removeListener(listenerId)
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
            {t("aiStylist.aiStylistTab.analyzing.title", "Analyzing your style preferences...")}
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
              className="text-[10px] font-Bold mt-2 tracking-[2px] text-center"
              style={{ color: isDarkMode ? "#B8AFCC" : "#A0A0A0" }}
            >
              {messages[textIndex].toUpperCase()}
            </Text>

            {/* Repositioned Cancel Button */}
            <TouchableOpacity
              onPress={onCancel}
              className="mt-8 py-3 px-6"
              activeOpacity={0.7}
            >
              <Text className="text-base font-Bold text-[#8E54FE]">
                {t("aiStylist.aiStylistTab.analyzing.cancel", "Cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default AnalyzingOverlay
