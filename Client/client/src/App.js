
import './App.css';
import 'primereact/resources/themes/saga-blue/theme.css';        
import 'primereact/resources/primereact.min.css';               
import 'primeicons/primeicons.css';                             
import 'primeflex/primeflex.css';     
import AppRoutes from "./routes";                         
import { BrowserRouter } from "react-router-dom";
import Navbar from './chatBot_components/Navbar';

function App() {
  return (
    <>
    <BrowserRouter >
      <Navbar/>
      <AppRoutes /> 
    </BrowserRouter>
    </>
  );
}

export default App;
