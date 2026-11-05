
import { NavLink } from "react-router-dom"
import "../css/Sidebar.css"

const ProviderSidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">QLINE</div>

            <p className="sidebar-subtitle">אזור מדריכה</p>

            <nav className="sidebar-nav">
                <NavLink to="/provider/home">דף הבית</NavLink>
                <NavLink to="/provider/calendar">היומן שלי</NavLink>
                <NavLink to="/provider/appointments">השיעורים שלי</NavLink>
                <NavLink to="/provider/profile">הפרופיל שלי</NavLink>
            </nav>
        </aside>
    )
}

export default ProviderSidebar
