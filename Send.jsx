import { useState } from "react";
import { useNavigate} from "react-router-dom";
import BottomNav from "../components/BottomNav";

function Send() {
    const [upi, setUpi] = useState("");
    const [amount, setAmount] = useState("");
    const [pin, setPin] = useState("");
    const navigate = useNavigate();

    function handleSend() {
            const token = localStorage.getItem("token");

        fetch("http://127.0.0.1:5000/send",{
            method: "POST",
            headers: { "Content-Type": "application/json",
                        "Authorization": "Bearer " + token },
            body: JSON.stringify({ upi_id: upi, amount: amount, pin:pin,
                
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.message === "Successful"){
                navigate("/Success")
            }
        })
    }
    return (
        <div className="form-container">
            <h2>Send money</h2>
            <input type="text" value={upi} placeholder="Enter UPI ID" onChange={(e) => setUpi(e.target.value)}/><br />
            <input type="number" value={amount} placeholder="Amount" onChange={(e) => setAmount(e.target.value)} /><br />
            <input type="text" value={pin} placeholder="Pin" onChange={(e) => setPin(e.target.value)} /><br />
            <button onClick={handleSend}>Send</button>
            <BottomNav />
        </div>

    )
}
export default Send;