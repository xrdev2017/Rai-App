import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WishlistScreen from "./WishlistScreen";
import CreateNewWishlistScreen from "./CreateNewWishlistScreen";
import AddExistingWishlistScreen from "./AddExistingWishlistScreen";
import WishlistFolderScreen from "./WishlistFolderScreen";

const Stack = createNativeStackNavigator();
const WishlistStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="CreateNewWishlist" component={CreateNewWishlistScreen} />
      <Stack.Screen name="AddExistingWishlist" component={AddExistingWishlistScreen} />
      <Stack.Screen name="WishlistFolder" component={WishlistFolderScreen} />
    </Stack.Navigator>
  );
};

export default WishlistStack;
