
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../css/provider/ProviderServices.css"
import ProviderEditService from "./ProviderEditService"
import ProviderNewService from "./ProviderNewService"

const ProviderServices = () => {
    const navigate = useNavigate()

    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [editingServiceId, setEditingServiceId] = useState(null)
    const [showNewService, setShowNewService] = useState(false)

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const token = localStorage.getItem("token")

                const response = await fetch(
                    "http://localhost:2173/api/services/my-services",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                if (!response.ok)
                    throw new Error("טעינת השירותים נכשלה")

                const data = await response.json()
                setServices(data)

            } catch (error) {
                console.error(error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchServices()
    }, [])

    const handleDelete = async (id) => {
        if (!window.confirm("האם את בטוחה שברצונך למחוק את השירות?"))
            return

        try {
            const token = localStorage.getItem("token")

            const response = await fetch(
                "http://localhost:2173/api/services",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ id })
                }
            )

            const data = await response.json()

            if (!response.ok)
                throw new Error(data.message || "מחיקת השירות נכשלה")

            setServices(prevServices =>
                prevServices.filter(service => service._id !== id)
            )

        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className="providerServicesPage" dir="rtl">

            <div className="providerServicesContainer">

                {/* כותרת עליונה */}
                <div className="providerServicesHero">
                    <span className="providerServicesBrand">QLINE</span>

                    <h1>השירותים שלי</h1>

                    <p>
                        צפייה וניהול השירותים שאת מציעה
                    </p>
                </div>

                {/* אזור ניהול השירותים */}
                <div className="providerServicesMainCard">

                    <div className="providerServicesToolbar">
                        <div>
                            <h2>ניהול שירותים</h2>
                            <p>
                                {services.length} שירותים במערכת
                            </p>
                        </div>

                        <button
                            className="providerServicesAddButton"
                            onClick={() => setShowNewService(true)} >
                                הוספת שירות חדש
                        </button>
                    </div>

                    {error && (
                        <p className="providerServicesError">
                            {error}
                        </p>
                    )}

                    {loading ? (
                        <p className="providerServicesLoading">
                            טוען שירותים...
                        </p>
                    ) : services.length === 0 ? (

                        <div className="providerServicesEmpty">
                            <h3>עדיין לא הוספת שירותים</h3>
                            <p>
                                אפשר להוסיף שירות חדש באמצעות הכפתור למעלה.
                            </p>
                        </div>

                    ) : (

                        <div className="providerServicesGrid">

                            {services.map(service => (
                                <div
                                    className="providerServicesItem"
                                    key={service._id}
                                >

                                    <div className="providerServicesItemHeader">

                                        <div
                                            className="providerServicesColor"
                                            style={{
                                                backgroundColor:
                                                    service.color || "#7088e8"
                                            }}
                                        />

                                        <h3>{service.name}</h3>
                                    </div>

                                    <p className="providerServicesDescription">
                                        {service.description || "לא הוזן תיאור לשירות"}
                                    </p>

                                    <div className="providerServicesPrice">
                                        <span>מחיר השירות</span>
                                        <strong>₪{service.price}</strong>
                                    </div>

                                    <div className="providerServicesActions">

                                        <button
                                            className="providerServicesEditButton"
                                            onClick={() => setEditingServiceId(service._id)}
                                        >
                                            עריכה
                                        </button>

                                        <button
                                            className="providerServicesDeleteButton"
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

                <button
                    className="providerServicesBackButton"
                    onClick={() => navigate("/provider/home")}
                >
                    חזרה לדף הבית
                </button>
                {editingServiceId && (
                    <ProviderEditService
                        serviceId={editingServiceId}
                        onClose={() => setEditingServiceId(null)}
                        onUpdated={(updatedService) => {
                            setServices(prev =>
                                prev.map(service =>
                                    service._id === updatedService._id
                                        ? updatedService
                                        : service
                                )
                            )
                            setEditingServiceId(null)
                        }}
                    />
                )}

                {showNewService && (
                    <ProviderNewService
                        onClose={() => setShowNewService(false)}
                        onCreated={() => {
                            setShowNewService(false)
                            window.location.reload()
                        }}
                    />
                )}

            </div>
        </div >

    )
}

export default ProviderServices
