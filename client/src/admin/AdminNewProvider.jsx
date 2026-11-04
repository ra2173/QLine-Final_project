import { useState } from "react"
import { useNavigate } from "react-router-dom"

function AdminNewProvider() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        username: "",
        id: "",
        email: "",
        password: "",
        phone: "",
        service: ""
    })

    const [error, setError] = useState("")

    // עדכון השדות בטופס
    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // שליחת הטופס
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        try {
            const token = localStorage.getItem("token")

            const response = await fetch("http://localhost:2173/api/providers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok)
                throw new Error(data.message || "יצירת המדריכה נכשלה")

            navigate("/admin/providers")

        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div>
            <h1>הוספת מדריכה חדשה</h1>

            <form onSubmit={handleSubmit}>

                <label>שם פרטי</label>
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <label>שם משפחה</label>
                <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />

                <label>שם משתמש</label>
                <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                <label>תעודת זהות</label>
                <input
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    minLength={9}
                    maxLength={9}
                    required
                />

                <label>אימייל</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label>סיסמה</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <label>טלפון</label>
                <input name="phone" value={formData.phone} onChange={handleChange} />
                <label>שירות</label>
                <input name="service" value={formData.service} onChange={handleChange} required />
                {error && <p>{error}</p>}

                <button type="submit"> הוספת מדריכה </button>
                <button type="button" onClick={() => navigate("/admin/providers")} > ביטול </button>

            </form>
        </div>
    )
}

export default AdminNewProvider