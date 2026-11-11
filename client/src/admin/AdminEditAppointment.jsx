import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import "../css/admin/AdminEditAppointment.css"

function AdminEditAppointment() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [providers, setProviders] = useState([])
    const [services, setServices] = useState([])

    const [formData, setFormData] = useState({
        providerId: "",
        serviceId: "",
        startTime: "",
        lengthTime: "",
        maxParticipants: "",
        branch: "",
        notes: "",
        status: ""
    })

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // טעינת פרטי השיעור, המדריכות והשירותים
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token")

                const [appointmentResponse, providersResponse, servicesResponse] =
                    await Promise.all([
                        fetch(`http://localhost:2173/api/appointments/${id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }),

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

                const appointment = await appointmentResponse.json()
                const providersData = await providersResponse.json()
                const servicesData = await servicesResponse.json()

                if (!appointmentResponse.ok)
                    throw new Error(appointment.message || "טעינת השיעור נכשלה")

                if (!providersResponse.ok)
                    throw new Error(providersData.message || "טעינת המדריכות נכשלה")

                if (!servicesResponse.ok)
                    throw new Error(servicesData.message || "טעינת השירותים נכשלה")

                setProviders(providersData)
                setServices(servicesData)

                setFormData({
                    providerId: appointment.providerId?._id || appointment.providerId || "",
                    serviceId: appointment.serviceId?._id || appointment.serviceId || "",
                    startTime: appointment.startTime
                        ? new Date(appointment.startTime).toISOString().slice(0, 16)
                        : "",
                    lengthTime: appointment.lengthTime || "",
                    maxParticipants: appointment.maxParticipants || "",
                    branch: appointment.branch || "",
                    notes: appointment.notes || "",
                    status: appointment.status || "empty"
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
                serviceId: formData.serviceId,
                startTime: formData.startTime,
                lengthTime: Number(formData.lengthTime),
                maxParticipants: Number(formData.maxParticipants),
                branch: formData.branch,
                notes: formData.notes,
                status: formData.status
            }

            const response = await fetch("http://localhost:2173/api/appointments", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            })

            const data = await response.json()

            if (!response.ok)
                throw new Error(data.message || "עדכון השיעור נכשל")

            navigate("/admin/appointments")

        } catch (error) {
            setError(error.message)
        }
    }

    if (loading)
        return <p>טוען פרטי שיעור...</p>


    return (
        <div className="editAppointmentOverlay">
            <div className="editAppointmentModal">

                <button
                    className="editAppointmentClose"
                    type="button"
                    onClick={() => navigate("/admin/appointments")}
                >
                    ✕
                </button>

                <div className="editAppointmentHeader">
                    <span className="editAppointmentBrand">QLINE</span>
                    <h1>עריכת שיעור</h1>
                    <p>עדכון פרטי השיעור במערכת</p>
                </div>

                <form
                    className="editAppointmentForm"
                    onSubmit={handleSubmit}
                >

                    <div className="editAppointmentGrid">


                        <div className="editAppointmentField">
                            <label>מדריכה</label>
                            <select
                                name="providerId"
                                value={formData.providerId}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        providerId: e.target.value,
                                        serviceId: ""
                                    })
                                }}
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

                        <div className="editAppointmentField">
                            <label>שירות</label>
                            <select
                                name="serviceId"
                                value={formData.serviceId}
                                onChange={handleChange}
                                required
                                disabled={!formData.providerId}
                            >
                                <option value="">בחרי שירות</option>

                                {services
                                    .filter(service =>
                                        service.providerId?._id === formData.providerId
                                    )
                                    .map(service => (
                                        <option key={service._id} value={service._id}>
                                            {service.name}
                                        </option>
                                    ))}
                            </select>
                        </div>


                        <div className="editAppointmentField">
                            <label>תאריך ושעה</label>
                            <input
                                type="datetime-local"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="editAppointmentField">
                            <label>משך השיעור בדקות</label>
                            <input
                                type="number"
                                name="lengthTime"
                                value={formData.lengthTime}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>

                        <div className="editAppointmentField">
                            <label>מספר משתתפים מרבי</label>
                            <input
                                type="number"
                                name="maxParticipants"
                                value={formData.maxParticipants}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>

                        <div className="editAppointmentField">
                            <label>סניף</label>
                            <input
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="editAppointmentField">
                            <label>סטטוס השיעור</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="empty">פנוי</option>
                                <option value="booked">רשום</option>
                                <option value="completed">הושלם</option>
                                <option value="late cancel">ביטול מאוחר</option>
                            </select>
                        </div>

                        <div className="editAppointmentField">
                            <label>הערות</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="הערות נוספות לשיעור..."
                            />
                        </div>

                    </div>

                    {error && (
                        <p className="editAppointmentError">{error}</p>
                    )}

                    <div className="editAppointmentButtons">

                        <button
                            type="submit"
                            className="editAppointmentSubmit"
                        >
                            שמירת שינויים
                        </button>

                        <button
                            type="button"
                            className="editAppointmentCancel"
                            onClick={() => navigate("/admin/appointments")}
                        >
                            ביטול
                        </button>

                    </div>

                </form>
            </div>
        </div>
    )

}

export default AdminEditAppointment