// // import React from "react";
// // import { View, Text, Pressable, ScrollView, StatusBar } from "react-native";
// // import {
// //   ArrowLeft,
// //   UserRound,
// //   SquarePen,
// //   LockKeyhole,
// //   Languages,
// //   ChevronRight,
// // } from "lucide-react-native";
// // import { SafeAreaView } from "react-native-safe-area-context";
// // import { responsiveWidth } from "react-native-responsive-dimensions";
// // import { useNavigation } from "@react-navigation/native";

// // const MenuItem = ({ icon: Icon, title, onPress }) => (
// //   <Pressable
// //     onPress={onPress}
// //     className="flex-row items-center justify-between px-5 py-4 "
// //     activeOpacity={0.7}
// //   >
// //     <View className="flex-row items-center gap-4 flex-1">
// //       <Icon
// //         size={20}
// //         strokeWidth={1.5}
// //         className="text-textPrimary font-Medium text-lg"
// //       />
// //       <Text className="text-base text-black font-Medium">{title}</Text>
// //     </View>
// //     <ChevronRight size={18} strokeWidth={1.5} className="text-gray-400" />
// //   </Pressable>
// // );

// // const AccountPrivacyScreen = () => {
// //   const handleGoBack = () => {
// //     if (navigation) navigation.goBack();
// //     else console.log("Go back pressed");
// //   };
// //   const navigation = useNavigation();
// //   return (
// //     <SafeAreaView className="flex-1 bg-white">
// //       {/* Header */}
// //       <View className="flex-row items-center  p-5 ">
// //         <Pressable
// //           onPress={handleGoBack}
// //           className="w-10 h-10 items-center justify-center -ml-2"
// //           activeOpacity={0.7}
// //         >
// //           <ArrowLeft size={20} strokeWidth={2} />
// //         </Pressable>
// //         <Text className="flex-1 text-center text-xl font-SemiBold text-textPrimary">
// //           Privacy & Settings
// //         </Text>
// //         <View
// //           style={{
// //             width: responsiveWidth(10),
// //           }}
// //         />
// //       </View>

// //       <ScrollView
// //         className="flex-1"
// //         showsVerticalScrollIndicator={false}
// //         // contentContainerStyle={{ paddingTop: 20 }}
// //       >
// //         <View className="bg-white">
// //           <MenuItem
// //             icon={UserRound}
// //             title="Personal Information"
// //             onPress={() => navigation.navigate('AccountPrivacyPersonal')}
// //           />
// //           <MenuItem
// //             icon={SquarePen}
// //             title="Edit profile"
// //             onPress={() => navigation.navigate('AccountPrivacyEdit')}
// //           />
// //           <MenuItem
// //             icon={LockKeyhole}
// //             title="Password & Privacy"
// //             onPress={() => navigation.navigate('AccountPrivacyPassword')}
// //           />
// //           <MenuItem
// //             icon={Languages}
// //             title="Language"
// //             onPress={() => navigation.navigate('AccountPrivacyLanguage')}
// //           />
// //         </View>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // };

// // export default AccountPrivacyScreen;

// import React from "react";
// import { View, Text, Pressable, ScrollView } from "react-native";
// import {
//   ArrowLeft,
//   UserRound,
//   SquarePen,
//   LockKeyhole,
//   Languages,
//   ChevronRight,
// } from "lucide-react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { responsiveWidth } from "react-native-responsive-dimensions";
// import { useNavigation } from "@react-navigation/native";
// import i18n from "../../../utils/languageSetup"; // import i18n

// const MenuItem = ({ icon: Icon, title, onPress }) => (
//   <Pressable
//     onPress={onPress}
//     className="flex-row items-center justify-between px-5 py-4"
//     activeOpacity={0.7}
//   >
//     <View className="flex-row items-center gap-4 flex-1">
//       <Icon size={20} strokeWidth={1.5} />
//       <Text className="text-base text-black font-Medium">{title}</Text>
//     </View>
//     <ChevronRight size={18} strokeWidth={1.5} className="text-gray-400" />
//   </Pressable>
// );

// const AccountPrivacyScreen = () => {
//   const navigation = useNavigation();

