import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiSlice=createApi({
    reducerPath:'api',
    baseQuery:fetchBaseQuery({
        baseUrl: "http://localhost:2200/api",
       credentials: 'include',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
     }
    return headers;
  }
    }),
    tagTypes: ['User', 'QuickReplies', 'Chat', 'Goals', 'HealthData'],

    endpoints:()=>({})

})
export default apiSlice