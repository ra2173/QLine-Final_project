
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

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
        return <p>טוען תורים...</p>
    }

    if (error) {
        return <p>{error}</p>
    }


    return (
        <div>
            <h1>התורים שלי</h1>

            <h2>השיעורים הקרובים שלי</h2>

            {upcomingAppointments.length === 0 ? (
                <p>אין לך שיעורים קרובים</p>
            ) : (
                <ul>
                    {upcomingAppointments.map(appointment => (
                        <li key={appointment._id}>
                            <h3>{appointment.serviceId?.name || "שיעור"}</h3>

                            <p>
                                מדריכה: {appointment.providerId?.name}{" "}
                                {appointment.providerId?.lastName}
                            </p>

                            <p>
                                תאריך: {new Date(appointment.startTime).toLocaleDateString("he-IL")}
                            </p>

                            <p>
                                שעה: {new Date(appointment.startTime).toLocaleTimeString(
                                    "he-IL",
                                    { hour: "2-digit", minute: "2-digit" }
                                )}
                            </p>

                            <p>משך: {appointment.lengthTime} דקות</p>
                            <p>סניף: {appointment.branch}</p>

                            <button onClick={() => cancelAppointment(appointment._id)}> ביטול השיבוץ </button>
                        </li>
                    ))}
                </ul>
            )}

            <h2>שיעורים קודמים</h2>

            {pastAppointments.length === 0 ? (
                <p>אין שיעורים קודמים</p>
            ) : (
                <ul>
                    {pastAppointments.map(appointment => (
                        <li key={appointment._id}>
                            <h3>{appointment.serviceId?.name || "שיעור"}</h3>
                            <p> תאריך: {new Date(appointment.startTime).toLocaleString("he-IL")}</p>
                            <p>מדריכה: {appointment.providerId?.name}</p>
                            <p>סניף: {appointment.branch}</p>
                        </li>
                    ))}
                </ul>
            )}
            {cancelError && <p>{cancelError}</p>}
            <button onClick={() => navigate("/user/home")}> חזרה לדף הבית </button>
        </div>
    )
}

export default UserAppointments
