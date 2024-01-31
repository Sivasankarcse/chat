import { View, Text, TextInput, ActivityIndicator } from 'react-native'
import React, { FC, useCallback, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import UserTileComponent from '../components/UserTileComponent';
import debounce from 'lodash/debounce';
import { DM_DOMAIN } from '@env';
import axios from 'axios';
import Header from '../components/Header'

type SearchScreenProps = NativeStackScreenProps<RootStackParamList, "Search">

const SearchScreen: FC<SearchScreenProps> = (props) => {

    const [userName,setUsername] = useState("");
    const [searchUserExist, setSearchUserExist] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const checkUserExist = async(val) => {
        await axios
            .post(`http://${DM_DOMAIN}:5280/api/check_account`, val, {
                headers: {},
            })
            .then((res) => {
                console.log("response2", res.data);
                if(res.data === 0){
                    // show searched existing user in our window list if he available
                    setSearchUserExist(true);
                }else{
                    setSearchUserExist(false);
                }
            })
            .catch((err) => {
                console.log("xmpp check account err", err)
                err.response.status == 409;
            })
        setIsLoading(false);
    }

    const searchValueHandler = useCallback(debounce((searchUser: string) => {
        const params = {
            "user": searchUser,
            "host": DM_DOMAIN
        }
        setUsername(searchUser)
        checkUserExist(params)
    }, 2000), [])

    const searchValue = (text: string) => {
        setIsLoading(true)
        searchValueHandler(text);
    }

    return (
        <View
        // style={{marginTop: 35}}
        >
            <Header
                title="Search"
                backAction={() => props.navigation.goBack()}
                isLeftComponent={true}
            />
                <View style={{padding: 10, justifyContent: 'center', alignItems: 'center'}}>
                <TextInput
                    style={{
                        height: 40,
                        width: "100%",
                        borderWidth: 0.5,
                        borderColor: 'gray',
                        borderRadius: 10,
                        paddingHorizontal: 10
                    }}
                    placeholder='Search'
                    onChangeText={(text) => searchValue(text)}
                />
                </View>
                {isLoading ?
                    <View style={{height: '80%', justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator animating={isLoading} color="red" size={50} />
                    </View>
                :
                <View>
                    {searchUserExist ?
                        <View style={{margin: 10, justifyContent: 'center', alignItems: 'center'}}>
                            <UserTileComponent searchUserName={userName} navigateScreen={() => props.navigation.push("ChatWindow", {
                                recepientId: userName,
                                recepientName: userName,
                                recepientImage: "",
                                newUser: true,
                            })}/>
                        </View> :
                        <View style={{height: '80%', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{textAlign: 'center'}}>Search User Not Registered</Text>
                        </View>
                    }
                </View>
                }
            </View>
    )
}

export default SearchScreen