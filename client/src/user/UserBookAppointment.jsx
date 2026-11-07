
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../css/user/UserBookAppointment.css"


const UserBookAppointment = () => {
    const [appointments, setAppointments] = useState([])
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(true)
    const [bookingId, setBookingId] = useState(null)

    const navigate = useNavigate()

    const loadAppointments = async () => {
        try {
            const token = localStorage.getItem("token")

            if (!token) {
                navigate("/user/login")
                return
            }

            const res = await axios.get(
                "http://localhost:2173/api/appointments/available",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setAppointments(res.data)
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "לא ניתן לטעון תורים פנויים"
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadAppointments()
    }, [])

    const bookAppointment = async (id) => {
        setError("")
        setMessage("")
        setBookingId(id)

        try {
            const token = localStorage.getItem("token")

            await axios.post(
                `http://localhost:2173/api/appointments/${id}/book`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            setMessage("התור נקבע בהצלחה!")
            await loadAppointments()
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "לא ניתן לקבוע את התור"
            )
        } finally {
            setBookingId(null)
        }
    }

    if (loading) return <p>טוען תורים פנויים...</p>
return (
<div className="book-page">
<div className="book-container">

        <h1 className="book-title">קביעת תור</h1>

        {message && (
            <p className="book-message book-success">
                {message}
            </p>
        )}

        {error && (
            <p className="book-message book-error">
                {error}
            </p>
        )}

        {appointments.length === 0 ? (
            <div className="book-empty">
                אין כרגע תורים פנויים
            </div>
        ) : (
            <ul className="book-list">
                {appointments.map((appointment) => (
                    <li key={appointment._id} className="book-card">

                        <p className="book-info">
                            <strong>תאריך:</strong>{" "}
                            {new Date(appointment.startTime).toLocaleString("he-IL")}
                        </p>

                        <p className="book-info">
                            <strong>מורה:</strong>{" "}
                            {appointment.providerId?.name || "לא צוין"}{" "}
                            {appointment.providerId?.lastName || ""}
                        </p>

                        <p className="book-info">
                            <strong>שירות:</strong>{" "}
                            {appointment.serviceId?.name || "לא צוין"}
                        </p>

                        <Button
                            variant="contained"
                            className="book-button"
                            onClick={() => bookAppointment(appointment._id)}
                            disabled={bookingId !== null}
                        >
                            {bookingId === appointment._id
                                ? "קובעת תור..."
                                : "קביעת תור"}
                        </Button>

                    </li>
                ))}
            </ul>
        )}

        <Button
            variant="text"
            className="book-back"
            onClick={() => navigate("/user/home")}
        >
            חזרה לדף הבית
        </Button>

    </div>
</div>

)
}

export default UserBookAppointment
