
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

const AppointmentDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [appointment, setAppointment] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [booking, setBooking] = useState(false)
    const [bookingMessage, setBookingMessage] = useState("")

    const token = localStorage.getItem("token")

    const fetchAppointment = async () => {
        try {
            if (!token) {
                navigate("/user/login")
                return
            }
            const { data } = await axios.get(
                `http://localhost:2173/appointments/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            setAppointment(data)
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem("token")
                navigate("/user/login")
            } else {
                setError(
                    error.response?.data?.message ||
                    "לא ניתן לטעון את פרטי השיעור"
                )
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointment()
    }, [id, navigate])

    const bookAppointment = async () => {
        try {
            setBooking(true)
            setBookingMessage("")
            const { data } = await axios.post(
                `http://localhost:2173/appointments/${id}/book`, {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            setBookingMessage(data.message || "נרשמת לשיעור בהצלחה!")

            await fetchAppointment()

        } catch (error) {
            setBookingMessage(error.response?.data?.message || "ההרשמה נכשלה")
        } finally {
            setBooking(false)
        }
    }
    if (loading)
        return <p>טוען פרטי שיעור...</p>

    if (error)
        return <p>{error}</p>

    if (!appointment)
        return <p>השיעור לא נמצא</p>

    const participants = appointment.participants || []
    const maxParticipants = appointment.maxParticipants
    const freePlaces = Math.max(0, maxParticipants - participants.length)
    const isFull = freePlaces === 0

    const currentUserId = (() => {
        try {
            if (!token) return null
            const payload = JSON.parse(atob(token.split(".")[1]))
            return payload.UserInfo._id
        } catch {
            return null
        }
    })()
    
    const isRegistered = participants.some(participant =>
        (participant._id || participant).toString() === currentUserId
    )
    return (
        <div>
            <h1>פרטי השיעור</h1>
            <h2> {appointment.serviceId?.name || "שיעור"} </h2>
            <p>
                מורה: {appointment.providerId?.name}
                {" "}
                {appointment.providerId?.lastName}
            </p>
            <p> תאריך: {new Date(appointment.startTime).toLocaleDateString("he-IL")}</p>
            <p>
                שעה: {new Date(appointment.startTime).toLocaleTimeString("he-IL", {
                    hour: "2-digit",
                    minute: "2-digit"
                })}
            </p>
            <p>משך השיעור: {appointment.lengthTime} דקות</p>
            <p>
                משתתפות: {appointment.participants.length}
                {" / "}
                {appointment.maxParticipants}
            </p>

            <p>מקומות פנויים: {freePlaces}</p>
            {isRegistered ? (<p>את כבר רשומה לשיעור הזה!</p>) : isFull ? (<p>השיעור מלא כרגע</p>)
                : (
                    <button onClick={bookAppointment} disabled={booking}>
                        {booking ? "נרשמת..." : "הרשמה לשיעור"}
                    </button>
                )}

            {bookingMessage && <p>{bookingMessage}</p>}
            <button onClick={() => navigate("/calendar")}> חזרה ללוח השיעורים </button>
        </div>
    )
}


export default AppointmentDetails
