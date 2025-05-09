
import apiSlice from "./apiSlice";

const userApiSlice=apiSlice.injectEndpoints({
    endpoints:(build)=>({
      getUsers:build.query({
            query:()=>({
                url:"/api/user"
            }),
            providesTags:["Users"]
        }),
      getUserById:build.query({
            query:(id)=>({
                url:`/api/user/${id}`
            }),
            
        }),
      addUser:build.mutation({
          query:(user)=>({
            url:'/api/register',
            method:'POST',
            body:user
          }),
          invalidatesTags:["Users"]
       }),
      loginUser: build.mutation({
        query: (user) => ({
          url: '/api/login',
          method: 'POST',
          body: user,
        }),
      }),
      checkEmail: build.mutation({
        query: (email) => ({
          url: '/api/user/check-email',
          method: 'POST',
          body: {email},
        }),
      }),
      deleteUser:build.mutation({
            query:(user)=>({
                url:`/api/user`,
                method:'DELETE',
                body: { id: user._id },
        }),
        invalidatesTags:["Users"]
        }),
      editUser:build.mutation({
            query:(user)=>({
                url:`api/user`,
                method:"PUT",
                body:user
            }),
            invalidatesTags:["Uesrs"] 
        }),
         
    })
})

export const {useAddUserMutation,
    useDeleteUserMutation,
    useEditUserMutation,
    useGetUserByIdQuery,
    useGetUsersQuery,
    useLoginUserMutation,
    useCheckEmailMutation
    
}=userApiSlice