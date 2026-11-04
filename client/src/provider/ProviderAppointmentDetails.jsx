
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

const toLocalDateTime = (date) => {
    const d = new Date(date)
    const offset = d.getTimezoneOffset() * 60000
    return new Date(d.getTime() - offset).toISOString().slice(0, 16)
}

const ProviderAppointmentDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [appointment, setAppointment] = useState(null)
    const [participants, setParticipants] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState({
        startTime: "",
        lengthTime: "",
        branch: "",
        notes: ""
    })

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const token = localStorage.getItem("token")

                const response = await fetch(
                    `http://localhost:2173/api/appointments/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )

                if (!response.ok)
                    throw new Error("טעינת פרטי השיעור נכשלה")

                const data = await response.json()
                setAppointment(data)

                setForm({
                    startTime: toLocalDateTime(data.startTime),
                    lengthTime: data.lengthTime,
                    branch: data.branch,
                    notes: data.notes || ""
                })

                const participantsResponse = await fetch(
                    `http://localhost:2173/api/appointments/${id}/participants`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )

                if (!participantsResponse.ok)
                    throw new Error("טעינת המשתתפות נכשלה")

                setParticipants(await participantsResponse.json())

            } catch (error) {
                console.error(error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchDetails()
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleUpdate = async (e) => {
        e.preventDefault()

        try {
            const token = localStorage.getItem("token")

            const response = await fetch(
                "http://localhost:2173/api/appointments",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        _id: id,
                        serviceId: appointment.serviceId._id,
                        startTime: form.startTime,
                        lengthTime: Number(form.lengthTime),
                        branch: form.branch,
                        notes: form.notes
                    })
                }
            )

            const data = await response.json()

            if (!response.ok)
                throw new Error(data.message || "עדכון השיעור נכשל")

            setEditing(false)
            navigate("/provider/calendar")

        } catch (error) {
            console.error(error)
            setError(error.message)
        }
    }

    if (loading) return <p>טוען פרטי שיעור...</p>
    if (error) return <p>{error}</p>
    if (!appointment) return <p>השיעור לא נמצא</p>

    const handleDelete = async () => {
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

            navigate("/provider/calendar")

        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div dir="rtl">
            <h2>פרטי השיעור</h2>

            <p>שירות: {appointment.serviceId?.name}</p>
            <p>
                מדריכה: {appointment.providerId?.name}{" "}
                {appointment.providerId?.lastName}
            </p>

            {editing ? (
                <form onSubmit={handleUpdate}>
                    <label>תאריך ושעה</label>
                    <input
                        type="datetime-local"
                        name="startTime"
                        value={form.startTime}
                        onChange={handleChange}
                        required
                    />

                    <label>משך השיעור בדקות</label>
                    <input
                        type="number"
                        name="lengthTime"
                        value={form.lengthTime}
                        onChange={handleChange}
                        min="1"
                        required
                    />

                    <label>סניף</label>
                    <input
                        name="branch"
                        value={form.branch}
                        onChange={handleChange}
                        required
                    />

                    <label>הערות</label>
                    <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                    />

                    <button type="submit">שמירת שינויים</button>
                    <button type="button" onClick={() => setEditing(false)}>
                        ביטול
                    </button>
                </form>
            ) : (
                <>
                    <p>
                        תאריך: {new Date(appointment.startTime).toLocaleDateString("he-IL")}
                    </p>
                    <p>
                        שעה: {new Date(appointment.startTime).toLocaleTimeString("he-IL", {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </p>
                    <p>משך: {appointment.lengthTime} דקות</p>
                    <p>סניף: {appointment.branch}</p>
                    <p>הערות: {appointment.notes || "אין הערות"}</p>
                    <p>
                        משתתפות: {participants.length}/{appointment.maxParticipants}
                    </p>

                    <h3>רשימת משתתפות</h3>

                    {participants.length === 0 ? (
                        <p>עדיין אין נרשמות לשיעור</p>
                    ) : (
                        participants.map(participant => (
                            <div key={participant._id}>
                                {participant.name} {participant.lastName}
                                {participant.phone && ` - ${participant.phone}`}
                            </div>
                        ))
                    )}

                    <button onClick={() => setEditing(true)}>
                        עריכת שיעור
                    </button>
                    <button onClick={handleDelete}>
                        מחיקת שיעור
                    </button>
                </>
            )}

            <button onClick={() => navigate("/provider/calendar")}>
                חזרה ללוח השיעורים
            </button>
        </div>
    )
}

export default ProviderAppointmentDetails
