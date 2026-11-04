import { useState } from "react"
import { useNavigate } from "react-router-dom"

const ProviderNewService = () => {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        color: "#3b82f6"
    })

    const [error, setError] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm({
            ...form,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        try {
            const token = localStorage.getItem("token")

            const response = await fetch("http://localhost:2173/api/services", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...form,
                    price: Number(form.price)
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "יצירת השירות נכשלה")
            }

            navigate("/provider/services")

        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div>
            <h2>הוספת שירות חדש</h2>

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

                <button type="submit">שמירת שירות</button>
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

export default ProviderNewService