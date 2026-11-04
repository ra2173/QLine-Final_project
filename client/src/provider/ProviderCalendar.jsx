
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { addDays, addWeeks, format, startOfWeek, isSameDay } from "date-fns"
import { he } from "date-fns/locale"

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

    const [week, setWeek] = useState(new Date())
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const firstDay = startOfWeek(week, { weekStartsOn: 0 })
    const lastDay = addDays(firstDay, 7)

    const fetchAppointments = async () => {
        try {
            setLoading(true)
            setError("")

            const token = localStorage.getItem("token")

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

            // מציגים רק שיעורים של המדריכה בשבוע הנבחר
            const weeklyAppointments = data.filter(appointment => {
                const startTime = new Date(appointment.startTime)

                return startTime >= firstDay &&
                    startTime < lastDay
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

    if (loading) return <p>טוען שיעורים...</p>

    if (error) return <p>{error}</p>

    return (
        <div dir="rtl">
            <h2>לוח השיעורים שלי</h2>

            <button onClick={() => setWeek(addWeeks(week, -1))}>
                שבוע קודם
            </button>

            <button onClick={() => setWeek(new Date())}>
                השבוע
            </button>

            <button onClick={() => setWeek(addWeeks(week, 1))}>
                שבוע הבא
            </button>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, minmax(130px, 1fr))",
                gap: "8px",
                overflowX: "auto",
                marginTop: "16px"
            }}>

                {days.map(day => {
                    const dayAppointments = appointments
                        .filter(appointment =>
                            isSameDay(
                                new Date(appointment.startTime),
                                day
                            )
                        )
                        .sort((a, b) =>
                            new Date(a.startTime) - new Date(b.startTime)
                        )

                    return (
                        <div key={day.toISOString()}>
                            <h3>{format(day, "EEEE", { locale: he })}</h3>
                            <div>{format(day, "dd/MM/yyyy")}</div>
                            <div>{hebrewDate(day)}</div>

                            {dayAppointments.length === 0 && (
                                <p>אין שיעורים</p>
                            )}

                            {dayAppointments.map(appointment => {
                                const participants = appointment.participants || 0
                                const capacity = appointment.maxParticipants || 10

                                return (
                                    <div
                                        key={appointment._id}
                                        style={{
                                            border: "1px solid #aaa",
                                            padding: "8px",
                                            marginTop: "8px",
                                            borderRadius: "6px"
                                        }}
                                    >
                                        <strong>
                                            {format(
                                                new Date(appointment.startTime),
                                                "HH:mm"
                                            )}
                                        </strong>

                                        <div>
                                            שיעור:{" "}
                                            {appointment.serviceId?.name || "שיעור"}
                                        </div>

                                        <div>
                                            משתתפות: {participants}/{capacity}
                                        </div>

                                        <button
                                            onClick={() =>
                                                navigate(`/provider/appointment/${appointment._id}`)
                                            }
                                        >
                                            פרטים נוספים
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>

            <button onClick={() => navigate("/provider/home")}>
                חזרה לדף הבית
            </button>
        </div>
    )
}

export default ProviderCalendar
