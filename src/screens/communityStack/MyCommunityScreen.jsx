import React, { useState } from "react";
import { View, Text, Pressable, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import SuggestedTab from "./communityTabs/SuggestedTab";
import FollowingTab from "./communityTabs/FollowingTab";
import FollowersTab from "./communityTabs/FollowersTab";
import { useTranslation } from "react-i18next";

const MyCommunityScreen = () => {
  const navigation = useNavigation();
  const layout = useWindowDimensions();
  const { t } = useTranslation();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "suggested", title: t("community.suggested") },
    { key: "following", title: t("community.following") },
    { key: "followers", title: t("community.followers") },
  ]);

  const renderScene = SceneMap({
    suggested: SuggestedTab,
    following: FollowingTab,
    followers: FollowersTab,
  });

  const renderTabBar = (props) => (
    <View className="flex-row bg-white dark:bg-darkSurfacePrimary px-4 pt-2">
      {props.navigationState.routes.map((route, i) => {
        const isActive = i === props.navigationState.index;
        return (
          <Pressable
            key={route.key}
            className="flex-1 py-3"
            onPress={() => setIndex(i)}
          >
            <Text
              className={`text-center text-base font-Medium ${
                isActive
                  ? "text-textPrimary dark:text-darkTextPrimary border-b-2 border-borderAction pb-2"
                  : "text-textPrimary dark:text-darkTextPrimary opacity-60"
              }`}
            >
              {route.title}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-darkSurfacePrimary/90">
      {/* Header */}
      <View className="flex-row items-center p-5">
        <Pressable
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          className="w-10 h-10 justify-center items-center -ml-2"
        >
          <ArrowLeft color="#5700FE" />
        </Pressable>
        <Text className="flex-1 text-center text-xl font-SemiBold text-textPrimary dark:text-darkTextPrimary">
          {t("community.myCommunity")}
        </Text>
        <View style={{ width: 40 }} /> {/* placeholder for alignment */}
      </View>

      {/* TabView */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  );
};

export default MyCommunityScreen;
