import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import BottomNav from "../components/BottomNav";

function Dashboard() {
    const [stores, setStore] = useState([])
    useEffect(() => {
        const token = localStorage.getItem("token")
        fetch("http://upi-app-2.onrender.com/dashboard", {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(data => {
                setStore(data.result)
            })
    }, [])
    return (
        <div className="main-container">
            <div className="header">
                <h2>Welcome</h2>
            </div>
            <div className="balance-card">
                {/* <h2>Available Balance</h2>
                <p>12000</p> */}
                {stores.map((store, index) => (
                    <div key={index}>
                        <p>
                            <p>{store.username}</p>
                            <p>{store.upi_id}</p>

                        </p>
                    </div>
                ))}

            </div>
            <div className="action-btn">
                <button><Link to="/Send">Send</Link></button>
                <button><Link to="/Request">Request</Link></button>
                <button><Link to="/History">History</Link></button>
            </div>
            <BottomNav />

        </div>

    )

}
export default Dashboard;