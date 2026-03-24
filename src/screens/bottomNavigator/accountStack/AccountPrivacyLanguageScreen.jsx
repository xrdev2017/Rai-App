// import { useNavigation } from "@react-navigation/native";
// import { ArrowLeft } from "lucide-react-native";
// import React, { useState } from "react";
// import { View, Text, Pressable, StatusBar, ScrollView } from "react-native";
// import { responsiveWidth } from "react-native-responsive-dimensions";
// import { SafeAreaView } from "react-native-safe-area-context";

// const AccountPrivacyLanguageScreen = () => {
//   const [selectedLanguage, setSelectedLanguage] = useState("English");
//   const navigation = useNavigation();
//   const languages = [
//     { id: 1, name: "English" },
//     { id: 2, name: "Russian" },
//   ];

//   const handleBack = () => {
//     console.log("Back button pressed");
//   };

//   const handleLanguageSelect = (language) => {
//     setSelectedLanguage(language);
//     console.log("Selected language:", language);
//   };

//   const handleGoBack = () => {
//     if (navigation) navigation.goBack();
//     else console.log("Go back pressed");
//   };
//   return (
//     <SafeAreaView
//       className="flex-1 bg-white"
//       style={{
//         padding: responsiveWidth(5),
//       }}
//     >
//       {/* <StatusBar barStyle="dark-content" backgroundColor="#ffffff" /> */}

//       {/* Header */}
//       <View className="flex-row items-center  ">
//         <Pressable
//           onPress={handleGoBack}
//           className="w-10 h-10 items-center justify-center -ml-2"
//           activeOpacity={0.7}
//         >
//           <ArrowLeft size={20} strokeWidth={2} />
//         </Pressable>
//         <Text className="flex-1 text-center text-xl font-SemiBold text-textPrimary">
//           Language
//         </Text>
//         <View
//           style={{
//             width: responsiveWidth(10),
//           }}
//         />
//       </View>
//       {/* Content */}
//       <ScrollView className="flex-1 " showsVerticalScrollIndicator={false}>
//         <Text className="text-[16px] text-textPrimary mt-6 mb-6 font-SemiBold">
//           Select your desire language
//         </Text>

//         <View className="gap-[1px]">
//           {languages.map((language) => {
//             const isSelected = selectedLanguage === language.name;
//             return (
//               <Pressable
//                 key={language.id}
//                 className={`px-4 py-4 rounded-md ${
//                   isSelected ? "bg-gray-100" : "bg-white"
//                 }`}
//                 onPress={() => handleLanguageSelect(language.name)}
//               >
//                 <Text className={`text-base text-textPrimary font-Medium `}>
//                   {language.name}
//                 </Text>
//               </Pressable>
//             );
//           })}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default AccountPrivacyLanguageScreen;


import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from "../../../utils/languageSetup"; // adjust path
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../../utils/ThemeContext";

const AccountPrivacyLanguageScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const languages = [
    { id: "en", name: "English" },
    { id: "ru", name: "Русский" },
  ];

  useEffect(() => {
    const loadLang = async () => {
      const savedLang = await AsyncStorage.getItem("appLanguage");
      if (savedLang) {
        i18n.changeLanguage(savedLang);
        setSelectedLanguage(savedLang);
      }
    };
    loadLang();
  }, []);

  const handleLanguageSelect = async (langCode) => {
    try {
      setSelectedLanguage(langCode);
      i18n.changeLanguage(langCode);
      await AsyncStorage.setItem("appLanguage", langCode);
      console.log("Language switched to:", langCode);
    } catch (e) {
      console.error("Error switching language:", e);
    }
  };

  const handleGoBack = () => navigation.goBack();

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-darkSurfacePrimary" : "bg-white"}`}
      style={{ padding: responsiveWidth(5) }}
    >
      {/* Header */}
      <View className="flex-row items-center">
        <Pressable
          onPress={handleGoBack}
          className="w-10 h-10 items-center justify-center -ml-2"
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} strokeWidth={2} color={isDarkMode ? "#F5F4F7" : "#08002B"} />
        </Pressable>
        <Text className={`flex-1 text-center text-xl font-SemiBold ${isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"}`}>
          {i18n.t("language.title")}
        </Text>
        <View style={{ width: responsiveWidth(10) }} />
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <Text className={`text-[16px] mt-6 mb-6 font-SemiBold ${isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"}`}>
          {i18n.t("language.selectPrompt")}
        </Text>

        <View className="gap-[1px]">
          {languages.map((language) => {
            const isSelected = selectedLanguage === language.id;
            return (
              <Pressable
                key={language.id}
                className={`px-4 py-4 rounded-md ${
                  isSelected ? (isDarkMode ? "bg-darkSurfaceSecondary" : "bg-gray-100") : (isDarkMode ? "bg-darkSurfacePrimary" : "bg-white")
                }`}
                onPress={() => handleLanguageSelect(language.id)}
              >
                <Text className={`text-base font-Medium ${isDarkMode ? "text-darkTextPrimary" : "text-textPrimary"}`}>
                  {language.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountPrivacyLanguageScreen;
