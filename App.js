import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import AuthScreen from './src/screens/AuthScreen';
import AppNavigation from './src/navigation/AppNavigation';

export default function App() {
  return <AppNavigation/>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
