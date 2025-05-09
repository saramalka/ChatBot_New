import { apiSlice } from '../api/apiSlice';

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({ query: () => '/admin/users', providesTags: ['Users'] }),
    deleteUser: builder.mutation({ query: (id) => ({ url: `/admin/users/${id}`, method: 'DELETE' }) }),

    getAllMessages: builder.query({ query: () => '/admin/messages', providesTags: ['Messages'] }),
    deleteMessage: builder.mutation({ query: (id) => ({ url: `/admin/messages/${id}`, method: 'DELETE' }) }),
  }),
});

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetAllMessagesQuery,
  useDeleteMessageMutation,
} = adminApi;
