import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    "name":'auth',
    initialState:{
        token:localStorage.getItem("token")||"",
        isLoggedIn:localStorage.getItem("token")?true:false,
        name:localStorage.getItem("username") || "",
       role: localStorage.getItem("userRole") || "",    
    },
    reducers:{
        setToken:(state,action)=>{
            console.log("setToken action payload:", action.payload);
            const {name,token,role}=action.payload
            state.token=token
            state.isLoggedIn=true
            state.name=name
            state.role=role

            localStorage.setItem("token",token)
            localStorage.setItem("username", name)
            localStorage.setItem("userRole", role);
           

        },
        removeToken:(state)=>{
            state.token=""
            state.isLoggedIn=false
            state.name=""
    
            localStorage.removeItem("token")
            localStorage.removeItem("username")
            localStorage.removeItem("userRole");
           
        }
    }
})

export default authSlice.reducer
export const {setToken,removeToken}=authSlice.actions