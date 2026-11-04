
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../css/user/AppointmentDetails.css"

const AppointmentDetails = ({ id }) => {    
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
                `http://localhost:2173/api/appointments/${id}`,
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
                `http://localhost:2173/api/appointments/${id}/book`, {},
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
    <div className="appointment-details-page" dir="rtl">

        <div className="appointment-details-container">

            <div className="details-header">
                <span className="details-label">Qline</span>
                <h1>פרטי השיעור</h1>
                <p>כל הפרטים על השיעור שבחרת</p>
            </div>

            <div className="details-card">

                <div className="details-card-header">
                    <div className="details-icon">✦</div>

                    <div>
                        <h2>{appointment.serviceId?.name || "שיעור"}</h2>
                        <span>פרטי השיעור</span>
                    </div>
                </div>

                <div className="details-info-grid">

                    <div className="details-info-item">
                        <span>מדריכה</span>
                        <strong>
                            {appointment.providerId?.name}{" "}
                            {appointment.providerId?.lastName}
                        </strong>
                    </div>

                    <div className="details-info-item">
                        <span>תאריך</span>
                        <strong>
                            {new Date(appointment.startTime).toLocaleDateString("he-IL")}
                        </strong>
                    </div>

                    <div className="details-info-item">
                        <span>שעה</span>
                        <strong>
                            {new Date(appointment.startTime).toLocaleTimeString(
                                "he-IL",
                                {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                }
                            )}
                        </strong>
                    </div>

                    <div className="details-info-item">
                        <span>משך השיעור</span>
                        <strong>{appointment.lengthTime} דקות</strong>
                    </div>

                </div>

                <div className="details-capacity">

                    <div className="capacity-item">
                        <span>משתתפות</span>
                        <strong>
                            {participants.length} / {maxParticipants}
                        </strong>
                    </div>

                    <div className="capacity-item">
                        <span>מקומות פנויים</span>
                        <strong>{freePlaces}</strong>
                    </div>

                </div>

                {isRegistered ? (
                    <div className="booking-status success">
                        את כבר רשומה לשיעור הזה!
                    </div>
                ) : isFull ? (
                    <div className="booking-status full">
                        השיעור מלא כרגע
                    </div>
                ) : (
                    <button
                        className="booking-button"
                        onClick={bookAppointment}
                        disabled={booking}
                    >
                        {booking ? "נרשמת..." : "הרשמה לשיעור"}
                    </button>
                )}

                {bookingMessage && (
                    <div className="booking-message">
                        {bookingMessage}
                    </div>
                )}

            </div>

        </div>

    </div>
)
}


export default AppointmentDetails
