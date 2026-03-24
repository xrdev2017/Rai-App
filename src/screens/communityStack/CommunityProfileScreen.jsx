
import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  useWindowDimensions,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ArrowLeft,
  Ban,
  EllipsisVertical,
  Flag,
  LockKeyhole,
  Share as ShareIcon,
  X,
} from "lucide-react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { SceneMap, TabView } from "react-native-tab-view";

import CommunityItemsTab from "./communityTabs/CommunityItemsTab";
import CommunityOutfitsTab from "./communityTabs/CommunityOutfitsTab";
import CommunityLookbooksTab from "./communityTabs/CommunityLookbooksTab";
import { ShareSheet, TAB_IDS } from "../bottomNavigator/WardrobeScreen";
import { reportReasons } from "../../../assets/data/data";
import { useDispatch, useSelector } from "react-redux";
import {
  useBlockMutation,
  useFollowMutation,
} from "../../redux/slices/authSlice";
import { checkIsFollowing } from "../../utils/checkIsFollowing";
import { useAddReportMutation } from "../../redux/slices/community/communitySlice";
import { setUser } from "../../redux/reducers/authReducer";
import i18n from "../../utils/languageSetup";

import Share from "react-native-share";

/* Options for 3-dot menu */
export const options = [
  { icon: <Ban />, label: "Block", type: "block" },
  { icon: <Flag />, label: "Report", type: "report" },
  { icon: <ShareIcon />, label: "Share Profile" },
];

