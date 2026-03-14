import {BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Send from "./pages/Send.jsx";
import Request from "./pages/Request.jsx";
import History from "./pages/History.jsx";
import Profile from "./pages/Profile.jsx";
import Success from "./pages/Success.jsx";
import "./App.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Send" element={<Send />} />
        <Route path="/Request" element={<Request />} />
        <Route path="/History" element={<History />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Success" element={<Success />} />

        
      </Routes>
    </Router>
  )
}
export default App;