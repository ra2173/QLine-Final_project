
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Button, CircularProgress } from "@mui/material"
import "../css/user/UserAppointments.css"

const UserAppointments = () => {
    const [appointments, setAppointments] = useState([])
    const [error, setError] = useState("")
    const [cancelError, setCancelError] = useState("")
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        getAppointments()
    }, [navigate])

    const getAppointments = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                navigate("/user/login")
                return
            }
            const res = await axios.get(
                "http://localhost:2173/api/appointments/my-appointments",
                { headers: { Authorization: `Bearer ${token}` } }
            )

            setAppointments(
                Array.isArray(res.data) ? res.data : []
            )

        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem("token")
                navigate("/user/login")
            } else {
                setError(error.response?.data?.message || "לא ניתן לטעון את התורים")
            }
        } finally {
            setLoading(false)
        }
    }

    const cancelAppointment = async (id) => {
        try {
            setCancelError("")
            const token = localStorage.getItem("token")
            await axios.put(
                "http://localhost:2173/api/appointments/cancel",
                { id },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            setAppointments((prev) =>
                prev.filter((appointment) => appointment._id !== id)
            )

        } catch (error) {
            setCancelError(
                error.response?.data?.message ||
                "לא ניתן לבטל את השיבוץ"
            )
        }
    }

    const now = new Date()

    const upcomingAppointments = appointments.filter(
        appointment => new Date(appointment.startTime) > now
    )

    const pastAppointments = appointments.filter(
        appointment => new Date(appointment.startTime) <= now
    )
if (loading) {
    return (
        <div className="appointments-page">
            <CircularProgress sx={{ color: "#7088e8" }} />
        </div>
    )
}

if (error) {
    return (
        <div className="appointments-page">
            <p className="appointment-error">{error}</p>
        </div>
    )
}

return (
    <div className="appointments-page">
        <div className="appointments-container">

            {/* כותרת */}
            <header className="appointments-header">
                <div>
                    <h1>התורים שלי</h1>
                    <p>כל האימונים שלך במקום אחד</p>
                </div>

                <div className="appointments-header-icon">
                    <span>▦</span>
                </div>
            </header>

            {/* שיעורים קרובים */}
            <section className="upcoming-section">

                <div className="section-heading">
                    <h2>השיעורים הקרובים</h2>
                    <span className="appointments-count">
                        {upcomingAppointments.length} שיעורים
                    </span>
                </div>

                {upcomingAppointments.length === 0 ? (
                    <div className="appointments-empty">
                        אין לך שיעורים קרובים
                    </div>
                ) : (
                    <div className="upcoming-list">

                        {upcomingAppointments.map(appointment => {
                            const date = new Date(appointment.startTime)

                            return (
                                <div
                                    key={appointment._id}
                                    className="upcoming-card"
                                >

                                    <div className="upcoming-main">

                                        {/* תאריך */}
                                        <div className="appointment-date">
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

                                        {/* פרטי השיעור */}
                                        <div className="appointment-details">

                                            <h3>
                                                {appointment.serviceId?.name || "שיעור"}
                                            </h3>

                                            <div className="appointment-time">
                                                {date.toLocaleTimeString(
                                                    "he-IL",
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    }
                                                )}
                                            </div>

                                            <p>
                                                מדריכה:{" "}
                                                {appointment.providerId?.name}{" "}
                                                {appointment.providerId?.lastName}
                                            </p>

                                        </div>

                                        <div className="appointment-icon">
                                            <span>✓</span>
                                        </div>

                                    </div>

                                    <div className="appointment-footer">

                                        <div className="appointment-extra">
                                            <span>
                                                {appointment.lengthTime} דקות
                                            </span>

                                            <span className="extra-divider">·</span>

                                            <span>{appointment.branch}</span>
                                        </div>

                                        <Button
                                            className="cancel-appointment-btn"
                                            color="error"
                                            variant="text"
                                            onClick={() =>
                                                cancelAppointment(appointment._id)
                                            }
                                        >
                                            ביטול שיבוץ
                                        </Button>

                                    </div>

                                </div>
                            )
                        })}

                    </div>
                )}

            </section>

            {/* שיעורים קודמים */}
            <section className="past-section">

                <div className="section-heading">
                    <h2>שיעורים קודמים</h2>
                </div>

                {pastAppointments.length === 0 ? (
                    <div className="appointments-empty">
                        אין שיעורים קודמים
                    </div>
                ) : (
                    <div className="past-list">

                        {pastAppointments.map(appointment => {
                            const date = new Date(appointment.startTime)

                            return (
                                <div
                                    key={appointment._id}
                                    className="past-card"
                                >

                                    <div className="past-date">
                                        {date.toLocaleDateString("he-IL", {
                                            day: "2-digit",
                                            month: "long"
                                        })}
                                    </div>

                                    <div className="past-details">
                                        <h3>
                                            {appointment.serviceId?.name || "שיעור"}
                                        </h3>

                                        <p>
                                            {date.toLocaleTimeString("he-IL", {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                            {" · "}
                                            {appointment.providerId?.name || "מדריכה"}
                                            {" · "}
                                            {appointment.branch}
                                        </p>
                                    </div>

                                    <span className="past-status">
                                        הסתיים
                                    </span>

                                </div>
                            )
                        })}

                    </div>
                )}

            </section>

            {/* הודעת שגיאה בביטול */}
            {cancelError && (
                <p className="appointment-error">
                    {cancelError}
                </p>
            )}

            {/* חזרה */}
            <Button
                className="appointments-back"
                variant="text"
                onClick={() => navigate("/user/home")}
            >
                ← חזרה לדף הבית
            </Button>

        </div>
    </div>
)}
export default UserAppointments