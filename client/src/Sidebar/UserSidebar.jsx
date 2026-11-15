import { useNavigate, NavLink } from "react-router-dom"
import "../css/Sidebar.css"

const UserSidebar = () => {
    const navigate = useNavigate()

    const userId = localStorage.getItem("userId")

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        navigate("/user/login", { replace: true })
    }
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">QLINE</div>

            <nav className="sidebar-nav">
                <NavLink to="/user/home">
                    דף הבית
                </NavLink>

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
            <button className="sidebar-logout" onClick={logout}>
                התנתקות
            </button>
        </aside>
    )
}

export default UserSidebar
