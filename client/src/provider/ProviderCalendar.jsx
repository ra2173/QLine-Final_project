
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    addDays,
    addWeeks,
    format,
    startOfWeek,
    isSameDay
} from "date-fns"
import { he } from "date-fns/locale"
import "../css/provider/ProviderCalendar.css"

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

const ProviderCalendar = () => {
    const navigate = useNavigate()

    const [selectedDate, setSelectedDate] = useState(new Date())
    const [view, setView] = useState("weekly")
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const firstDay = startOfWeek(selectedDate, {
        weekStartsOn: 0
    })

    const lastDay = addDays(firstDay, 6)

    const days = []

    for (let i = 0; i < 7; i++) {
        days.push(addDays(firstDay, i))
    }

    const displayedDays =
        view === "weekly" ? days : [selectedDate]

    const fetchAppointments = async () => {
        try {
            setLoading(true)
            setError("")

            const token = localStorage.getItem("token")
            const providerId = localStorage.getItem("providerId")

            if (!token) {
                navigate("/provider/login")
                return
            }

            const response = await fetch(
                "http://localhost:2173/api/appointments",
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

            const allAppointments = Array.isArray(data)
                ? data
                : data.appointments || []

            const myAppointments = allAppointments.filter(appointment => {
                const appointmentProviderId =
                    appointment.providerId?._id ||
                    appointment.providerId

                return String(appointmentProviderId) === String(providerId)
            })

            setAppointments(myAppointments)

        } catch (error) {
            console.error(error)
            setError(error.message || "לא הצלחנו לטעון את השיעורים")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    const changeDate = (direction) => {
        if (view === "weekly") {
            setSelectedDate(addWeeks(selectedDate, direction))
        } else {
            setSelectedDate(addDays(selectedDate, direction))
        }
    }

    const getDayAppointments = (day) => {
        return appointments
            .filter(appointment =>
                isSameDay(new Date(appointment.startTime), day)
            )
            .sort((a, b) =>
                new Date(a.startTime) - new Date(b.startTime)
            )
    }

    return (
        <div className="providerCalendarPage" dir="rtl">
            <div className="providerCalendarContainer">

                <div className="providerCalendarHeader">
                    <h1>השיעורים הקרובים</h1>
                    <p>בחרי יום כדי לראות את השיעורים הזמינים</p>
                </div>

                <div className="providerCalendarToolbar">

                    <div className="providerCalendarViewSwitch">
                        <button
                            className={view === "weekly" ? "active" : ""}
                            onClick={() => setView("weekly")}
                        >
                            שבועי
                        </button>

                        <button
                            className={view === "daily" ? "active" : ""}
                            onClick={() => setView("daily")}
                        >
                            יומי
                        </button>
                    </div>

                    <div className="providerCalendarDateNavigation">
                        <button onClick={() => changeDate(-1)}>
                            ‹
                        </button>

                        <strong>
                            {view === "weekly"
                                ? `${format(firstDay, "dd/MM/yyyy")} - ${format(lastDay, "dd/MM/yyyy")}`
                                : format(selectedDate, "dd/MM/yyyy")}
                        </strong>

                        <button onClick={() => changeDate(1)}>
                            ›
                        </button>
                    </div>

                    <button
                        className="providerCalendarToday"
                        onClick={() => setSelectedDate(new Date())}
                    >
                        היום
                    </button>
                </div>

                <div className="providerCalendarDivider"></div>

                {error && (
                    <p className="providerCalendarError">{error}</p>
                )}

                {loading ? (
                    <p className="providerCalendarLoading">
                        טוען שיעורים...
                    </p>
                ) : (
                    <div
                        className={`providerCalendarGrid ${
                            view === "daily" ? "daily" : ""
                        }`}
                    >
                        {displayedDays.map(day => {
                            const dayAppointments = getDayAppointments(day)

                            return (
                                <div
                                    className="providerCalendarDay"
                                    key={day.toISOString()}
                                >
                                    <div className="providerCalendarDayHeader">
                                        <h3>
                                            {format(day, "EEEE", { locale: he })}
                                        </h3>

                                        <span>
                                            {format(day, "dd/MM")}
                                        </span>

                                        <span>
                                            {hebrewDate(day)}
                                        </span>
                                    </div>

                                    <div className="providerCalendarDayBody">
                                        {dayAppointments.length === 0 && (
                                            <p className="providerCalendarEmpty">
                                                אין שיעורים
                                            </p>
                                        )}

                                        {dayAppointments.map(appointment => {
                                            const participants =
                                                appointment.participantsCount ??
                                                appointment.participants?.length ??
                                                0

                                            const capacity =
                                                appointment.maxParticipants || 10

                                            return (
                                                <div
                                                    className="providerCalendarLesson"
                                                    key={appointment._id}
                                                >
                                                    <div className="providerCalendarLessonTime">
                                                        {format(
                                                            new Date(appointment.startTime),
                                                            "HH:mm"
                                                        )}
                                                    </div>

                                                    <div className="providerCalendarLessonName">
                                                        {appointment.serviceId?.name || "שיעור"}
                                                    </div>

                                                    <div className="providerCalendarLessonCount">
                                                        משתתפות: {participants}/{capacity}
                                                    </div>

                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/provider/appointment/${appointment._id}`
                                                            )
                                                        }
                                                    >
                                                        פרטים נוספים
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

            </div>
        </div>
    )
}

export default ProviderCalendar
