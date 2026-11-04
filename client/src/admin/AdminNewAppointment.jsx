import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function AdminNewAppointment() {
    const navigate = useNavigate()

    const [providers, setProviders] = useState([])
    const [services, setServices] = useState([])

    const [formData, setFormData] = useState({
        providerId: "",
        serviceId: "",
        startTime: "",
        lengthTime: "",
        maxParticipants: 10,
        branch: "",
        notes: ""
    })

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)

    // טעינת מדריכות ושירותים
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token")

                const [providersResponse, servicesResponse] = await Promise.all([
                    fetch("http://localhost:2173/api/providers", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }),

                    fetch("http://localhost:2173/api/services", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                ])

                const providersData = await providersResponse.json()
                const servicesData = await servicesResponse.json()

                if (!providersResponse.ok)
                    throw new Error(providersData.message || "טעינת המדריכות נכשלה")

                if (!servicesResponse.ok)
                    throw new Error(servicesData.message || "טעינת השירותים נכשלה")

                setProviders(providersData)

                // מציגים רק שירותים של מדריכות
                setServices(servicesData)

            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // עדכון הטופס
    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // יצירת שיעור
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        try {
            const token = localStorage.getItem("token")

            const appointmentData = {
                ...formData,
                lengthTime: Number(formData.lengthTime),
                maxParticipants: Number(formData.maxParticipants)
            }

            const response = await fetch(
                "http://localhost:2173/api/appointments",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(appointmentData)
                }
            )

            const data = await response.json()

            if (!response.ok)
                throw new Error(data.message || "יצירת השיעור נכשלה")

            navigate("/admin/appointments")

        } catch (error) {
            setError(error.message)
        }
    }

    if (loading)
        return <p>טוען נתונים...</p>

    return (
        <div>
            <h1>יצירת שיעור חדש</h1>

            <form onSubmit={handleSubmit}>

                <label>בחירת מדריכה</label>
                <select
                    name="providerId"
                    value={formData.providerId}
                    onChange={handleChange}
                    required
                >
                    <option value="">בחרי מדריכה</option>

                    {providers.map(provider => (
                        <option key={provider._id} value={provider._id}>
                            {provider.name} {provider.lastName}
                        </option>
                    ))}
                </select>

                <label>בחירת שירות</label>
                <select
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleChange}
                    required
                >
                    <option value="">בחרי שירות</option>

                    {services.map(service => (
                        <option key={service._id} value={service._id}>
                            {service.name}
                        </option>
                    ))}
                </select>

                <label>תאריך ושעה</label>
                <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                />

                <label>משך השיעור בדקות</label>
                <input
                    type="number"
                    name="lengthTime"
                    value={formData.lengthTime}
                    onChange={handleChange}
                    min="1"
                    required
                />

                <label>מספר משתתפים מרבי</label>
                <input
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    min="1"
                    required
                />

                <label>סניף</label>
                <input
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                />

                <label>הערות</label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                />

                {error && <p>{error}</p>}

                <button type="submit">
                    יצירת שיעור
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/admin/appointments")}
                >
                    ביטול
                </button>

            </form>
        </div>
    )
}

export default AdminNewAppointment