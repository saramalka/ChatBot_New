import apiSlice   from '../api/apiSlice';

export const chatSlice = apiSlice.injectEndpoints({
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
        headers: {
          'Content-Type': 'application/json', },
      }),
      invalidatesTags: ['Chat'],
    }),
  }),
});

export const {useGetMessagesQuery,useSendMessageMutation} = chatSlice;


