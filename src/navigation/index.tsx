import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, Screens } from './types';
import { colors } from '@/theme';
import HomeScreen from '@/screens/home';
import StoryDetailScreen from '@/screens/storyDetail';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Router = () => {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      card: colors.card,
      text: colors.textPrimary,
    },
  };
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator>
        <Stack.Screen
          name={Screens.home}
          options={{ headerTitle: 'Home' }}
          component={HomeScreen}
        />
        <Stack.Screen
          name={Screens.storyDetails}
          component={StoryDetailScreen}
          options={{
            title: 'Story Details',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
