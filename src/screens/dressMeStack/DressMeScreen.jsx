import React, { useState } from "react";
import { View, Text, Pressable, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import { TabView } from "react-native-tab-view";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { useTranslation } from "react-i18next";

import Item2Tab from "./dressMeComponents/Item2Tab";
import Item3Tab from "./dressMeComponents/Item3Tab";
import Item4Tab from "./dressMeComponents/Item4Tab";

const DressMeScreen = () => {
  const { t } = useTranslation();
  const route = useRoute();
  const tab = route.params?.tab;
  const id = route.params?.id;

  const navigation = useNavigation();
  const layout = useWindowDimensions();

  const [routes] = useState([
    { key: "Items2", title: t("dressMe.items2") },
    { key: "Items3", title: t("dressMe.items3") },
    { key: "Items4", title: t("dressMe.items4") },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "Items2":
        return <Item2Tab id={id} />;
      case "Items3":
        return <Item3Tab id={id} />;
      case "Items4":
        return <Item4Tab id={id} />;
      default:
        return null;
    }
  };

  const initialIndex = tab ? routes.findIndex((r) => r.title === tab) : 0;
  const [index, setIndex] = useState(initialIndex);

  const renderTabBar = () => (
    <View className="bg-white dark:bg-darkSurfacePrimary flex-row py-2">
      {routes.map((tab, i) => (
        <Pressable
          key={tab.key}
          className="flex-1 py-3"
          onPress={() => setIndex(i)}
        >
          <Text
            className={`text-center text-base font-Medium ${
              index === i
                ? "text-textPrimary dark:text-darkTextPrimary  border-b-2 border-borderAction pb-2"
                : "text-textPrimary dark:text-darkTextPrimary "
            }`}
          >
            {tab.title}
          </Text>
        </Pressable>
      ))}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-darkSurfacePrimary/90 ">
      {/* Header */}
      <View
        className="flex-row items-center"
        style={{ padding: responsiveWidth(5) }}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-10 h-10 justify-center items-center -ml-2"
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#5700FE" />
        </Pressable>
        <Text className="flex-1 text-center text-xl font-SemiBold text-textPrimary dark:text-darkTextPrimary">
          {t("dressMe.title")}
        </Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      {/* Custom Tab Bar */}
      {renderTabBar()}

      {/* Swipeable Tabs */}
      <View style={{flex:1, padding: responsiveWidth(5) }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          swipeEnabled={true}
          renderTabBar={() => null}
        />
      </View>
    </SafeAreaView>
  );
};

export default DressMeScreen;
