import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Router from '@/navigation';
import QueryProvider from '@/providers/queryProvider';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Router />
      </QueryProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});

export default App;
