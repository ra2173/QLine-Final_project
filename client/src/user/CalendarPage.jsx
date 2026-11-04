import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { addDays, addWeeks, addMinutes, format, startOfWeek, isSameDay } from "date-fns"
import { he } from "date-fns/locale"
import "../css/user/CalendarPage.css"
import AppointmentDetails from "./AppointmentDetails"


// המרה לתאריך עברי
const hebrewDate = (date) => {
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
    const [selectedDay, setSelectedDay] = useState(new Date())

    const [viewMode, setViewMode] = useState("week")

    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedAppointment, setSelectedAppointment] = useState(null)


    // חישוב היום הראשון והיום האחרון של השבוע
    const firstDay = startOfWeek(week, { weekStartsOn: 0 })
    const lastDay = addDays(firstDay, 7)


    // טעינת שיעורים מהשרת
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
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
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


    // טעינה מחדש כאשר עוברים לשבוע אחר
    useEffect(() => {
        fetchAppointments()
    }, [week])


    // יצירת מערך של שבעת ימי השבוע
    const days = []

    for (let i = 0; i < 7; i++) {
        days.push(addDays(firstDay, i))
    }


    // מעבר ליום אחר
    const changeDay = (amount) => {

        const newDay = addDays(selectedDay, amount)

        setSelectedDay(newDay)

        // אם עברנו לשבוע אחר, מעדכנים גם את השבוע
        setWeek(newDay)
    }


    // מעבר לשבוע אחר
    const changeWeek = (amount) => {

        const newWeek = addWeeks(week, amount)

        setWeek(newWeek)
        setSelectedDay(newWeek)
    }


    // חזרה להיום
    const goToToday = () => {

        const today = new Date()

        setWeek(today)
        setSelectedDay(today)
    }


    // שיעורי היום הנבחר
    const selectedDayAppointments = appointments
        .filter((appointment) => {
            return isSameDay(
                new Date(appointment.startTime),
                selectedDay
            )
        })
        .sort((a, b) => {
            return new Date(a.startTime) - new Date(b.startTime)
        })


    if (loading) {
        return <p className="calendar-message">טוען שיעורים...</p>
    }

    if (error) {
        return <p className="calendar-message">{error}</p>
    }


    return (

        <div className="calendar-page" dir="rtl">

            <div className="calendar-container">

                {/* כותרת */}
                <div className="calendar-header">

                    <h2>השיעורים הקרובים</h2>

                    <p>
                        בחרי יום כדי לראות את השיעורים הזמינים
                    </p>

                </div>


                {/* סרגל ניווט */}
                <div className="calendar-toolbar">

                    {/* בחירת תצוגה */}
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


                    {/* ניווט בין ימים או שבועות */}
                    <div className="week-navigation">

                        <button
                            onClick={() => {
                                if (viewMode === "week") {
                                    changeWeek(-1)
                                } else {
                                    changeDay(-1)
                                }
                            }}
                        >
                            ‹
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
                                    changeWeek(1)
                                } else {
                                    changeDay(1)
                                }
                            }}
                        >
                            ›
                        </button>

                    </div>


                    <button
                        className="today-button"
                        onClick={goToToday}
                    >
                        היום
                    </button>

                </div>

                {/* תצוגה יומית */}
                {viewMode === "day" && (

                    <>
                        {/* סרגל שבעת הימים */}
                        <div className="calendar-days">

                            {days.map((day) => (

                                <button
                                    key={day.toISOString()}
                                    className={`calendar-day ${isSameDay(day, selectedDay) ? "active" : ""
                                        }`}
                                    onClick={() => setSelectedDay(day)}
                                >

                                    <span className="day-name">
                                        {format(day, "EEEE", { locale: he })}
                                    </span>

                                    <span className="day-date">
                                        {format(day, "dd/MM")}
                                    </span>

                                    <span className="day-hebrew">
                                        {hebrewDate(day)}
                                    </span>

                                </button>

                            ))}

                        </div>


                        {/* שיעורי היום הנבחר */}
                        <div className="daily-appointments">

                            <h3>
                                שיעורים ליום {format(selectedDay, "EEEE", { locale: he })}
                            </h3>

                            {selectedDayAppointments.map((appointment, index) => {

                                const participants = appointment.participants?.length || 0
                                const capacity = appointment.maxParticipants || 10
                                const places = Math.max(0, capacity - participants)

                                const startTime = new Date(appointment.startTime)

                                const endTime = addMinutes(
                                    startTime,
                                    appointment.lengthTime || 0
                                )

                                return (

                                    <div
                                        key={appointment._id}
                                        className={`appointment-card color-${index % 3}`}
                                    >

                                        <div className="appointment-info">

                                            <strong className="appointment-time">
                                                {format(startTime, "HH:mm")}
                                                {" - "}
                                                {format(endTime, "HH:mm")}
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
                                            onClick={() => setSelectedAppointment(appointment._id)}
                                        >
                                            פרטים נוספים
                                        </button>

                                    </div>
                                )
                            })}

                            {selectedDayAppointments.length === 0 && (
                                <div className="empty-appointments">
                                    <p>אין שיעורים ביום זה</p>
                                </div>
                            )}

                        </div>

                    </>
                )}


                {/* תצוגה שבועית - טבלה של שבעה ימים */}
                {viewMode === "week" && (

                    <div className="weekly-calendar">

                        {days.map((day) => {

                            // כל השיעורים של היום הנוכחי
                            const dayAppointments = appointments
                                .filter((appointment) =>
                                    isSameDay(
                                        new Date(appointment.startTime),
                                        day
                                    )
                                )
                                .sort((a, b) =>
                                    new Date(a.startTime) - new Date(b.startTime)
                                )

                            return (

                                <div
                                    key={day.toISOString()}
                                    className="weekly-day-column"
                                >

                                    {/* כותרת היום */}
                                    <div className="weekly-day-header">

                                        <strong>
                                            {format(day, "EEEE", { locale: he })}
                                        </strong>

                                        <span>
                                            {format(day, "dd/MM")}
                                        </span>

                                        <span>
                                            {hebrewDate(day)}
                                        </span>

                                    </div>


                                    {/* שיעורי היום */}
                                    <div className="weekly-day-appointments">

                                        {dayAppointments.map((appointment, index) => {

                                            const participants =
                                                appointment.participants?.length || 0

                                            const capacity =
                                                appointment.maxParticipants || 10

                                            const places = Math.max(
                                                0,
                                                capacity - participants
                                            )

                                            const startTime = new Date(
                                                appointment.startTime
                                            )

                                            const endTime = addMinutes(
                                                startTime,
                                                appointment.lengthTime || 0
                                            )

                                            return (

                                                <div
                                                    key={appointment._id}
                                                    className={`weekly-appointment-card color-${index % 3}`}
                                                >

                                                    <strong className="weekly-time">
                                                        {format(startTime, "HH:mm")}
                                                        {" - "}
                                                        {format(endTime, "HH:mm")}
                                                    </strong>

                                                    <h4>
                                                        {appointment.serviceId?.name || "שיעור"}
                                                    </h4>

                                                    <p>
                                                        {appointment.providerId?.name || "לא צוין"}
                                                        {" "}
                                                        {appointment.providerId?.lastName || ""}
                                                    </p>

                                                    <span className="weekly-places">
                                                        {places} מקומות פנויים
                                                    </span>

                                                    <button
                                                        onClick={() => setSelectedAppointment(appointment._id)}
                                                    >
                                                        פרטים
                                                    </button>

                                                </div>

                                            )
                                        })}

                                        {dayAppointments.length === 0 && (
                                            <p className="weekly-no-appointments">
                                                אין שיעורים
                                            </p>
                                        )}

                                    </div>

                                </div>

                            )
                        })}

                    </div>

                )}

                {selectedAppointment && (
                    <div
                        className="modal-overlay"
                        onClick={() => setSelectedAppointment(null)}
                    >
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="modal-close"
                                onClick={() => setSelectedAppointment(null)}
                            >
                                ×
                            </button>

                            <AppointmentDetails id={selectedAppointment} />
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}


export default CalendarPage