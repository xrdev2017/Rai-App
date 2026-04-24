import React, { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
  Platform,
  Alert,
  ActivityIndicator
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useSelector, useDispatch } from "react-redux"
import { useGetProfileUpdateQuery, useVerifyIosPurchaseMutation, useVerifyAndroidPurchaseMutation } from "../redux/slices/authSlice"
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
import {
  initConnection,
  fetchProducts,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  requestSubscription,
  requestPurchase
} from "react-native-iap"
import { subscriptionSkus } from "../utils/iapManager"


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
          <Stop offset="0" stopColor="#8E54FE" stopOpacity="0.2" />
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
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [purchasing, setPurchasing] = useState(false)
  const isLocalPurchase = useRef(false)

  const { user } = useSelector((state) => state.auth)
  const { refetch: refetchProfile } = useGetProfileUpdateQuery()
  const [verifyIosPurchase] = useVerifyIosPurchaseMutation()
  const [verifyAndroidPurchase] = useVerifyAndroidPurchaseMutation()

  React.useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        await initConnection();
        const data = await fetchProducts({ skus: subscriptionSkus, type: 'subs' });
        if (data && data.length > 0) {
          console.log("✅ IAP: Subscriptions loaded successfully");
        }
        setSubscriptions(data || []);
      } catch (err) {
        console.error("IAP: Fetch Error:", err);
      } finally {
        setLoading(false)
      }
    };
    loadProducts();
  }, []);

  React.useEffect(() => {
    const purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
      console.log('🔑 IAP Product ID (productId):', purchase.productId);
      console.log('🔑 IAP Transaction ID (transactionId):', purchase.transactionId);
      console.log('🔑 IAP Purchase Token (purchaseToken):', purchase.purchaseToken);
      const receipt = purchase.purchaseToken;
      if (receipt) {
        try {
          await finishTransaction({ purchase, isConsumable: false });
          console.log('✅ IAP: Purchase completed and acknowledged');
          
          if (isLocalPurchase.current) {
            isLocalPurchase.current = false;
            try {
              if (Platform.OS === 'ios') {
                console.log('🚀 IAP: Verifying iOS purchase with backend for transaction:', purchase.transactionId);
                await verifyIosPurchase({ transactionId: purchase.transactionId }).unwrap();
                console.log('✅ IAP: Backend verification successful for transaction:', purchase.transactionId);
              } else {
                console.log('🚀 IAP: Verifying Android purchase with backend...');
                await verifyAndroidPurchase({
                  purchaseToken: purchase.purchaseToken,
                  productId: purchase.productId,
                  packageName: 'com.rai.fashion'
                }).unwrap();
                console.log('✅ IAP: Backend verification successful');
              }
              
              if (refetchProfile) refetchProfile();
              Alert.alert("Success", "Your subscription has been activated!");
            } catch (verifyErr) {
              console.error('❌ IAP Backend Verification Error:', verifyErr);
              Alert.alert("Purchase Warning", "Purchase was successful, but we had trouble activating it on our server. Please contact support if your features don't unlock.");
            }
          } else {
            console.log("ℹ️ IAP: Recovered transaction processed silently.");
            if (refetchProfile) refetchProfile();
          }
        } catch (ackErr) {
          console.error('❌ IAP Acknowledgment Error:', ackErr);
        }
      }
    });

    const purchaseErrorSubscription = purchaseErrorListener((error) => {
      if (error?.code !== "E_USER_CANCELLED") {
        console.error(`❌ IAP Purchase Error [Code: ${error.code}]:`, error.message);
        Alert.alert("Purchase Error", error.message || "An error occurred.");
      }
    });

    return () => {
      console.log("IAP: Cleaning up listeners...");
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
    };
  }, [refetchProfile]);

  const currentUserPlan = React.useMemo(() => {
    const sub = user?.subscription;
    if (sub && (sub.status === "active" || sub.status === "trialing")) {
      if (sub.productId.startsWith("rai_basic")) return "rai_basic";
      if (sub.productId.startsWith("rai_pro")) return "rai_pro";
    }
    return user?.plan || "free";
  }, [user]);

  const currentPlanCycle = React.useMemo(() => {
    const sub = user?.subscription;
    if (!sub || (sub.status !== "active" && sub.status !== "trialing")) {
      return "monthly"; // Free users or inactive subscriptions defaults to monthly tab
    }
    
    const productId = (sub.productId || "").toLowerCase();
    if (productId.includes("year")) return "yearly";
    if (productId.includes("month")) return "monthly";
    
    // Fallback/Android specific check if interval is provided
    return sub.interval === "year" ? "yearly" : "monthly";
  }, [user]);

  useEffect(() => {
    if (currentUserPlan && currentPlanCycle === billingCycle) {
      setSelectedPlan("current_plan_selection");
    } else {
      setSelectedPlan(null);
    }
  }, [currentUserPlan, billingCycle, currentPlanCycle]);



  const getRealPlanData = (planId) => {
    if (Platform.OS === 'ios') {
      const targetSku = `${planId}_${billingCycle === "monthly" ? "month" : "year"}`
      const sub = subscriptions.find((s) => (s?.productId || s?.id || s?.productId) === targetSku)
      if (!sub) {
        console.warn(`IAP: Could not find sub with ID: ${targetSku}`);
        return null
      }

      const sku = sub.id || sub.productId;
      console.log(`IAP: Found sub for iOS: ${sku}`);

      return {
        price: sub.localizedPrice || sub.displayPrice,
        offerToken: "ios_dummy_token", // Just to pass the !planData.offerToken check
        sku: sku,
        period: billingCycle === "monthly" ? "mo" : "year"
      }
    }

    const sub = subscriptions.find((s) => (s?.productId || s?.id) === planId)
    if (!sub) return null

    // Mapping: rai_basic -> basic-month/year, rai_pro -> pro-month/year
    const normalizedPlanId = planId.replace("rai_", "")
    const targetBasePlanId = `${normalizedPlanId}-${billingCycle === "monthly" ? "month" : "year"}`
    
    // Find all matching offers for this base plan - handling Android specific property name
    const matchingOffers = (sub.subscriptionOfferDetailsAndroid || sub.subscriptionOfferDetails || []).filter(
      (o) => o.basePlanId === targetBasePlanId
    )
    
    // Prioritize offers with trial (offerId exists), otherwise fallback to base plan
    const offer = matchingOffers.find(o => o.offerId) || matchingOffers[0]
    
    if (!offer) return { price: null, offerToken: null, period: null }

    const latestPhase = offer.pricingPhases.pricingPhaseList[offer.pricingPhases.pricingPhaseList.length - 1]
    return {
      price: latestPhase.formattedPrice,
      offerToken: offer.offerToken,
      basePlanId: offer.basePlanId,
      period: latestPhase.billingPeriod,
      sku: planId
    }
  }

  const handlePurchase = async () => {
    if (selectedPlan === "current_plan_selection") {
      Alert.alert("Info", "You are already on this plan.")
      return
    }

    const planData = getRealPlanData(selectedPlan)

    if (!planData || !planData.offerToken) {
      Alert.alert("Error", "Product information not available. Please try again later.")
      return
    }

    try {
      setPurchasing(true)
      isLocalPurchase.current = true
      console.log(`🚀 IAP: Initiating purchase for: ${selectedPlan}`);
      
      const purchaseRequest = {
        request: {
          apple: { sku: planData.sku },
          google: {
            skus: [planData.sku],
            ...(planData.offerToken ? {
              subscriptionOffers: [{ sku: planData.sku, offerToken: planData.offerToken }]
            } : {})
          }
        },
        type: 'subs'
      };

      await requestPurchase(purchaseRequest);
    } catch (err) {
      if (err?.code !== "E_USER_CANCELLED") {
        console.error("❌ IAP: Purchase failed:", err.message);
        Alert.alert("Error", `Purchase failed: ${err.message}`)
      }
    } finally {
      setPurchasing(false)
    }
  }

  const currentPlanData = {
    id: "current_plan_selection",
    name: currentUserPlan === "rai_basic" 
      ? i18n.t("subscription.basicPlanName") 
      : currentUserPlan === "rai_pro" 
        ? i18n.t("subscription.proPlanName") 
        : i18n.t("subscription.freePlanName"),
    price: "$0",
    features: [
      { 
        text: `${user?.subscription?.ai_genereted ?? user?.credits?.aiStylist?.limit ?? (currentUserPlan === "free" ? 3 : 0)} ${i18n.t("subscription.plans.free.feature1").replace(/^\d+\s/, "")}`, 
        available: true,
        icon: "circle_right"
      },
      { 
        text: `${user?.subscription?.vto ?? user?.credits?.vto?.limit ?? (currentUserPlan === "free" ? 3 : 0)} ${i18n.t("subscription.plans.free.feature2").replace(/^\d+\s/, "")}`, 
        available: true,
        icon: "circle_right"
      }
    ],
    badge: i18n.t("subscription.currentBadge")
  }

  const getPlanPrice = (planId, defaultPrice) => {
    if (loading) return "..."
    const realData = getRealPlanData(planId)
    return realData?.price || defaultPrice
  }

  const proSavingsPercentage = React.useMemo(() => {
    try {
      let monthlyPrice = 0;
      let yearlyPrice = 0;

      if (Platform.OS === 'ios') {
        const monthlySub = subscriptions.find(s => (s?.productId || s?.id) === 'rai_pro_month');
        const yearlySub = subscriptions.find(s => (s?.productId || s?.id) === 'rai_pro_year');
        
        monthlyPrice = monthlySub?.price ? parseFloat(monthlySub.price) : 0;
        yearlyPrice = yearlySub?.price ? parseFloat(yearlySub.price) : 0;
      } else {
        const proSub = subscriptions.find(s => (s?.productId || s?.id) === 'rai_pro');
        if (proSub) {
          const offers = (proSub.subscriptionOfferDetailsAndroid || proSub.subscriptionOfferDetails || []);
          const monthlyOffer = offers.find(o => o.basePlanId === 'pro-month');
          const yearlyOffer = offers.find(o => o.basePlanId === 'pro-year');
          
          const getPriceFromOffer = (offer) => {
            const phase = offer?.pricingPhases?.pricingPhaseList?.[offer?.pricingPhases?.pricingPhaseList?.length - 1];
            return phase?.priceAmountMicros ? parseFloat(phase.priceAmountMicros) / 1000000 : 0;
          };
          
          monthlyPrice = getPriceFromOffer(monthlyOffer);
          yearlyPrice = getPriceFromOffer(yearlyOffer);
        }
      }

      if (monthlyPrice > 0 && yearlyPrice > 0) {
        const savings = Math.round((1 - (yearlyPrice / (monthlyPrice * 12))) * 100);
        return savings > 0 ? savings : 25;
      }
    } catch (err) {
      console.error("Error calculating savings:", err);
    }
    return 25; // Default fallback
  }, [subscriptions]);

  const PLANS = [
    {
      id: "rai_basic",
      name: i18n.t("subscription.basicPlanName"),
      price: getPlanPrice("rai_basic", billingCycle === "monthly" ? "₹550.00" : "₹4,900.00"),
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
      ],
      badge: currentUserPlan === "rai_basic" ? null : null
    },
    {
      id: "rai_pro",
      name: i18n.t("subscription.proPlanName"),
      price: getPlanPrice("rai_pro", billingCycle === "monthly" ? "₹1,100.00" : "₹9,900.00"),
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
      badge: currentUserPlan === "rai_pro" ? null : i18n.t("subscription.recommendedBadge")
    }
  ]

  const renderPlanCard = (plan, isSelected, isCurrentPlan = false) => {
    const isPremium = plan.isPremium

    return (
      <TouchableOpacity
        key={plan.id}
        onPress={() => setSelectedPlan(plan.id)}
        activeOpacity={1}
        className="mb-4"
        style={{
          borderRadius: 12,
          backgroundColor:
            (plan.id === "rai_pro" && !isCurrentPlan)
              ? isDarkMode
                ? "#2D2633"
                : "#F8F6FF"
              : isDarkMode
                ? "#2D2633"
                : "#F5F4F7",
          borderWidth: isSelected ? 2 : 0,
          borderColor: isSelected ? "#8E54FE" : "transparent",
          marginHorizontal: 2,
        }}
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            { overflow: "hidden", borderRadius: 12 }
          ]}
        >
          {plan.id === "rai_pro" && !isCurrentPlan && <PremiumProBackground borderRadius={12} />}

          {/* Recommended Badge at bottom right */}
          {plan.id === "rai_pro" && !isCurrentPlan && (
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
                <View className="flex-row items-center flex-1 mr-2">
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
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
                    className={`text-[14.5px] font-Medium flex-1 ${
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
                {i18n.t("subscription.save25").replace("25", proSavingsPercentage)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Plans List */}
        <View className="mb-8">
          {currentPlanCycle === billingCycle && renderPlanCard(currentPlanData, selectedPlan === "current_plan_selection", true)}
          {PLANS.map((plan) => renderPlanCard(plan, selectedPlan === plan.id))}
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
            onPress={handlePurchase}
            disabled={purchasing || !selectedPlan}
            activeOpacity={0.8}
            className="flex-row items-center justify-center w-full"
            style={{
              backgroundColor: "#8E54FE",
              height: 48,
              borderRadius: 12,
              zIndex: 1,
              opacity: (purchasing || !selectedPlan) ? 0.7 : 1
            }}
          >
            {purchasing ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text className="text-white text-[16px] font-Bold">
                  {i18n.t("subscription.purchaseNow")}
                </Text>
                <View style={{ width: 8 }} />
                <ArrowRight size={20} color="white" strokeWidth={2.5} />
              </>
            )}
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
          className="flex-row items-center justify-center"
          style={{ paddingHorizontal: 20, flexWrap: "wrap" }}
        >
          <TouchableOpacity style={{ marginHorizontal: 15, marginVertical: 5 }}>
            <Text
              className="text-[13px] font-Bold text-[#8E54FE]"
              style={{ textDecorationLine: "underline" }}
            >
              {i18n.t("subscription.cancelAnytime")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginHorizontal: 15, marginVertical: 5 }}>
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
