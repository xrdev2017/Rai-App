// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Pressable,
//   ScrollView,
//   Modal,
//   Image,
// } from "react-native";
// import {
//   ArrowLeft,
//   UserRound,
//   SquarePen,
//   LockKeyhole,
//   ChevronRight,
// } from "lucide-react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { responsiveWidth } from "react-native-responsive-dimensions";
// import { useNavigation } from "@react-navigation/native";
// import { useDeleteAccountMutation } from "../../../redux/slices/authSlice";
// import { useFormContext } from "react-hook-form";
// import { useTranslation } from "react-i18next";

// const MenuItem = ({ icon: Icon, title, onPress }) => (
//   <Pressable
//     onPress={onPress}
//     className="flex-row items-center justify-between px-5 py-4"
//     activeOpacity={0.7}
//   >
//     <View className="flex-row items-center gap-4 flex-1">
//       <Text className="text-base text-black font-Medium">{title}</Text>
//     </View>
//     <ChevronRight size={18} strokeWidth={1.5} className="text-gray-400" />
//   </Pressable>
// );

// const DeleteAccountModal = ({ visible, onCancel, onConfirm }) => {
//   const { t } = useTranslation();
//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       onRequestClose={onCancel}
//     >
//       <Pressable
//         className="flex-1 bg-black/50 justify-center items-center px-8"
//         activeOpacity={1}
//         onPress={onCancel}
//       >
//         <Pressable
//           className="bg-white rounded-3xl p-6 w-full max-w-sm"
//           activeOpacity={1}
//           onPress={() => {}}
//         >
//           {/* User Avatar */}
//           <View className="items-center mb-6">
//             <View className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-100">
//               <Image
//                 source={{
//                   uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
//                 }}
//                 className="w-full h-full"
//                 resizeMode="cover"
//               />
//             </View>
//           </View>

//           {/* Modal Description */}
//           <Text className="text-base font-Medium text-gray-600 text-center mb-8 leading-6">
//             {t("accountPrivacyPassword.deleteAccountModal.description")}
//           </Text>

//           {/* Action Buttons */}
//           <View className="gap-3">
//             <Pressable
//               className="bg-red-500 rounded-2xl py-4 items-center"
//               onPress={onConfirm}
//               activeOpacity={0.8}
//             >
//               <Text className="text-white text-lg font-SemiBold">
//                 {t("accountPrivacyPassword.deleteAccountModal.confirm")}
//               </Text>
//             </Pressable>

//             <Pressable
//               className="bg-gray-200 rounded-2xl py-4 items-center"
//               onPress={onCancel}
//               activeOpacity={0.8}
//             >
//               <Text className="text-black text-lg font-SemiBold">
//                 {t("accountPrivacyPassword.deleteAccountModal.cancel")}
//               </Text>
//             </Pressable>
//           </View>
//         </Pressable>
//       </Pressable>
//     </Modal>
//   );
// };

// const AccountPrivacyPasswordScreen = () => {
//   const { t } = useTranslation();
//   const [deleteAccount] = useDeleteAccountMutation();
//   const { handleSubmit } = useFormContext();
//   const navigation = useNavigation();

//   const [showModal, setShowModal] = useState(false);

//   const handleGoBack = () => navigation.goBack();
//   const handleDeletePress = () => setShowModal(true);
//   const handleDeleteCancel = () => setShowModal(false);

//   const handleDeleteConfirm = async () => {
//     try {
//       const response = await deleteAccount().unwrap();
//       console.log(response);
//       setShowModal(false);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       {/* Header */}
//       <View className="flex-row items-center p-5">
//         <Pressable
//           onPress={handleGoBack}
//           className="w-10 h-10 items-center justify-center -ml-2"
//           activeOpacity={0.7}
//         >
//           <ArrowLeft size={20} strokeWidth={2} />
//         </Pressable>
//         <Text className="flex-1 text-center text-xl font-SemiBold text-textPrimary">
//           {t("accountPrivacyPassword.title")}
//         </Text>
//         <View style={{ width: responsiveWidth(10) }} />
//       </View>

//       <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
//         <View className="bg-white">
//           <MenuItem
//             icon={UserRound}
//             title={t("accountPrivacyPassword.password")}
//             onPress={() =>
//               navigation.navigate("AccountPrivacyPasswordNewPassword")
//             }
//           />
//           <MenuItem
//             icon={SquarePen}
//             title={t("accountPrivacyPassword.privacy")}
//             onPress={() =>
//               navigation.navigate("AccountPrivacyPasswordPrivacySetup")
//             }
//           />
//           <MenuItem
//             icon={LockKeyhole}
//             title={t("accountPrivacyPassword.blockedProfile")}
//             onPress={() =>
//               navigation.navigate("AccountPrivacyPasswordBlocked")
//             }
//           />

//           <Pressable
//             onPress={handleDeletePress}
//             className="flex-row items-center justify-between px-5 py-4"
//             activeOpacity={0.7}
//           >
//             <View className="flex-row items-center gap-4 flex-1">
//               <Text className="text-base text-red-500 font-Medium">
//                 {t("accountPrivacyPassword.deleteAccount")}
//               </Text>
//             </View>
//             <ChevronRight size={18} strokeWidth={1.5} className="text-gray-400" />
//           </Pressable>
//         </View>

//         <DeleteAccountModal
//           visible={showModal}
//           onCancel={handleDeleteCancel}
//           onConfirm={handleSubmit(handleDeleteConfirm)}
//         />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default AccountPrivacyPasswordScreen;


