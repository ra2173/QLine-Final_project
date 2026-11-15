
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../css/user/UserHome.css"

const UserHome = () => {
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem("token")

                if (!token) {
                    navigate("/user/login", { replace: true })
                    return
                }

                const response = await fetch(
                    "http://localhost:2173/api/appointments/my-appointments",
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

        fetchAppointments()
    }, [navigate])

    const now = new Date()

    const today = new Date(now)
    today.setHours(0, 0, 0, 0)

    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)

    const upcomingAppointments = appointments
        .filter(appointment =>
            new Date(appointment.startTime) >= now
        )
        .sort((a, b) =>
            new Date(a.startTime) - new Date(b.startTime)
        )

    const weeklyAppointments = appointments.filter(appointment => {
        const date = new Date(appointment.startTime)
        return date >= weekStart && date < weekEnd
    })

    const completedAppointments = appointments.filter(appointment => {
        const start = new Date(appointment.startTime)

        const end = new Date(
            start.getTime() +
            Number(appointment.lengthTime || 0) * 60000
        )

        return end < now
    })

    const nextAppointment = upcomingAppointments[0]

    const stats = [
        {
            title: "השיעורים שלי",
            value: appointments.length,
            color: "blue"
        },
        {
            title: "השבוע",
            value: weeklyAppointments.length,
            color: "peach"
        },
        {
            title: "השיעור הבא",
            value: nextAppointment
                ? new Date(nextAppointment.startTime)
                    .toLocaleDateString("he-IL", {
                        day: "numeric",
                        month: "numeric"
                    })
                : "אין",
            color: "blue"
        },
        {
            title: "שיעורים שהסתיימו",
            value: completedAppointments.length,
            color: "peach"
        }
    ]

    const actions = [
        {
            title: "לוח השיעורים",
            description: "צפייה והרשמה לשיעורים",
            path: "/user/calendar"
        },
        {
            title: "השיעורים שלי",
            description: "השיעורים שנרשמתי אליהם",
            path: "/user/appointments"
        },
        {
            title: "רשימת המתנה",
            description: "מעקב אחר שיעורים מלאים",
            path: "/user/waitlist"
        },
        {
            title: "הפרופיל שלי",
            description: "צפייה בפרטים האישיים",
            path: `/user/profile/${localStorage.getItem("userId")}`
        }
    ]

    return (
        <div className="userDashboard" dir="rtl">

            <header className="userDashboardHeader">
                <div>
                    <span className="userDashboardLabel">
                        QLINE / האזור האישי שלי
                    </span>

                    <h1>ברוכה הבאה!</h1>

                    <p>
                        כל מה שצריך לדעת על השיעורים שלך,
                        במקום אחד.
                    </p>
                </div>

                <button
                    className="userDashboardMainButton"
                    onClick={() => navigate("/user/calendar")}
                >
                    הרשמה לשיעור
                </button>
            </header>

            {error && (
                <div className="userDashboardError">
                    {error}
                </div>
            )}

            <section className="userDashboardStats">
                {stats.map(stat => (
                    <div
                        key={stat.title}
                        className="userDashboardStatCard"
                    >
                        <span>{stat.title}</span>

                        <strong className={stat.color}>
                            {loading ? "..." : stat.value}
                        </strong>
                    </div>
                ))}
            </section>

            <div className="userDashboardContent">

                <section className="userDashboardSection">
                    <div className="userDashboardSectionHeader">
                        <h2>פעולות מהירות</h2>
                        <p>כל מה שצריך, במרחק לחיצה</p>
                    </div>

                    <div className="userDashboardActions">
                        {actions.map(action => (
                            <button
                                key={action.path}
                                className="userDashboardAction"
                                onClick={() => navigate(action.path)}
                            >
                                <div>
                                    <h3>{action.title}</h3>
                                    <p>{action.description}</p>
                                </div>

                                <span>←</span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="userDashboardSection">
                    <div className="userDashboardSectionHeader">
                        <h2>השיעורים הקרובים שלי</h2>
                        <p>השיעורים הבאים שנרשמת אליהם</p>
                    </div>

                    <div className="userDashboardLessons">
                        {loading ? (
                            <p className="userDashboardEmpty">
                                טוען שיעורים...
                            </p>
                        ) : upcomingAppointments.length === 0 ? (
                            <p className="userDashboardEmpty">
                                עדיין אין לך שיעורים קרובים
                            </p>
                        ) : (
                            upcomingAppointments.slice(0, 4).map(appointment => (
                                <div
                                    key={appointment._id}
                                    className="userDashboardLesson"
                                    style={{
                                        "--lesson-color":
                                            appointment.serviceId?.color ||
                                            "#7088e8"
                                    }}
                                >
                                    <div className="userDashboardLessonInfo">
                                        <h3>
                                            {appointment.serviceId?.name ||
                                                "שיעור"}
                                        </h3>

                                        <span>
                                            {appointment.branch}
                                        </span>
                                    </div>

                                    <div className="userDashboardLessonDate">
                                        <strong>
                                            {new Date(appointment.startTime)
                                                .toLocaleTimeString("he-IL", {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                        </strong>

                                        <span>
                                            {new Date(appointment.startTime)
                                                .toLocaleDateString("he-IL")}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <button
                        className="userDashboardViewAll"
                        onClick={() => navigate("/user/appointments")}
                    >
                        צפייה בכל השיעורים שלי
                        <span>←</span>
                    </button>
                </section>

            </div>

            <footer className="userDashboardFooter">
                QLINE · האזור האישי שלך
            </footer>

        </div>
    )
}

export default UserHome
