
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

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

    return (
        <div>
            <h1>הפרופיל שלי</h1>
            <p>שם: {user.name}</p>
            <p>שם משפחה: {user.lastName}</p>
            <p>שם משתמש: {user.username}</p>
            <p>תעודת זהות: {user.idNumber}</p>
            <p>אימייל: {user.email}</p>
            <p>טלפון: {user.phone || "לא הוזן"}</p>
            <button onClick={() => navigate("/user/home")}> חזרה לדף הבית </button>
            <button onClick={() => navigate(`/user/profile/edit/${user._id}`)}> עדכון פרטים</button>
        </div>
    )
}

export default SingleUser