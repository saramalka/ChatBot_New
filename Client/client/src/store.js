
import { configureStore } from '@reduxjs/toolkit';
import apiSlice from './features/api/apiSlice';
import chatSlice  from './features/chat/chatSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    auth:authReducer,
    [apiSlice.reducerPath]:apiSlice.reducer,
   
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,

});
export default store
