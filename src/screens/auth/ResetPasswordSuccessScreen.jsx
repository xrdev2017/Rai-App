import { View, Text, StatusBar, Image, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { MoveLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const ResetPasswordSuccessScreen = () => {
    const navigation = useNavigation();
  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{
        paddingHorizontal: responsiveWidth(5),
        paddingTop: StatusBar.currentHeight || 0,
        paddingBottom: responsiveHeight(2),
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image source={require("../../../assets/images/tick.png")} />
      <View
        className="items-center "
        style={{ marginBottom: responsiveHeight(3) }}
      >
        <Text className="text-[24px] font-SemiBold text-textPrimary mb-2">
          Password Changed!
        </Text>
        <Text className="text-[14px] font-Regular text-textSecondary text-center">
          Return to the login page to enter your account with your new passwod
        </Text>
      </View>
      <Pressable
        onPress={() => navigation.navigate("Login")}
        className="bg-surfaceAction py-4 rounded-xl flex-row items-center justify-center w-full gap-3"
        style={{ marginBottom: responsiveHeight(3) }}
      >
        <MoveLeft size={20} color="#f4f4f4" />

        <Text className="text-[16px] text-textPrimaryInverted font-SemiBold">
          Back To Login
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ResetPasswordSuccessScreen;
