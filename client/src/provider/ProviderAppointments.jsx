
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "../css/provider/ProviderAppointments.css"

const ProviderAppointments = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("all")
    const [deletingId, setDeletingId] = useState(null)

    // טעינת השיעורים של המורה
    const fetchAppointments = async () => {
        try {
            setLoading(true)
            setError("")

            const token = localStorage.getItem("token")

            if (!token) {
                navigate("/provider/login", { replace: true })
                return
            }

            const response = await fetch(
                "http://localhost:2173/api/appointments/provider/mine",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (!response.ok) {
                throw new Error("טעינת השיעורים נכשלה")
            }

            const data = await response.json()

            setAppointments(
                Array.isArray(data)
                    ? data
                    : data.appointments || []
            )

        } catch (err) {
            console.error(err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    // מחיקת שיעור
    const deleteAppointment = async (id) => {
        const confirmed = window.confirm(
            "האם את בטוחה שברצונך למחוק את השיעור?"
        )

        if (!confirmed) return

        try {
            setDeletingId(id)

            const token = localStorage.getItem("token")

            const response = await fetch(
                "http://localhost:2173/api/appointments",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ _id: id })
                }
            )

            if (!response.ok) {
                const data = await response.json().catch(() => ({}))

                throw new Error(
                    data.message || "מחיקת השיעור נכשלה"
                )
            }

            setAppointments(prev =>
                prev.filter(appointment =>
                    appointment._id !== id
                )
            )

        } catch (err) {
            alert(err.message)
        } finally {
            setDeletingId(null)
        }
    }

    const now = new Date()

    // חיפוש וסינון
    const filteredAppointments = appointments
        .filter(appointment => {
            const serviceName =
                appointment.serviceId?.name || ""

            const branch = appointment.branch || ""

            const matchesSearch =
                serviceName.toLowerCase().includes(
                    search.toLowerCase()
                ) ||
                branch.toLowerCase().includes(
                    search.toLowerCase()
                )

            const start = new Date(appointment.startTime)

            const end = new Date(
                start.getTime() +
                Number(appointment.lengthTime || 0) * 60000
            )

            const matchesFilter =
                filter === "all" ||
                (filter === "upcoming" && end > now) ||
                (filter === "past" && end <= now)

            return matchesSearch && matchesFilter
        })
        .sort((a, b) =>
            new Date(a.startTime) - new Date(b.startTime)
        )

    return (
        <div className="providerAppointmentsPage" dir="rtl">

            {/* כותרת */}
            <div className="providerAppointmentsHeader">
                <div>
                    <h1>ניהול השיעורים שלי</h1>
                    <p>
                        צפייה, עריכה ומחיקה של השיעורים שלך
                    </p>
                </div>

                <button
                    className="providerAppointmentsCalendar"
                    onClick={() => navigate("/provider/calendar")}
                >
                    מעבר ללוח השיעורים
                </button>
            </div>

            {/* חיפוש וסינון */}
            <div className="providerAppointmentsToolbar">

                <input
                    type="text"
                    placeholder="חיפוש שיעור או סניף..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="providerAppointmentsFilters">
                    <button
                        className={filter === "all" ? "active" : ""}
                        onClick={() => setFilter("all")}
                    >
                        כל השיעורים
                    </button>

                    <button
                        className={filter === "upcoming" ? "active" : ""}
                        onClick={() => setFilter("upcoming")}
                    >
                        שיעורים קרובים
                    </button>

                    <button
                        className={filter === "past" ? "active" : ""}
                        onClick={() => setFilter("past")}
                    >
                        שיעורים שהסתיימו
                    </button>
                </div>
            </div>

            {/* מספר שיעורים */}
            <p className="providerAppointmentsCount">
                נמצאו {filteredAppointments.length} שיעורים
            </p>

            {error && (
                <p className="providerAppointmentsError">
                    {error}
                </p>
            )}

            {loading ? (
                <p className="providerAppointmentsMessage">
                    טוען שיעורים...
                </p>
            ) : filteredAppointments.length === 0 ? (
                <p className="providerAppointmentsMessage">
                    לא נמצאו שיעורים
                </p>
            ) : (

                <div className="providerAppointmentsGrid">

                    {filteredAppointments.map(appointment => {

                        const start = new Date(
                            appointment.startTime
                        )

                        const end = new Date(
                            start.getTime() +
                            Number(appointment.lengthTime || 0) * 60000
                        )

                        const isPast = end <= now

                        const participants =
                            appointment.participantsCount ??
                            appointment.participants?.length ??
                            0

                        const capacity =
                            appointment.maxParticipants || 10

                        const serviceColor =
                            appointment.serviceId?.color ||
                            "#7088e8"

                        return (
                            <div
                                key={appointment._id}
                                className={`providerAppointmentCard ${isPast ? "past" : ""
                                    }`}
                                style={{
                                    "--lesson-color": serviceColor
                                }}
                            >

                                {/* שם השיעור */}
                                <div className="providerAppointmentCardHeader">
                                    <div>
                                        <h2>
                                            {appointment.serviceId?.name ||
                                                "שיעור"}
                                        </h2>

                                        <span>
                                            {appointment.branch}
                                        </span>
                                    </div>

                                    <span className="providerAppointmentStatus">
                                        {isPast ? "הסתיים" : "מתוכנן"}
                                    </span>
                                </div>

                                {/* פרטי השיעור */}
                                <div className="providerAppointmentDetails">

                                    <div>
                                        <span>תאריך</span>
                                        <strong>
                                            {start.toLocaleDateString("he-IL")}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>שעה</span>
                                        <strong>
                                            {start.toLocaleTimeString(
                                                "he-IL",
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                }
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>משך השיעור</span>
                                        <strong>
                                            {appointment.lengthTime} דקות
                                        </strong>
                                    </div>

                                    <div>
                                        <span>משתתפות</span>
                                        <strong>
                                            {participants}/{capacity}
                                        </strong>
                                    </div>

                                </div>

                                {/* כפתורי ניהול */}
                                <div className="providerAppointmentActions">

                                    <button
    className="providerAppointmentEdit"
    onClick={() =>
        navigate(
            `/provider/appointment/${appointment._id}`,
            {
                state: {
                    backgroundLocation: location
                }
            }
        )
    }
>
    פרטים ועריכה
</button>

                                    <button
                                        className="providerAppointmentDelete"
                                        disabled={
                                            deletingId === appointment._id
                                        }
                                        onClick={() =>
                                            deleteAppointment(
                                                appointment._id
                                            )
                                        }
                                    >
                                        {deletingId === appointment._id
                                            ? "מוחק..."
                                            : "מחיקה"}
                                    </button>

                                </div>

                            </div>
                        )
                    })}

                </div>
            )}
        </div>
    )
}

export default ProviderAppointments
