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
    const [success, setSuccess] = useState("")
    const [editingField, setEditingField] = useState(null)
    const [editValue, setEditValue] = useState("")
    const [saving, setSaving] = useState(false)

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
    const startEditing = (field) => {
        setEditingField(field)
        setEditValue(user[field] || "")
        setError("")
        setSuccess("")
    }

    const cancelEditing = () => {
        setEditingField(null)
        setEditValue("")
    }

      const saveField = async () => {
        try {
            setSaving(true)
            setError("")
            setSuccess("")

            const token = localStorage.getItem("token")

            await axios.put(
                "http://localhost:2173/api/users",
                {
                    [editingField]: editValue
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            // עדכון הפרטים במסך בלי לטעון מחדש
            setUser(prev => ({
                ...prev,
                [editingField]: editValue
            }))

            setSuccess("הפרטים עודכנו בהצלחה!")
            setEditingField(null)
            setEditValue("")

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "עדכון הפרטים נכשל"
            )
        } finally {
            setSaving(false)
        }
    }
const renderField = (field, label, type = "text") => (
        <div className="profile-info-row" key={field}>
            <span>{label}</span>

            <div className="profile-field-content">

                {editingField === field ? (
                    <>
                        <input
                            className="profile-edit-input"
                            type={type}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                        />

                        <button
                            className="profile-save-icon"
                            onClick={saveField}
                            disabled={saving}
                            title="שמירה"
                        >
                            ✓
                        </button>

                        <button
                            className="profile-cancel-icon"
                            onClick={cancelEditing}
                            disabled={saving}
                            title="ביטול"
                        >
                            ✕
                        </button>
                    </>
                ) : (
                    <>
                        <strong>
                            {user[field] || "לא הוזן"}
                        </strong>

                        <button
                            className="profile-edit-icon"
                            onClick={() => startEditing(field)}
                            title="עריכה"
                        >
                            ✎
                        </button>
                    </>
                )}

            </div>
        </div>
    )

    const formatDate = (date) => {
        if (!date) return "אין מידע"

        return new Date(date).toLocaleDateString("he-IL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })
    }

    if (loading) return <p>טוען פרופיל...</p>
    if (error) return <p>{error}</p>
    if (!user) return <p>לא נמצאו פרטי משתמש</p>



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

                {error && (
                    <p className="profile-message profile-error">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="profile-message profile-success">
                        {success}
                    </p>
                )}

                <div className="profile-layout">

                    {/* פרטים אישיים */}
                    <div className="single-user-card">

                        <div className="profile-section-title">
                            פרטים אישיים
                        </div>

                        {renderField("name", "שם פרטי")}
                        {renderField("lastName", "שם משפחה")}
                        {renderField("idNumber", "תעודת זהות")}

                        <div className="profile-section-title">
                            פרטי חשבון ויצירת קשר
                        </div>

                        {renderField("username", "שם משתמש")}
                        {renderField("email", "כתובת אימייל", "email")}
                        {renderField("phone", "טלפון", "tel")}

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
