
import './App.css';
import 'primereact/resources/themes/saga-blue/theme.css';        
import 'primereact/resources/primereact.min.css';               
import 'primeicons/primeicons.css';                             
import 'primeflex/primeflex.css';     
import AppRoutes from "./routes";                         
import { BrowserRouter } from "react-router-dom";
import Navbar from './chatBot_components/Navbar';


function App() {
  const user = JSON.parse(localStorage.getItem("user"));
const isAdmin = user?.role === "admin";

  return (
    <>
    <BrowserRouter >
      <Navbar isAdmin={isAdmin}/>
      <AppRoutes /> 
    </BrowserRouter>
    </>
  );
}

export default App;
