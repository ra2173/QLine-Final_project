
import { useEffect, useState } from "react"
import "../css/provider/ProviderClients.css"

const ProviderClients = () => {
    const [clients, setClients] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchClients = async () => {
            try {
                setLoading(true)
                setError("")

                const token = localStorage.getItem("token")

                // טעינת השיעורים של המדריכה בלבד
                const appointmentsResponse = await fetch(
                    "http://localhost:2173/api/appointments/provider/mine",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                if (!appointmentsResponse.ok) {
                    throw new Error("טעינת השיעורים נכשלה")
                }

                const appointments = await appointmentsResponse.json()

                // טעינת המשתתפות בשיעורים של המדריכה
                const participantsResponses = await Promise.all(
                    appointments.map(appointment =>
                        fetch(
                            `http://localhost:2173/api/appointments/${appointment._id}/participants`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        )
                    )
                )

                
const participantsData = await Promise.all(
    participantsResponses.map(async (response, index) => {

        const text = await response.text()

        console.log(
            "שיעור:",
            appointments[index]._id,
            "סטטוס:",
            response.status,
            "תשובה:",
            text
        )

        if (!response.ok) {
            throw new Error("טעינת רשימת הלקוחות נכשלה")
        }

        if (!text) {
            throw new Error(
                "השרת החזיר תשובה ריקה עבור שיעור " +
                appointments[index]._id
            )
        }

        return JSON.parse(text)
    })
)


                // איחוד לקוחות ללא כפילויות
                const uniqueClients = new Map()

                participantsData.flat().forEach(client => {
                    if (client._id) {
                        uniqueClients.set(client._id, client)
                    }
                })

                setClients(Array.from(uniqueClients.values()))

            } catch (error) {
                console.error(error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchClients()
    }, [])

    // חיפוש לקוחות
    const filteredClients = clients.filter(client => {
        const fullName = `${client.name} ${client.lastName}`.toLowerCase()
        const phone = client.phone || ""
        const searchValue = search.trim().toLowerCase()

        return (
            fullName.includes(searchValue) ||
            phone.includes(searchValue)
        )
    })

    return (
        <div className="providerClientsPage" dir="rtl">
            <div className="providerClientsContainer">

                {/* כותרת ראשית */}
                <div className="providerClientsHero">
                    <span className="providerClientsBrand">QLINE</span>
                    <h1>הלקוחות שלי</h1>
                    <p>צפייה בלקוחות הרשומים לשיעורים שלך</p>
                </div>

                {/* כרטיס רשימת לקוחות */}
                <div className="providerClientsMainCard">

                    <div className="providerClientsToolbar">
                        <div>
                            <h2>רשימת לקוחות</h2>
                            <p>
                                {clients.length} לקוחות רשומים
                            </p>
                        </div>

                        <div className="providerClientsSearch">
                            <input
                                type="text"
                                placeholder="חיפוש לפי שם או טלפון..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="providerClientsError">{error}</p>
                    )}

                    {loading ? (
                        <p className="providerClientsLoading">
                            טוען לקוחות...
                        </p>
                    ) : clients.length === 0 ? (
                        <div className="providerClientsEmpty">
                            <h3>עדיין אין לקוחות רשומים</h3>
                            <p>לקוחות שיירשמו לשיעורים שלך יופיעו כאן.</p>
                        </div>
                    ) : (
                        <div className="providerClientsTableWrapper">
                            <table className="providerClientsTable">
                                <thead>
                                    <tr>
                                        <th>שם פרטי</th>
                                        <th>שם משפחה</th>
                                        <th>טלפון</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredClients.map(client => (
                                        <tr key={client._id}>
                                            <td>{client.name}</td>
                                            <td>{client.lastName}</td>
                                            <td>{client.phone || "לא צוין"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredClients.length === 0 && (
                                <p className="providerClientsNoResults">
                                    לא נמצאו לקוחות התואמים לחיפוש
                                </p>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default ProviderClients
