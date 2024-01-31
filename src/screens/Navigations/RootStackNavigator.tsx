import { View, Text } from 'react-native'
import React from 'react'
import AuthStackNavigator from './AuthStackNavigator'
import { NavigationContainer } from '@react-navigation/native'
import { useSelector } from 'react-redux';
import MainStackNavigator from './MainStackNavigator';
import isEmpty from 'lodash/isEmpty';

const RootStackNavigator = () => {
    const jid = useSelector(state => state['chatData'].jid);
    console.log("rootNavigation", jid)

    return (
        <NavigationContainer>
            {isEmpty(jid) ? <AuthStackNavigator /> : <MainStackNavigator />}
        </NavigationContainer>
    )
}

export default RootStackNavigator