//   const handleGoBack = () => {
//     if (navigation) navigation.goBack();
//     else console.log("Go back pressed");
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
//           {i18n.t("accountPrivacy.title")}
//         </Text>
//         <View style={{ width: responsiveWidth(10) }} />
//       </View>

//       <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
//         <View className="bg-white">
//           <MenuItem
//             icon={UserRound}
//             title={i18n.t("accountPrivacy.personalInfo")}
//             onPress={() => navigation.navigate("AccountPrivacyPersonal")}
//           />
//           <MenuItem
//             icon={SquarePen}
//             title={i18n.t("accountPrivacy.editProfile")}
//             onPress={() => navigation.navigate("AccountPrivacyEdit")}
//           />
//           <MenuItem
//             icon={LockKeyhole}
//             title={i18n.t("accountPrivacy.passwordPrivacy")}
//             onPress={() => navigation.navigate("AccountPrivacyPassword")}
//           />
//           {/* <MenuItem
//             icon={Languages}
//             title={i18n.t("accountPrivacy.language")}
//             onPress={() => navigation.navigate("AccountPrivacyLanguage")}
//           /> */}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default AccountPrivacyScreen;

import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import {
  ArrowLeft,
  UserRound,
  SquarePen,
  LockKeyhole,
  Languages,
  ChevronRight,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import i18n from "../../../utils/languageSetup";
import { useTheme } from "../../../utils/ThemeContext";

const MenuItem = ({ icon: Icon, title, onPress, isDarkMode }) => (
  <Pressable
    onPress={onPress}
    className={`flex-row items-center justify-between px-5 py-4`}
    style={{
      // backgroundColor: isDarkMode ? "#2D2633" : "#fff",
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "rgba(139, 84, 254, 0.1)" : "#F0F0F0",
    }}
    activeOpacity={0.7}
  >
    <View className="flex-row items-center gap-4 flex-1">
      <Icon
        size={20}
        strokeWidth={1.5}
        color={isDarkMode ? "#8E54FE" : "#08002B"}
      />
      <Text
        className={`text-base font-Medium ${
          isDarkMode ? "text-darkTextPrimary" : "text-black"
        }`}
      >
        {title}
      </Text>
    </View>
    <ChevronRight
      size={18}
      strokeWidth={1.5}
      color={isDarkMode ? "rgba(181, 168, 204, 0.5)" : "#ccc"}
    />
  </Pressable>
);

const AccountPrivacyScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();

  const handleGoBack = () => {
    if (navigation) navigation.goBack();
    else console.log("Go back pressed");
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-darkSurfacePrimary/90" : "bg-white"}`}
    >
      {/* Header */}
      <View className={`flex-row items-center p-5 `}>
        <Pressable
          onPress={handleGoBack}
          className="w-10 h-10 items-center justify-center -ml-2"
          activeOpacity={0.7}
        >
          <ArrowLeft
            size={20}
            strokeWidth={2}
            color={isDarkMode ? "#F5F4F7" : "#000"}
          />
        </Pressable>
        <Text
          className={`flex-1 text-center text-xl font-SemiBold ${
            isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"
          }`}
        >
          {i18n.t("accountPrivacy.title")}
        </Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      <ScrollView className={`flex-1`} showsVerticalScrollIndicator={false}>
        <View>
          <MenuItem
            icon={UserRound}
            title={i18n.t("accountPrivacy.personalInfo")}
            onPress={() => navigation.navigate("AccountPrivacyPersonal")}
            isDarkMode={isDarkMode}
          />
          <MenuItem
            icon={SquarePen}
            title={i18n.t("accountPrivacy.editProfile")}
            onPress={() => navigation.navigate("AccountPrivacyEdit")}
            isDarkMode={isDarkMode}
          />
          <MenuItem
            icon={LockKeyhole}
            title={i18n.t("accountPrivacy.passwordPrivacy")}
            onPress={() => navigation.navigate("AccountPrivacyPassword")}
            isDarkMode={isDarkMode}
          />
          {/* <MenuItem
            icon={Languages}
            title={i18n.t("accountPrivacy.language")}
            onPress={() => navigation.navigate("AccountPrivacyLanguage")}
            isDarkMode={isDarkMode}
          /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountPrivacyScreen;
