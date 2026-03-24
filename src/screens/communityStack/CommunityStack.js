import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyCommunityScreen from "./MyCommunityScreen";
import CommunityProfileScreen from "./CommunityProfileScreen";

const Stack = createNativeStackNavigator();
const CommunityStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyCommunity" component={MyCommunityScreen} />
      <Stack.Screen
        name="CommunityProfile"
        component={CommunityProfileScreen}
      />
    </Stack.Navigator>
  );
};

export default CommunityStack;
