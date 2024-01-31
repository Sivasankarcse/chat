import { View, Text, TouchableWithoutFeedback, Keyboard, TextInput, TouchableOpacity, Dimensions, FlatList, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { FC, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Header from '../components/Header'
import { Feather } from '@expo/vector-icons';
import { DM_DOMAIN } from '@env';
import isEmpty from 'lodash/isEmpty';
import { xml } from '@xmpp/client';
import { DmContext } from '../context/DmContext';
import { saveChatInRedux, setEndReachedStatus, setHistoryDataRequested, setSendAndAcceptedContactList } from '../redux/action';
import axios from 'axios';
import { useSelector } from 'react-redux';
import * as chatServerApi from '../api/chatServerApi';

type chatType = {
    msg: string,
    to: string,
    timestamp: string,
    type: string,
}

type ChatHistoryType = {
    id: string,
    chat: chatType[]
}

type DmDataType = {
    chatData: {
        jid: ""
        chatHistory: ChatHistoryType[],
        contactList: [],
        isHistoryRequested: boolean,
        isEndReached: boolean,
    }
}

type ChatUserProps = {
    recepientId: string,
    recepientName: string,
    recepientImage: string,
    newUser: boolean
}

type ChatWindowProps = NativeStackScreenProps<RootStackParamList, "ChatWindow">

const ChatWindow: FC<ChatWindowProps> = (props) => {
    const { recepientId, recepientName, recepientImage, newUser }: ChatUserProps = props?.route?.params
    const [inputMsg, setInputMsg] = useState("");
    const scrollViewRef = useRef(null)
    const { xmppInstance: xmpp } = useContext(DmContext)
    const flatlistRef = useRef(null)
    const {
        jid,
        chatHistory = [],
        contactList,
        isHistoryRequested = false,
    } = useSelector((state:DmDataType) => state?.chatData) || {}

    const isEndReached = useSelector((state) => state?.chatData?.isEndReached);

    useEffect(() => {
        console.log("chathistory", chatHistory)
        const isChatHistoryEmpty = chatHistory.filter((thisUserChatHistory) => {
            return thisUserChatHistory.id == recepientName
        })

        console.log("im chathistory undfine", isChatHistoryEmpty)
        // scrollToBottom();

        return() => {
            setEndReachedStatus(false)
        }
    }, []);

    const thisUserChatHistory = chatHistory?.filter(item => item?.id === recepientName)
    const prevMsgTimestamp = thisUserChatHistory?.[0]?.chat?.[0].timestamp || ""
    
    const userChatHistory = !isEmpty(thisUserChatHistory?.[0]?.chat) ? [...thisUserChatHistory?.[0]?.chat]?.reverse() : []

    console.log("im rerender chatwindow prevMsgTimeSta", prevMsgTimestamp)

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: false })
        }
    }

    const handleContentSizeChange = () => {
        scrollToBottom();
    }

    const fetchMessages = async () => {
        console.log("prevMsgTimestamp", prevMsgTimestamp, isEndReached)
        if(!isEndReached) {
            setHistoryDataRequested(true)
            const fetchMsg = xml(
                "iq",
                {
                    type: "set",
                    id: Date.now().toString
                },
                xml(
                    "query",
                    {
                        xmlns: "urn:xmpp:mam:2",
                    },
                    xml(
                        "x",
                        {
                            xmlns: "urn:xmpp:mam:2",
                            type: "submit"
                        },
                        xml(
                            "field",
                            {
                                var: "FORM_TYPE",
                                type: "hidden", 
                            },
                            xml("value",{}, "urn:xmpp:mam:2")
                        ),
                        xml(
                            "field",
                            {
                                var: "with"
                            },
                            xml("value", {}, `${jid}@${DM_DOMAIN}`)
                        )
                    ),
                    xml(
                        "set",
                        { xmlns: "http://jabber.org/protocol/rsm" },
                        xml("max", {}, 20),
                        xml("before"),
                        // isEmpty(prevMsgTimestamp)
                        //     ? xml("before")
                        //     : xml("before", {}, prevMsgTimestamp)
                    ),
                    xml("flip-page")
                )
            )

            await xmpp.send(fetchMsg).catch((err:any) => {console.log("im fetchmsg catch err", err)});
        }
    }

    function getTime(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    // const addToContactList = async (senderId: string, receiverId: string) => {
    //     const data = {
    //         "localuser": senderId,
    //         "localhost": DM_DOMAIN,
    //         "user": receiverId,
    //         "host": DM_DOMAIN,
    //         "nick": receiverId,
    //         "group": "Friends",
    //         "subs": "both"
    //     }
    //     await axios.post(`http://${DM_DOMAIN}:5280/api/add_rosteritem`, data, {
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //     })
    //         .then(() => {
    //             setSendAndAcceptedContactList({
    //                 jid: `${receiverId}@${DM_DOMAIN}`,
    //                 nick: receiverId,
    //                 subscription: "both",
    //                 ask: "undefined",
    //                 group: "friends"
    //             })
    //         })
    //         .catch((err) => {
    //             console.log("addrosteritem err", err);
    //         })
    // }

    const sendMessage = async () => {
        console.log("DMMain", DM_DOMAIN);
        console.log("recipentName", recepientName)
        // Check inputMsg empty or not. Don't allow empty messages
        if (!isEmpty(inputMsg)) {
            // This is message stanza for send to ejabberd server.
            const msg = xml(
                "message",
                {
                    type: "chat",
                    to: `${recepientName}@${DM_DOMAIN}`,
                    id: Date.now().toString(),
                },
                xml("body", null, inputMsg)
            )

            // send stanza to server
            await xmpp.send(msg)
                .then(() => {
                    // store chat history to reducer
                    saveChatInRedux({
                        from: jid,
                        conv: {
                            msg: inputMsg,
                            to: recepientName,
                            type: "chat"
                        }
                    })
                    setInputMsg("")
                })
                .catch((err:any) => {
                    console.log("xmpp send msg err", err)
                })
        }
    }

    const renderItem = ({item, index}) => {
        return(
            <TouchableWithoutFeedback>
                <View style={{ marginTop: 6 }}>
                    <View
                        style={{
                            maxWidth: Dimensions.get('screen').width * 0.6,
                            backgroundColor: '#3a6ee8',
                            alignSelf:
                                item?.to === recepientName
                                    ? 'flex-end'
                                    : 'flex-start',
                            marginHorizontal: 10,
                            padding: 13,
                            borderRadius: 8,
                            borderBottomLeftRadius:
                                item?.to === recepientName ? 8 : 0,
                            borderBottomRightRadius:
                                item?.to === recepientName ? 0 : 8,
                        }}
                    >
                        <Text
                            style={{
                                color: '#fff',
                                fontSize: 16,
                            }}
                        >
                            {item?.msg}
                        </Text>
                        <Text
                            style={{
                                color: '#dfe4ea',
                                fontSize: 14,
                                alignSelf: 'flex-end',
                            }}
                        >
                            {item?.timestamp}
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    // const renderKeyExtractor = useCallback((item:any) => item?.timestamp, [])

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior='padding'
        >
            <Header
                title={recepientName}
                image={recepientImage}
                backAction={() => props.navigation.goBack()}
                isLeftComponent={true}
            />

            <View style={{ flex: 1, flexGrow: 1 }}>
                {!isEmpty(userChatHistory) ?
                    <FlatList
                        style={{ backgroundColor: '#f2f2ff' }}
                        ref={flatlistRef}
                        inverted={true}
                        data={userChatHistory}
                        overScrollMode="never"
                        // keyExtractor={renderKeyExtractor}
                        renderItem={renderItem}
                        onEndReachedThreshold={0.8}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    /> :
                    <View style={{ flex: 1, flexGrow: 1 }}>
                        <TouchableWithoutFeedback style={{
                            maxWidth: Dimensions.get('screen').width * 0.8,
                            backgroundColor: '#3a6ee8'
                        }}>
                            <Text style={{textAlign: 'center', marginTop: 20}}>No Messages</Text>
                        </TouchableWithoutFeedback>
                    </View>
}
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: '#fff',
                    borderRadius: 4,
                    width: "100%",
                    paddingVertical: 15,

                }} >
                    <TextInput
                        defaultValue={inputMsg}
                        onChangeText={(text) => setInputMsg(text)}
                        placeholder='Message'
                        style={{
                            height: 40,
                            flex: 1,
                            paddingHorizontal: 10,
                        }}
                    />
                    <TouchableOpacity
                        style={{
                            paddingHorizontal: 10,
                            justifyContent: 'center',
                        }}
                        onPress={() => {
                            sendMessage();
                        }}
                    >
                        <Feather name="send" size={24} color="green" />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default ChatWindow