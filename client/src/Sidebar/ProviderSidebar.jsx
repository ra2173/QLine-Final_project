
import { useNavigate, NavLink } from "react-router-dom"
import "../css/Sidebar.css"

const ProviderSidebar = () => {
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        localStorage.removeItem("providerId")
        localStorage.removeItem("accountType")
        localStorage.removeItem("role")

        navigate("/provider/login", { replace: true })
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">QLINE</div>

            <p className="sidebar-subtitle">אזור מדריכה</p>

            <nav className="sidebar-nav">
                <NavLink to="/provider/home">דף הבית</NavLink>
                <NavLink to="/provider/calendar">היומן שלי</NavLink>
                <NavLink to="/provider/appointments">השיעורים שלי</NavLink>
                <NavLink to="/provider/services">סוגי השיעורים שלי</NavLink>
                <NavLink to="/provider/clients">הלקוחות שלי</NavLink>
                <NavLink to="/provider/profile">הפרופיל שלי</NavLink>
            </nav>

            <button className="sidebar-logout" onClick={logout}>
                התנתקות
            </button>
        </aside>
    )
}

export default ProviderSidebar
