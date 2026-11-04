import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../css/admin/AdminProviders.css"

function AdminProviders() {
    const navigate = useNavigate()

    const [providers, setProviders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // טעינת כל המדריכות
    const fetchProviders = async () => {
        try {
            const token = localStorage.getItem("token")

            const response = await fetch("http://localhost:2173/api/providers", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (!response.ok)
                throw new Error(data.message || "טעינת המדריכות נכשלה")

            setProviders(data)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProviders()
    }, [])

    // מחיקת מדריכה
    const handleDelete = async (id) => {
        if (!window.confirm("האם את בטוחה שברצונך למחוק את המדריכה?"))
            return

        try {
            const token = localStorage.getItem("token")

            const response = await fetch(
                `http://localhost:2173/api/providers/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const data = await response.json()

            if (!response.ok)
                throw new Error(data.message || "מחיקת המדריכה נכשלה")

            setProviders(prev =>
                prev.filter(provider => provider._id !== id)
            )

        } catch (error) {
            setError(error.message)
        }
    }

    if (loading)
        return <p>טוען מדריכות...</p>

 return (
    <div className="admin-providers">

        <header className="providers-header">
            <h1>ניהול מדריכות</h1>

            <div className="providers-header-buttons">
                <button onClick={() => navigate("/admin")}>
                    חזרה לדף הבית
                </button>

                <button onClick={() => navigate("/admin/providers/new")}>
                    + הוספת מדריכה חדשה
                </button>
            </div>
        </header>

        {error && <p className="providers-error">{error}</p>}

        {providers.length === 0 ? (
            <p className="providers-empty">לא נמצאו מדריכות במערכת</p>
        ) : (
            <div className="providers-list">
                {providers.map(provider => (
                    <div className="provider-card" key={provider._id}>

                        <h3>{provider.name} {provider.lastName}</h3>

                        <p>שם משתמש: {provider.username}</p>
                        <p>אימייל: {provider.email}</p>
                        <p>טלפון: {provider.phone}</p>
                        <p>שירות: {provider.service}</p>

                        <div className="provider-card-buttons">
                            <button
                                onClick={() =>
                                    navigate(`/admin/providers/edit/${provider._id}`)
                                }
                            >
                                עריכה
                            </button>

                            <button onClick={() => handleDelete(provider._id)}>
                                מחיקה
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        )}
    </div>
)
}

export default AdminProviders