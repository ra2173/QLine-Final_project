import { useEffect, useState } from "react"

const ProviderProfile = () => {
    const [form, setForm] = useState({
        name: "",
        lastName: "",
        username: "",
        id: "",
        email: "",
        phone: "",
        service: "",
        password: ""
    })

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    // טעינת פרטי המורה
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token")
                const providerId = localStorage.getItem("providerId")

                const response = await fetch(
                    `http://localhost:2173/api/providers/${providerId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                const data = await response.json()

                if (!response.ok)
                    throw new Error(data.message || "טעינת הפרופיל נכשלה")

                setForm({
                    name: data.name || "",
                    lastName: data.lastName || "",
                    username: data.username || "",
                    id: data.id || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    service: data.service || "",
                    password: ""
                })

            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // עדכון הפרופיל
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setMessage("")

        try {
            const token = localStorage.getItem("token")

            // לא שולחים סיסמה אם לא ביקשו לשנות אותה
            const updatedData = { ...form }
            if (!updatedData.password)
                delete updatedData.password

            const response = await fetch(
                "http://localhost:2173/api/providers",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedData)
                }
            )

            const data = await response.json()

            if (!response.ok)
                throw new Error(data.message || "עדכון הפרופיל נכשל")

            setForm(prev => ({ ...prev, password: "" }))
            setMessage("הפרופיל עודכן בהצלחה")

        } catch (error) {
            setError(error.message)
        }
    }

    if (loading) return <p>טוען פרופיל...</p>

    return (
        <div dir="rtl">
            <h2>הפרופיל שלי</h2>

            <form onSubmit={handleSubmit}>
                <label>שם פרטי</label>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <label>שם משפחה</label>
                <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                />

                <label>שם משתמש</label>
                <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                />

                <label>תעודת זהות</label>
                <input
                    name="id"
                    value={form.id}
                    onChange={handleChange}
                    required
                />

                <label>דוא"ל</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <label>טלפון</label>
                <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                />

                <label>תחום השירות</label>
                <input
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    required
                />

                <label>סיסמה חדשה (לא חובה)</label>
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                />

                {error && <p>{error}</p>}
                {message && <p>{message}</p>}

                <button type="submit">שמירת שינויים</button>
            </form>
        </div>
    )
}

export default ProviderProfile