
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

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
        <div>
            <h1>קביעת תור</h1>

            {message && <p>{message}</p>}
            {error && <p>{error}</p>}

            {appointments.length === 0 ? (
                <p>אין כרגע תורים פנויים</p>
            ) : (
                <ul>
                    {appointments.map((appointment) => (
                        <li key={appointment._id}>
                            <p>
                                תאריך:
                                {" "}
                                {new Date(
                                    appointment.startTime
                                ).toLocaleString("he-IL")}
                            </p>

                            <p>
                                מורה:
                                {" "}
                                {appointment.providerId?.name || "לא צוין"}
                                {" "}
                                {appointment.providerId?.lastName || ""}
                            </p>

                            <p>
                                שירות:
                                {" "}
                                {appointment.serviceId?.name || "לא צוין"}
                            </p>

                            <button
                                onClick={() => bookAppointment(appointment._id)}
                                disabled={bookingId !== null}
                            >
                                {bookingId === appointment._id
                                    ? "קובעת תור..."
                                    : "קביעת תור"}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <button onClick={() => navigate("/user/home")}>
                חזרה לדף הבית
            </button>
        </div>
    )
}

export default UserBookAppointment