import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import {
  ArrowLeft,
  UserRound,
  SquarePen,
  LockKeyhole,
  ChevronRight,
  UserCircle2Icon,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import { useDeleteAccountMutation } from "../../../redux/slices/authSlice";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../utils/ThemeContext";

const MenuItem = ({ icon: Icon, title, onPress, isDarkMode }) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center justify-between px-5 py-4"
    style={{
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "rgba(139,84,254,0.08)" : "#F0F0F0",
      backgroundColor: isDarkMode ? "transparent" : "#fff",
    }}
    activeOpacity={0.7}
  >
    <View className="flex-row items-center gap-4 flex-1">
      <Icon
        size={20}
        strokeWidth={1.5}
        color={isDarkMode ? "#8E54FE" : "#08002B"}
      />
      <Text className={`text-base font-Medium ${isDarkMode ? "text-darkTextPrimary" : "text-black"}`}>
        {title}
      </Text>
    </View>
    <ChevronRight
      size={18}
      strokeWidth={1.5}
      color={isDarkMode ? "rgba(181,168,204,0.6)" : "#ccc"}
    />
  </Pressable>
);

const DeleteAccountModal = ({ visible, onCancel, onConfirm }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}
        activeOpacity={1}
        onPress={onCancel}
      >
        <Pressable
          style={{
            width: "100%",
            maxWidth: 420,
            borderRadius: 24,
            padding: 20,
            backgroundColor: isDarkMode ? "#2D2633" : "#fff",
          }}
          activeOpacity={1}
          onPress={() => {}}
        >
          {/* User Avatar */}
          <View style={{ alignItems: "center", marginBottom: 18 }}>
            {/* <View style={{ width: 80, height: 80, borderRadius: 40, overflow: "hidden", borderWidth: 4, borderColor: isDarkMode ? "rgba(255,255,255,0.03)" : "#F3F3F3" }}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View> */}
            <UserCircle2Icon size={50} color={isDarkMode ? '#fff' : '#000'} />
          </View>

          {/* Modal Description */}
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: isDarkMode ? "#F5F4F7" : "#374151",
              textAlign: "center",
              marginBottom: 18,
              lineHeight: 22,
            }}
          >
            {t("accountPrivacyPassword.deleteAccountModal.description")}
          </Text>

          {/* Action Buttons */}
          <View style={{ gap: 12 }}>
            <Pressable
              style={{
                backgroundColor: "#ef4444",
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: "center",
              }}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                {t("accountPrivacyPassword.deleteAccountModal.confirm")}
              </Text>
            </Pressable>

            <Pressable
              style={{
                backgroundColor: isDarkMode ? "#3a3440" : "#E5E7EB",
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: "center",
              }}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={{ color: isDarkMode ? "#F5F4F7" : "#111827", fontSize: 16, fontWeight: "700" }}>
                {t("accountPrivacyPassword.deleteAccountModal.cancel")}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const AccountPrivacyPasswordScreen = () => {
  const { t } = useTranslation();
  const [deleteAccount] = useDeleteAccountMutation();
  const { handleSubmit } = useFormContext();
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();

  const [showModal, setShowModal] = useState(false);

  const handleGoBack = () => navigation.goBack();
  const handleDeletePress = () => setShowModal(true);
  const handleDeleteCancel = () => setShowModal(false);

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteAccount().unwrap();
      console.log(response);
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? "#1A1820" : "#fff" }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, backgroundColor: isDarkMode ? "#1A1820" : "#fff" }}>
        <Pressable
          onPress={handleGoBack}
          style={{ width: 40, height: 40, justifyContent: "center", alignItems: "center", marginLeft: -6 }}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} strokeWidth={2} color={isDarkMode ? "#F5F4F7" : "#000"} />
        </Pressable>
        <Text style={{ flex: 1, textAlign: "center", fontSize: 20, fontWeight: "600", color: isDarkMode ? "#F5F4F7" : "#08002B" }}>
          {t("accountPrivacyPassword.title")}
        </Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: isDarkMode ? "#1A1820" : "#fff" }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: isDarkMode ? "#1A1820" : "#fff" }}>
          <MenuItem
            icon={UserRound}
            title={t("accountPrivacyPassword.password")}
            onPress={() => navigation.navigate("AccountPrivacyPasswordNewPassword")}
            isDarkMode={isDarkMode}
          />
          <MenuItem
            icon={SquarePen}
            title={t("accountPrivacyPassword.privacy")}
            onPress={() => navigation.navigate("AccountPrivacyPasswordPrivacySetup")}
            isDarkMode={isDarkMode}
          />
          <MenuItem
            icon={LockKeyhole}
            title={t("accountPrivacyPassword.blockedProfile")}
            onPress={() => navigation.navigate("AccountPrivacyPasswordBlocked")}
            isDarkMode={isDarkMode}
          />

          <Pressable
            onPress={handleDeletePress}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingVertical: 16,
            }}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
              <Text style={{ fontSize: 16, color: "#ef4444", fontWeight: "600" }}>
                {t("accountPrivacyPassword.deleteAccount")}
              </Text>
            </View>
            <ChevronRight size={18} strokeWidth={1.5} color={isDarkMode ? "rgba(181,168,204,0.6)" : "#ccc"} />
          </Pressable>
        </View>

        <DeleteAccountModal
          visible={showModal}
          onCancel={handleDeleteCancel}
          onConfirm={handleSubmit(handleDeleteConfirm)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountPrivacyPasswordScreen;