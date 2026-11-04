import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const ProviderEditService = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        color: "#3b82f6"
    })

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // טעינת השירות הקיים
    useEffect(() => {
        const fetchService = async () => {
            try {
                const token = localStorage.getItem("token")

                const response = await fetch(
                    `http://localhost:2173/api/services/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                const data = await response.json()

                if (!response.ok)
                    throw new Error(data.message || "טעינת השירות נכשלה")

                setForm({
                    name: data.name,
                    description: data.description || "",
                    price: data.price,
                    color: data.color || "#3b82f6"
                })

            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchService()
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm({
            ...form,
            [name]: value
        })
    }

    // שמירת השינויים
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        try {
            const token = localStorage.getItem("token")

            const response = await fetch(
                "http://localhost:2173/api/services",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        _id: id,
                        ...form,
                        price: Number(form.price)
                    })
                }
            )

            const data = await response.json()

            if (!response.ok)
                throw new Error(data.message || "עדכון השירות נכשל")

            navigate("/provider/services")

        } catch (error) {
            setError(error.message)
        }
    }

    if (loading) return <p>טוען שירות...</p>

    return (
        <div dir="rtl">
            <h2>עריכת שירות</h2>

            <form onSubmit={handleSubmit}>
                <label>שם השירות</label>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <label>תיאור</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                />

                <label>מחיר</label>
                <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    required
                />

                <label>צבע השירות</label>
                <input
                    type="color"
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                />

                {error && <p>{error}</p>}

                <button type="submit">שמירת שינויים</button>

                <button
                    type="button"
                    onClick={() => navigate("/provider/services")}
                >
                    ביטול
                </button>
            </form>
        </div>
    )
}

export default ProviderEditService