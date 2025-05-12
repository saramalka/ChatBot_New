
import apiSlice  from '../api/apiSlice';

export const answerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuickReplies: builder.query({
      query: () => '/replay',
      providesTags: ['QuickReplies'],
    }),
    addQuickReply: builder.mutation({
      query: (newReply) => ({
        url: '/replay',
        method: 'POST',
        body: newReply,
      }),
      invalidatesTags: ['QuickReplies'],
    }),
    deleteQuickReply: builder.mutation({
      query: (id) => ({
        url: `/replay/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['QuickReplies'],
    }),
  }),
});

export const {
  useGetQuickRepliesQuery,
  useAddQuickReplyMutation,
  useDeleteQuickReplyMutation,
} = answerApi;
