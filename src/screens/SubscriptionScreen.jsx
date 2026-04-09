import React, { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
  Image
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import {
  X,
  Star,
  Check,
  Lock,
  Crown,
  Sparkles,
  ArrowRight,
  Shirt
} from "lucide-react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import {
  responsiveHeight,
  responsiveWidth
} from "react-native-responsive-dimensions"
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Filter,
  FeTurbulence,
  FeColorMatrix
} from "react-native-svg"
import { useTheme } from "../utils/ThemeContext"
import { StatusBar } from "expo-status-bar"
import i18n from "../utils/languageSetup"

const { width } = Dimensions.get("window")

const PremiumProBackground = ({ borderRadius = 10 }) => (
  <View style={[StyleSheet.absoluteFill, { overflow: "hidden", borderRadius }]}>
    <Svg height="100%" width="100%">
      <Defs>
        <RadialGradient
          id="proGrad"
          cx="100%"
          cy="70%"
          rx="60%"
          ry="80%"
          fx="100%"
          fy="100%"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#2563EB" stopOpacity="0.2" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
        <Filter id="noiseFilter">
          <FeTurbulence
            type="fractalNoise"
            baseFrequency="1.5"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <FeColorMatrix type="saturate" values="0" />
        </Filter>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#proGrad)" />
      <Rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        filter="url(#noiseFilter)"
        opacity="0.01"
      />
    </Svg>
  </View>
)

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

