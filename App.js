import ContactList from "./screens/ContactList";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="ContactList" component={ContactList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}