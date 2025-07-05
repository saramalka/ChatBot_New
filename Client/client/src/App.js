
import './App.css';
import 'primereact/resources/themes/saga-blue/theme.css';        
import 'primereact/resources/primereact.min.css';               
import 'primeicons/primeicons.css';                             
import 'primeflex/primeflex.css';     
import AppRoutes from "./routes";                         
import { BrowserRouter } from "react-router-dom";
import Navbar from './chatBot_components/Navbar';
import { useSelector } from 'react-redux';


function App() {
 const role = useSelector((state) => state.auth.role);
const isAdmin = role === "admin";
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
