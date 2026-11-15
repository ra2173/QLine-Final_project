
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import GroupsIcon from "@mui/icons-material/Groups"
import PeopleIcon from "@mui/icons-material/People"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices"
import DashboardIcon from "@mui/icons-material/Dashboard"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutlined"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import "../css/admin/AdminHome.css"

function AdminHome() {
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [providers, setProviders] = useState([])
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("providerId")
        localStorage.removeItem("userId")
        localStorage.removeItem("accountType")
        localStorage.removeItem("role")

        navigate("/provider/login", { replace: true })
    }

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem("token")

                const endpoints = [
                    "/api/appointments",
                    "/api/providers",
                    "/api/users"
                ]

                const responses = await Promise.all(
                    endpoints.map(url =>
                        fetch(`http://localhost:2173${url}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                    )
                )

                if (responses.some(res => !res.ok)) {
                    throw new Error("טעינת נתוני הדשבורד נכשלה")
                }

                const [appointmentsData, providersData, clientsData] =
                    await Promise.all(responses.map(res => res.json()))

                setAppointments(
                    Array.isArray(appointmentsData)
                        ? appointmentsData
                        : appointmentsData.appointments || []
                )

                setProviders(
                    Array.isArray(providersData)
                        ? providersData
                        : providersData.providers || []
                )

                setClients(
                    Array.isArray(clientsData)
                        ? clientsData
                        : clientsData.users || []
                )
            } catch (err) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboard()
    }, [])

    const today = new Date()

    const isToday = (date) =>
        new Date(date).toDateString() === today.toDateString()

    const weekStart = new Date(today)
    weekStart.setHours(0, 0, 0, 0)
    weekStart.setDate(today.getDate() - today.getDay())

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)

    const todayLessons = appointments.filter(appointment =>
        isToday(appointment.startTime)
    )

    const weeklyLessons = appointments.filter(appointment => {
        const date = new Date(appointment.startTime)
        return date >= weekStart && date < weekEnd
    })

    const upcomingLessons = appointments
        .filter(appointment =>
            new Date(appointment.startTime) >= today
        )
        .sort((a, b) =>
            new Date(a.startTime) - new Date(b.startTime)
        )
        .slice(0, 5)

    const stats = [
        {
            title: "שיעורים השבוע",
            value: weeklyLessons.length,
            icon: <CalendarMonthIcon />,
            color: "blue"
        },
        {
            title: "מדריכות",
            value: providers.length,
            icon: <GroupsIcon />,
            color: "peach"
        },
        {
            title: "לקוחות רשומים",
            value: clients.length,
            icon: <PeopleIcon />,
            color: "blue"
        },
        {
            title: "שיעורים היום",
            value: todayLessons.length,
            icon: <AccessTimeIcon />,
            color: "peach"
        }
    ]

    const actions = [
        {
            title: "לוח שיעורים",
            icon: <CalendarMonthIcon />,
            path: "/admin/calendar"
        },
        {
            title: "ניהול שיעורים",
            icon: <DashboardIcon />,
            path: "/admin/appointments"
        },
        {
            title: "ניהול מדריכות",
            icon: <GroupsIcon />,
            path: "/admin/providers"
        },
        {
            title: "ניהול לקוחות",
            icon: <PeopleIcon />,
            path: "/admin/clients"
        },
        {
            title: "סוגי שיעורים",
            icon: <MiscellaneousServicesIcon />,
            path: "/admin/services"
        },
        {
            title: "הוספת שיעור",
            icon: <AddCircleOutlineIcon />,
            path: "/admin/appointments/new"
        }
    ]

    return (
        <div className="admin-home" dir="rtl">

            <header className="admin-header">
                <div className="admin-brand">
                    <DashboardIcon />
                    <span>QLINE / ניהול המערכת</span>
                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    התנתקות
                </button>
            </header>

            <div className="admin-welcome">
                <div>
                    <h1>שלום מנהלת!</h1>
                    <p>כל מה שקורה בסטודיו, במקום אחד.</p>
                </div>

                <button
                    className="admin-calendar-shortcut"
                    onClick={() => navigate("/admin/calendar")}
                >
                    <CalendarMonthIcon />
                    לוח השיעורים
                </button>
            </div>

            {error && (
                <p className="admin-dashboard-error">{error}</p>
            )}

            <div className="admin-stats">
                {stats.map((stat, index) => (
                    <div
                        className="admin-stat-card"
                        key={index}
                    >
                        <div className={`admin-stat-icon ${stat.color}`}>
                            {stat.icon}
                        </div>

                        <p>{stat.title}</p>

                        <h2>
                            {loading ? "..." : stat.value}
                        </h2>
                    </div>
                ))}
            </div>

            <div className="admin-dashboard-grid">

                <section className="admin-dashboard-section">
                    <div className="admin-section-heading">
                        <h2>פעולות מהירות</h2>
                        <p>גישה מהירה לניהול המערכת</p>
                    </div>

                    <div className="admin-buttons">
                        {actions.map(action => (
                            <button
                                key={action.path}
                                onClick={() => navigate(action.path)}
                            >
                                {action.icon}
                                <span>{action.title}</span>
                                <ArrowForwardIcon
                                    className="admin-action-arrow"
                                />
                            </button>
                        ))}
                    </div>
                </section>

                <section className="admin-dashboard-section">
                    <div className="admin-section-heading">
                        <h2>השיעורים הקרובים</h2>
                        <p>חמשת השיעורים הבאים במערכת</p>
                    </div>

                    <div className="admin-upcoming-list">
                        {!loading && upcomingLessons.length === 0 && (
                            <p className="admin-no-lessons">
                                אין שיעורים קרובים
                            </p>
                        )}

                        {upcomingLessons.map(appointment => {
                            const lessonColor =
                                appointment.serviceId?.color || "#7088e8"

                            return (
                                <div
                                    className="admin-upcoming-lesson"
                                    key={appointment._id}
                                    style={{
                                        "--lesson-color": lessonColor
                                    }}
                                >
                                    <div className="admin-lesson-info">
                                        <strong>
                                            {appointment.serviceId?.name || "שיעור"}
                                        </strong>

                                        <span>
                                            {appointment.providerId?.name || ""}
                                            {" "}
                                            {appointment.providerId?.lastName || ""}
                                        </span>
                                    </div>

                                    <div className="admin-lesson-date">
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
                            )
                        })}
                    </div>

                    <button
                        className="admin-view-calendar"
                        onClick={() => navigate("/admin/calendar")}
                    >
                        צפייה בלוח השיעורים
                        <ArrowForwardIcon />
                    </button>
                </section>

            </div>
        </div>
    )
}

export default AdminHome
