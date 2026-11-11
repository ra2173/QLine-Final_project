import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../css/admin/AdminNewProvider.css"

function AdminNewProvider({ onClose, onSuccess }) {

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

            await onSuccess()
        } catch (error) {
            setError(error.message)
        }
    }

return (
    <div
        className="provider-modal-overlay"
        onClick={onClose}
    >
        <div
            className="provider-container"
            onClick={(e) => e.stopPropagation()}
        >

            <button
                type="button"
                className="provider-close"
                onClick={onClose}
            >
                ×
            </button>

            <div className="provider-brand">Qline</div>

            <h1>הוספת מדריכה חדשה</h1>

            <p className="provider-subtitle">
                מלאי את הפרטים כדי להוסיף מדריכה למערכת
            </p>

            <form className="provider-form" onSubmit={handleSubmit}>

                <div className="provider-form-title">
                    <div>
                        <h2>פרטי המדריכה</h2>
                        <p>פרטים אישיים ופרטי התחברות</p>
                    </div>

                    <div className="provider-icon">✦</div>
                </div>

                <div className="provider-fields">

                    <div className="provider-field">
                        <label>שם פרטי</label>
                        <input name="name" value={formData.name}
                            onChange={handleChange} required />
                    </div>

                    <div className="provider-field">
                        <label>שם משפחה</label>
                        <input name="lastName" value={formData.lastName}
                            onChange={handleChange} required />
                    </div>

                    <div className="provider-field">
                        <label>שם משתמש</label>
                        <input name="username" value={formData.username}
                            onChange={handleChange} required />
                    </div>

                    <div className="provider-field">
                        <label>תעודת זהות</label>
                        <input name="id" value={formData.id}
                            onChange={handleChange}
                            minLength={9} maxLength={9} required />
                    </div>

                    <div className="provider-field">
                        <label>אימייל</label>
                        <input type="email" name="email"
                            value={formData.email}
                            onChange={handleChange} required />
                    </div>

                    <div className="provider-field">
                        <label>סיסמה</label>
                        <input type="password" name="password"
                            value={formData.password}
                            onChange={handleChange} required />
                    </div>

                    <div className="provider-field">
                        <label>טלפון</label>
                        <input name="phone" value={formData.phone}
                            onChange={handleChange} />
                    </div>

                    <div className="provider-field">
                        <label>שירות</label>
                        <input name="service" value={formData.service}
                            onChange={handleChange} required />
                    </div>

                </div>

                {error && (
                    <p className="provider-form-error">{error}</p>
                )}

                <div className="provider-form-buttons">
                    <button type="submit">
                        הוספת מדריכה
                    </button>

                    <button type="button" onClick={onClose}>
                        ביטול
                    </button>
                </div>

            </form>
        </div>
    </div>
)
}

export default AdminNewProvider