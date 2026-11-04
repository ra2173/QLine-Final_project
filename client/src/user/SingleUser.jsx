import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import "../css/user/SingleUser.css"



const SingleUser = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => { 
        fetchUser() 
    }, [id, navigate])

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                navigate("/user/login")
                return
            }
            const { data } = await axios.get(
                `http://localhost:2173/api/users/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            setUser(data)
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "לא ניתן לטעון את פרטי המשתמש"
            )
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <p>טוען פרופיל...</p>
    if (error) return <p>{error}</p>
    if (!user) return <p>לא נמצאו פרטי משתמש</p>

const formatDate = (date) => {
    if (!date) return "אין מידע"

    return new Date(date).toLocaleDateString("he-IL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    })
}

return (
    <div className="single-user-page" dir="rtl">

        <div className="single-user-container">

            <div className="single-user-header">
                <div>
                    <span className="profile-label">QLINE</span>
                    <h1>פרטי לקוחה</h1>
                    <p>צפייה וניהול פרטי החשבון</p>
                </div>
            </div>

            <div className="profile-layout">

                {/* פרטי הלקוחה */}
                <div className="single-user-card">

                    <div className="profile-section-title">
                        פרטים אישיים
                    </div>

                    <div className="profile-info-row">
                        <span>שם פרטי</span>
                        <strong>{user.name}</strong>
                    </div>

                    <div className="profile-info-row">
                        <span>שם משפחה</span>
                        <strong>{user.lastName}</strong>
                    </div>

                    <div className="profile-info-row">
                        <span>תעודת זהות</span>
                        <strong>{user.idNumber}</strong>
                    </div>

                    <div className="profile-section-title">
                        פרטי חשבון ויצירת קשר
                    </div>

                    <div className="profile-info-row">
                        <span>שם משתמש</span>
                        <strong>{user.username}</strong>
                    </div>

                    <div className="profile-info-row">
                        <span>כתובת אימייל</span>
                        <strong>{user.email}</strong>
                    </div>

                    <div className="profile-info-row">
                        <span>טלפון</span>
                        <strong>{user.phone || "לא הוזן"}</strong>
                    </div>

                </div>

                {/* כרטיסיית פעילות */}
                <div className="user-activity-card">

                    <div className="activity-card-header">
                        <h3>פעילות לקוחה</h3>
                    </div>

                    <div className="activity-item">
                        <span>תאריך הצטרפות</span>
                        <strong>{formatDate(user.createdAt)}</strong>
                    </div>

                    <div className="activity-item">
                        <span>עדכון אחרון</span>
                        <strong>{formatDate(user.updatedAt)}</strong>
                    </div>

                    <div className="activity-divider"></div>

                    <div className="activity-item">
                        <span>ביקור אחרון</span>
                        <strong>{formatDate(user.lastVisit)}</strong>
                    </div>

                    <div className="activity-item">
                        <span>ביקור קרוב</span>
                        <strong>{formatDate(user.nextVisit)}</strong>
                    </div>

                </div>

            </div>

            <div className="single-user-actions">

                <button
                    className="profile-edit-button"
                    onClick={() => navigate(`/user/profile/edit/${user._id}`)}
                >
                    עדכון פרטים
                </button>

                <button
                    className="profile-back-button"
                    onClick={() => navigate("/user/home")}
                >
                    חזרה לדף הבית
                </button>

            </div>

        </div>

    </div>
)
}

export default SingleUser