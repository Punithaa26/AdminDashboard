import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";


function App() {
  const user = localStorage.getItem("user") ;

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? (user.role === "admin" ? <Navigate to="/admin" /> : <Navigate to="/welcome" />) : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/welcome" element={<Welcome />} />
      </Routes>
    </Router>
  );
}

export default App;
