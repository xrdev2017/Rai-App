import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { ArrowLeft, Bell, Settings } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { useSocketNotifications } from "../utils/useSocketNotifications";
import { useSelector } from "react-redux";
import { useGetUserNotificationsQuery } from "../redux/slices/notification/notificationSlice";
import { useTranslation } from "react-i18next";

const NotificationsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const user = useSelector((state) => state.auth.user);

  const notificationsEnabled = useSelector(
    (state) => state.auth.notificationsEnabled
  );

  const { data: notificationsData = [], refetch } =
    useGetUserNotificationsQuery(undefined, {
      skip: !notificationsEnabled,
    });

  useSocketNotifications(notificationsEnabled, refetch);

  const getNotificationType = (notification) => {
    if (notification.post) return "user_upload";
    if (notification.adminMessage) return "brand";
    if (notification.planner) return "reminder";
    return "system";
  };

  const getNotificationTitle = (notification) => {
    const type = getNotificationType(notification);
    switch (type) {
      case "user_upload":
        return t("notifications.userUpload", {
          user: notification.post?.user?.name || t("notifications.someone"),
        });
      case "brand":
        return notification.adminMessage || t("notifications.brand");
      case "reminder":
        return t("notifications.reminder");
      case "system":
      default:
        return t("notifications.system");
    }
  };

  const getNotificationTime = (createdAt) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours}${t("notifications.hoursAgo")}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNotificationIcon = (notification) => {
    const type = getNotificationType(notification);
    const bgColor = type === "user_upload" ? "bg-red-100" : "bg-gray-100";

    switch (type) {
      case "user_upload":
        return (
          <View
            className={`w-12 h-12 ${bgColor} rounded-full items-center justify-center`}
          >
            <View className="w-8 h-8 bg-white rounded-full items-center justify-center">
              <View className="w-6 h-6 bg-gray-300 rounded-full" />
            </View>
          </View>
        );
      case "brand":
        return (
          <View
            className={`w-12 h-12 ${bgColor} rounded-full items-center justify-center`}
          >
            <Text className="text-xl font-bold text-gray-700">R</Text>
          </View>
        );
      case "reminder":
        return (
          <View
            className={`w-12 h-12 ${bgColor} rounded-full items-center justify-center`}
          >
            <Bell size={24} color="#666" />
          </View>
        );
      case "system":
        return (
          <View
            className={`w-12 h-12 ${bgColor} rounded-full items-center justify-center`}
          >
            <Settings size={24} color="#666" />
          </View>
        );
      default:
        return (
          <View
            className={`w-12 h-12 ${bgColor} rounded-full items-center justify-center`}
          >
            <View className="w-6 h-6 bg-gray-400 rounded-full" />
          </View>
        );
    }
  };

  return (
    <View
      className="flex-1 bg-white dark:bg-darkSurfacePrimary/90"
      style={{
        padding: responsiveWidth(5),
      }}
    >
      {/* Header */}
      <View className="flex-row items-center py-5">
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-10 h-10 justify-center items-center -ml-2"
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#5700FE" />
        </Pressable>
        <Text className="flex-1 text-center text-xl font-SemiBold text-textPrimary dark:text-darkTextPrimary">
          {t("notifications.title")}
        </Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      {/* Notifications List */}
      <ScrollView>
        {notificationsData.length > 0 ? (
          notificationsData.map((notification) => (
            <View key={notification._id} className="flex-row items-start py-4">
              {/* Icon */}
              <View className="mr-4">{getNotificationIcon(notification)}</View>

              {/* Content */}
              <View className="flex-1">
                <Text className="text-base text-textPrimary font-Medium mb-1">
                  {getNotificationTitle(notification)}
                </Text>
                <Text className="text-sm text-gray-500 font-Regular">
                  {getNotificationTime(notification.createdAt)}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View className="py-8 items-center">
            <Text className="text-gray-500 font-Regular">
              {t("notifications.noNotifications")}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationsScreen;
