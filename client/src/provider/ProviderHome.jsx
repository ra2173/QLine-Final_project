
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../css/provider/ProviderHome.css"

const ProviderHome = () => {
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("providerId")
        localStorage.removeItem("userId")
        localStorage.removeItem("accountType")
        localStorage.removeItem("role")

        navigate("/provider/login", { replace: true })
    }

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem("token")
                const providerId = localStorage.getItem("providerId")

                if (!token) {
                    navigate("/provider/login", { replace: true })
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

    const todayStart = new Date(now)
    todayStart.setHours(0, 0, 0, 0)

    const tomorrowStart = new Date(todayStart)
    tomorrowStart.setDate(tomorrowStart.getDate() + 1)

    const weekStart = new Date(todayStart)
    weekStart.setDate(todayStart.getDate() - todayStart.getDay())

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)

    const todayLessons = appointments.filter(appointment => {
        const date = new Date(appointment.startTime)
        return date >= todayStart && date < tomorrowStart
    })

    const weeklyLessons = appointments.filter(appointment => {
        const date = new Date(appointment.startTime)
        return date >= weekStart && date < weekEnd
    })

    const upcomingLessons = appointments
        .filter(appointment => new Date(appointment.startTime) >= now)
        .sort((a, b) =>
            new Date(a.startTime) - new Date(b.startTime)
        )

    const weeklyRegistrations = weeklyLessons.reduce(
        (total, appointment) =>
            total + (
                appointment.participantsCount ??
                appointment.participants?.length ??
                0
            ),
        0
    )

    const stats = [
        {
            label: "שיעורים השבוע",
            value: weeklyLessons.length,
            color: "blue"
        },
        {
            label: "שיעורים היום",
            value: todayLessons.length,
            color: "peach"
        },
        {
            label: "הרשמות השבוע",
            value: weeklyRegistrations,
            color: "blue"
        },
        {
            label: "שיעורים קרובים",
            value: upcomingLessons.length,
            color: "peach"
        }
    ]

    const menuItems = [
        {
            title: "לוח השיעורים שלי",
            description: "צפייה בלוח השבועי",
            path: "/provider/calendar"
        },
        {
            title: "השיעורים שלי",
            description: "ניהול השיעורים",
            path: "/provider/appointments"
        },
        {
            title: "סוגי השיעורים שלי",
            description: "ניהול סוגי השיעורים",
            path: "/provider/services"
        },
        {
            title: "הלקוחות שלי",
            description: "צפייה בלקוחות",
            path: "/provider/clients"
        },
        {
            title: "הפרופיל שלי",
            description: "עדכון פרטים אישיים",
            path: "/provider/profile"
        }
    ]

    return (
        <div className="providerHome" dir="rtl">

            <header className="providerHomeHeader">
                <div className="providerHomeLogo">
                    QLINE
                    <span> / אזור המדריכה</span>
                </div>

                <button
                    className="providerHomeLogout"
                    onClick={logout}
                >
                    התנתקות
                </button>
            </header>

            <main className="providerHomeContent">

                <section className="providerHomeWelcome">
                    <div>
                        <span className="providerHomeLabel">
                            לוח הבקרה שלי
                        </span>

                        <h1>ברוכה הבאה!</h1>

                        <p>
                            כל מה שקורה בשיעורים שלך, במקום אחד.
                        </p>
                    </div>

                    <button
                        className="providerHomeCalendarButton"
                        onClick={() => navigate("/provider/calendar")}
                    >
                        לוח השיעורים שלי
                    </button>
                </section>

                {error && (
                    <p className="providerHomeError">{error}</p>
                )}

                <section className="providerHomeStats">
                    {stats.map(stat => (
                        <div
                            className="providerHomeStatCard"
                            key={stat.label}
                        >
                            <span>{stat.label}</span>

                            <strong className={stat.color}>
                                {loading ? "..." : stat.value}
                            </strong>
                        </div>
                    ))}
                </section>

                <div className="providerHomeDashboard">

                    <section className="providerHomeSection">
                        <div className="providerHomeSectionTitle">
                            <div>
                                <h2>פעולות מהירות</h2>
                                <p>ניהול הפעילות שלך</p>
                            </div>
                        </div>

                        <div className="providerHomeGrid">
                            {menuItems.map(item => (
                                <button
                                    key={item.path}
                                    className="providerHomeCard"
                                    onClick={() => navigate(item.path)}
                                >
                                    <div className="providerHomeCardText">
                                        <h3>{item.title}</h3>
                                        <p>{item.description}</p>
                                    </div>

                                    <span className="providerHomeArrow">
                                        ←
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="providerHomeSection">
                        <div className="providerHomeSectionTitle">
                            <div>
                                <h2>השיעורים הקרובים שלי</h2>
                                <p>חמשת השיעורים הבאים שלך</p>
                            </div>
                        </div>

                        <div className="providerHomeUpcoming">
                            {!loading && upcomingLessons.length === 0 && (
                                <p className="providerHomeEmpty">
                                    אין שיעורים קרובים
                                </p>
                            )}

                            {upcomingLessons.slice(0, 5).map(appointment => (
                                <div
                                    className="providerHomeLesson"
                                    key={appointment._id}
                                    style={{
                                        "--lesson-color":
                                            appointment.serviceId?.color ||
                                            "#7088e8"
                                    }}
                                >
                                    <div className="providerHomeLessonInfo">
                                        <strong>
                                            {appointment.serviceId?.name || "שיעור"}
                                        </strong>
                                        <span>
                                            {appointment.branch}
                                        </span>
                                    </div>

                                    <div className="providerHomeLessonDate">
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
                            ))}
                        </div>

                        <button
                            className="providerHomeViewAll"
                            onClick={() => navigate("/provider/calendar")}
                        >
                            צפייה בלוח השיעורים
                            <span>←</span>
                        </button>
                    </section>

                </div>

                <footer className="providerHomeFooter">
                    QLINE · מערכת ניהול השיעורים שלך
                </footer>

            </main>
        </div>
    )
}

export default ProviderHome
