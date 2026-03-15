import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

     function handleLogin(){
    fetch("https://upi-app-backend-t6ze.onrender.com//login",{
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body:JSON.stringify({username:username, password:password})
    })
    .then(res => res.json())
    .then(data => {
        if (data.token){
            localStorage.setItem("token", data.token)
            navigate("/Dashboard")
        }
        else{
            alert(data.message)
        }
    })
}
    return (
        <div className="form-container">
            <h2>Login Page</h2>
            <input type="text" value={username}placeholder="Username" onChange={(e) => setUsername(e.target.value)} /><br />
            <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br />
            <button onClick={handleLogin}>Login</button><br/>
            <p>
                Don't have an account?
                <Link to="/">Register</Link>
            </p>
        </div>
    )
}
export default Login;