
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const ProviderServices = () => {
    const navigate = useNavigate()

    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

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

    if (loading) return <p>טוען שירותים...</p>
    if (error) return <p>{error}</p>

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

            // הסרת השירות מהרשימה
            setServices(prevServices =>
                prevServices.filter(service => service._id !== id)
            )

        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div dir="rtl">
            <h2>השירותים שלי</h2>

            <button onClick={() => navigate("/provider/services/new")}>
                הוספת שירות חדש
            </button>

            {services.length === 0 ? (
                <p>עדיין לא הוספת שירותים</p>
            ) : (
                services.map(service => (
                    <div
                        key={service._id}
                        style={{
                            border: "1px solid #aaa",
                            padding: "12px",
                            marginTop: "10px",
                            borderRadius: "6px"
                        }}
                    >
                        <h3>{service.name}</h3>
                        <p>{service.description}</p>
                        <p>מחיר: {service.price}</p>

                        <div
                            style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: service.color
                            }}
                        />
                        <button onClick={() => navigate(`/provider/services/edit/${service._id}`)} > עריכה </button>
                        <button onClick={() => handleDelete(service._id)}> מחיקה</button>
                    </div>
                ))
            )}

            <button onClick={() => navigate("/provider/home")}>
                חזרה לדף הבית
            </button>
        </div>
    )
}

export default ProviderServices
