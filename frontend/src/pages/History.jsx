import { useState, useEffect} from "react";
import BottomNav from "../components/BottomNav";

function History() {
    const [history, setHistory] = useState([])
    useEffect(() => {
        const token = localStorage.getItem("token")
        fetch("https://upi-app-backend-t6ze.onrender.com/transactions", {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(data => {
                setHistory(data)
            })
    }, [])
    return (
        <>
            {/* <h2>Transaction History</h2>
            <p>Sent 500</p>
            <p>Received 900</p>
            <p>Added 100</p>
            <h2>History</h2> */}
            {history.map((tx, index) => (
                <div key={index}>
                    <p>
                        From: {tx.from} | To: {tx.to} | Amount: {tx.amount} |
                        Date: {new Date(tx.timestamp).toLocaleString()}

                    </p>
                </div>
            ))}
            <BottomNav />

        </>
    )
}
export default History;