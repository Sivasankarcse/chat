import { 
    distroyAuth, 
    saveChat, 
    saveContactList, 
    saveEndReachedStatus, 
    saveHistoryRequested, 
    saveSendAndAcceptedContactList, 
    storeAuth 
} from "./reducers/chatReducer";
import { store } from "./store";

const {dispatch} = store;

export function saveAuthData(value: any) {
    console.log('saveauthdata action value', value)
    dispatch(storeAuth(value));
}

export function setContactList(value: any) {
    dispatch(saveContactList(value))
}

export function destroyAuthData() {
    dispatch(distroyAuth())
}

export function setSendAndAcceptedContactList(value: any) {
    dispatch(saveSendAndAcceptedContactList(value));
}

export function setHistoryDataRequested(value: any) {
    dispatch(saveHistoryRequested(value))
}

export function saveChatInRedux(value: any){
    dispatch(saveChat(value))
}
 
export function setEndReachedStatus(value: any) {
    dispatch(saveEndReachedStatus(value))
}