import { View, Text, Pressable, Image, ScrollView, Modal } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Dot, FolderClosed, Send, SquarePen, X } from "lucide-react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import DatePicker from "../../components/DatePicker";
import CustomTimePicker from "../../screens/bottomNavigator/tabComponents/CustomTimePicker";
import { useFormContext } from "react-hook-form";
import { useCreatePlannerMutation } from "../../redux/slices/planner/plannerSlice";
import { useTranslation } from "react-i18next";
import i18n from "../../utils/languageSetup";
import Share from "react-native-share";
import { useTheme } from "../../utils/ThemeContext";

const SuccessModal = ({ visible }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View className="flex-1 justify-center items-center bg-black/40">
        <View
          className={`rounded-2xl w-[80%] p-6 items-center ${
            isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"
          }`}
        >
          <Image
            source={require("../../../assets/images/profile-success.webp")}
          />
          <Text className="text-3xl font-SemiBold text-textPrimary dark:text-darkTextPrimary mt-4 text-center">
            {t("saveOutfit.outfitSuccess")}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const SaveOutfitScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const { getValues } = useFormContext();
  const { outfit, plannerDate, plannerTime } = getValues();
  const [createPlanner, { isLoading }] = useCreatePlannerMutation();

  const SelectFolderModal = ({ visible }) => (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          className={isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"}
          style={{
            padding: 20,
            borderRadius: 20,
            width: "80%",
            gap: responsiveHeight(2),
          }}
        >
          <Pressable
            onPress={() => {
              setShowFolderModal(false);
              navigation.navigate("CreateNewLookbook");
            }}
            className="bg-surfaceAction p-2 rounded-xl flex-row items-center justify-center gap-2"
          >
            <FolderClosed color="#f4f4f4" />
            <Text className="text-textPrimaryInverted font-SemiBold">
              {t("saveOutfit.createNewLookbook")}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setShowFolderModal(false)}
            style={{ marginTop: 20 }}
          >
            <Text className="text-center text-red-500 font-SemiBold">
              {t("saveOutfit.cancel")}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  const handleTimeConfirm = async () => {
    try {
      const itemData = {
        outfitId: outfit?._id,
        date: plannerDate,
        time: plannerTime,
      };
      await createPlanner(itemData).unwrap();
      setSuccessVisible(true);
      setTimeout(() => {
        setCalendarVisible(false);
        setReminderModalVisible(false);
        setSuccessVisible(false);
        navigation.navigate("BottomNavigator", { screen: "Planner" });
      }, 2000);
    } catch (error) {
      // console.log("Planner creation error:", error);
    }
  };

  const handleTimeCancel = () => setReminderModalVisible(false);

  const handleShare = async () => {
    // console.log("click ", outfit?.title);

    try {
      const message = `Check out this outfit: ${outfit?.title || "My Outfit"}`;
      await Share.open({
        message,
        failOnCancel: false,
      });
    } catch (err) {
      // if (err && err.message !== "User did not share")
        // console.log("Share Error:", err);
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-darkSurfacePrimary/90" : "bg-white"}`}
      style={{ padding: responsiveWidth(5) }}
    >
      <View className="flex-row items-center mb-5">
        <Pressable
          onPress={() =>
            navigation.navigate("BottomNavigator", {
              screen: "Wardrobe",
              params: { tab: "Outfit" },
            })
          }
          className="w-10 h-10 justify-center items-center -ml-2"
          activeOpacity={0.7}
        >
          <X size={20} color="#5700FE" />
        </Pressable>
        <Text
          className={`flex-1 text-center text-xl font-SemiBold ${
            isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
          }`}
        >
          {t("saveOutfit.savedOutfit")}
        </Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          gap: responsiveHeight(3),
          paddingBottom: responsiveHeight(2),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full bg-surfaceSecondary dark:bg-darkSurfaceSecondary rounded-xl items-center justify-center">
          <Image
            source={{ uri: outfit?.image }}
            style={{
              width: responsiveWidth(40),
              height: responsiveHeight(40),
              objectFit: "cover",
            }}
          />
        </View>

        <View className="flex-row items-center justify-between mt-3">
          <View className="flex-row items-center gap-4">
            <Pressable
              onPress={() => navigation.navigate("SetOutfit")}
              className="bg-surfaceSecondary dark:bg-darkSurfaceSecondary rounded-full p-3 self-start"
            >
              <SquarePen color={isDarkMode ? "#F5F4F7" : "black"} />
            </Pressable>
            <Pressable
              onPress={handleShare}
              className="bg-surfaceSecondary dark:bg-darkSurfaceSecondary rounded-full p-3 self-start"
            >
              <Send color={isDarkMode ? "#F5F4F7" : "black"} />
            </Pressable>
          </View>
          <View className="flex-row items-center gap-2 bg-textSuccess/30 rounded-3xl px-4">
            <Text className="text-textSuccess font-Medium">
              {t("saveOutfit.outfitCreated")}
            </Text>
            <Dot color={"#209261"} />
          </View>
        </View>

        <View className="gap-4 mt-4">
          <Text className="text-lg font-SemiBold text-textPrimary dark:text-darkTextPrimary">
            {t("saveOutfit.title")}
          </Text>
          <Text className="text-md font-Regular text-textPrimary dark:text-darkTextPrimary ">
            {outfit?.title}
          </Text>
          <View className="w-full h-[1px] bg-zinc-300" />
        </View>

        <View className="flex-row items-center justify-between gap-10 mt-3">
          <View className="gap-4 flex-1">
            <Text className="text-lg font-SemiBold text-textPrimary dark:text-darkTextPrimary ">
              {t("saveOutfit.season")}
            </Text>
            <Text className="text-md font-Regular text-textPrimary dark:text-darkTextPrimary ">
              {outfit?.season}
            </Text>
            <View className="w-full h-[1px] bg-zinc-300" />
          </View>
          <View className="gap-4 flex-1">
            <Text className="text-lg font-SemiBold text-textPrimary dark:text-darkTextPrimary">
              {t("saveOutfit.style")}
            </Text>
            <Text className="text-md font-Regular text-textPrimary dark:text-darkTextPrimary ">
              {outfit?.style?.name}
            </Text>
            <View className="w-full h-[1px] bg-zinc-300" />
          </View>
        </View>
      </ScrollView>

      <View className="flex-row items-center justify-between gap-2 mt-4">
        <Pressable
          onPress={() => setShowFolderModal(true)}
          className={`w-1/2 h-16 border-2 border-surfaceAction rounded-xl justify-center ${
            isDarkMode ? "bg-darkSurfaceSecondary" : "bg-white"
          }`}
        >
          <Text
            className={`text-center font-Medium text-lg ${
              isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
            }`}
          >
            {t("saveOutfit.addToLookbook")}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setCalendarVisible(true)}
          className="w-1/2 h-16 bg-surfaceAction rounded-xl border-2 border-surfaceAction justify-center"
        >
          <Text className="text-white text-center font-Medium text-lg">
            {t("saveOutfit.addToCalendar")}
          </Text>
        </Pressable>
      </View>

      <SelectFolderModal visible={showFolderModal} />
      <DatePicker
        calendarVisible={calendarVisible}
        setCalendarVisible={() => setReminderModalVisible(true)}
        onClose={() => setCalendarVisible(false)}
      />
      <CustomTimePicker
        visible={reminderModalVisible}
        initialHour="1"
        initialMinute="00"
        initialPeriod="AM"
        onCancel={handleTimeCancel}
        onConfirm={handleTimeConfirm}
        isLoading={isLoading}
      />
      <SuccessModal visible={successVisible} />
    </SafeAreaView>
  );
};

export default SaveOutfitScreen;
