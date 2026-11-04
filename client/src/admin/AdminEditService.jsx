import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

function AdminEditService() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [providers, setProviders] = useState([])

    const [formData, setFormData] = useState({
        providerId: "",
        name: "",
        description: "",
        price: "",
        color: "#3b82f6"
    })

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // טעינת השירות והמדריכות
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token")

                const [serviceResponse, providersResponse] =
                    await Promise.all([
                        fetch(`http://localhost:2173/api/services/${id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }),

                        fetch("http://localhost:2173/api/providers", {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                    ])

                const service = await serviceResponse.json()
                const providersData = await providersResponse.json()

                if (!serviceResponse.ok)
                    throw new Error(service.message || "טעינת השירות נכשלה")

                if (!providersResponse.ok)
                    throw new Error(providersData.message || "טעינת המדריכות נכשלה")

                setProviders(providersData)

                setFormData({
                    providerId: service.providerId?._id || service.providerId || "",
                    name: service.name || "",
                    description: service.description || "",
                    price: service.price ?? "",
                    color: service.color || "#3b82f6"
                })

            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
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
                providerId: formData.providerId,
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                color: formData.color
            }

            const response = await fetch("http://localhost:2173/api/services", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            })

            const data = await response.json()

            if (!response.ok)
                throw new Error(data.message || "עדכון השירות נכשל")

            navigate("/admin/services")

        } catch (error) {
            setError(error.message)
        }
    }

    if (loading)
        return <p>טוען פרטי שירות...</p>

    return (
        <div>
            <h1>עריכת שירות</h1>

            <form onSubmit={handleSubmit}>

                <label>מדריכה</label>
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

                <label>שם השירות</label>
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <label>תיאור השירות</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />

                <label>מחיר</label>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    required
                />

                <label>צבע השירות</label>
                <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                />

                {error && <p>{error}</p>}

                <button type="submit">
                    שמירת שינויים
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/admin/services")}
                >
                    ביטול
                </button>

            </form>
        </div>
    )
}

export default AdminEditService