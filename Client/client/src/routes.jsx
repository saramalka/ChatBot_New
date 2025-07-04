import { useState } from "react";
import  Chat from './chatBot_components/Chat'
import  Login from './chatBot_components/Login'
import AdminQuickRepliesPage from "./chatBot_components/AdminQuickRepliesPage";
import { Routes, Route, Navigate } from "react-router-dom";
import UsersPage from "./chatBot_components/UsersPage";
import NutritionComponent from "./chatBot_components/Nutrition";

// import LoginForm from "./Components/login";
// import SignUpForm from "./Components/register";
// import Dashboard from "./Components/dashboard";
// import TaskDetails from "./Components/taskDetails";
// import Profile from "./Components/profile";
// import TaskList from "./Components/taskList";
// import TeamsList from './Components/teamsList'
// import Homepage from "./Components/homepage";
// import UserList from "./Components/userList";



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
       <Route path="/admin/replies" element={<AdminQuickRepliesPage />} />
       <Route path="/admin/users" element={<UsersPage />} />
      {/* <Route path="/login" element={<LoginForm onLogin={handleLogin}/>} />
      <Route path="/register" element={<SignUpForm onLogin={handleLogin}/>} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Homepage />} />
      <Route path="/teams" element={<TeamsList />} />
      <Route path="/tasks" element={<TaskList />} />
      
      <Route path="profile" element={<Profile />} /> */}
  
    </Routes>
  );
};

export default AppRoutes;
