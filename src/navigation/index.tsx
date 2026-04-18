import {
  DefaultTheme,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { RootStackParamList, Screens } from './types';
import { colors } from '@/theme';
import HomeScreen from '@/screens/home';
import StoryDetailScreen from '@/screens/storyDetail';
import { AppText } from '@/components/appText';
import { Pressable } from 'react-native';
import BookmarksScreen from '@/screens/bookmarks';

const Stack = createNativeStackNavigator<RootStackParamList>();

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
const BookmarkHeader = () => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate(Screens.bookmarks);
  };
  return (
    <Pressable onPress={handlePress}>
      <AppText style={{ color: colors.accent }}>Bookmarks</AppText>
    </Pressable>
  );
};

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
          options={{
            headerTitle: 'Home',
            headerRight: () => <BookmarkHeader />,
          }}
          component={HomeScreen}
        />
        <Stack.Screen
          name={Screens.storyDetails}
          component={StoryDetailScreen}
          options={{
            title: 'Story Details',
          }}
        />
        <Stack.Screen
          name={Screens.bookmarks}
          component={BookmarksScreen}
          options={{
            title: 'Bookmarks',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
