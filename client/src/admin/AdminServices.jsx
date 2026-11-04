import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function AdminServices() {
    const navigate = useNavigate()

    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // טעינת כל השירותים
    const fetchServices = async () => {
        try {
            const token = localStorage.getItem("token")

            const response = await fetch("http://localhost:2173/api/services", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (!response.ok)
                throw new Error(data.message || "טעינת השירותים נכשלה")

            setServices(data)

        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchServices()
    }, [])

    // מחיקת שירות
    const handleDelete = async (id) => {
        if (!window.confirm("האם את בטוחה שברצונך למחוק את השירות?"))
            return

        try {
            const token = localStorage.getItem("token")

            const response = await fetch("http://localhost:2173/api/services", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ id })
            })

            const data = await response.json()

            if (!response.ok)
                throw new Error(data.message || "מחיקת השירות נכשלה")

            setServices(prev =>
                prev.filter(service => service._id !== id)
            )

        } catch (error) {
            setError(error.message)
        }
    }

    if (loading)
        return <p>טוען שירותים...</p>

    return (
        <div>
            <h1>ניהול שירותים</h1>

            <button onClick={() => navigate("/admin")}>
                חזרה לדף הבית
            </button>

            <button onClick={() => navigate("/admin/services/new")}>
                הוספת שירות חדש
            </button>

            {error && <p>{error}</p>}

            {services.length === 0 ? (
                <p>לא נמצאו שירותים</p>
            ) : (
                <div>
                    {services.map(service => (
                        <div key={service._id}>
                            <h3>{service.name}</h3>

                            <p>{service.description}</p>
                            <p>מחיר: {service.price} ₪</p>

                            <p>
                                מדריכה: {service.providerId?.name || "לא ידוע"}
                                {" "}
                                {service.providerId?.lastName || ""}
                            </p>

                            <div
                                style={{
                                    backgroundColor: service.color,
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "50%"
                                }}
                            />

                            <button
                                onClick={() =>
                                    navigate(`/admin/services/edit/${service._id}`)
                                }
                            >
                                עריכה
                            </button>

                            <button
                                onClick={() => handleDelete(service._id)}
                            >
                                מחיקה
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AdminServices