
import { useEffect, useState } from "react"
import "../css/provider/ProviderProfile.css"

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

    const [editing, setEditing] = useState({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

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

                if (!response.ok) {
                    throw new Error(data.message || "טעינת הפרופיל נכשלה")
                }

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

    const toggleEdit = (field) => {
        setEditing(prev => ({
            ...prev,
            [field]: !prev[field]
        }))
        setMessage("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setMessage("")
        setSaving(true)

        try {
            const token = localStorage.getItem("token")

            const updatedData = { ...form }

            if (!updatedData.password) {
                delete updatedData.password
            }

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

            if (!response.ok) {
                throw new Error(data.message || "עדכון הפרופיל נכשל")
            }

            setForm(prev => ({
                ...prev,
                password: ""
            }))

            setEditing({})
            setMessage("הפרופיל עודכן בהצלחה")

        } catch (error) {
            setError(error.message)
        } finally {
            setSaving(false)
        }
    }

    const fields = [
        { name: "name", label: "שם פרטי" },
        { name: "lastName", label: "שם משפחה" },
        { name: "id", label: "תעודת זהות" },
        { name: "username", label: "שם משתמש" },
        { name: "email", label: "כתובת אימייל", type: "email" },
        { name: "phone", label: "טלפון" },
        { name: "service", label: "תחום השירות" },
        { name: "password", label: "סיסמה חדשה", type: "password" }
    ]

    if (loading) {
        return (
            <div className="providerProfileLoading">
                טוען פרופיל...
            </div>
        )
    }

    return (
        <div className="providerProfilePage" dir="rtl">

            <div className="providerProfileContainer">

                {/* כותרת ראשית */}
                <div className="providerProfileHero">
                    <span className="providerProfileBrand">QLINE</span>
                    <h1>הפרופיל שלי</h1>
                    <p>צפייה ועדכון פרטי החשבון</p>
                </div>

                <div className="providerProfileLayout">

                    {/* כרטיס פרטים אישיים */}
                    <div className="providerProfileMainCard">

                        <form onSubmit={handleSubmit}>

                            <h2>פרטים אישיים</h2>

                            {fields.map((field, index) => (
                                <div key={field.name}>

                                    {index === 3 && (
                                        <h2 className="providerProfileSectionTitle">
                                            פרטי חשבון ויצירת קשר
                                        </h2>
                                    )}

                                    <div className="providerProfileField">

                                        <label htmlFor={`profile-${field.name}`}>
                                            {field.label}
                                        </label>

                                        <div className="providerProfileFieldValue">

                                            {editing[field.name] ? (
                                                <input
                                                    id={`profile-${field.name}`}
                                                    name={field.name}
                                                    type={field.type || "text"}
                                                    value={form[field.name]}
                                                    onChange={handleChange}
                                                    autoFocus
                                                />
                                            ) : (
                                                <span>
                                                    {field.name === "password"
                                                        ? "••••••••"
                                                        : form[field.name] || "לא הוזן"}
                                                </span>
                                            )}

                                            <button
                                                type="button"
                                                className="providerProfileEditButton"
                                                onClick={() => toggleEdit(field.name)}
                                                title={editing[field.name] ? "סיום עריכה" : "עריכה"}
                                            >
                                                {editing[field.name] ? "✓" : "✎"}
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            ))}

                            {error && (
                                <p className="providerProfileError">{error}</p>
                            )}

                            {message && (
                                <p className="providerProfileSuccess">{message}</p>
                            )}

                            <div className="providerProfileActions">
                                <button
                                    type="submit"
                                    className="providerProfileSaveButton"
                                    disabled={saving}
                                >
                                    {saving ? "שומר שינויים..." : "שמירת שינויים"}
                                </button>
                            </div>

                        </form>
                    </div>

                    {/* כרטיס מידע צדדי */}
                    <aside className="providerProfileSideCard">

                        <h2>פרטי המדריכה</h2>

                        <div className="providerProfileSideItem">
                            <span>שם מלא</span>
                            <strong>
                                {form.name} {form.lastName}
                            </strong>
                        </div>

                        <div className="providerProfileSideItem">
                            <span>תחום השירות</span>
                            <strong>{form.service || "לא הוזן"}</strong>
                        </div>

                        <div className="providerProfileSideItem">
                            <span>שם משתמש</span>
                            <strong>{form.username || "לא הוזן"}</strong>
                        </div>

                        <div className="providerProfileSideItem">
                            <span>כתובת אימייל</span>
                            <strong>{form.email || "לא הוזן"}</strong>
                        </div>

                    </aside>

                </div>
            </div>
        </div>
    )
}

export default ProviderProfile
