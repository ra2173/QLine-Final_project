import { NavLink } from "react-router-dom"
import "../css/Sidebar.css"

const UserSidebar = () => {
    const userId = localStorage.getItem("userId")

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">QLINE</div>

          <nav className="sidebar-nav">
    <NavLink to="/user/calendar">
        לוח שיעורים
    </NavLink>

    <NavLink to="/user/appointments">
        השיעורים שלי
    </NavLink>

    <NavLink to="/user/waitlist">
        רשימת המתנה
    </NavLink>

    <NavLink to={`/user/profile/${userId}`}>
        הפרופיל שלי
    </NavLink>
</nav>
        </aside>
    )
}

export default UserSidebar
