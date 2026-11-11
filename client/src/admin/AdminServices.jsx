import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../css/admin/AdminServices.css"

function AdminServices() {
    const navigate = useNavigate()

    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // טעינת כל השיעורים
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
                throw new Error(data.message || "טעינת השיעורים  נכשלה")

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
        return <p>טוען שיעורים ...</p>

return (
        <div className="pageContainer">
            <div className="pageHeader">
                <h1 className="pageTitle">ניהול סוגי שיעורים</h1>
                <div className="headerButtons">
                    <button className="secondaryButton" onClick={() => navigate("/admin")}>
                        חזרה לדף הבית
                    </button>
                    <button className="primaryButton" onClick={() => navigate("/admin/services/new")}>
                        הוספת שירות חדש
                    </button>
                </div>
            </div>

            {error && <p className="errorText">{error}</p>}

            {services.length === 0 ? (
                <p className="emptyText">לא נמצאו שיעורים</p>
            ) : (
                <div className="servicesGrid">
                    {services.map(service => (
                        <div key={service._id} className="serviceCard">
                            <div>
                                <div className="cardTop">
                                    <h3 className="serviceName">{service.name}</h3>
                                    <div
                                        className="colorIndicator"
                                        style={{ backgroundColor: service.color }}
                                    />
                                </div>

                                <p className="serviceDescription">{service.description}</p>
                                
                                <div className="serviceMeta">
                                    <p className="metaItem"><strong>מחיר:</strong> {service.price} ₪</p>
                                    <p className="metaItem">
                                        <strong>מדריכה:</strong> {service.providerId?.name || "לא ידוע"} {service.providerId?.lastName || ""}
                                    </p>
                                </div>
                            </div>

                            <div className="cardActions">
                                <button
                                    className="editButton"
                                    onClick={() =>
                                        navigate(`/admin/services/edit/${service._id}`)
                                    }
                                >
                                    עריכה
                                </button>

                                <button
                                    className="deleteButton"
                                    onClick={() => handleDelete(service._id)}
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

export default AdminServices