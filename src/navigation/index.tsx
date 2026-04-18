import { Text } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const Router = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={() => <Text>Hello</Text>} />
    </Stack.Navigator>
  );
};
export default Router;
