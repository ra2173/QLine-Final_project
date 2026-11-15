
import { useNavigate, NavLink } from "react-router-dom"
import "../css/Sidebar.css"

const AdminSidebar = () => {
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

            <p className="sidebar-subtitle">ניהול המערכת</p>

            <nav className="sidebar-nav">
                <NavLink to="/admin">דף הבית</NavLink>
                <NavLink to="/admin/calendar">לוח שיעורים</NavLink>                <NavLink to="/admin/clients">ניהול לקוחות</NavLink>
                <NavLink to="/admin/appointments">ניהול שיעורים</NavLink>
                <NavLink to="/admin/services">ניהול סוגי שיעורים</NavLink>
            </nav>
            <button className="sidebar-logout" onClick={logout}>
                התנתקות
            </button>

        </aside>
    )
}

export default AdminSidebar
