
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../css/admin/AdminClients.css"

function AdminClients() {
    const navigate = useNavigate()

    const [clients, setClients] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // טעינת כל הלקוחות
    const fetchClients = async () => {
        try {
            const token = localStorage.getItem("token")

            const response = await fetch("http://localhost:2173/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (!response.ok)
                throw new Error(data.message || "טעינת הלקוחות נכשלה")

            setClients(data)

        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchClients()
    }, [])

    // מחיקת לקוח
    const handleDelete = async (id) => {
        if (!window.confirm("האם את בטוחה שברצונך למחוק את הלקוח?"))
            return

        try {
            const token = localStorage.getItem("token")

            const response = await fetch(
                `http://localhost:2173/api/users/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const data = await response.json()

            if (!response.ok)
                throw new Error(data.message || "מחיקת הלקוח נכשלה")

            setClients(prev =>
                prev.filter(client => client._id !== id)
            )

        } catch (error) {
            setError(error.message)
        }
    }

    // סינון לקוחות לפי שם או שם משתמש
    const filteredClients = clients.filter(client =>
        `${client.name} ${client.lastName} ${client.username}`
            .toLowerCase()
            .includes(search.toLowerCase())
    )

    if (loading)
        return <p>טוען לקוחות...</p>

if (loading)
    return <p className="clients-loading">טוען לקוחות...</p>

return (
    <div className="admin-clients">

        <div className="clients-header">
            <h1>ניהול לקוחות</h1>

            <button
                className="clients-back-button"
                onClick={() => navigate("/admin")}
            >
                חזרה לדף הבית
            </button>
        </div>

        <input
            className="clients-search"
            type="text"
            placeholder="חיפוש לקוח..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />

        {error && (
            <p className="clients-error">{error}</p>
        )}

        {filteredClients.length === 0 ? (
            <p className="clients-empty">לא נמצאו לקוחות</p>
        ) : (
            <div className="clients-list">

                {filteredClients.map(client => (
                    <div
                        className="client-card"
                        key={client._id}
                    >
                        <h3>
                            {client.name} {client.lastName}
                        </h3>

                        <p>שם משתמש: {client.username}</p>
                        <p>אימייל: {client.email}</p>
                        <p>טלפון: {client.phone}</p>

                        <div className="client-card-buttons">

                            <button
                                onClick={() =>
                                    navigate(`/user/profile/${client._id}`)
                                }
                            >
                                צפייה בפרטי לקוח
                            </button>

                            <button
                                onClick={() => handleDelete(client._id)}
                            >
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

export default AdminClients