import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../HomeScreen';
import SearchScreen from '../SearchScreen';
import ChatWindow from '../ChatWindow';
import LoginScreen from '../Auth/LoginScreen';

const Stack = createNativeStackNavigator()

const MainStackNavigator = () => {
    console.log("MainNaviation")
    
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="ChatWindow" component={ChatWindow} />
            <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
    )
}

export default MainStackNavigator