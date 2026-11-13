
import { useState } from "react"
import "../css/provider/ProviderEditService.css"

const ProviderNewService = ({ onClose, onCreated }) => {

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        color: "#3b82f6"
    })

    const [error, setError] = useState("")
    const [saving, setSaving] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSaving(true)

        try {
            const token = localStorage.getItem("token")

            const response = await fetch(
                "http://localhost:2173/api/services",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...form,
                        price: Number(form.price)
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "יצירת השירות נכשלה")
            }

            onCreated()

        } catch (error) {
            setError(error.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div
            className="providerEditServiceOverlay"
            onClick={onClose}
        >
            <div
                className="providerEditServiceModal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="providerNewServiceTitle"
                dir="rtl"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="providerEditServiceHeader">
                    <div>
                        <span className="providerEditServiceBrand">
                            QLINE
                        </span>

                        <h2 id="providerNewServiceTitle">
                            הוספת שירות חדש
                        </h2>

                        <p>הזיני את פרטי השירות החדש</p>
                    </div>

                    <button
                        type="button"
                        className="providerEditServiceClose"
                        onClick={onClose}
                        aria-label="סגירה"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="providerEditServiceFields">

                        <div className="providerEditServiceField">
                            <label htmlFor="new-service-name">
                                שם השירות
                            </label>

                            <input
                                id="new-service-name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="הזיני שם שירות"
                                required
                            />
                        </div>

                        <div className="providerEditServiceField">
                            <label htmlFor="new-service-price">
                                מחיר השירות (₪)
                            </label>

                            <input
                                id="new-service-price"
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>

                        <div className="providerEditServiceField providerEditServiceFull">
                            <label htmlFor="new-service-description">
                                תיאור השירות
                            </label>

                            <textarea
                                id="new-service-description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="תיאור קצר של השירות"
                                rows="3"
                            />
                        </div>

                        <div className="providerEditServiceField providerEditServiceFull">
                            <label htmlFor="new-service-color">
                                צבע השירות בלוח השנה
                            </label>

                            <div className="providerEditServiceColorBox">
                                <input
                                    id="new-service-color"
                                    type="color"
                                    name="color"
                                    value={form.color}
                                    onChange={handleChange}
                                />

                                <span>{form.color}</span>
                            </div>
                        </div>

                    </div>

                    {error && (
                        <p className="providerEditServiceError">
                            {error}
                        </p>
                    )}

                    <div className="providerEditServiceActions">
                        <button
                            type="button"
                            className="providerEditServiceCancel"
                            onClick={onClose}
                        >
                            ביטול
                        </button>

                        <button
                            type="submit"
                            className="providerEditServiceSave"
                            disabled={saving}
                        >
                            {saving ? "שומר שירות..." : "שמירת שירות"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default ProviderNewService
