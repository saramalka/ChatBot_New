import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    "name":'auth',
    initialState:{
        token:localStorage.getItem("token")||"",
        isLoggedIn:localStorage.getItem("token")?true:false,
        name:localStorage.getItem("username") || "",    
    },
    reducers:{
        setToken:(state,action)=>{
            const {name,token}=action.payload
            state.token=token
            state.isLoggedIn=true
            state.name=name
            
            localStorage.setItem("token",token)
            localStorage.setItem("username", name)
           

        },
        removeToken:(state)=>{
            state.token=""
            state.isLoggedIn=false
            state.name=""
    
            localStorage.removeItem("token")
            localStorage.removeItem("username")
           
        }
    }
})

export default authSlice.reducer
export const {setToken,removeToken}=authSlice.actions