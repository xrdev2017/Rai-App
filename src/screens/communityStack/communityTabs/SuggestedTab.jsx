import { View, Text, ScrollView, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import {
  useFollowMutation,
  useGetAllUserQuery,
} from "../../../redux/slices/authSlice";
import { useSelector } from "react-redux";
import { checkIsFollowing } from "../../../utils/checkIsFollowing";

const ProfileCard = ({ post, user, loadingUserId, toggleFollow }) => {
  const navigation = useNavigation();
  const isFollowing = checkIsFollowing(post?.followers, user?._id);

  const isLoading = loadingUserId === post?._id; // ✅ only true for this user
// console.log("LINE AT 17", post);

  return (
    <View className="flex-row items-center justify-between px-4">
      <Pressable
        // onPress={() => navigation.navigate("CommunityProfile")}
        className="flex-row items-center"
      >
        <Image
          source={{ uri: post.profileImage }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View className="w-[60%]">
          <Text className="text-[16px] font-Medium text-textPrimary dark:text-darkTextPrimary">
            {post?.name || post?.email}
          </Text>
          <Text className="text-[14px] font-Medium text-textPrimary dark:text-darkTextPrimary">
            {post?.username ? `@${post?.username}` : null}
          </Text>
        </View>
      </Pressable>

      {post?._id !== user?._id && (
        <Pressable
          disabled={isLoading}
          className={`px-4 py-2 rounded-full ${
            isLoading
              ? "bg-gray-300"
              : isFollowing
                ? "bg-surfaceAction"
                : "bg-surfaceSecondary "
          }`}
          onPress={() => toggleFollow(post?._id)}
        >
          <Text
            className={`text-base font-Medium ${
              isLoading
                ? "text-gray-400"
                : isFollowing
                  ? "text-white"
                  : "text-textSecondary"
            }`}
          >
            {isLoading
              ? "Loading..."
              : isFollowing
                ? "✓ Following"
                : "+ Follow"}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const SuggestedTab = () => {
  const user = useSelector((state) => state.auth.user);
  const [follow] = useFollowMutation();

  const [loadingUserId, setLoadingUserId] = useState(null); // ✅ track per user

  const toggleFollow = async (postId) => {
    try {
      setLoadingUserId(postId); // start loading for this user
      const result = await follow({ targetUserId: postId }).unwrap();
      console.log("Follow action successful:", result);
    } catch (error) {
      console.error("Failed to follow/unfollow:", error);
    } finally {
      setLoadingUserId(null); // reset after done
    }
  };

  const { data = [], isLoading, isError } = useGetAllUserQuery();
  console.log("LINE AT 91", data);

  return (
    <View className="flex-1">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          gap: responsiveHeight(2),
        }}
        showsVerticalScrollIndicator={false}
      >
        {data?.map((post) => (
          <ProfileCard
            key={post._id}
            post={post}
            user={user}
            loadingUserId={loadingUserId}
            toggleFollow={toggleFollow}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default SuggestedTab;
