import {
  EllipsisVertical,
  Search,
  SlidersHorizontal,
  X,
  Globe,
  PenTool,
  Heart,
  Shirt,
  ChartColumn,
  Settings,
  HelpCircle,
  Star,
  Share as ShareIcon,
  LogOut,
  Bell,
  UserCircle2,
  User2Icon,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Modal,
  Animated,
  Dimensions,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import {
  SafeAreaView,
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import ItemTab from "./tabComponents/ItemTab";
import LookbookTab from "./tabComponents/LookbookTab";
import OutfitTab from "./tabComponents/OutfitTab";
import CustomBottomSheet from "../../components/CustomBottomSheet";
import ColorPalette from "../../components/ColorPallete";
import { categories, seasons } from "../../../assets/data/data";
import { Slider } from "@miblanchard/react-native-slider";
import { SceneMap, TabView } from "react-native-tab-view";
import { SHARE_OPTIONS } from "./AccountScreen";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useFormContext } from "react-hook-form";
import {
  useGetAllBrandsQuery,
  useGetAllStyleQuery,
} from "../../redux/slices/addItem/addItemSlice";
import OptionSelector from "../../components/OptionSelector";
import MultiOptionSelector from "../../components/MultiOptionSelector";
import { useLogoutMutation } from "../../redux/slices/authSlice";
import { clearAuth } from "../../redux/reducers/authReducer";
import Share from "react-native-share";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../utils/ThemeContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.7;

export const TAB_IDS = {
  Items: "Items",
  Outfit: "Outfit",
  Lookbooks: "Lookbooks",
};
export const TAB_OPTIONS = [
  { id: TAB_IDS.Items, label: "Items" },
  { id: TAB_IDS.Outfit, label: "Outfit" },
  { id: TAB_IDS.Lookbooks, label: "Lookbooks" },
];

export const ShareSheet = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <View
          className={`rounded-t-2xl px-5 py-6 ${
            isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"
          }`}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-5">
            <Pressable onPress={onClose}>
              <View
                className={`p-1 rounded-full ${
                  isDarkMode ? "bg-darkSurfaceSecondary" : "bg-gray-200"
                }`}
              >
                <X size={22} color={isDarkMode ? "#fff" : "#000"} />
              </View>
            </Pressable>
            <Text
              className={`font-bold text-2xl ${
                isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
              }`}
            >
              {t("share")}
            </Text>
            <View style={{ width: 32 }} />
          </View>
          {/* Options */}
          ...
        </View>
      </View>
    </Modal>
  );
};

