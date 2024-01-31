import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, current } from '@reduxjs/toolkit';

const initialState = {
    jid: "",
    password: "",
    contactList: [],
    chatHistory: [],
    isHistoryRequested: false,
    isEndReached: false,
    lastMsgId: ""
}

const chatSlice = createSlice({
    name: "chatData",
    initialState,
    reducers: {
        storeAuth: (state, {payload}) => {
            state.jid = payload
        },
        distroyAuth: (state) => {
            return initialState;
        },
        saveContactList: (state, {payload}) => {
            return {
                ...state,
                contactList: payload
            }
        },
        saveSendAndAcceptedContactList: (state, {payload}) => {
            return {
                ...state,
                contactList: [...state?.contactList, payload]
            }
        },
        saveHistoryRequested: (state, {payload}) => {
            state.isHistoryRequested = payload;
        },
        saveChat: (state, action) => {
            const {from: userId, conv} = action.payload;

            const newData = state?.chatHistory?.some((item) => item.id === userId)
                ? state?.chatHistory?.map((item) => {
                    if(item?.id === userId){
                        return {
                            ...item,
                            chat: state.isHistoryRequested 
                                ? [conv, ...item?.chat] 
                                : [...item?.chat, conv]
                        };
                    }
                    return item;
                }) 
                : [...state.chatHistory, {id: userId, chat: [conv]}];
            
            state.chatHistory = newData;
            state.lastMsgId = Date.now().toString();
        },
        saveEndReachedStatus: (state, {payload}) => {
            console.log("im reducer saveendreached", payload)
            state.isEndReached = payload;
        }
    }
})

export const { 
    storeAuth, 
    saveContactList, 
    distroyAuth, 
    saveSendAndAcceptedContactList,
    saveHistoryRequested,
    saveChat,
    saveEndReachedStatus
} = chatSlice.actions;
export default chatSlice.reducer;