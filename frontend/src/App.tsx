//import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/users/login";
import Signup from "./components/users/signup";
import Navbar from "./components/users/navbar";
import Dashboard from "./pages/dashboard";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import TaskBoard from "./pages/taskBoard";

function Layout() {
  
   const location = useLocation();
   const showNavbar = !(location.pathname === "/" || location.pathname === "/signup");

      
  return (
    <>
       {showNavbar && <Navbar />} 
      <div>
       
          

          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/navbar" element={<Navbar />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/taskboard" element={<TaskBoard />} /> 
          </Routes>
        
      </div>
    </>
  );
}
const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
