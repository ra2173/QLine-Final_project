
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

const UpdateUser = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        username: "",
        email: "",
        phone: "",
        idNumber: "",
        password: ""
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

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
            if (data)
                console.log("Fetched user data:", data)
            setFormData({
                _id: data._id || "",
                name: data.name || "",
                lastName: data.lastName || "",
                username: data.username || "",
                email: data.email || "",
                phone: data.phone || "",
                idNumber: data.idNumber || "",
                password: ""
            })
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "לא ניתן לטעון את פרטי המשתמש"
            )
        } finally {
            setLoading(false)
        }
    }



    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError("")
        setSuccess("")

        try {
            const token = localStorage.getItem("token")
            await axios.put(
                `http://localhost:2173/api/users`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            setSuccess("הפרטים עודכנו בהצלחה!")

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "עדכון הפרטים נכשל"
            )
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <p>טוען פרטים...</p>

    return (
        <div dir="rtl">
            <h1>עדכון פרטים אישיים</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>שם פרטי:</label>
                    <input name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div>
                    <label>שם משפחה:</label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>

                <div>
                    <label>שם משתמש:</label>
                    <input name="username" value={formData.username} onChange={handleChange} required />
                </div>

                <div>
                    <label>אימייל:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div>
                    <label>טלפון:</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                </div>

                <div>
                    <label>סיסמה:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                </div>
                <button type="submit" disabled={saving}>{saving ? "שומר..." : "שמירת שינויים"}</button>
                <button type="button" onClick={() => navigate(`/user/profile/${id}`)}> ביטול</button>
            </form>
        </div>
    )
}

export default UpdateUser
