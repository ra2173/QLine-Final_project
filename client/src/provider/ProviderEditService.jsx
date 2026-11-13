
import { useEffect, useState } from "react"
import "../css/provider/ProviderEditService.css"

const ProviderEditService = ({ serviceId, onClose, onUpdated }) => {

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        color: "#3b82f6"
    })

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

    // טעינת פרטי השירות
    useEffect(() => {
        const fetchService = async () => {
            try {
                const token = localStorage.getItem("token")

                const response = await fetch(
                    `http://localhost:2173/api/services/${serviceId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || "טעינת השירות נכשלה")
                }

                setForm({
                    name: data.name || "",
                    description: data.description || "",
                    price: data.price ?? "",
                    color: data.color || "#3b82f6"
                })

            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchService()
    }, [serviceId])

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // שמירת השינויים
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setSaving(true)

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
                        _id: serviceId,
                        ...form,
                        price: Number(form.price)
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "עדכון השירות נכשל")
            }

            onUpdated({
                _id: serviceId,
                ...form,
                price: Number(form.price)
            })

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
                aria-labelledby="providerEditServiceTitle"
                dir="rtl"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="providerEditServiceHeader">
                    <div>
                        <span className="providerEditServiceBrand">
                            QLINE
                        </span>

                        <h2 id="providerEditServiceTitle">
                            עריכת שירות
                        </h2>

                        <p>עדכון פרטי השירות הקיים</p>
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

                {loading ? (
                    <p className="providerEditServiceLoading">
                        טוען שירות...
                    </p>
                ) : (
                    <form onSubmit={handleSubmit}>

                        <div className="providerEditServiceFields">

                            <div className="providerEditServiceField">
                                <label htmlFor="edit-service-name">
                                    שם השירות
                                </label>

                                <input
                                    id="edit-service-name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="הזיני שם שירות"
                                    required
                                />
                            </div>

                            <div className="providerEditServiceField">
                                <label htmlFor="edit-service-price">
                                    מחיר השירות (₪)
                                </label>

                                <input
                                    id="edit-service-price"
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="providerEditServiceField providerEditServiceFull">
                                <label htmlFor="edit-service-description">
                                    תיאור השירות
                                </label>

                                <textarea
                                    id="edit-service-description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="תיאור קצר של השירות"
                                    rows="3"
                                />
                            </div>

                            <div className="providerEditServiceField providerEditServiceFull">
                                <label htmlFor="edit-service-color">
                                    צבע השירות בלוח השנה
                                </label>

                                <div className="providerEditServiceColorBox">
                                    <input
                                        id="edit-service-color"
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
                                {saving ? "שומר שינויים..." : "שמירת שינויים"}
                            </button>
                        </div>

                    </form>
                )}
            </div>
        </div>
    )
}

export default ProviderEditService
