import {
  Bell,
  EllipsisVertical,
  Flag,
  Send,
  UserCircle2,
  X,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { reportReasons } from "../../../assets/data/data";
import Share from "react-native-share";

import EmojiModal from "react-native-emoji-modal";
import { DropdownMenu, Sidebar } from "./WardrobeScreen";
import { useNavigation } from "@react-navigation/native";
import {
  useAddReactionMutation,
  useAddReportMutation,
  useGetAllPostQuery,
} from "../../redux/slices/community/communitySlice";
import { useDispatch, useSelector } from "react-redux";
import {
  useFollowMutation,
  useLogoutMutation,
} from "../../redux/slices/authSlice";
import { clearAuth } from "../../redux/reducers/authReducer";
import { useFormContext } from "react-hook-form";
import { checkIsFollowing } from "../../utils/checkIsFollowing";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../utils/ThemeContext";
import { useFonts } from "expo-font";

// Moved components outside of CommunityScreen
const PostCard = ({
  post,
  toggleFollow,
  openSheet,
  navigation,
  user,
  addReactionLoading,
  addFollowLoading,
  t,
  isDarkMode,
}) => {
  const isFollowing = checkIsFollowing(post?.user?.followers, user?._id);

  // console.log("LINE AT 2343", post, user);

  // Show only first 3 reactions on the post
  const displayedReactions = post?.reactions?.slice(0, 3) || [];
  const hasMoreReactions = post?.reactions?.length > 3;

  const handleShare = async (postImage) => {
    try {
      const response = await Share.open({
        urls: [postImage],
        failOnCancel: false,
      });
      // console.log("✅ Share Response:", response);
    } catch (err) {
      if (err && err.message !== "User did not share") {
        console.log("❌ Share Error:", err);
      }
    }
  };

  return (
    <View
      className="  mb-4 overflow-hidden"
      style={{
        gap: responsiveHeight(2),
      }}
    >
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={() =>
            navigation.navigate("CommunityStack", {
              screen: "CommunityProfile",
              params: { postData: post },
            })
          }
          className="flex-row items-center"
        >
          <Image
            source={{ uri: post?.user?.profileImage }}
            className="w-10 h-10 rounded-full mr-3"
          />
          <Text
            className={`text-[16px] font-Medium ${
              isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
            }`}
          >
            {post?.user?.name}
          </Text>
        </Pressable>

        {post?.user?._id !== user?._id && (
          <Pressable
            disabled={addFollowLoading}
            className={`px-4 py-2 rounded-full ${
              addFollowLoading
                ? "bg-gray-300"
                : isFollowing
                  ? "bg-surfaceAction"
                  : "bg-surfaceSecondary"
            }`}
            onPress={() => toggleFollow(post?.user?._id)}
          >
            <Text
              className={`text-base font-Medium ${
                addFollowLoading
                  ? "text-gray-400"
                  : isFollowing
                    ? "text-white"
                    : "text-textSecondary"
              }`}
            >
              {addFollowLoading
                ? t("loading")
                : isFollowing
                  ? t("following")
                  : t("follow")}
            </Text>
          </Pressable>
        )}
      </View>

      <View className="bg-surfaceSecondary rounded-xl">
        <Image
          source={{ uri: post?.post?.image }}
          className="rounded-lg"
          style={{
            width: responsiveWidth(90),
            height: responsiveHeight(40),
          }}
        />
      </View>

      <View className="pt-0">
        <View className="flex-row items-center">
          <View className="flex-row items-center mr-4">
            <Pressable onPress={() => openSheet("reactions", post?.post?._id)}>
              <View className="flex-row items-center">
                {displayedReactions.map((item, idx) => (
                  <Text key={idx} className="text-base mr-1">
                    {item?.type}
                  </Text>
                ))}
                {hasMoreReactions && (
                  <Text className="text-base text-gray-500 ml-1">
                    +{post?.reactions?.length - 3}
                  </Text>
                )}
              </View>
            </Pressable>
          </View>
        </View>
        <View className="flex-row items-center justify-between w-full">
          <View className="flex-row items-center">
            <Pressable
              disabled={addReactionLoading}
              onPress={() => openSheet("react", post?.post?._id)}
              className="bg-surfaceSecondary px-4 py-1 rounded-full flex-row items-center gap-1"
            >
              <Text
                className={`text-sm ${addReactionLoading ? "text-gray-200" : "text-gray-600"} `}
              >
                {t("tapToReact")}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleShare(post?.post?.image)}
              className="p-2 ml-2"
            >
              <Send color="#5700FE" />
            </Pressable>
          </View>
          {post?.user?._id !== user?._id && (
            <Pressable
              onPress={() => openSheet("report", post?._id)}
              className="p-2"
            >
              <Flag color="#5700FE" />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const ReactionsModal = ({ visible, onClose, reactions, t, isDarkMode }) => {
  if (!visible) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <TouchableWithoutFeedback>
            <View
              className={`rounded-2xl w-[90%] max-h-[70%] p-4 ${
                isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"
              }`}
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text
                  className={`text-xl font-SemiBold ${
                    isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
                  }`}
                >
                  {t("allReactions")}
                </Text>
                <Pressable onPress={onClose}>
                  <X size={24} color={isDarkMode ? "#F5F4F7" : "#000"} />
                </Pressable>
              </View>

              {reactions && reactions.length > 0 ? (
                <FlatList
                  data={reactions}
                  renderItem={({ item }) => (
                    <View
                      className={`flex-row items-center py-3 border-b ${
                        isDarkMode
                          ? "border-darkBorderTertiary"
                          : "border-gray-100"
                      }`}
                    >
                      <Text className="text-2xl mr-3">{item?.type}</Text>
                      <Text
                        className={`text-base font-Medium ${
                          isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
                        }`}
                      >
                        {item?.user?.name || t("unknownUser")}
                      </Text>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={true}
                />
              ) : (
                <Text
                  className={`text-center py-8 ${
                    isDarkMode ? "text-darkTextSecondary" : "text-gray-500"
                  }`}
                >
                  {t("noReactions")}
                </Text>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const CenteredEmojiModal = ({ visible, onEmojiSelected, onPressOutside }) => {
  const [iconFontsLoaded] = useFonts({
    "Material Design Icons": require("react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf"),
  });

  if (!visible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onPressOutside}
    >
      <TouchableWithoutFeedback onPress={onPressOutside}>
        <EmojiModal
          emojiSize={32}
          visible={visible}
          onEmojiSelected={onEmojiSelected}
          onPressOutside={onPressOutside}
          containerStyle={{
            backgroundColor: isDarkMode ? "#1A1820" : "white",
            margin: 0,
            padding: 0,
          }}
          contentContainerStyle={{
            padding: 16,
          }}
        />
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const CommunityScreen = () => {
  const { handleSubmit, clearErrors, setError } = useFormContext();
  const { t } = useTranslation();

  const [activeSheet, setActiveSheet] = useState(null);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [currentPostReactions, setCurrentPostReactions] = useState([]);

  const openSheet = (type, postId = null) => {
    setActiveSheet(type);
    if (postId) {
      setCurrentPostId(postId);

      // If opening reactions modal, find the post and set its reactions
      if (type === "reactions") {
        const post = allCommunityPost?.find((p) => p.post?._id === postId);
        setCurrentPostReactions(post?.reactions || []);
      }
    }
  };

  const closeSheet = () => {
    setActiveSheet(null);
    setCurrentPostId(null);
    setSelectedReason("");
    setCurrentPostReactions([]);
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const ellipsisRef = useRef(null);
  const navigation = useNavigation();

  const handleEllipsisPress = () => {
    if (ellipsisRef.current) {
      ellipsisRef.current.measure((x, y, width, height, pageX, pageY) => {
        setDropdownPosition({ x: pageX, y: pageY + height });
        setShowDropdown(true);
      });
    }
  };

  const {
    data: allCommunityPost,
    isLoading: allCommunityPostLoading,
    isError: allCommunityPostError,
  } = useGetAllPostQuery();

  const [follow, { isLoading: addFollowLoading }] = useFollowMutation();
  const [addReaction, { isLoading: addReactionLoading }] =
    useAddReactionMutation();
  const [addReport, { isLoading: addReportLoading }] = useAddReportMutation();

  const handleEmojiSelect = async (emojiObj) => {
    try {
      const itemData = {
        postId: currentPostId,
        type: emojiObj,
      };

      const response = await addReaction(itemData).unwrap();
      // console.log("Reaction added success:", response);
      closeSheet();
    } catch (error) {
      // console.error("Failed to add reaction:", error);
    }
  };

  const handleReportSelect = async () => {
    try {
      const itemData = {
        reason: selectedReason,
        reportType: "Post",
        targetCommunity: currentPostId,
      };

      const response = await addReport(itemData).unwrap();
      // console.log("Report added:", response);
      closeSheet();
    } catch (error) {
      // console.log("Failed to add report:", error);
    }
  };

  const [loadingUserId, setLoadingUserId] = useState(null);

  const toggleFollow = async (postId) => {
    try {
      setLoadingUserId(postId);
      const result = await follow({ targetUserId: postId }).unwrap();
      // console.log("Follow action successful:", result);
    } catch (error) {
      // console.error("Failed to follow/unfollow:", error);
    }
  };

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const handleLogout = async (data) => {
    clearErrors();
    try {
      const response = await logout().unwrap();
      dispatch(clearAuth());
      // console.log("✅ Logout Success:", response);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (err) {
      // console.log("❌ Logout Error:", err);
      const errorMessage =
        err?.data?.message || err?.error || t("logoutFailed");
      setError("root", {
        type: "manual",
        message: errorMessage,
        formType: "logout",
      });
    }
  };

  const { isDarkMode } = useTheme();

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDarkMode ? "bg-darkSurfacePrimary/90" : "bg-white"
      }`}
      style={{ paddingBottom: responsiveHeight(5) }}
    >
      <View
        className={`px-5 py-3 flex-row items-center justify-between rounded-b-2xl ${
          isDarkMode ? "bg-darkSurfacePrimary" : "bg-surfacePrimary"
        }`}
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
              <UserCircle2 size={34} color={isDarkMode ? "#fff" : "#000"} />
            )}
          </View>
          <View>
            <Text
              className={`text-lg font-Bold ${
                isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
              }`}
            >
              {t("greeting", { name: user?.name || user?.email.split("@")[0] })}
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

      {allCommunityPostLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="purple" size={20} />
        </View>
      ) : allCommunityPostError ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 font-Medium">{t("internalError")}</Text>
        </View>
      ) : allCommunityPost && allCommunityPost.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: responsiveWidth(5),
          }}
        >
          {allCommunityPost.map((post, i) => (
            <PostCard
              key={post.postId || post?.post?._id || i}
              post={post}
              toggleFollow={() => toggleFollow(post?.user?._id)}
              openSheet={openSheet}
              navigation={navigation}
              user={user}
              addReactionLoading={addReactionLoading}
              addFollowLoading={addFollowLoading}
              t={t}
              isDarkMode={isDarkMode}
            />
          ))}
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text
            className={`font-Medium ${
              isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
            }`}
          >
            {t("noPosts")}
          </Text>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={activeSheet === "report"}
        onRequestClose={closeSheet}
      >
        <View style={[styles.bottomSheet]}>
          <View style={styles.bottomSheetHeader}>
            <Pressable
              onPress={closeSheet}
              style={{
                position: "absolute",
                left: responsiveWidth(2),
              }}
            >
              <X color={isDarkMode ? "#F5F4F7" : "#000"} />
            </Pressable>
            <Text
              className={`font-Bold text-2xl ${
                isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
              }`}
            >
              {t("report")}
            </Text>
          </View>
          <Text
            className={`text-xl font-SemiBold mb-8 ${
              isDarkMode ? "text-darkTextPrimary" : "text-gray-900"
            }`}
          >
            {t("reportPrompt")}
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 20,
            }}
            style={{ maxHeight: responsiveHeight(50), width: "100%" }}
          >
            {reportReasons.map((reason, index) => (
              <Pressable
                key={index}
                onPress={() => setSelectedReason(reason)}
                className={`p-4 w-full rounded-2xl  ${
                  selectedReason === reason ? "bg-zinc-200 " : " "
                }`}
              >
                <Text
                  className={`text-base ${
                    selectedReason === reason
                      ? "text-purple-900 font-medium"
                      : isDarkMode
                        ? "text-darkTextPrimary"
                        : "text-gray-900"
                  }`}
                >
                  {reason}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable
            onPress={handleReportSelect}
            disabled={!selectedReason || addReportLoading}
            className={`py-4 w-full px-6 rounded-2xl ${
              selectedReason && !addReportLoading
                ? "bg-surfaceAction"
                : "bg-gray-300"
            }`}
          >
            <Text
              className={`text-center text-xl font-SemiBold ${
                selectedReason && !addReportLoading
                  ? "text-white"
                  : "text-gray-500"
              }`}
            >
              {addReportLoading ? t("reporting") : t("report")}
            </Text>
          </Pressable>
        </View>
      </Modal>

      {/* Reactions Modal */}
      <ReactionsModal
        visible={activeSheet === "reactions"}
        onClose={closeSheet}
        reactions={currentPostReactions}
        t={t}
        isDarkMode={isDarkMode}
      />

      {/* Centered Emoji Modal */}
      <CenteredEmojiModal
        visible={activeSheet === "react"}
        onEmojiSelected={handleEmojiSelect}
        onPressOutside={closeSheet}
        isDarkMode={isDarkMode}
      />

      <DropdownMenu
        visible={showDropdown}
        onClose={() => setShowDropdown(false)}
        position={dropdownPosition}
        isDarkMode={isDarkMode}
      />
      <Sidebar
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        user={user}
        loggedout={handleSubmit(handleLogout)}
        isDarkMode={isDarkMode}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: responsiveWidth(4),
    bottom: 0,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    position: "relative",
  },
});

export default CommunityScreen;
