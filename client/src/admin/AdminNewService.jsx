import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../css/admin/AdminNewService.css"
function AdminNewService() {
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

    // טעינת רשימת המדריכות
    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const token = localStorage.getItem("token")

                const response = await fetch(
                    "http://localhost:2173/api/providers",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

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

        fetchProviders()
    }, [])

    // עדכון הטופס
    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // יצירת שירות חדש
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        try {
            const token = localStorage.getItem("token")

            const serviceData = {
                ...formData,
                price: Number(formData.price)
            }

            const response = await fetch(
                "http://localhost:2173/api/services",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(serviceData)
                }
            )

            const data = await response.json()

            if (!response.ok)
                throw new Error(data.message || "יצירת השירות נכשלה")

            navigate("/admin/services")

        } catch (error) {
            setError(error.message)
        }
    }

if (loading)
        return <p className="loadingText">טוען מדריכות...</p>


return (
    <div className="serviceModalOverlay">
        <div className="serviceModal">

            <button
                className="serviceClose"
                type="button"
                onClick={() => navigate("/admin/services")}
            >
                ✕
            </button>

            <div className="serviceModalHeader">
                <span className="serviceBrand">QLINE</span>
                <h1>הוספת שירות חדש</h1>
                <p>הגדירי שירות חדש למערכת שלך</p>
            </div>

            <form className="serviceForm" onSubmit={handleSubmit}>

                <div className="serviceField">
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
                </div>

                <div className="serviceField">
                    <label>שם השירות</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="לדוגמה: פילאטיס מכשירים"
                        required
                    />
                </div>

                <div className="serviceField">
                    <label>תיאור השירות</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="תיאור קצר של השירות..."
                    />
                </div>

                <div className="serviceTwoColumns">

                    <div className="serviceField">
                        <label>מחיר</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="מחיר"
                            min="0"
                            required
                        />
                    </div>

                    <div className="serviceField">
                        <label>צבע השירות</label>
                        <div className="serviceColorBox">
                            <input
                                type="color"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                            />
                            <span>{formData.color}</span>
                        </div>
                    </div>

                </div>

                {error && (
                    <p className="serviceError">{error}</p>
                )}

                <div className="serviceButtons">
                    <button type="submit" className="serviceSubmit">
                        הוספת שירות
                    </button>

                    <button
                        type="button"
                        className="serviceCancel"
                        onClick={() => navigate("/admin/services")}
                    >
                        ביטול
                    </button>
                </div>

            </form>
        </div>
    </div>
)

}

export default AdminNewService