import { View, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateOutfitScreen from "./CreateOutfitScreen";
import SaveOutfitScreen from "./SaveOutfitScreen";
import SetOutfitScreen from "./SetOutfitScreen";
import AddExistingLookbookScreen from "./AddExistingLookbookScreen";
import CreateNewLookbookScreen from "./CreateNewLookbookScreen";



const Stack = createNativeStackNavigator();
const CreateOutfitStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="CreateOutfit">
      <Stack.Screen name="CreateOutfit" component={CreateOutfitScreen} />
      <Stack.Screen name="SaveOutfit" component={SaveOutfitScreen} />
      <Stack.Screen name="SetOutfit" component={SetOutfitScreen} />
      <Stack.Screen name="AddExistingLookbook" component={AddExistingLookbookScreen} />
      <Stack.Screen name="CreateNewLookbook" component={CreateNewLookbookScreen} />

    </Stack.Navigator>
  );
};

export default CreateOutfitStack;
