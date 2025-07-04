import apiSlice from '../api/apiSlice';

export const chatSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: () => '/chat/all',
      providesTags: ['Chat'],
    }),

    sendMessage: builder.mutation({
      query: (body) => ({
        url: '/chat',
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Chat'],
    }),

    getInitialGoals: builder.query({
      query: () => '/chat/initial',
      providesTags: ['Goals'],
    }),

    updateNutritionGoals: builder.mutation({
      query: (body) => ({
        url: '/chat/updateNutritionGoals',
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Goals'],
    }),

    saveHealthData: builder.mutation({
      query: (body) => ({
        url: '/chat/healthData',
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    getHealthData: builder.query({
      query: () => '/chat/healthDataGet',
      providesTags: ['HealthData'],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetInitialGoalsQuery,
  useUpdateNutritionGoalsMutation,
  useSaveHealthDataMutation,
  useGetHealthDataQuery
} = chatSlice;