/* -------- Block/Unblock Modal -------- */
const BlockAccountModal = ({
  visible,
  onCancel,
  onConfirm,
  isBlocking,
  loading,
  user,
  blocked,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center px-8"
        activeOpacity={1}
        onPress={onCancel}
      >
        <Pressable
          className="bg-white rounded-3xl p-6 w-full max-w-sm"
          activeOpacity={1}
          onPress={() => {}} // prevent close when touching modal
        >
          {/* Avatar */}
          <View className="items-center mb-6">
            <View className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-100">
              <Image
                source={{
                  uri:
                    user?.profileImage ||
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Message */}
          <Text className="text-base font-Medium text-gray-600 text-center mb-8 leading-6">
            {isBlocking
              ? `Are you sure you want to block ${user?.name || "this user"}?`
              : `Do you want to unblock ${user?.name || "this user"}?`}
          </Text>

          {/* Buttons */}
          <View className="gap-3">
            <Pressable
              className={`${blocked ? "bg-surfaceAction" : "bg-red-500"} rounded-2xl py-4 items-center`}
              onPress={onConfirm}
              disabled={loading}
            >
              <Text className="text-white text-lg font-SemiBold">
                {loading
                  ? "Please wait..."
                  : blocked
                    ? "Yes, Unblock"
                    : "Yes, Block"}
              </Text>
            </Pressable>

            <Pressable
              className="bg-gray-200 rounded-2xl py-4 items-center"
              onPress={onCancel}
              disabled={loading}
            >
              <Text className="text-black text-lg font-SemiBold">Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

/* -------- Report Modal -------- */
const ReportModal = ({
  visible,
  onClose,
  reportReasons,
  selectedReason,
  setSelectedReason,
  handleReportSelect,
  addReportLoading,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} className="flex-1 bg-black/30 justify-end">
        <Pressable
          onPress={() => {}}
          className="bg-white p-6 rounded-t-3xl"
          style={{ maxHeight: responsiveHeight(80) }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Pressable onPress={onClose} className="p-2">
              <X />
            </Pressable>
            <Text className="text-2xl font-Bold">Report</Text>
            <View className="w-8" />
          </View>

          <Text className="text-xl font-SemiBold text-gray-900 mb-4">
            Why are you reporting this?
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            style={{ maxHeight: responsiveHeight(50), width: "100%" }}
          >
            {reportReasons.map((reason, index) => (
              <Pressable
                key={index}
                onPress={() => setSelectedReason(reason)}
                className={`p-4 w-full rounded-2xl ${
                  selectedReason === reason ? "bg-zinc-200" : ""
                }`}
              >
                <Text
                  className={`text-base ${
                    selectedReason === reason
                      ? "text-purple-900 font-medium"
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
            style={[
              styles.reportButton,
              (!selectedReason || addReportLoading) && styles.disabledButton,
            ]}
          >
            <Text
              className={`text-center text-xl font-SemiBold ${
                selectedReason && !addReportLoading
                  ? "text-white"
                  : "text-gray-500"
              }`}
            >
              {addReportLoading ? "Reporting..." : "Report"}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

/* -------- Main Screen -------- */
const CommunityProfileScreen = () => {
  const navigation = useNavigation();
  const layout = useWindowDimensions();
  const route = useRoute();
  const dispatch = useDispatch();

  const postData = route?.params?.postData?.user;
  const user = useSelector((state) => state.auth.user);

  // console.log(
  //   "LINE AT 795 user",
  //   user,
  //   "LINE AT 801",
  //   postData,
  //   user.blockedUsers.includes(postData._id)
  // );

  const [isFollowing, setIsFollowing] = useState(
    checkIsFollowing(postData?.followers, user?._id)
  );
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [isBlocking, setIsBlocking] = useState(true); // true = block, false = unblock
  const [showThreeDotModal, setShowThreeDotModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: TAB_IDS.Items, title: "Items" },
    { key: TAB_IDS.Outfit, title: "Outfits" },
    { key: TAB_IDS.Lookbooks, title: "Lookbooks" },
  ]);

  const renderScene = SceneMap({
    [TAB_IDS.Items]: CommunityItemsTab,
    [TAB_IDS.Outfit]: CommunityOutfitsTab,
    [TAB_IDS.Lookbooks]: CommunityLookbooksTab,
  });

  /* RTK hooks */
  const [addReport, { isLoading: addReportLoading }] = useAddReportMutation();
  const [follow, { isLoading: addFollowLoading }] = useFollowMutation();
  const [block, { isLoading: addBlockLoading }] = useBlockMutation();


  const handleConfirmBlock = async () => {
    try {
      // Store current state before making the request
      const wasBlocked = user.blockedUsers.includes(postData._id);

      await block({ targetUserId: postData?._id }).unwrap();

      // Toggle the state based on previous value
      const isNowBlocked = !wasBlocked;
      // console.log(isNowBlocked ? "User blocked" : "User unblocked");

      // Optimistically update blockedUsers
      const updatedUser = {
        ...user,
        blockedUsers: isNowBlocked
          ? [...user.blockedUsers, postData._id]
          : user.blockedUsers.filter((id) => id !== postData._id),
      };
      dispatch(setUser(updatedUser));

      setShowBlockModal(false);
    } catch (err) {
      // console.log("Block/Unblock failed:", err);
    }
  };

  /* Handle Report */
  const handleReportSelect = async () => {
    try {
      const itemData = {
        reason: selectedReason,
        reportType: "Profile",
        targetUser: postData?._id,
      };
      const response = await addReport(itemData).unwrap();
      // console.log("Report added:", response);
      setShowReportModal(false);
    } catch (error) {
      // console.log("Failed to add report:", error);
    }
  };

  /* Handle Follow */
  const toggleFollow = async (postId) => {
    try {
      const result = await follow({ targetUserId: postId }).unwrap();
      setIsFollowing(!isFollowing);
      // console.log("Follow action successful:", result);
    } catch (error) {
      // console.error("Failed to follow/unfollow:", error);
    }
  };

  const ProfileInfo = ({ post }) => (
    <View className="flex-row items-center justify-between px-5 ">
      <View className="flex-row items-center">
        <Image
          source={{ uri: post?.profileImage }}
          className="rounded-full mr-3 border border-borderAction"
          style={{ width: responsiveWidth(13), height: responsiveWidth(13) }}
        />
        <View>
          <Text className="text-[16px] font-Medium text-textPrimary">
            {post?.name}
          </Text>
          <Text className="text-[14px] font-Regular text-textPrimary">
            {post?.username}
          </Text>
        </View>
      </View>
      {post?._id !== user?._id && (
        <Pressable
          disabled={addFollowLoading}
          className={`px-4 py-2 rounded-full ${
            addFollowLoading
              ? "bg-gray-300"
              : isFollowing
                ? "bg-surfaceAction"
                : "bg-surfaceSecondary"
          }`}
          onPress={() => toggleFollow(post?._id)}
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
              ? "Loading..."
              : isFollowing
                ? "✓ Following"
                : "+ Follow"}
          </Text>
        </Pressable>
      )}
    </View>
  );

  const renderTabBar = (props) => (
    <View className="flex-row bg-white px-4 pt-3">
      {props.navigationState.routes.map((route, i) => {
        const active = index === i;
        return (
          <Pressable
            key={route.key}
            className="flex-1 py-3"
            onPress={() => setIndex(i)}
          >
            <Text
              className={`text-center text-base font-Medium ${
                active
                  ? "text-textPrimary border-b-2 border-borderAction pb-2"
                  : "text-textPrimary"
              }`}
            >
              {route.title}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  const handleShare = async () => {
    try {
      const message = i18n.t("account.shareProfileMessage", {
        username: user?.username,
      });
      await Share.open({ message, failOnCancel: false });
    } catch (err) {
      if (err && err.message !== "User did not share")
        console.log("Share Error:", err);
    }
  };

  const ThreeDotSheet = ({ visible, onClose }) => (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} className="flex-1 justify-end bg-black/40">
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 20,
            paddingVertical: 25,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 10,
          }}
        >
          <View
            className="w-full justify-between"
            style={{ gap: responsiveHeight(2) }}
          >
            {options.map((item, idx) => (
              <Pressable
                key={idx}
                onPress={() => {
                  if (item.type === "block") {
                    setShowThreeDotModal(false);
                    setIsBlocking(true); // block mode
                    setShowBlockModal(true);
                  } else if (item.type === "report") {
                    setShowThreeDotModal(false);
                    setShowReportModal(true);
                  } else {
                    setShowThreeDotModal(false);
                    handleShare();
                  }
                }}
                className="flex-row"
                style={{ gap: responsiveHeight(2) }}
              >
                {item.icon}
                <Text className="font-medium text-base">{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );

  const flag =
    postData?.privacy?.profile === "everyone" ||
    (postData?.privacy?.profile === "only_me" && user?._id === postData?._id) ||
    isFollowing;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center p-5">
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-10 h-10 justify-center items-center -ml-2"
        >
          <ArrowLeft color="#81739A" />
        </Pressable>

        {user?._id !== postData?._id && (
          <Pressable
            onPress={() => setShowThreeDotModal(true)}
            className="w-10 h-10 justify-center items-center"
          >
            <EllipsisVertical color="#000" />
          </Pressable>
        )}
      </View>

      <ProfileInfo post={postData} />

      {/* Bio + Tabs */}
      {flag ? (
        <>
          <Text
            className="text-[16px] font-Medium text-textSecondary"
            style={{
              paddingHorizontal: responsiveWidth(4),
              paddingTop: responsiveHeight(1),
            }}
          >
            {postData?.bio}
          </Text>

          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
          />
        </>
      ) : (
        <View className="flex-1 justify-center items-center gap-2">
          <LockKeyhole />
          <Text className="text-[14px] font-SemiBold text-textPrimary">
            This profile is private
          </Text>
          <Text className="text-[14px] font-Regular text-textPrimary">
            Send them a follow request to view their wardrobe
          </Text>
        </View>
      )}

      {/* Modals */}
      {user?._id !== postData?._id && (
        <ThreeDotSheet
          visible={showThreeDotModal}
          onClose={() => setShowThreeDotModal(false)}
        />
      )}

      <BlockAccountModal
        visible={showBlockModal}
        onCancel={() => setShowBlockModal(false)}
        onConfirm={handleConfirmBlock}
        isBlocking={isBlocking}
        blocked={user.blockedUsers.includes(postData._id)}
        loading={addBlockLoading}
        user={postData}
      />

      <ReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportReasons={reportReasons}
        selectedReason={selectedReason}
        setSelectedReason={setSelectedReason}
        handleReportSelect={handleReportSelect}
        addReportLoading={addReportLoading}
      />

      {/* <ShareSheet
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
      /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  reportButton: { marginTop: 20 },
  disabledButton: { opacity: 0.6 },
});

export default CommunityProfileScreen;