export const Sidebar = ({
  visible,
  onClose,
  setShowShareModal,
  user,
  loggedout,
  isDarkMode,
}) => {
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const { t } = useTranslation();

  const sidebarMenuItems = [
    {
      id: 1,
      icon: Settings,
      label: t("privacySettings"),
      path: "AccountPrivacyStack",
    },
    { id: 2, icon: HelpCircle, label: t("help"), path: "AccountFeedback" },
    { id: 3, icon: Star, label: t("rateApp") },
  ];

  const bottomMenuItems = [
    { id: 4, icon: ShareIcon, label: t("shareProfile"), type: "modal" },
    { id: 5, icon: LogOut, label: t("logout") },
  ];

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  //   const user = useSelector((state) => state.auth.user);

  const handleShare = async () => {
    try {
      const message = `Check out ${user?.name}'s profile on Rai! Search with @${user?.username}`;
      const imageUrl = user?.profileImage; // must be valid (http/https/file/base64)

      const response = await Share.open({
        // urls: [imageUrl], // 👈 image goes here
        message: message, // 👈 message should still be passed
        failOnCancel: false,
      });

      console.log("✅ Share Response:", response);
    } catch (err) {
      if (err && err.message !== "User did not share") {
        console.log("❌ Share Error:", err);
      }
    }
  };

  console.log("LINE AT 155", user);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
          <View className="flex-1 flex-row">
            <Pressable
              className="absolute inset-0 bg-black/50"
              onPress={onClose}
            />
            <Animated.View
              className={`h-full shadow-xl ${
                isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"
              }`}
              style={{
                transform: [{ translateX: slideAnim }],
                width: SIDEBAR_WIDTH,
              }}
            >
              {/* Profile Section */}
              <View
                className="flex-row  items-center"
                style={{
                  paddingHorizontal: responsiveWidth(5),
                  paddingVertical: responsiveHeight(2),
                  gap: responsiveWidth(3),
                }}
              >
                <View className="relative">
                  <Image
                    source={{
                      uri: user?.profileImage,
                    }}
                    className="rounded-full border border-[#5700FE]"
                    style={{
                      width: responsiveWidth(14),
                      height: responsiveWidth(14),
                    }}
                  />
                  {(user?.subscription?.status === "active" ||
                    user?.subscription?.status === "trialing") && (
                    <Image
                      source={require("../../../assets/images/ic_blue_tick.png")}
                      className="absolute"
                      style={{ width: 15, height: 15, bottom: 2, right: 2 }}
                      resizeMode="contain"
                    />
                  )}
                </View>
                <View className="gap-1">
                  <View
                    className={`border-b gap-1 ${
                      isDarkMode
                        ? "border-darkBorderTertiary"
                        : "border-zinc-200"
                    }`}
                  >
                    <Text
                      className={`text-lg font-SemiBold ${
                        isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
                      }`}
                    >
                      {user?.name || user?.email?.split("@")[0] || ""}
                    </Text>
                    <Text
                      className={`text-sm font-Regular mb-1 ${
                        isDarkMode ? "text-darkTextSecondary" : "text-gray-500"
                      }`}
                    >
                      @{user?.username}
                    </Text>
                  </View>
                  <View
                    className="flex-row items-center  mt-1 flex-wrap"
                    style={{
                      gap: responsiveWidth(1),
                    }}
                  >
                    <Text
                      className={`text-sm font-Medium ${
                        isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
                      }`}
                    >
                      {user?.followers.length} {t("followers")}
                    </Text>
                    <Text
                      className={`text-sm font-Medium ${
                        isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
                      }`}
                    >
                      {user?.following.length} {t("following")}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Main Menu Items */}
              <View className="flex-1 pt-2">
                {sidebarMenuItems.map((item) => (
                  <Pressable
                    key={item.id}
                    className={`flex-row items-center px-6 py-4 ${
                      isDarkMode
                        ? "active:bg-darkSurfaceSecondary"
                        : "active:bg-gray-50"
                    }`}
                    onPress={() => {
                      onClose();
                      if (item.path) {
                        navigation.navigate("AccountStack", {
                          screen: item.path,
                        });
                      }
                    }}
                  >
                    <item.icon
                      size={20}
                      color={isDarkMode ? "#fff" : "#000"}
                      style={{ marginRight: 16 }}
                    />
                    <Text
                      className={`text-base font-Medium ${
                        isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
                      }`}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Bottom Menu Items */}
              <View className=" pb-6">
                {bottomMenuItems.map((item) => (
                  <Pressable
                    key={item.id}
                    className="flex-row items-center px-6 py-4 active:bg-gray-50"
                    onPress={() => {
                      onClose();
                      if (item.type === "modal") {
                        handleShare();
                      } else {
                        loggedout();
                      }
                    }}
                  >
                    <item.icon
                      size={20}
                      color={isDarkMode ? "#fff" : "#000"}
                      style={{ marginRight: 16 }}
                    />
                    <Text
                      className={`text-base font-Medium ${
                        isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
                      }`}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};

export const DropdownMenu = ({ visible, onClose, position, isDarkMode }) => {
  const { t } = useTranslation();

  const menuItems = [
    {
      id: 1,
      icon: Globe,
      label: t("myCommunity"),
      path: "CommunityStack",
    },
    {
      id: 2,
      icon: PenTool,
      label: t("canvasIcon"),
      path: "CreateOutfitStack",
    },
    {
      id: 3,
      icon: Heart,
      label: t("wishlistIcon"),
      path: "WishlistStack",
    },
    {
      id: 4,
      icon: Shirt,
      label: t("dressMeIcon"),
      path: "DressMeStack",
    },
    {
      id: 5,
      icon: ChartColumn,
      label: t("analytics"),
      path: "Analytics",
    },
  ];

  if (!visible) return null;
  const navigation = useNavigation();
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/50" onPress={onClose}>
        <View
          className={`absolute rounded-xl border shadow-md min-w-[160px] ${
            isDarkMode
              ? "border-darkBorderTertiary bg-darkSurfacePrimary/80"
              : "border-borderTertiary bg-white"
          }`}
          //   className={`absolute rounded-xl border shadow-md min-w-[160px]
          //       border-darkBorderTertiary bg-darkSurfacePrimary/80

          //  `}
          style={{ top: responsiveHeight(6), right: responsiveWidth(6) }}
        >
          {menuItems.map((item, index) => (
            <Pressable
              key={item.id}
              className={`flex-row items-center gap-2 px-4 py-3 ${index === menuItems.length - 1 ? "border-b-0" : isDarkMode ? "border-b border-darkBorderTertiary" : "border-b border-borderTertiary"}`}
              onPress={() => {
                onClose();

                navigation.navigate(item.path);
              }}
            >
              <item.icon
                size={22}
                color={isDarkMode ? "#F5F4F7" : "#08002B"}
                strokeWidth={1.9}
              />
              <Text
                className={`text-[15px] font-Medium ${
                  isDarkMode ? "text-darkTextPrimary" : "text-gray-800"
                }`}
                // className={`text-[15px] font-Medium text-darkTextPrimary
                // `}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

const BottomSheet = ({ visible, onCancel }) => {
  const { t } = useTranslation(); // using filters.json
  const [usageValue, setUsageValue] = useState(50);
  const { watch, setValue, reset } = useFormContext();
  const { isDarkMode } = useTheme();

  const { data: allStyles } = useGetAllStyleQuery();
  const { data: allBrands } = useGetAllBrandsQuery();

  const selectedSeasons = watch("filterSeasons") || [];
  const selectedStyles = watch("filterStyles") || [];
  const filterBrand = watch("filterBrand");

  const handleToggleSeason = (season) => {
    const newSeasons = selectedSeasons.includes(season)
      ? selectedSeasons.filter((s) => s !== season)
      : [...selectedSeasons, season];
    setValue("filterSeasons", newSeasons, { shouldValidate: true });
  };

  const handleToggleStyle = (style) => {
    const newStyles = selectedStyles.includes(style)
      ? selectedStyles.filter((s) => s !== style)
      : [...selectedStyles, style];
    setValue("filterStyles", newStyles, { shouldValidate: true });
  };

  const handleBrandSelect = (selected) => {
    setValue("filterBrand", selected[0] || "");
  };

  const resetFilters = () => {
    reset({
      usage: 50,
      selectedSeasons: [],
      selectedStyles: [],
      filterColors: [],
      filterBrand: "",
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
          <View
            className={`flex-1 ${
              isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"
            }`}
            style={{ padding: responsiveWidth(5) }}
          >
            {/* Header */}
            <View
              className={`flex-row items-center justify-between border-b ${
                isDarkMode ? "border-darkBorderTertiary" : "border-gray-100"
              }`}
            >
              <Pressable onPress={onCancel} className="p-2 ">
                <X size={22} color={isDarkMode ? "#fff" : "#000"} />
              </Pressable>
              <Text
                className={`text-xl font-semibold ${
                  isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
                }`}
              >
                {t("filters")}
              </Text>
              <Pressable onPress={resetFilters}>
                <Text
                  className={`text-base font-medium ${
                    isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
                  }`}
                >
                  {t("reset")}
                </Text>
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={{ gap: responsiveHeight(2) }}
              showsVerticalScrollIndicator={false}
            >
              {/* Brand */}
              <CustomBottomSheet
                title={t("brand")}
                data={allBrands?.data}
                initialSelected={filterBrand ? [filterBrand] : []}
                onChange={handleBrandSelect}
                loadingText={t("loadingCategories")}
                errorText={t("failedLoadCategories")}
              />

              {/* Colors */}
              <ColorPalette name="filterColors" />

              {/* Season */}
              <View>
                <Text
                  className={`text-lg font-SemiBold ${
                    isDarkMode ? "text-darkTextPrimary" : "text-black"
                  }`}
                >
                  {t("season")}
                </Text>
                <View className="flex-row flex-wrap gap-2 mt-2">
                  {seasons.map((season) => (
                    <MultiOptionSelector
                      key={season}
                      title={season}
                      selectedValues={selectedSeasons}
                      onSelect={handleToggleSeason}
                    />
                  ))}
                </View>
              </View>

              {/* Style */}
              <View>
                <Text
                  className={`text-lg font-SemiBold ${
                    isDarkMode ? "text-darkTextPrimary" : "text-black"
                  }`}
                >
                  {t("style")}
                </Text>
                <View className="flex-row gap-4 flex-wrap">
                  {allStyles?.styles.map((opt) => (
                    <MultiOptionSelector
                      key={opt?.name}
                      title={opt?.name}
                      selectedValues={selectedStyles}
                      onSelect={handleToggleStyle}
                    />
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Apply Button */}
            <View>
              <Pressable
                className="bg-surfaceAction rounded-2xl py-4 items-center"
                onPress={onCancel}
              >
                <Text className="text-white text-lg font-SemiBold">
                  {t("apply")}
                </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};

const WardrobeScreen = () => {
  const { t } = useTranslation();

  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTab, setActiveTab] = useState(TAB_IDS.Items);
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const ellipsisRef = useRef(null);

  const route = useRoute();
  const { tab } = route.params || {};
  const navigation = useNavigation();

  const layout = useWindowDimensions();

  const initialTab = tab ?? null;
  const initialIndex = TAB_OPTIONS.findIndex((t) => t.id === initialTab);
  const [index, setIndex] = useState(initialIndex);

  const routes = TAB_OPTIONS.map((tab) => ({
    key: tab.id,
    title: tab.label,
  }));

  const { control, handleSubmit, clearErrors, setError } = useFormContext();
  const user = useSelector((state) => state.auth.user);

  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const renderScene = SceneMap({
    [TAB_IDS.Items]: () => <ItemTab tab={tab === TAB_IDS.Items} />,
    [TAB_IDS.Outfit]: () => <OutfitTab tab={tab === TAB_IDS.Outfit} />,
    [TAB_IDS.Lookbooks]: () => <LookbookTab tab={tab === TAB_IDS.Lookbooks} />,
  });

  useEffect(() => {
    setIndex(TAB_OPTIONS.findIndex((t) => t.id === activeTab));
  }, [activeTab]);

  useEffect(() => {
    if (tab) setActiveTab(tab);
  }, [tab]);

  const handleEllipsisPress = () => {
    if (ellipsisRef.current) {
      ellipsisRef.current.measure((x, y, width, height, pageX, pageY) => {
        setDropdownPosition({ x: pageX, y: pageY + height });
        setShowDropdown(true);
      });
    }
  };

  const handleLogout = async () => {
    clearErrors();
    try {
      await logout().unwrap();
      dispatch(clearAuth());
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (err) {
      const errorMessage =
        err?.data?.message || err?.error || "Logout failed. Please try again.";
      setError("root", {
        type: "manual",
        message: errorMessage,
        formType: "logout",
      });
    }
  };

  // console.log('LINE AT 546', user);
  const { isDarkMode } = useTheme();

  return (
    <SafeAreaView
      className={`flex-1  ${isDarkMode ? "bg-darkSurfacePrimary/90" : "bg-white"}`}
      style={{ paddingBottom: responsiveHeight(4) }}
    >
      {/* Header */}
      <View
        className={`px-5 py-3 flex-row items-center justify-between rounded-b-2xl 
          ${isDarkMode ? "bg-darkSurfacePrimary" : "bg-surfacePrimary"} `}
      >
        <Pressable
          onPress={() => setShowSidebar(true)}
          className="flex-row items-center"
        >
          <View className="rounded-full mr-3 border border-borderAction">
            {user?.profileImage ? (
              <Image
                source={{ uri: user?.profileImage }}
                style={{
                  width: responsiveWidth(14),
                  height: responsiveWidth(14),
                  borderRadius: 9999,
                }}
              />
            ) : (
              <View className="rounded-full border border-borderAction p-2">
                <UserCircle2 size={34} color={isDarkMode ? "#fff" : "#000"} />
              </View>
            )}
            {(user?.subscription?.status === "active" ||
              user?.subscription?.status === "trialing") && (
              <Image
                source={require("../../../assets/images/ic_blue_tick.png")}
                className="absolute"
                style={{ width: 15, height: 15, bottom: 2, right: 2 }}
                resizeMode="contain"
              />
            )}
          </View>
          <View>
            <Text
              className={`text-lg font-Bold ${isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"}`}
            >
              {t("greeting", { name: user?.name || user?.email?.split("@")[0] || "" })}
            </Text>
            <Text
              className={`text-base font-Medium ${
                isDarkMode ? "text-darkTextSecondary" : "text-textSecondary"
              }`}
            >
              {t("subtitle")}
            </Text>
          </View>
        </Pressable>
        <View className="flex-row items-center">
          <Pressable
            onPress={() => navigation.navigate("Notification")}
            className="p-2 mr-2"
          >
            <Bell size={22} color={isDarkMode ? "#fff" : "#000"} />
          </Pressable>
          <Pressable
            ref={ellipsisRef}
            onPress={handleEllipsisPress}
            className="p-2"
          >
            <EllipsisVertical size={22} color={isDarkMode ? "#fff" : "#000"} />
          </Pressable>
        </View>
      </View>

      {/* Search + Filter */}
      <View className="flex-row items-center px-4 py-2 gap-3">
        <View
          className={`flex-1 flex-row items-center rounded-2xl px-4 py-1 ${
            isDarkMode
              ? "border border-darkBorderTertiary bg-darkSurfaceSecondary"
              : "border border-gray-200 bg-white"
          }`}
        >
          <Search size={18} color="#C5BFD1" />
          <Controller
            control={control}
            name="searchTextWardrobe"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`flex-1 text-base p-2 font-Medium ${
                  isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
                }`}
                placeholder={t("searchPlaceholder")}
                placeholderTextColor="#9ca3af"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="search"
              />
            )}
          />
        </View>
        <Pressable
          className="p-4 bg-surfaceAction rounded-xl items-center justify-center"
          onPress={() => setShowModal(true)}
        >
          <SlidersHorizontal size={20} color="white" />
        </Pressable>
      </View>

      {/* Tabs */}
      <View
        className={`px-5 flex-row ${
          isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"
        }`}
      >
        {TAB_OPTIONS.map((tab, i) => (
          <Pressable
            key={tab.id}
            className="flex-1 py-3"
            onPress={() => {
              setActiveTab(tab.id);
              setIndex(i);
            }}
          >
            <Text
              className={`text-center text-base font-Medium ${
                isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
              } ${activeTab === tab.id ? "border-b-2 border-borderAction pb-2" : ""}`}
            >
              {t(`tabs.${tab.id.toLowerCase()}`)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Tab Content */}
      <View className="flex-1">
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={(i) => {
            setIndex(i);
            setActiveTab(TAB_OPTIONS[i].id);
          }}
          swipeEnabled
          renderTabBar={() => null}
        />
      </View>

      {/* Modals */}
      <BottomSheet visible={showModal} onCancel={() => setShowModal(false)} />
      <DropdownMenu
        visible={showDropdown}
        onClose={() => setShowDropdown(false)}
        position={dropdownPosition}
        isDarkMode={isDarkMode}
      />
      <Sidebar
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        setShowShareModal={setShowShareModal}
        user={user}
        loggedout={handleSubmit(handleLogout)}
        isDarkMode={isDarkMode}
      />
    </SafeAreaView>
  );
};

export default WardrobeScreen;
