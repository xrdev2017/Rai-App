import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateLookbookEditScreen from "./CreateLookbookEditScreen";
import CreateLookbookEditDetailScreen from "./CreateLookbookEditDetailScreen";

const Stack = createNativeStackNavigator();
const CreateLookbookEditStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="CreateLookbookEditDetail"
    >
      <Stack.Screen
        name="CreateLookbookEditDetail"
        component={CreateLookbookEditDetailScreen}
      />
      <Stack.Screen
        name="CreateLookbookEdit"
        component={CreateLookbookEditScreen}
      />
    </Stack.Navigator>
  );
};

export default CreateLookbookEditStack;
