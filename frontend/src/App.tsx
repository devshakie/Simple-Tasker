import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/users/login";
import Signup from "./components/users/signup";
function App() {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
