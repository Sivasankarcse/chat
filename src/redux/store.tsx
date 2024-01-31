import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import rootReducer from './reducers';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

const rootPersistConfig = {
    key: "root",
    versions: 1,
    storage: AsyncStorage,
    whiteList: ["chatData"]
}

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false})
})

export const persistor = persistStore(store);


