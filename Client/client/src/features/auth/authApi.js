import  apiSlice  from '../api/apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: '/users/register',
        method: 'POST',
        body: data,
      }),
      invalidatesTags:["Users"]
    }),
    login: builder.mutation({
      query: (data) => ({
        url: '/users/login',
        method: 'POST',
        body: data,
      }),
      invalidatesTags:["Users"]
    }),
     check: builder.mutation({
      query: (data) => ({
        url: '/users/check-user',
        method: 'GET',
        
      }),
      invalidatesTags:["Users"]
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useCheckUserMutation } = authApi;