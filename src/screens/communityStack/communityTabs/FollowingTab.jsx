// import { View, Text, ScrollView, Image, Pressable } from "react-native";
// import React, { useState } from "react";
// import { responsiveHeight } from "react-native-responsive-dimensions";
// import { useNavigation } from "@react-navigation/native";

// const FollowingTab = () => {
//   const [posts, setPosts] = useState([
//     {
//       id: 1,
//       user: {
//         name: "User123",
//         username: "@user",

//         avatar:
//           "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
//         isFollowing: true,
//       },
//       reactions: 357,
//       isReacted: true,
//     },
//     {
//       id: 2,
//       user: {
//         name: "User123",
//         username: "@user",

//         avatar:
//           "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
//         isFollowing: true,
//       },
//       reactions: 357,
//       isReacted: true,
//     },
//   ]);
//   const ProfileCard = ({ post }) => {
//     const navigation = useNavigation();

//     return (
//       <View className="flex-row items-center justify-between px-4 ">
//         <Pressable
//           onPress={() => navigation.navigate("CommunityProfile")}
//           className="flex-row items-center"
//         >
//           <Image
//             source={{ uri: post.user.avatar }}
//             className="w-10 h-10 rounded-full mr-3"
//           />
//           <View>
//             <Text className="text-[16px] font-Medium text-textPrimary dark:text-darkTextPrimary">
//               {post.user.name}
//             </Text>
//             <Text className="text-[14px] font-Medium text-textPrimary dark:text-darkTextPrimary">
//               {post.user.username}
//             </Text>
//           </View>
//         </Pressable>
//         <Pressable
//           className={`px-4 py-2 rounded-full ${
//             post.user.isFollowing ? "bg-surfaceSecondary" : "bg-surfaceAction"
//           }`}
//           onPress={() => toggleFollow(post.id)}
//         >
//           <Text
//             className={`text-base font-Medium ${
//               post.user.isFollowing ? "text-textSecondary" : "text-white"
//             }`}
//           >
//             {post.user.isFollowing ? "\u2713  Following" : "+  Follow"}
//           </Text>
//         </Pressable>
//       </View>
//     );
//   };
//   const toggleFollow = (postId) => {
//     setPosts((prev) =>
//       prev.map((post) =>
//         post.id === postId
//           ? {
//               ...post,
//               user: {
//                 ...post.user,
//                 isFollowing: !post.user.isFollowing,
//               },
//             }
//           : post
//       )
//     );
//   };
//   return (
//     <View className="flex-1">
//       <ScrollView
//         contentContainerStyle={{
//           flex: 1,
//           gap: responsiveHeight(2),
//         }}
//         showsVerticalScrollIndicator={false}
//       >
//         {posts.map((post) => (
//           <ProfileCard key={post.id} post={post} />
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// export default FollowingTab;

import { View, Text, ScrollView, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { responsiveHeight } from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import {
  useFollowMutation,
  useGetAllFollowingUserQuery,
  useGetAllUserQuery,
} from "../../../redux/slices/authSlice";
import { useSelector } from "react-redux";
import { checkIsFollowing } from "../../../utils/checkIsFollowing";

const ProfileCard = ({ post, user, loadingUserId, toggleFollow }) => {
  const navigation = useNavigation();
  const isFollowing = checkIsFollowing(post?.followers, user?._id);

  const isLoading = loadingUserId === post?._id; // ✅ only true for this user
// console.log('LINE AT 125', post);

  return (
    <View className="flex-row items-center justify-between px-4">
      <Pressable
        // onPress={() => navigation.navigate("CommunityProfile")}
        className="flex-row items-center"
      >
        <Image
          source={{ uri: post?.profileImage }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View className="w-[50%]">
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
                ? " bg-surfaceSecondary"
                : "bg-surfaceAction"
          }`}
          onPress={() => toggleFollow(post?._id)}
        >
          <Text
            className={`text-base font-Medium ${
              isLoading
                ? "text-gray-400"
                : isFollowing
                  ? " text-textSecondary"
                  : "text-white"
            }`}
          >
            {isLoading
              ? "Loading..."
              : isFollowing
                ? "+ Follow"
                : "✓ Following"}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const FollowingTab = () => {
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

  const { data = [], isLoading, isError } = useGetAllFollowingUserQuery();
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

export default FollowingTab;
