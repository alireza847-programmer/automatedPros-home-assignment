import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Router from '@/navigation';
import QueryProvider from '@/providers/queryProvider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <QueryProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <Router />
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
