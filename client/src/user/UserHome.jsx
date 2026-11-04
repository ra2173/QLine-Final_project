
import { useNavigate } from "react-router-dom"

const UserHome = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")

    const userId = token
        ? JSON.parse(atob(token.split(".")[1])).UserInfo._id
        : null
    const logout = () => {
        localStorage.removeItem("token")
        navigate("/user/login")
    }

    return (
        <div>
            <h1>דף הבית של הלקוח</h1>
            <button onClick={() => navigate("/user/appointments")}> התורים שלי </button>
            <button onClick={() => navigate("/user/book")}> קביעת תור</button>
            <button onClick={() => navigate(`/user/profile/${userId}`)}> הפרופיל שלי</button>
            <button onClick={() => navigate('/user/calendar')}> מעבר ללוח השיעורים</button>
            <button onClick={() => navigate("/user/waitlist")}> רשימת ההמתנה שלי</button>
            <button onClick={logout}> התנתקות</button>
        </div>
    )
}

export default UserHome
