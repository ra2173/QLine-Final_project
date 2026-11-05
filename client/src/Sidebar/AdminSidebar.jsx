
import { NavLink } from "react-router-dom"
import "../css/Sidebar.css"

const AdminSidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">QLINE</div>

            <p className="sidebar-subtitle">ניהול המערכת</p>

            <nav className="sidebar-nav">
                <NavLink to="/admin">דף הבית</NavLink>
                <NavLink to="/admin/providers">ניהול מדריכות</NavLink>
                <NavLink to="/admin/clients">ניהול לקוחות</NavLink>
                <NavLink to="/admin/appointments">ניהול שיעורים</NavLink>
                <NavLink to="/admin/services">ניהול שירותים</NavLink>
            </nav>
        </aside>
    )
}

export default AdminSidebar
