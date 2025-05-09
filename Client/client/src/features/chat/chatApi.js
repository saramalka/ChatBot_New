import { apiSlice } from '../api/apiSlice';

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: () => '/chat',
      providesTags: ['Chat'],
    }),
    sendMessage: builder.mutation({
      query: (body) => ({
        url: '/chat',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Chat'],
    }),
  }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = chatApi;
