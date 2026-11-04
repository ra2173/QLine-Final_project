import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function AdminAppointments() {
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // טעינת כל השיעורים
    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token")

            const response = await fetch(
                "http://localhost:2173/api/appointments",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const data = await response.json()

            if (!response.ok)
                throw new Error(data.message || "טעינת השיעורים נכשלה")

            setAppointments(data)

        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    // מחיקת שיעור
    const handleDelete = async (id) => {
        if (!window.confirm("האם את בטוחה שברצונך למחוק את השיעור?"))
            return

        try {
            const token = localStorage.getItem("token")

            const response = await fetch(
                "http://localhost:2173/api/appointments",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ id })
                }
            )

            const data = await response.json()

            if (!response.ok)
                throw new Error(data.message || "מחיקת השיעור נכשלה")

            setAppointments(prev =>
                prev.filter(appointment => appointment._id !== id)
            )

        } catch (error) {
            setError(error.message)
        }
    }

    if (loading)
        return <p>טוען שיעורים...</p>

    return (
        <div>
            <h1>ניהול שיעורים</h1>

            <button onClick={() => navigate("/admin")}>
                חזרה לדף הבית
            </button>

            <button onClick={() => navigate("/admin/appointments/new")}>
                יצירת שיעור חדש
            </button>

            {error && <p>{error}</p>}

            {appointments.length === 0 ? (
                <p>לא נמצאו שיעורים</p>
            ) : (
                <div>
                    {appointments.map(appointment => (
                        <div key={appointment._id}>
                            <h3>
                                {appointment.serviceId?.name || "שיעור"}
                            </h3>

                            <p>
                                מדריכה: {appointment.providerId?.name}
                                {" "}
                                {appointment.providerId?.lastName}
                            </p>

                            <p>
                                תאריך:
                                {" "}
                                {new Date(appointment.startTime).toLocaleDateString("he-IL")}
                            </p>

                            <p>
                                שעה:
                                {" "}
                                {new Date(appointment.startTime).toLocaleTimeString("he-IL", {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </p>

                            <p>סניף: {appointment.branch}</p>
                            <p>משך השיעור: {appointment.lengthTime} דקות</p>

                            <p>
                                משתתפים: {appointment.participants || 0}
                                {" / "}
                                {appointment.maxParticipants}
                            </p>

                            <button
                                onClick={() =>
                                    navigate(`/admin/appointments/edit/${appointment._id}`)
                                }
                            >
                                עריכה
                            </button>

                            <button
                                onClick={() => handleDelete(appointment._id)}
                            >
                                מחיקה
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AdminAppointments