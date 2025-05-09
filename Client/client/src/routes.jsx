import { useState } from "react";
import  ChatPage from './chatBot_components/ChatPage'
import  AuthPage from './chatBot_components/AuthPage'
import { Routes, Route, Navigate } from "react-router-dom";

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
     <Route path="/" element={<ChatPage />} />
       <Route path="/auth" element={<AuthPage/>}/> 
      {/* <Route path="/login" element={<LoginForm onLogin={handleLogin}/>} />
      <Route path="/register" element={<SignUpForm onLogin={handleLogin}/>} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Homepage />} />
      <Route path="/teams" element={<TeamsList />} />
      <Route path="/tasks" element={<TaskList />} />
      <Route path="/users" element={<UserList />} />
      <Route path="profile" element={<Profile />} /> */}
  
    </Routes>
  );
};

export default AppRoutes;
