import {useState} from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleRegister() {
        fetch("http://127.0.0.1:5000/register",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({username:username, email:email, password: password})
        })
        .then(res => res.json())
        .then(data => {
        console.log(data.message)
        })
        }

    return (
        <div>
            <h2>Register Form</h2>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br/>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} /><br/>
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br/>
            <button onClick={handleRegister}>Register</button>            
            <p>
                Already have an account? 
                <Link to="/Login">Login</Link>
            </p>

        </div>

    )

}
export default Register;