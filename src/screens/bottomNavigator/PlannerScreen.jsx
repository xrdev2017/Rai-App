import {
  EllipsisVertical,
  Bell,
  Edit,
  Trash2,
  BellRing,
  UserCircle2,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  Modal,
  Animated,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomTimePicker from "./tabComponents/CustomTimePicker";
import { useNavigation } from "@react-navigation/native";
import { DropdownMenu, ShareSheet, Sidebar } from "./WardrobeScreen";
import DatePicker from "../../components/DatePicker";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../redux/slices/authSlice";
import { useFormContext } from "react-hook-form";
import { clearAuth } from "../../redux/reducers/authReducer";
import {
  useDeletePlannerMutation,
  useGetAllPlannerQuery,
  useUpdatePlannerMutation,
} from "../../redux/slices/planner/plannerSlice";
import { formatDate } from "../../utils/formatDate";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../utils/ThemeContext";

const PlannerScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [deleteConfirmModalVisible, setDeleteConfirmModalVisible] =
    useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const scaleAnimation = useState(new Animated.Value(0))[0];
  const navigation = useNavigation();
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [showShareModal, setShowShareModal] = useState(false);

  const ellipsisRef = useRef(null);

  const { handleSubmit, clearErrors, getValues, reset } = useFormContext();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const [deletePlanner, { isLoading: isDeleting }] = useDeletePlannerMutation();
  const [updatePlanner, { isLoading: isUpdating }] = useUpdatePlannerMutation();

  const {
    data: allPlanner,
    isLoading: allPlannerLoading,
    isError: allPlannerError,
    refetch: refetchPlanner,
  } = useGetAllPlannerQuery();

  const handleMenuPress = (outfit, event) => {
    event.target.measure((x, y, width, height, pageX, pageY) => {
      setMenuPosition({
        x: pageX - 150,
        y: pageY + height + 5,
      });
      setSelectedOutfit(outfit);
      setModalVisible(true);

      Animated.spring(scaleAnimation, {
        toValue: 1,
        tension: 180,
        friction: 8,
        useNativeDriver: true,
      }).start();
    });
  };

  const closeModal = () => {
    Animated.timing(scaleAnimation, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedOutfit(null);
    });
  };

  const handleReminder = () => {
    setModalVisible(false);
    setCalendarVisible(true);
  };

  const handleEdit = () => {
    // console.log("Edit clicked for: 108", selectedOutfit);
    setModalVisible(false);
    navigation.navigate("PlannerEdit", { selectedOutfit });
  };

  const handleDelete = () => {
    setModalVisible(false);
    setDeleteConfirmModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      if (!selectedOutfit?._id) {
        Alert.alert("Error", "No planner item selected for deletion");
        return;
      }

      const result = await deletePlanner(selectedOutfit._id).unwrap();

      if (result.success) {
        Alert.alert("Success", "Planner item deleted successfully");
        // Refresh the planner list
        refetchPlanner();
        reset({
          plannerDate: null,
          plannerTime: null,
        });
      } else {
        Alert.alert("Error", result.message || "Failed to delete planner item");
      }
    } catch (error) {
      console.error("Delete error:", error);
      Alert.alert(
        "Error",
        error?.data?.message ||
          "Failed to delete planner item. Please try again.",
      );
    } finally {
      setDeleteConfirmModalVisible(false);
      setSelectedOutfit(null);
    }
  };

  const { plannerDate, plannerTime } = getValues();

  const handleTimeConfirm = async () => {
    // console.log("LINE AT", plannerDate, plannerTime, selectedOutfit);

    try {
      if (!selectedOutfit?._id) {
        Alert.alert("Error", "No planner item selected for deletion");
        return;
      }

      const result = await updatePlanner({
        id: selectedOutfit._id,
        data: {
          date: plannerDate,
          time: plannerTime,
        },
      }).unwrap();

      // console.log("LINE AT 170", result);

      // if (result.success) {
      Alert.alert("Success", "Planner item updated successfully");
      // Refresh the planner list
      refetchPlanner();
      reset({
        plannerDate: null,
        plannerTime: null,
      });
    } catch (error) {
      // console.log("Delete error:", error);
      Alert.alert(
        "Error",
        error?.data?.message ||
          "Failed to update planner item. Please try again.",
      );
    } finally {
      setReminderModalVisible(false);
      setSelectedOutfit(null);
      setCalendarVisible(false);
    }
  };

  const handleTimeCancel = () => {
    setReminderModalVisible(false);
    setSelectedOutfit(null);
    setCalendarVisible(false);
  };

  const renderOutfitItem = ({ item }) => (
    <View
      className={`flex-row items-center px-4 py-8 ${
        isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"
      }`}
      style={{
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
        elevation: 4,
      }}
    >
      <View className="flex-row mr-4">
        <Image
          source={{ uri: item?.outfit?.image }}
          className="rounded-lg w-14 h-14 object-cover"
        />
      </View>
      <View className="flex-1">
        <Text
          className={`text-base font-Medium ${
            isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
          }`}
        >
          {item?.outfit?.title}
        </Text>
        <Text
          className={`text-xs mt-1 font-Regular ${
            isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
          }`}
        >
          {item.time}, {formatDate(item?.date)}
        </Text>
      </View>
      <Pressable
        className="p-2"
        onPress={(event) => handleMenuPress(item, event)}
      >
        <EllipsisVertical color="#81739A" />
      </Pressable>
    </View>
  );

  const handleEllipsisPress = () => {
    if (ellipsisRef.current) {
      ellipsisRef.current.measure((x, y, width, height, pageX, pageY) => {
        setDropdownPosition({ x: pageX, y: pageY + height });
        setShowDropdown(true);
      });
    }
  };

  const handleLogout = async (data) => {
    // console.log("Forgot Data:", data);
    clearErrors();

    try {
      const response = await logout().unwrap();
      dispatch(clearAuth());
      // console.log("✅ Signup Success:", response);

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (err) {
      // console.log("❌ Signup Error:", err);
      const errorMessage =
        err?.data?.message || err?.error || "Signup failed. Please try again.";
    }
  };
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  return (
    <SafeAreaView
      className={`flex-1 ${
        isDarkMode ? "bg-darkSurfacePrimary/90" : "bg-white"
      }`}
      style={{ paddingBottom: responsiveHeight(5) }}
    >
      {/* Header */}

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

      {/* Outfit List */}
      {allPlannerLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color="purple" size={20} />
        </View>
      ) : allPlannerError ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 font-Medium">
            Internal Server or Internet Issue!
          </Text>
        </View>
      ) : allPlanner && allPlanner.length > 0 ? (
        <FlatList
          data={allPlanner}
          renderItem={renderOutfitItem}
          keyExtractor={(item) => item?._id.toString()}
          className="flex-1"
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center gap-2">
          <Text
            className={`font-Medium text-[16px] text-center ${
              isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
            }`}
          >
            {t("plannerScreen.text1")}
          </Text>
          <Text
            className={`font-Regular text-[14px] text-center ${
              isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
            }`}
          >
            {t("plannerScreen.text2")}
          </Text>
        </View>
      )}

      {/* Floating Action Button */}
      <Pressable
        onPress={() => navigation.navigate("CreateOutfitStack")}
        className="absolute  w-14 h-14 rounded-full bg-violet-700 justify-center items-center shadow-md"
        style={{
          bottom: responsiveHeight(20),
          right: responsiveWidth(5),
        }}
      >
        <Text className="text-white text-6xl font-light">+</Text>
      </Pressable>

      {/* Context Menu Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
        statusBarTranslucent={true}
      >
        <Pressable activeOpacity={1} onPress={closeModal} style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
          >
            <Animated.View
              style={[
                {
                  position: "absolute",
                  left: menuPosition.x,
                  top: menuPosition.y,
                  minWidth: 160,
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 8,
                },
                {
                  transform: [{ scale: scaleAnimation }],
                },
              ]}
            >
              <Pressable activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                <Pressable
                  className="flex-row items-center px-4 py-3 border-b border-gray-100"
                  onPress={handleReminder}
                >
                  <BellRing size={18} color="#6B7280" />
                  <Text className="text-sm font-Medium text-gray-900 ml-3">
                    Reminder
                  </Text>
                </Pressable>

                <Pressable
                  className="flex-row items-center px-4 py-3 border-b border-gray-100"
                  onPress={handleEdit}
                >
                  <Edit size={18} color="#6B7280" />
                  <Text className="text-sm font-Medium text-gray-900 ml-3">
                    Edit
                  </Text>
                </Pressable>

                <Pressable
                  className="flex-row items-center px-4 py-3"
                  onPress={handleDelete}
                >
                  <Trash2 size={18} color="#EF4444" />
                  <Text className="text-sm font-Medium text-red-500 ml-3">
                    Delete
                  </Text>
                </Pressable>
              </Pressable>
            </Animated.View>
          </View>
        </Pressable>
      </Modal>

      {/* Custom Time Picker Modal for Reminder */}
      <CustomTimePicker
        visible={reminderModalVisible}
        initialTime={{
          hour: "1",
          minute: "00",
          period: "AM",
        }}
        onCancel={handleTimeCancel}
        onConfirm={handleTimeConfirm}
      />

      <DatePicker
        calendarVisible={calendarVisible}
        setCalendarVisible={() => {
          setReminderModalVisible(true);
        }}
        onClose={() => {
          setCalendarVisible(false);
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteConfirmModalVisible}
        onRequestClose={() => setDeleteConfirmModalVisible(false)}
        statusBarTranslucent={true}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setDeleteConfirmModalVisible(false)}
        >
          <Pressable
            className="bg-white rounded-3xl p-6 w-full max-w-xs items-center"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-lg font-SemiBold text-textPrimary text-center mb-6 leading-6">
              Are you sure, you want to delete?
            </Text>

            <Pressable
              className="bg-red-600 rounded-md py-3 w-full mb-3 items-center"
              onPress={confirmDelete}
              activeOpacity={0.8}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-lg font-SemiBold">
                  Yes, delete it
                </Text>
              )}
            </Pressable>

            <Pressable
              className="bg-gray-100 rounded-md py-3 w-full items-center"
              onPress={() => setDeleteConfirmModalVisible(false)}
              activeOpacity={0.8}
              disabled={isDeleting}
            >
              <Text className="text-textSecondary text-lg font-SemiBold">
                Cancel
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <DropdownMenu
        visible={showDropdown}
        onClose={() => setShowDropdown(false)}
        position={dropdownPosition}
      />
      <Sidebar
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        user={user}
        loggedout={handleSubmit(handleLogout)}
        setShowShareModal={setShowShareModal}
      />
      <ShareSheet
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </SafeAreaView>
  );
};

export default PlannerScreen;
