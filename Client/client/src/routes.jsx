import { useState } from "react";
import  Login from './chatBot_components/Login'
import { Routes, Route, Navigate } from "react-router-dom";
import UsersPage from "./chatBot_components/UsersPage";
import NutritionComponent from "./chatBot_components/Nutrition";

const AppRoutes = () => {
  const [login,setLogin]=useState(false)

  const handleLogin=()=>{
    setLogin(true)
    console.log(login)
  }

  return (
    <Routes>
     <Route path="/chat" element={<NutritionComponent />} />
       <Route path="/" element={<Login/>}/> 
       <Route path="/admin/users" element={<UsersPage />} />
    </Routes>
  );
};

export default AppRoutes;