const SubscriptionScreen = () => {
  const navigation = useNavigation()
  const { isDarkMode } = useTheme()
  const [billingCycle, setBillingCycle] = useState("monthly") // 'monthly' or 'yearly'
  const [selectedPlan, setSelectedPlan] = useState("free") // 'free', 'basic', 'pro'

  const freePlan = {
    id: "free",
    name: i18n.t("subscription.freePlanName"),
    price: "$0",
    features: [
      { text: i18n.t("subscription.plans.free.feature1"), available: true },
      { text: i18n.t("subscription.plans.free.feature2"), available: true }
    ],
    badge: i18n.t("subscription.currentBadge")
  }

  const PLANS = [
    {
      id: "basic",
      name: i18n.t("subscription.basicPlanName"),
      price: billingCycle === "monthly" ? "$4.99" : "$44.99",
      period: billingCycle === "monthly" ? "/mo" : "/year",
      features: [
        {
          text: i18n.t("subscription.plans.basic.feature1"),
          available: true,
          icon: "circle_right"
        },
        {
          text: i18n.t("subscription.plans.basic.feature2"),
          available: false,
          icon: "lock"
        }
      ]
    },
    {
      id: "pro",
      name: i18n.t("subscription.proPlanName"),
      price: billingCycle === "monthly" ? "$9.99" : "$89.99",
      period: billingCycle === "monthly" ? "/mo" : "/year",
      isPremium: true,
      features: [
        {
          text: i18n.t("subscription.plans.pro.feature1"),
          available: true,
          icon: "magic"
        },
        {
          text: i18n.t("subscription.plans.pro.feature2"),
          available: true,
          icon: "shirt"
        }
      ],
      badge: i18n.t("subscription.recommendedBadge")
    }
  ]

  const PlanCard = ({ plan }) => {
    const isSelected = selectedPlan === plan.id
    const isPremium = plan.isPremium

    return (
      <TouchableOpacity
        onPress={() => setSelectedPlan(plan.id)}
        activeOpacity={0.9}
        className="mb-4"
        style={{
          borderRadius: 12,
          backgroundColor:
            plan.id === "pro"
              ? isDarkMode
                ? "#2D2633"
                : "#FFFFFF"
              : isDarkMode
                ? "#2D2633"
                : "#F5F4F7",
          borderWidth: 2,
          borderColor: isSelected ? "#8E54FE" : "transparent",
          marginHorizontal: plan.id === "pro" ? -1 : 0
        }}
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            { overflow: "hidden", borderRadius: 10 }
          ]}
        >
          {plan.id === "pro" && <PremiumProBackground borderRadius={10} />}

          {/* Recommended Badge at bottom right */}
          {plan.id === "pro" && (
            <View
              className={`absolute px-4 py-1.5 ${
                isDarkMode ? "bg-[#8E54FE]" : "bg-[#8E54FE]"
              }`}
              style={{
                bottom: 0,
                right: 0,
                borderTopLeftRadius: 20
              }}
            >
              <Text className="text-[10px] font-Bold text-white uppercase">
                {i18n.t("subscription.recommendedBadge")}
              </Text>
            </View>
          )}
        </View>

        <View className="px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-4">
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                  <Text
                    className={`text-[19px] font-Bold ${
                      isDarkMode ? "text-white" : "text-[#05001D]"
                    }`}
                  >
                    {plan.name}
                  </Text>
                  {isPremium && (
                    <Crown
                      size={16}
                      color={"#8E54FE"}
                      style={{ marginLeft: 8 }}
                    />
                  )}
                </View>
                {plan.price !== "$0" && (
                  <View className="flex-row items-baseline">
                    <Text className={`text-[22px] font-Bold text-[#8E54FE]`}>
                      {plan.price}
                    </Text>
                    <Text
                      className={`text-[12px] font-Medium ml-1 ${
                        isDarkMode ? "text-[#FFFFFF]" : "text-[#05001D]"
                      }`}
                    >
                      {plan.period}
                    </Text>
                  </View>
                )}
              </View>

              {plan.features.map((feature, idx) => (
                <View key={idx} className="flex-row items-center mb-1">
                  {feature.icon === "circle_right" ? (
                    <Image
                      source={require("../../assets/images/ic_circle_right.png")}
                      style={{
                        width: 16,
                        height: 16,
                        marginRight: 10,
                        resizeMode: "contain"
                      }}
                    />
                  ) : feature.icon === "shield" ? (
                    <View className="mr-2.5 w-5 h-5 items-center justify-center">
                      <View className="absolute inset-0 bg-[#8E54FE]/20 rounded-full" />
                      <Check size={12} color={"#8E54FE"} strokeWidth={3} />
                    </View>
                  ) : feature.icon === "lock" ? (
                    <Image
                      source={require("../../assets/images/ic_lock.png")}
                      style={{
                        width: 16,
                        height: 16,
                        marginRight: 10,
                        resizeMode: "contain"
                      }}
                    />
                  ) : feature.icon === "magic" ? (
                    <Image
                      source={require("../../assets/images/ic_ai.png")}
                      style={{
                        width: 18,
                        height: 18,
                        marginRight: 10,
                        resizeMode: "contain"
                      }}
                    />
                  ) : feature.icon === "shirt" ? (
                    <Image
                      source={require("../../assets/images/ic_try_on.png")}
                      style={{
                        width: 18,
                        height: 18,
                        marginRight: 10,
                        resizeMode: "contain"
                      }}
                    />
                  ) : (
                    <Check
                      size={14}
                      color={"#8E54FE"}
                      style={{ marginRight: 10 }}
                      strokeWidth={3}
                    />
                  )}
                  <Text
                    className={`text-[14.5px] font-Medium ${
                      feature.available
                        ? isDarkMode
                          ? "text-white"
                          : "text-[#1A1820]"
                        : isDarkMode
                          ? "text-[#5C526D]"
                          : "#8E79A3"
                    }`}
                    style={!feature.available ? { fontStyle: "italic" } : {}}
                  >
                    {feature.text}
                  </Text>
                </View>
              ))}
            </View>

            {/* Badges */}
            {plan.badge === i18n.t("subscription.currentBadge") && (
              <View>
                <Text
                  className={`text-[12px] font-Bold ${isDarkMode ? "text-[#5C526D]" : "text-[#5C526D]"}`}
                  style={{ letterSpacing: 0.5, fontWeight: "800" }}
                >
                  {i18n.t("subscription.currentBadge")}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: isDarkMode ? "#1A1820" : "#fff" }}
    >
      {/* Close Button */}
      <View className="flex-row justify-end px-5 pt-3">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center"
        >
          <X
            size={26}
            color={isDarkMode ? "#fff" : "#05001D"}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        {/* Hero Section */}
        <View className="items-center">
          <View
            className="w-16 h-16 rounded-xl items-center justify-center mb-5"
            style={{ backgroundColor: isDarkMode ? "#2D2633" : "#F3EDFF" }}
          >
            <Star size={34} color="#8E54FE" fill="#8E54FE" />
          </View>
          <Text
            className="text-[24px] font-Bold text-center mb-2"
            style={{ color: isDarkMode ? "#fff" : "#05001D" }}
          >
            {i18n.t("subscription.unlockTitle")}
          </Text>
          <Text
            className="text-[15px] font-Medium text-center px-3 mb-5"
            style={{
              color: isDarkMode ? "#B8AFCC" : "#C5BFD1",
              lineHeight: 20
            }}
          >
            {i18n.t("subscription.unlockDescription")}
          </Text>
        </View>

        {/* Billing Cycles Toggle */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: isDarkMode ? "#2D2633" : "#F5F4F7",
            borderRadius: 30,
            padding: 5,
            width: "85%",
            marginBottom: 15,
            alignSelf: "center"
          }}
        >
          <TouchableOpacity
            onPress={() => setBillingCycle("monthly")}
            style={{
              flex: 1,
              height: 42,
              borderRadius: 25,
              backgroundColor:
                billingCycle === "monthly"
                  ? isDarkMode
                    ? "#3D3843"
                    : "#FFFFFF"
                  : "transparent",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text
              className={`text-[15px] ${billingCycle === "monthly" ? "font-Bold" : "font-Medium"}`}
              style={{
                color:
                  billingCycle === "monthly"
                    ? isDarkMode
                      ? "#fff"
                      : "#05001D"
                    : "#8E79A3"
              }}
            >
              {i18n.t("subscription.monthly")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setBillingCycle("yearly")}
            style={{
              flex: 1,
              height: 42,
              borderRadius: 25,
              backgroundColor:
                billingCycle === "yearly"
                  ? isDarkMode
                    ? "#3D3843"
                    : "#FFFFFF"
                  : "transparent",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row"
            }}
          >
            <Text
              className={`text-[15px] ${billingCycle === "yearly" ? "font-Bold" : "font-Medium"}`}
              style={{
                color:
                  billingCycle === "yearly"
                    ? isDarkMode
                      ? "#fff"
                      : "#05001D"
                    : "#8E79A3",
                marginRight: 6
              }}
            >
              {i18n.t("subscription.yearly")}
            </Text>
            <View className="bg-[#8E54FE] px-2 py-1 rounded-full">
              <Text className="text-[8px] font-Bold text-white uppercase">
                {i18n.t("subscription.save25")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Plans List */}
        <View className="mb-8">
          <PlanCard plan={freePlan} />
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </View>

        {/* Purchase Button Area */}
        <View
          style={{
            position: "relative",
            alignItems: "center",
            marginBottom: 20
          }}
        >
          {/* Shadow Source for the diffuse purple glow */}
          <View
            style={{
              position: "absolute",
              width: "90%",
              height: 40,
              bottom: 4,
              borderRadius: 12,
              backgroundColor: "transparent",
              shadowColor: "#8E54FE",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.5,
              shadowRadius: 18,
              elevation: 15
            }}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-row items-center justify-center w-full"
            style={{
              backgroundColor: "#8E54FE",
              height: 48,
              borderRadius: 12,
              zIndex: 1
            }}
          >
            <Text className="text-white text-[16px] font-Bold">
              {i18n.t("subscription.purchaseNow")}
            </Text>
            <View style={{ width: 8 }} />
            <ArrowRight size={20} color="white" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Footer Text */}
        <Text
          className="text-[12px] font-SemiBold text-center mb-4"
          style={{
            color: "#90A1B9",
            lineHeight: 16,
            paddingHorizontal: 20
          }}
        >
          {i18n.t("subscription.footerNote")}
        </Text>

        {/* Footer Links */}
        <View
          className="flex-row items-center justify-between"
          style={{ paddingHorizontal: 40 }}
        >
          <TouchableOpacity>
            <Text
              className="text-[13px] font-Bold text-[#8E54FE]"
              style={{ textDecorationLine: "underline" }}
            >
              {i18n.t("subscription.cancelAnytime")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text
              className="text-[13px] font-SemiBold text-[#90A1B9]"
              style={{ textDecorationLine: "underline" }}
            >
              {i18n.t("subscription.privacyPolicy")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SubscriptionScreen

const styles = StyleSheet.create({})
