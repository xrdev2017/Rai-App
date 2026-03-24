import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../screens/OnboardingScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import VerifyCodeScreen from "../screens/auth/VerifyCodeScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";
import ResetPasswordSuccessScreen from "../screens/auth/ResetPasswordSuccessScreen";
import SetProfileScreen from "../screens/auth/SetProfileScreen";

import AddItemScreen from "../create/AddItemScreen";
import BottomNavigatorScreen from "../screens/bottomNavigator/BottomNavigatorScreen";
import CreateLookbookScreen from "../create/CreateLookbookScreen";
import AddItemEditScreen from "../editCard/AddItemEditScreen";
import CreateLookbookEditScreen from "../editCard/CreateLookbookEditScreen";
import CreateOutfitEditScreen from "../editCard/CreateOutfitEditScreen";
import CreateLookbookEditStack from "../editCard/CreateLookbookEditStack";
import NotificationScreen from "../screens/NotificationScreen";
import CommunityStack from "../screens/communityStack/CommunityStack";
import WishlistStack from "../screens/wishlistStack/WishlistStack";
import DressMeStack from "../screens/dressMeStack/DressMeStack";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import CreateOutfitStack from "../create/createOutfitStack/CreateOutfitStack";
import AccountStack from "../screens/bottomNavigator/accountStack/AcountStack";
import { useSelector } from "react-redux";
import PlannerEditScreen from "../screens/bottomNavigator/PlannerEditScreen";
const Stack = createNativeStackNavigator();
const AppNavigator = () => {
  const token = useSelector((state) => state.auth.token);
  const hasSeenOnboarding = useSelector(
    (state) => state.auth.hasSeenOnboarding
  );
  // console.log("LINE AT 32", token);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token === null ? (
        <>
          {!hasSeenOnboarding && (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          )}

          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="SetProfile" component={SetProfileScreen} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="BottomNavigator"
            component={BottomNavigatorScreen}
          />

          <Stack.Screen
            name="ResetPasswordSuccess"
            component={ResetPasswordSuccessScreen}
          />

          {/* add items */}
          <Stack.Screen name="AddItem" component={AddItemScreen} />
          <Stack.Screen
            name="CreateLookbook"
            component={CreateLookbookScreen}
          />
          <Stack.Screen
            name="CreateOutfitStack"
            component={CreateOutfitStack}
          />

          {/* edit items */}
          <Stack.Screen name="AddItemEdit" component={AddItemEditScreen} />
          <Stack.Screen
            name="CreateOutfitEdit"
            component={CreateOutfitEditScreen}
          />
          <Stack.Screen
            name="CreateLookbookEditStack"
            component={CreateLookbookEditStack}
          />

          <Stack.Screen name="PlannerEdit" component={PlannerEditScreen} />

          {/* notifiation */}
          <Stack.Screen name="Notification" component={NotificationScreen} />

          {/*community*/}
          <Stack.Screen name="CommunityStack" component={CommunityStack} />

          {/*Wishlist*/}
          <Stack.Screen name="WishlistStack" component={WishlistStack} />

          {/*Wishlist*/}
          <Stack.Screen name="DressMeStack" component={DressMeStack} />

          {/* analytics */}
          <Stack.Screen name="Analytics" component={AnalyticsScreen} />

          {/* account stack */}
          <Stack.Screen name="AccountStack" component={AccountStack} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
