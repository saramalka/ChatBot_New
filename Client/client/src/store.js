
import { configureStore } from '@reduxjs/toolkit';
import apiSlice from './slices/apiSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    auth:authReducer,
    [apiSlice.reducerPath]:apiSlice.reducer
  },
  middleware:(getDefaultMiddlware)=>getDefaultMiddlware().concat(apiSlice.middleware),
  devTools:true
});
export default store
