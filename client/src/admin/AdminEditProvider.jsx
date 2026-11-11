import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "../css/admin/AdminEditProvider.css"

function AdminEditProvider() {
    const { id } = useParams()
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

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // טעינת פרטי המדריכה
    useEffect(() => {
        const fetchProvider = async () => {
            try {
                const token = localStorage.getItem("token")

                const response = await fetch(
                    `http://localhost:2173/api/providers/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                const data = await response.json()

                if (!response.ok)
                    throw new Error(data.message || "טעינת המדריכה נכשלה")

                setFormData({
                    name: data.name || "",
                    lastName: data.lastName || "",
                    username: data.username || "",
                    id: data.id || "",
                    email: data.email || "",
                    password: "",
                    phone: data.phone || "",
                    service: data.service || ""
                })

            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchProvider()
    }, [id])

    // עדכון שדות הטופס
    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // שמירת השינויים
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        try {
            const token = localStorage.getItem("token")

            const updatedData = {
                _id: id,
                name: formData.name,
                lastName: formData.lastName,
                username: formData.username,
                id: formData.id,
                email: formData.email,
                phone: formData.phone,
                service: formData.service
            }

            // שולחים סיסמה רק אם הוזנה סיסמה חדשה
            if (formData.password) {
                updatedData.password = formData.password
            }

            const response = await fetch("http://localhost:2173/api/providers", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            })

            const data = await response.json()

            if (!response.ok)
                throw new Error(data.message || "עדכון המדריכה נכשל")

            navigate("/admin/providers")

        } catch (error) {
            setError(error.message)
        }
    }

    if (loading)
        return <p>טוען פרטי מדריכה...</p>

return (
    <div className="editProviderOverlay">
        <div className="editProviderModal">

            <button
                className="editProviderClose"
                type="button"
                onClick={() => navigate("/admin/providers")}
            >
                ✕
            </button>

            <div className="editProviderHeader">
                <span className="editProviderBrand">QLINE</span>
                <h1>עריכת מדריכה</h1>
                <p>עדכון פרטי המדריכה במערכת</p>
            </div>

            <form className="editProviderForm" onSubmit={handleSubmit}>

                <div className="editProviderGrid">

                    <div className="editProviderField">
                        <label>שם פרטי</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="editProviderField">
                        <label>שם משפחה</label>
                        <input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="editProviderField">
                        <label>שם משתמש</label>
                        <input
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="editProviderField">
                        <label>תעודת זהות</label>
                        <input
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            minLength={9}
                            maxLength={9}
                            required
                        />
                    </div>

                    <div className="editProviderField">
                        <label>אימייל</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="editProviderField">
                        <label>טלפון</label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="editProviderField">
                        <label>שירות</label>
                        <input
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="editProviderField">
                        <label>סיסמה חדשה</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="השאירי ריק ללא שינוי"
                        />
                        <span className="editProviderHint">
                            יש להזין רק אם רוצים לשנות סיסמה
                        </span>
                    </div>

                </div>

                {error && (
                    <p className="editProviderError">{error}</p>
                )}

                <div className="editProviderButtons">

                    <button
                        type="submit"
                        className="editProviderSubmit"
                    >
                        שמירת שינויים
                    </button>

                    <button
                        type="button"
                        className="editProviderCancel"
                        onClick={() => navigate("/admin/providers")}
                    >
                        ביטול
                    </button>

                </div>

            </form>
        </div>
    </div>
)

}

export default AdminEditProvider