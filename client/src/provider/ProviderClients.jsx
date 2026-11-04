import { useEffect, useState } from "react"

const ProviderClients = () => {
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const token = localStorage.getItem("token")

                // טעינת השיעורים
                const appointmentsResponse = await fetch(
                    "http://localhost:2173/api/appointments",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                if (!appointmentsResponse.ok)
                    throw new Error("טעינת השיעורים נכשלה")

                const appointments = await appointmentsResponse.json()

                // טעינת המשתתפים בכל שיעור
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
                    participantsResponses.map(async response => {
                        if (!response.ok)
                            throw new Error("טעינת רשימת הלקוחות נכשלה")

                        return response.json()
                    })
                )

                // איחוד הלקוחות ללא כפילויות
                const uniqueClients = new Map()

                participantsData.flat().forEach(client => {
                    if (client._id)
                        uniqueClients.set(client._id, client)
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

    if (loading)
        return <p>טוען לקוחות...</p>

    if (error)
        return <p>{error}</p>

    return (
        <div dir="rtl">
            <h2>הלקוחות שלי</h2>

            {clients.length === 0 ? (
                <p>עדיין אין לקוחות הרשומים לשיעורים שלך</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>שם פרטי</th>
                            <th>שם משפחה</th>
                            <th>טלפון</th>
                        </tr>
                    </thead>

                    <tbody>
                        {clients.map(client => (
                            <tr key={client._id}>
                                <td>{client.name}</td>
                                <td>{client.lastName}</td>
                                <td>{client.phone || "לא צוין"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    )
}

export default ProviderClients