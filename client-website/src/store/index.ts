import { configureStore, combineReducers} from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import modalReducer from '../features/ui/modalSlice'
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import commonSlice from '../features/ui/commonSlice';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'] // you can choose to persist only certain slices of state
  };

  const rootReducer = combineReducers({
    user: userReducer,
    modal: modalReducer,
    common: commonSlice
    // Add other reducers here
  });
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  export const store = configureStore({
    reducer: persistedReducer,
    // middleware and other store enhancers can be added here
  });


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
