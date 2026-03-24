import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountPrivacyPasswordScreen from "./AccountPrivacyPasswordScreen";
import AccountPrivacyPasswordNewPasswordScreen from "./AccountPrivacyPasswordNewPasswordScreen";
import AccountPrivacyPasswordPrivacySetupScreen from "./AccountPrivacyPasswordPrivacySetupScreen";
import AccountPrivacyPasswordBlockedScreen from "./AccountPrivacyPasswordBlockedScreen";

const Stack = createNativeStackNavigator();
const AccountPrivacyPasswordStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="AccountPrivacy"
    >
      <Stack.Screen
        name="AccountPrivacy"
        component={AccountPrivacyPasswordScreen}
      />
      <Stack.Screen
        name="AccountPrivacyPasswordNewPassword"
        component={AccountPrivacyPasswordNewPasswordScreen}
      />
      <Stack.Screen
        name="AccountPrivacyPasswordPrivacySetup"
        component={AccountPrivacyPasswordPrivacySetupScreen}
      />
      <Stack.Screen
        name="AccountPrivacyPasswordBlocked"
        component={AccountPrivacyPasswordBlockedScreen}
      />
      {/* <Stack.Screen
        name="AccountPrivacyLanguage"
        component={AccountPrivacyLanguageScreen}
      /> */}
    </Stack.Navigator>
  );
};

export default AccountPrivacyPasswordStack;
