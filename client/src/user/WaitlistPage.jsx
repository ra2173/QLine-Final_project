import "../css/user/WaitlistPage.css"
import { Button, CircularProgress } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const WaitlistPage = () => {
    const navigate = useNavigate()

    const [waitlist, setWaitlist] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    const token = localStorage.getItem("token")

    const getWaitlist = async () => {
        try {
            if (!token) {
                navigate("/user/login")
                return
            }

            const { data } = await axios.get(
                "http://localhost:2173/api/waitlist/my-waitlist",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            setWaitlist(data)

        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem("token")
                navigate("/user/login")
                return
            }

            setError(
                error.response?.data?.message ||
                "לא ניתן לטעון את רשימת ההמתנה"
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getWaitlist()
    }, [])

    const removeFromWaitlist = async (id) => {
        try {
            setMessage("")

            await axios.delete(
                "http://localhost:2173/api/waitlist",
                {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { id }
                }
            )

            setWaitlist(prev =>
                prev.filter(entry => entry._id !== id)
            )

            setMessage("הוסרת מרשימת ההמתנה בהצלחה")

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "לא ניתן להסיר את הרשומה"
            )
        }
    }

    
if (loading) {
    return (
        <div className="waitlist-page">
            <CircularProgress sx={{ color: "#7088e8" }} />
        </div>
    )
}

if (error) {
    return (
        <div className="waitlist-page">
            <p className="waitlist-error">{error}</p>
        </div>
    )
}

return (
    <div className="waitlist-page">
        <div className="waitlist-container">

            <header className="waitlist-header">
                <div>
                    <h1>רשימת ההמתנה שלי</h1>
                    <p>השיעורים שאת ממתינה להצטרף אליהם</p>
                </div>

                <div className="waitlist-header-icon">
                    <span>☷</span>
                </div>
            </header>

            {message && (
                <div className="waitlist-message">
                    {message}
                </div>
            )}

            {waitlist.length === 0 ? (
                <div className="waitlist-empty">
                    <span>✦</span>
                    <h3>רשימת ההמתנה שלך ריקה</h3>
                    <p>כשתצטרפי לרשימת המתנה של שיעור, הוא יופיע כאן</p>
                </div>
            ) : (
                <div className="waitlist-list">

                    {waitlist.map(entry => {
                        const date = new Date(entry.date)
                        const startTime = entry.appointmentId?.startTime

                        return (
                            <div key={entry._id} className="waitlist-card">

                                <div className="waitlist-card-main">

                                    <div className="waitlist-date">
                                        <strong>
                                            {date.toLocaleDateString(
                                                "he-IL",
                                                { day: "2-digit" }
                                            )}
                                        </strong>
                                        <span>
                                            {date.toLocaleDateString(
                                                "he-IL",
                                                { month: "long" }
                                            )}
                                        </span>
                                    </div>

                                    <div className="waitlist-details">

                                        <h3>
                                            {entry.appointmentId?.serviceId?.name || "שיעור"}
                                        </h3>

                                        <div className="waitlist-time">
                                            {startTime
                                                ? new Date(startTime).toLocaleTimeString(
                                                    "he-IL",
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    }
                                                )
                                                : "לא צוין"}
                                        </div>

                                        <p>
                                            מדריכה: {entry.providerId?.name}{" "}
                                            {entry.providerId?.lastName}
                                        </p>

                                    </div>

                                    <div className="waitlist-status">
                                        ממתינה
                                    </div>

                                </div>

                                <div className="waitlist-card-footer">

                                    <span className="waitlist-branch">
                                        <span>⌖</span>
                                        {entry.appointmentId?.branch || "סניף"}
                                    </span>

                                    <Button
                                        variant="text"
                                        color="error"
                                        className="waitlist-remove-btn"
                                        onClick={() => removeFromWaitlist(entry._id)}
                                    >
                                        הסרה מרשימת ההמתנה
                                    </Button>

                                </div>

                            </div>
                        )
                    })}

                </div>
            )}

            <Button
                variant="text"
                className="waitlist-back"
                onClick={() => navigate("/user/home")}
            >
                ← חזרה לדף הבית
            </Button>

        </div>
    </div>
)

}

export default WaitlistPage
