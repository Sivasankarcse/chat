import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RootStackNavigator from './src/screens/Navigations/RootStackNavigator';
import { Provider } from 'react-redux';
import { persistor, store } from './src/redux/store'
import { PersistGate } from 'redux-persist/integration/react';
import DmContextProvider from './src/context/DmContext';

export default function App() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <DmContextProvider>
            <RootStackNavigator />
          </DmContextProvider>
        </PersistGate>
      </Provider>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
