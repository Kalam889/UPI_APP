import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";

function Request() {
    const [upi, setUpi] = useState("");
    const [amount, setAmount] = useState("");
    const [pin, setPin] = useState("");
    function handleRequest(){
    const token = localStorage.getItem("token")

    fetch("http://127.0.0.1:5000/request",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer " + token
        },
        body:JSON.stringify({
            upi_id:upi,
            amount:amount
        })
    })
}
    return (
        <div className="form-container">
            <h2>Request money</h2>
            <input type="text" value={upi} placeholder="Enter UPI ID" onChange={(e)=>setUpi(e.target.value)} /><br/>
            <input type="number" value={amount} placeholder="Amount" onChange={(e) => setAmount(e.target.value)}/><br/>
            <input type="text" value={pin} placeholder="Pin" onChange={(e) => setPin(e.target.value)}/><br/>
            <button>Send</button>
            <BottomNav/>
        </div>
        
    )
}
export default Request;