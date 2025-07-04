
import apiSlice from "../api/apiSlice";

const userApiSlice=apiSlice.injectEndpoints({
    endpoints:(build)=>({
      getUsers:build.query({
            query:()=>({
                url:"/users"
            }),
            providesTags:["Users"]
        }),
      getUserById:build.query({
            query:(id)=>({
                url:`/users/${id}`
            }),
            
        }),
      addUser:build.mutation({
          query:(user)=>({
            url:'/auth/register',
            method:'POST',
            body:user
          }),
          invalidatesTags:["Users"]
       }),
      loginUser: build.mutation({
        query: (user) => ({
          url: 'auth/login',
          method: 'POST',
          body: user,
        }),
      }),
      checkEmail: build.mutation({
  query: (email) => ({
    url: `/auth/check-user?email=${email}`,
    method: 'GET',
  }),
}),

      deleteUser: build.mutation({
        query: (userId) => ({
          url: `/users/${userId}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Users'],
      }),      
      editUser:build.mutation({
            query:(user)=>({
                url:`users`,
                method:"PUT",
                body:user
            }),
            invalidatesTags:["Users"] 
        }),
         
    })
})

export const {
  useAddUserMutation,
    useDeleteUserMutation,
    useEditUserMutation,
    useGetUserByIdQuery,
    useGetUsersQuery,
    useLoginUserMutation,
    useCheckEmailMutation
}=userApiSlice