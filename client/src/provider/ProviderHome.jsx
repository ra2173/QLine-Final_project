
import { useNavigate } from "react-router-dom"

const ProviderHome = () => {
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem("token")
        navigate("/provider/login")
    }

    return (
        <div>
            <h1>דף הבית של המדריכה</h1>
            <button onClick={() => navigate("/provider/calendar")}> לוח השיעורים שלי</button>
            <button onClick={() => navigate("/provider/appointments")}> השיעורים שלי</button>
            <button onClick={() => navigate("/provider/services")}> ניהול השירותים שלי</button>
            <button onClick={() => navigate("/provider/profile")}> הפרופיל שלי</button>
            <button onClick={() => navigate("/provider/clients")}> הלקוחות שלי</button>
            <button onClick={logout}> התנתקות</button>
        </div>
    )
}

export default ProviderHome
