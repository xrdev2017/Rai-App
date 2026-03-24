import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountPrivacyPersonalScreen from "./AccountPrivacyPersonalScreen";
import AccountPrivacyEditScreen from "./AccountPrivacyEditScreen";
import AccountPrivacyPasswordScreen from "./AccountPrivacyPasswordScreen";
import AccountPrivacyLanguageScreen from "./AccountPrivacyLanguageScreen";
import AccountPrivacyScreen from "./AccountPrivacyScreen";
import AccountPrivacyPasswordStack from "./AccountPrivacyPasswordStack";

const Stack = createNativeStackNavigator();
const AccountPrivacyStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="AccountPrivacy"
    >
      <Stack.Screen name="AccountPrivacy" component={AccountPrivacyScreen} />
      <Stack.Screen
        name="AccountPrivacyPersonal"
        component={AccountPrivacyPersonalScreen}
      />
      <Stack.Screen
        name="AccountPrivacyEdit"
        component={AccountPrivacyEditScreen}
      />
      <Stack.Screen
        name="AccountPrivacyPassword"
        component={AccountPrivacyPasswordStack}
      />
      <Stack.Screen
        name="AccountPrivacyLanguage"
        component={AccountPrivacyLanguageScreen}
      />
    </Stack.Navigator>
  );
};

export default AccountPrivacyStack;
