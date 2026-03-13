import {BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Send from "./pages/Send";
import Request from "./pages/Request";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Success from "./pages/Success";
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