import { combineReducers } from '@reduxjs/toolkit';
import chatReducer from './chatReducer';

const rootReducer = combineReducers({
    chatData: chatReducer
})

export default rootReducer;