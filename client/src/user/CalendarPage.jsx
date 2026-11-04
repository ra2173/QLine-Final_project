import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { addDays, addWeeks, format, startOfWeek, isSameDay } from "date-fns"
import { he } from "date-fns/locale"
import "../css/user/CalendarPage.css"

const hebrewDate = (date) => {//המרה לתאריך עברי
    const parts = new Intl.DateTimeFormat("he-u-ca-hebrew", {
        day: "numeric",
        month: "long"
    }).formatToParts(date)

    const day = Number(parts.find(part => part.type === "day").value)
    const month = parts.find(part => part.type === "month").value
    const hebrewNumbers = [
        "",
        "א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ז׳", "ח׳", "ט׳",
        "י׳", "י״א", "י״ב", "י״ג", "י״ד", "ט״ו", "ט״ז",
        "י״ז", "י״ח", "י״ט", "כ׳", "כ״א", "כ״ב", "כ״ג",
        "כ״ד", "כ״ה", "כ״ו", "כ״ז", "כ״ח", "כ״ט", "ל׳"
    ]
    return `${hebrewNumbers[day]} ב${month}`
}

const CalendarPage = () => {
    const navigate = useNavigate()
    const [week, setWeek] = useState(new Date())
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedDay, setSelectedDay] = useState(new Date())
    const [viewMode, setViewMode] = useState("week")

    // חישוב של היום הראשון והיום האחרון של השבוע
    const firstDay = startOfWeek(week, { weekStartsOn: 0 })
    const lastDay = addDays(firstDay, 7)

    const fetchAppointments = async () => {
        try {
            setLoading(true)
            setError("")

            const token = localStorage.getItem("token")
            if (!token) {
                navigate("/user/login")
                return
            }

            const response = await fetch(
                "http://localhost:2173/api/appointments/available",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            if (!response.ok) {
                throw new Error("טעינת השיעורים נכשלה")
            }

            const data = await response.json()

            // רק שיעורים שנמצאים בשבוע הנבחר
            const weeklyAppointments = data.filter((appointment) => {
                const startTime = new Date(appointment.startTime)
                return startTime >= firstDay && startTime < lastDay
            })
            setAppointments(weeklyAppointments)

        } catch (error) {
            console.error(error)
            setError(error.message || "לא הצלחנו לטעון את השיעורים")

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [week])

    const days = []
    for (let i = 0; i < 7; i++) {
        days.push(addDays(firstDay, i))
    }

    if (loading) {
        return <p>טוען שיעורים...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    return (
        <div className="calendar-page" dir="rtl">

            <div className="calendar-container">

                {/* כותרת */}
                <div className="calendar-header">
                    <h2>השיעורים הקרובים</h2>
                    <p>בחרי יום כדי לראות את השיעורים הזמינים</p>
                </div>

                {/* סרגל מעבר בין שבועות */}
                <div className="calendar-toolbar">

                    {/* בחירת סוג תצוגה */}
                    <div className="view-switch">
                        <button
                            className={viewMode === "week" ? "active" : ""}
                            onClick={() => setViewMode("week")}
                        >
                            שבועי
                        </button>

                        <button
                            className={viewMode === "day" ? "active" : ""}
                            onClick={() => setViewMode("day")}
                        >
                            יומי
                        </button>
                    </div>

                    {/* ניווט לפי סוג התצוגה */}
                    <div className="week-navigation">

                        <button
                            onClick={() => {
                                if (viewMode === "week") {
                                    setWeek(addWeeks(week, -1))
                                    setSelectedDay(addDays(selectedDay, -7))
                                } else {
                                    setSelectedDay(addDays(selectedDay, -1))
                                }
                            }}
                        >
                            ❮
                        </button>

                        <strong>
                            {viewMode === "week"
                                ? `${format(firstDay, "dd/MM/yyyy")} - ${format(addDays(firstDay, 6), "dd/MM/yyyy")}`
                                : format(selectedDay, "dd/MM/yyyy")
                            }
                        </strong>

                        <button
                            onClick={() => {
                                if (viewMode === "week") {
                                    setWeek(addWeeks(week, 1))
                                    setSelectedDay(addDays(selectedDay, 7))
                                } else {
                                    setSelectedDay(addDays(selectedDay, 1))
                                }
                            }}
                        >
                            ❯
                        </button>

                    </div>

                    <button
                        className="today-button"
                        onClick={() => {
                            setWeek(new Date())
                            setSelectedDay(new Date())
                        }}
                    >
                        היום
                    </button>

                </div>

                {/* שבעת ימי השבוע */}
                <div className="calendar-days">

                    {viewMode === "week" ? (

                        /* תצוגה שבועית */
                        <div className="weekly-appointments">

                            {days.map((day) => {

                                const dayAppointments = appointments
                                    .filter((appointment) =>
                                        isSameDay(new Date(appointment.startTime), day)
                                    )
                                    .sort((a, b) =>
                                        new Date(a.startTime) - new Date(b.startTime)
                                    )

                                return (
                                    <div
                                        key={day.toISOString()}
                                        className="weekly-day-column"
                                    >

                                        <h3>{format(day, "EEEE", { locale: he })}</h3>
                                        <p>{hebrewDate(day)}</p>

                                        {dayAppointments.length === 0 && (
                                            <p className="no-classes">אין שיעורים</p>
                                        )}

                                        {dayAppointments.map((appointment) => (

                                            <div
                                                key={appointment._id}
                                                className="weekly-class"
                                            >
                                                <strong>
                                                    {format(
                                                        new Date(appointment.startTime),
                                                        "HH:mm"
                                                    )}
                                                </strong>

                                                <p>
                                                    {appointment.serviceId?.name || "שיעור"}
                                                </p>

                                                <span>
                                                    {appointment.providerId?.name || "לא צוין"}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        navigate(`/appointment/${appointment._id}`)
                                                    }
                                                >
                                                    פרטים
                                                </button>
                                            </div>

                                        ))}

                                    </div>
                                )
                            })}

                        </div>

                    ) : (

                        <div className="daily-appointments">

                            <h3>
                                שיעורים ליום {format(selectedDay, "EEEE", { locale: he })}
                            </h3>

                            {appointments
                                .filter((appointment) =>
                                    isSameDay(
                                        new Date(appointment.startTime),
                                        selectedDay
                                    )
                                )
                                .sort((a, b) =>
                                    new Date(a.startTime) - new Date(b.startTime)
                                )
                                .map((appointment, index) => {

                                    const participants = appointment.participants?.length || 0
                                    const capacity = appointment.maxParticipants || 10
                                    const places = Math.max(0, capacity - participants)

                                    return (
                                        <div
                                            key={appointment._id}
                                            className={`appointment-card color-${index % 3}`}
                                        >

                                            <div className="appointment-info">

                                                <strong className="appointment-time">
                                                    {format(
                                                        new Date(appointment.startTime),
                                                        "HH:mm"
                                                    )}
                                                </strong>

                                                <h4>
                                                    {appointment.serviceId?.name || "שיעור"}
                                                </h4>

                                                <p>
                                                    מדריכה:{" "}
                                                    {appointment.providerId?.name || "לא צוין"}
                                                    {" "}
                                                    {appointment.providerId?.lastName || ""}
                                                </p>

                                            </div>

                                            <div className="appointment-capacity">
                                                <span>מקומות פנויים</span>
                                                <strong>{places}</strong>
                                            </div>

                                            <button
                                                className="appointment-button"
                                                onClick={() =>
                                                    navigate(`/appointment/${appointment._id}`)
                                                }
                                            >
                                                פרטים נוספים
                                            </button>

                                        </div>
                                    )
                                })
                            }

                            {appointments.filter((appointment) =>
                                isSameDay(
                                    new Date(appointment.startTime),
                                    selectedDay
                                )
                            ).length === 0 && (
                                    <div className="empty-appointments">
                                        <p>אין שיעורים ביום זה</p>
                                    </div>
                                )}

                        </div>

                    )}

                </div>

                {/* השיעורים של היום שנבחר */}
                <div className="daily-appointments">

                    <h3>
                        שיעורים ליום {format(selectedDay, "EEEE", { locale: he })}
                    </h3>

                    {appointments
                        .filter((appointment) =>
                            isSameDay(
                                new Date(appointment.startTime),
                                selectedDay
                            )
                        )
                        .sort((a, b) =>
                            new Date(a.startTime) - new Date(b.startTime)
                        )
                        .map((appointment, index) => {

                            const participants = appointment.participants?.length || 0
                            const capacity = appointment.maxParticipants || 10
                            const places = Math.max(0, capacity - participants)

                            return (

                                <div
                                    key={appointment._id}
                                    className={`appointment-card color-${index % 3}`}
                                >

                                    <div className="appointment-info">

                                        <strong className="appointment-time">
                                            {format(
                                                new Date(appointment.startTime),
                                                "HH:mm"
                                            )}
                                        </strong>

                                        <h4>
                                            {appointment.serviceId?.name || "שיעור"}
                                        </h4>

                                        <p>
                                            מדריכה:{" "}
                                            {appointment.providerId?.name || "לא צוין"}
                                            {" "}
                                            {appointment.providerId?.lastName || ""}
                                        </p>

                                    </div>

                                    <div className="appointment-capacity">
                                        <span>מקומות פנויים</span>
                                        <strong>{places}</strong>
                                    </div>

                                    <button
                                        className="appointment-button"
                                        onClick={() =>
                                            navigate(`/appointment/${appointment._id}`)
                                        }
                                    >
                                        פרטים נוספים
                                    </button>

                                </div>

                            )
                        })
                    }

                    {appointments.filter((appointment) =>
                        isSameDay(
                            new Date(appointment.startTime),
                            selectedDay
                        )
                    ).length === 0 && (

                            <div className="empty-appointments">
                                <p>אין שיעורים ביום זה</p>
                            </div>

                        )}

                </div>

            </div>

        </div>
    )
}

export default CalendarPage
