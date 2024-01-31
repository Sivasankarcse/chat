import { View, Text, ActivityIndicator, FlatList } from 'react-native'
import React, { FC, useContext, useEffect, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Header from '../components/Header'
import { destroyAuthData } from '../redux/action';
import { DmContext } from '../context/DmContext';
import isEmpty from 'lodash/isEmpty';
import { useSelector } from 'react-redux';
import UserTileComponent from '../components/UserTileComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">

const HomeScreen: FC<HomeScreenProps> = (props) => {
    const {xmppInstance: xmpp} = useContext(DmContext);
    const contactList = useSelector(state => state["chatData"].contactList)
    const jid = useSelector(state => state?.['chatData']?.jid) || ""
    const [isLoading, setIsLoading] = useState(false);

    const logout = async() => {
        xmpp.stop()
        try{
            // await AsyncStorage.clear();
            await destroyAuthData();
            props.navigation.navigate("Login");
        }catch(err){
            console.log("aysnstorage err", err)
        }
    }

    const renderItem = (item) => {
        return (
            <UserTileComponent 
                searchUserName={item?.item?.nick} 
                navigateScreen={() => props?.navigation.push("ChatWindow", {
                    recepientId: item?.item?.jid,
                    recepientName: item?.item?.nick,
                    recepientImage: "",
                    newUser: false
                })}
            />
        )
    }
    return (
        <View>
            <Header
                title={"Home"}
                isLeftComponent={true}
                isRightCompoenent={true}
                isIconOne={false}
                isIconTwo={true}
                isIconThree={true}
                // iconOneAction={() => props.navigation.navigate("ChatUsers")}
                iconTwoAction={() => props.navigation.navigate("Search")}
                iconThreeAction={logout}
            />
            {isLoading &&
                <View style={{height: '80%', justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator animating={isLoading} color="red" size={50} />
                </View>
            }
            {isEmpty(contactList) &&
                <View style={{height: '80%', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{textAlign: 'center'}}>User Not Found.</Text>
                </View>
            }
            <View style={{margin: 10, justifyContent: 'center', alignItems: 'center'}}>
                <FlatList
                    data={contactList}
                    renderItem={renderItem}
                    keyExtractor={(item) => item?.jid}
                />
            </View>
        </View>
    )
}

export default HomeScreen