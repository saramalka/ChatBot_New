import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    "name":'auth',
    initialState:{
        token:localStorage.getItem("token")||"",
        isLoggedIn:localStorage.getItem("token")?true:false,
        name:localStorage.getItem("name") || "",
        role:localStorage.getItem("role")||"member",
        teams:(() => {
            try {
              return JSON.parse(localStorage.getItem("teams") || "[]");
            } catch (e) {
              return [];
            }
          })()
          

    },
    reducers:{
        setToken:(state,action)=>{
            const {name,role,teams,token}=action.payload
            state.token=token
            state.isLoggedIn=true
            state.name=name
            state.role=role
            state.teams=teams
            localStorage.setItem("token",token)
            localStorage.setItem("name", name)
            localStorage.setItem("role",role)
            localStorage.setItem("teams", JSON.stringify(teams));

        },
        removeToken:(state)=>{
            state.token=""
            state.isLoggedIn=false
            state.name=""
            state.teams=[]
            localStorage.removeItem("token")
            localStorage.removeItem("name")
            localStorage.removeItem("role")
            localStorage.removeItem("teams")
        }
    }
})

export default authSlice.reducer
export const {setToken,removeToken}=authSlice.actions