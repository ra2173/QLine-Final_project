import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../css/provider/ProviderAppointments.css"


const API_URL = "http://localhost:2173/api/appointments"

const ProviderAppointments = () => {
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const token = localStorage.getItem("token")

    // טעינת השיעורים של המדריכה
    const getAppointments = async () => {
        try {
            setLoading(true)
            setError("")

            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error("טעינת השיעורים נכשלה")
            }

            const data = await response.json()

            // בהנחה שהשרת מחזיר מערך שיעורים
            setAppointments(Array.isArray(data) ? data : data.appointments || [])

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAppointments()
    }, [])

    // מחיקת שיעור
    const deleteAppointment = async (id) => {
        const confirmDelete = window.confirm("האם למחוק את השיעור?")

        if (!confirmDelete) return

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error("מחיקת השיעור נכשלה")
            }

            setAppointments(prev =>
                prev.filter(appointment => appointment._id !== id)
            )

        } catch (err) {
            alert(err.message)
        }
    }

    // מעבר להוספת שיעור
    const addAppointment = () => {
        navigate("/provider/appointments/new")
    }

    // מעבר לעריכת שיעור
    const editAppointment = (id) => {
        navigate(`/provider/appointments/edit/${id}`)
    }

    // מעבר לפרטי השיעור
    const showAppointment = (id) => {
        navigate(`/provider/appointment/${id}`)
    }

    if (loading) {
        return <p>טוען שיעורים...</p>
    }

    return (
        <div className="provider-appointments" dir="rtl">

            <div className="page-header">
                <div>
                    <h1>ניהול שיעורים</h1>
                    <p>צפייה וניהול השיעורים שלך</p>
                </div>

                <button onClick={addAppointment}>
                    + הוספת שיעור
                </button>
            </div>

            {error && <p className="error-message">{error}</p>}

            {appointments.length === 0 ? (
                <p>לא נמצאו שיעורים</p>
            ) : (
                <div className="appointments-list">

                    {appointments.map(appointment => (
                        <div
                            className="appointment-card"
                            key={appointment._id}
                        >
                            <div className="appointment-info">

                                <h3>
                                    {appointment.serviceId?.name || "שיעור"}
                                </h3>

                                <p>
                                    תאריך ושעה:{" "}
                                    {new Date(appointment.startTime).toLocaleString("he-IL")}
                                </p>

                                <p>
                                    משך השיעור: {appointment.lengthTime} דקות
                                </p>

                                <p>
                                    משתתפות: {appointment.participants?.length || 0}
                                    {" / "}
                                    {appointment.maxParticipants}
                                </p>

                                <p>
                                    סניף: {appointment.branch}
                                </p>

                                <p>
                                    סטטוס: {appointment.status}
                                </p>

                            </div>

                            <div className="appointment-actions">

                                <button
                                    onClick={() => showAppointment(appointment._id)}
                                >
                                    פרטים ומשתתפות
                                </button>

                                <button
                                    onClick={() => editAppointment(appointment._id)}
                                >
                                    עריכה
                                </button>

                                <button
                                    onClick={() => deleteAppointment(appointment._id)}
                                >
                                    מחיקה
                                </button>

                            </div>
                        </div>
                    ))}

                </div>
            )}

        </div>
    )
}

export default ProviderAppointments