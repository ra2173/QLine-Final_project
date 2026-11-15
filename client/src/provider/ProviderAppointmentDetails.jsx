
import { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import "../css/provider/ProviderAppointmentDetails.css"

const toLocalDateTime = (date) => {
    const d = new Date(date)
    const offset = d.getTimezoneOffset() * 60000
    return new Date(d.getTime() - offset).toISOString().slice(0, 16)
}

const ProviderAppointmentDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const [appointment, setAppointment] = useState(null)
    const [participants, setParticipants] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [editing, setEditing] = useState(false)

    const [form, setForm] = useState({
        startTime: "",
        lengthTime: "",
        branch: "",
        notes: ""
    })

 const closeModal = () => {
    if (location.state?.backgroundLocation) {
        navigate(-1)
    } else {
        navigate("/provider/appointments", { replace: true })
    }
}

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true)
                setError("")

                const token = localStorage.getItem("token")

                const response = await fetch(
                    `http://localhost:2173/api/appointments/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                if (!response.ok) {
                    throw new Error("טעינת פרטי השיעור נכשלה")
                }

                const data = await response.json()

                setAppointment(data)

                setForm({
                    startTime: toLocalDateTime(data.startTime),
                    lengthTime: data.lengthTime,
                    branch: data.branch,
                    notes: data.notes || ""
                })

                const participantsResponse = await fetch(
                    `http://localhost:2173/api/appointments/${id}/participants`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                if (!participantsResponse.ok) {
                    throw new Error("טעינת המשתתפות נכשלה")
                }

                const participantsData =
                    await participantsResponse.json()

                setParticipants(
                    Array.isArray(participantsData)
                        ? participantsData
                        : participantsData.participants || []
                )

            } catch (err) {
                console.error(err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchDetails()
    }, [id])

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                closeModal()
            }
        }

        window.addEventListener("keydown", handleEscape)

        return () => {
            window.removeEventListener("keydown", handleEscape)
        }
    }, [navigate])

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleUpdate = async (e) => {
        e.preventDefault()

        try {
            setError("")

            const token = localStorage.getItem("token")

            const response = await fetch(
                "http://localhost:2173/api/appointments",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        _id: id,
                        serviceId: appointment.serviceId?._id,
                        startTime: form.startTime,
                        lengthTime: Number(form.lengthTime),
                        branch: form.branch,
                        notes: form.notes
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(
                    data.message || "עדכון השיעור נכשל"
                )
            }

            closeModal()

        } catch (err) {
            console.error(err)
            setError(err.message)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm("האם למחוק את השיעור?")) {
            return
        }

        try {
            setError("")

            const token = localStorage.getItem("token")

            const response = await fetch(
                "http://localhost:2173/api/appointments",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        _id: id
                    })
                }
            )

            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new Error(
                    data.message || "מחיקת השיעור נכשלה"
                )
            }

            closeModal()

        } catch (err) {
            console.error(err)
            setError(err.message)
        }
    }

    const participantsCount = participants.length

    const maxParticipants = appointment?.maxParticipants || 10

    const availablePlaces =
        Math.max(0, maxParticipants - participantsCount)

    const lessonColor =
        appointment?.serviceId?.color || "#7088e8"

    return (
        <div
            className="providerDetailsOverlay"
            dir="rtl"
            onClick={closeModal}
        >
            <div
                className="providerDetailsModal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="providerDetailsTitle"
                style={{
                    "--lesson-color": lessonColor
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className="providerDetailsClose"
                    onClick={closeModal}
                    aria-label="סגירה"
                >
                    ×
                </button>

                <div className="providerDetailsHeader">
                    <span className="providerDetailsBrand">
                        QLINE
                    </span>

                    <h2 id="providerDetailsTitle">
                        {editing
                            ? "עריכת שיעור"
                            : "פרטי השיעור"}
                    </h2>

                    <p>
                        {editing
                            ? "עדכון פרטי השיעור"
                            : "צפייה וניהול פרטי השיעור"}
                    </p>
                </div>

                <div className="providerDetailsBody">

                    {loading ? (
                        <p className="providerDetailsMessage">
                            טוען פרטי שיעור...
                        </p>
                    ) : !appointment ? (
                        <p className="providerDetailsMessage">
                            השיעור לא נמצא
                        </p>
                    ) : (
                        <>
                            <div className="providerDetailsLessonHeader">
                                <div className="providerDetailsColorMark">
                                    Q
                                </div>

                                <div>
                                    <h3>
                                        {appointment.serviceId?.name ||
                                            "שיעור"}
                                    </h3>

                                    <p>
                                        {appointment.providerId?.name}{" "}
                                        {appointment.providerId?.lastName}
                                    </p>
                                </div>
                            </div>

                            {error && (
                                <p className="providerDetailsError">
                                    {error}
                                </p>
                            )}

                            {editing ? (
                                <form
                                    className="providerDetailsForm"
                                    onSubmit={handleUpdate}
                                >
                                    <div className="providerDetailsFormGrid">
                                        <label>
                                            תאריך ושעה
                                            <input
                                                type="datetime-local"
                                                name="startTime"
                                                value={form.startTime}
                                                onChange={handleChange}
                                                required
                                            />
                                        </label>

                                        <label>
                                            משך השיעור בדקות
                                            <input
                                                type="number"
                                                name="lengthTime"
                                                value={form.lengthTime}
                                                onChange={handleChange}
                                                min="1"
                                                required
                                            />
                                        </label>

                                        <label>
                                            סניף
                                            <input
                                                type="text"
                                                name="branch"
                                                value={form.branch}
                                                onChange={handleChange}
                                                required
                                            />
                                        </label>

                                        <label className="providerDetailsFullWidth">
                                            הערות
                                            <textarea
                                                name="notes"
                                                value={form.notes}
                                                onChange={handleChange}
                                                rows="2"
                                            />
                                        </label>
                                    </div>

                                    <div className="providerDetailsActions">
                                        <button
                                            type="submit"
                                            className="providerDetailsPrimary"
                                        >
                                            שמירת שינויים
                                        </button>

                                        <button
                                            type="button"
                                            className="providerDetailsSecondary"
                                            onClick={() => setEditing(false)}
                                        >
                                            ביטול
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="providerDetailsInfoGrid">

                                        <div className="providerDetailsInfoBox">
                                            <span>תאריך</span>
                                            <strong>
                                                {new Date(
                                                    appointment.startTime
                                                ).toLocaleDateString("he-IL")}
                                            </strong>
                                        </div>

                                        <div className="providerDetailsInfoBox">
                                            <span>שעה</span>
                                            <strong>
                                                {new Date(
                                                    appointment.startTime
                                                ).toLocaleTimeString("he-IL", {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </strong>
                                        </div>

                                        <div className="providerDetailsInfoBox">
                                            <span>משך השיעור</span>
                                            <strong>
                                                {appointment.lengthTime} דקות
                                            </strong>
                                        </div>

                                        <div className="providerDetailsInfoBox">
                                            <span>סניף</span>
                                            <strong>
                                                {appointment.branch}
                                            </strong>
                                        </div>

                                    </div>

                                    <div className="providerDetailsStats">
                                        <div>
                                            <span>משתתפות</span>
                                            <strong>
                                                {participantsCount}/{maxParticipants}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>מקומות פנויים</span>
                                            <strong>
                                                {availablePlaces}
                                            </strong>
                                        </div>
                                    </div>

                                    {appointment.notes && (
                                        <div className="providerDetailsNotes">
                                            <span>הערות</span>
                                            <p>{appointment.notes}</p>
                                        </div>
                                    )}

                                    <div className="providerDetailsParticipants">
                                        <h4>
                                            רשימת משתתפות
                                        </h4>

                                        {participants.length === 0 ? (
                                            <p className="providerDetailsEmpty">
                                                עדיין אין נרשמות לשיעור
                                            </p>
                                        ) : (
                                            <div className="providerDetailsParticipantsList">
                                                {participants.map(participant => (
                                                    <div
                                                        key={participant._id}
                                                        className="providerDetailsParticipant"
                                                    >
                                                        <span>
                                                            {participant.name}{" "}
                                                            {participant.lastName}
                                                        </span>

                                                        {participant.phone && (
                                                            <span>
                                                                {participant.phone}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="providerDetailsActions">
                                        <button
                                            type="button"
                                            className="providerDetailsPrimary"
                                            onClick={() => setEditing(true)}
                                        >
                                            עריכת שיעור
                                        </button>

                                        <button
                                            type="button"
                                            className="providerDetailsDelete"
                                            onClick={handleDelete}
                                        >
                                            מחיקת שיעור
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {error && !appointment && (
                        <p className="providerDetailsError">
                            {error}
                        </p>
                    )}

                </div>
            </div>
        </div>
    )
}

export default ProviderAppointmentDetails
