import { useNavigate } from "react-router-dom"
import GroupsIcon from '@mui/icons-material/Groups'
import PeopleIcon from '@mui/icons-material/People'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices'
import "../css/admin/AdminHome.css"

function AdminHome() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("providerId")
        navigate("/provider/login")
    }

    return (
        <div className="admin-home">

            <header className="admin-header">
                <h2>Qline</h2>
                <button className="logout-button" onClick={handleLogout}>
                    התנתקות
                </button>
            </header>
            <div className="admin-welcome">
                <h1>שלום מנהלת!</h1>
                <p>ברוכה הבאה למערכת הניהול</p>
            </div>
            <div className="admin-buttons">
                <button onClick={() => navigate("/admin/providers")}>
                    <GroupsIcon />
                    <span>ניהול מדריכות</span>
                </button>

                <button onClick={() => navigate("/admin/clients")}>
                    <PeopleIcon />
                    <span>ניהול לקוחות</span>
                </button>

                <button onClick={() => navigate("/admin/appointments")}>
                    <CalendarMonthIcon />
                    <span>ניהול לוח שיעורים</span>
                </button>

                <button onClick={() => navigate("/admin/services")}>
                    <MiscellaneousServicesIcon />
                    <span>ניהול סוגי שיעורים</span>
                </button>
            </div>


        </div>
    )
}

export default AdminHome