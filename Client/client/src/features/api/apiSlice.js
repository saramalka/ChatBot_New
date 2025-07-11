import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiSlice=createApi({
    reducerPath:'api',
    baseQuery:fetchBaseQuery({
        baseUrl: "http://localhost:2200/api",
       credentials: 'include',
    prepareHeaders:(headers,{getState})=>{
            const token = getState().auth.token;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
              }
              return headers;
        },
    fetchFn: (input, init) => {
      init = init || {};
      init.cache = 'no-cache';
      return fetch(input, init);
    }    
    }),
    tagTypes: ['User', 'QuickReplies', 'Chat', 'Goals', 'HealthData'],

    endpoints:()=>({})

})
export default apiSlice