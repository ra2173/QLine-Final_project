
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

    if (loading) return <p>טוען רשימת המתנה...</p>

    if (error) return <p>{error}</p>

    return (
        <div>
            <h1>רשימת ההמתנה שלי</h1>

            {message && <p>{message}</p>}

            {waitlist.length === 0 ? (
                <p>אין לך שיעורים ברשימת ההמתנה</p>
            ) : (
                waitlist.map(entry => (
                    <div key={entry._id}>
                        <h3>
                            {entry.appointmentId?.serviceId?.name ||
                                "שיעור"}
                        </h3>

                        <p>
                            מדריכה: {entry.providerId?.name}
                            {" "}
                            {entry.providerId?.lastName}
                        </p>

                        <p>
                            תאריך: {new Date(entry.date).toLocaleDateString("he-IL")}
                        </p>

                        <p>
                            שעה: {entry.appointmentId?.startTime
                                ? new Date(entry.appointmentId.startTime)
                                    .toLocaleTimeString("he-IL", {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })
                                : "לא צוין"}
                        </p>

                        <button
                            onClick={() => removeFromWaitlist(entry._id)}
                        >
                            הסרה מרשימת ההמתנה
                        </button>
                    </div>
                ))
            )}

            <button onClick={() => navigate("/user/home")}>
                חזרה לדף הבית
            </button>
        </div>
    )
}

export default WaitlistPage
