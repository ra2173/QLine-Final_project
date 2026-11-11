import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Button, Card, CardContent, Typography, IconButton, CircularProgress, Alert, Chip, Stack} from "@mui/material"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import GroupsIcon from "@mui/icons-material/Groups"
import "../css/admin/AdminAppintments.css"


function AdminAppointments() {
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // טעינת כל השיעורים
    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem("token")

            const response = await fetch(
                "http://localhost:2173/api/appointments",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const data = await response.json()

            if (!response.ok)
                throw new Error(data.message || "טעינת השיעורים נכשלה")

            setAppointments(data)

        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    // מחיקת שיעור
    const handleDelete = async (id) => {
        if (!window.confirm("האם את בטוחה שברצונך למחוק את השיעור?"))
            return

        try {
            const token = localStorage.getItem("token")

            const response = await fetch(
                "http://localhost:2173/api/appointments",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ id })
                }
            )

            const data = await response.json()

            if (!response.ok)
                throw new Error(data.message || "מחיקת השיעור נכשלה")

            setAppointments(prev =>
                prev.filter(appointment => appointment._id !== id)
            )

        } catch (error) {
            setError(error.message)
        }
    }

    if (loading)
        return <p>טוען שיעורים...</p>

 return (
    <Box className="admin-appointments-page" dir="rtl">

        {/* כותרת */}
        <Box className="appointments-header">
            <Box>
                <Typography className="appointments-title">
                    ניהול שיעורים
                </Typography>

                <Typography className="appointments-subtitle">
                    צפייה וניהול כל השיעורים במערכת
                </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowForwardIcon />}
                    onClick={() => navigate("/admin")}
                >
                    חזרה
                </Button>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/admin/appointments/new")}
                    className="add-appointment-button"
                >
                    יצירת שיעור חדש
                </Button>
            </Stack>
        </Box>

        {error && (
            <Typography className="appointments-error">
                {error}
            </Typography>
        )}

        {/* כמות שיעורים */}
        <Box className="appointments-count">
            <Typography>סך הכול שיעורים</Typography>
            <Typography className="appointments-count-number">
                {appointments.length}
            </Typography>
        </Box>

        {appointments.length === 0 ? (
            <Box className="appointments-empty">
                <CalendarMonthIcon />
                <Typography>לא נמצאו שיעורים</Typography>
            </Box>
        ) : (

            <Box className="appointments-grid">

                {appointments.map(appointment => (
                    <Card
                        key={appointment._id}
                        className="appointment-card"
                        elevation={0}
                    >
                        <CardContent>

                            {/* כותרת הכרטיס */}
                            <Box className="appointment-card-header">
                                <Box>
                                    <Typography className="appointment-service">
                                        {appointment.serviceId?.name || "שיעור"}
                                    </Typography>

                                    <Typography className="appointment-provider">
                                        מדריכה: {appointment.providerId?.name}{" "}
                                        {appointment.providerId?.lastName}
                                    </Typography>
                                </Box>

                                <Chip
                                    label={
                                        appointment.status === "full"
                                            ? "מלא"
                                            : appointment.status === "completed"
                                                ? "הושלם"
                                                : appointment.status === "booked"
                                                    ? "רשומות"
                                                    : appointment.status === "empty"
                                                        ? "פתוח"
                                                        : appointment.status
                                    }
                                    className={`appointment-status status-${appointment.status}`}
                                />
                            </Box>

                            {/* פרטי השיעור */}
                            <Box className="appointment-details">

                                <Box className="appointment-detail">
                                    <CalendarMonthIcon />
                                    <Typography>
                                        {new Date(appointment.startTime).toLocaleDateString("he-IL")}
                                    </Typography>
                                </Box>

                                <Box className="appointment-detail">
                                    <AccessTimeIcon />
                                    <Typography>
                                        {new Date(appointment.startTime).toLocaleTimeString("he-IL", {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </Typography>
                                </Box>

                                <Box className="appointment-detail">
                                    <LocationOnIcon />
                                    <Typography>
                                        {appointment.branch}
                                    </Typography>
                                </Box>

                                <Box className="appointment-detail">
                                    <GroupsIcon />
                                    <Typography>
                                        משתתפים: {appointment.participants || 0}
                                        {" / "}
                                        {appointment.maxParticipants}
                                    </Typography>
                                </Box>

                            </Box>

                            <Typography className="appointment-duration">
                                משך השיעור: {appointment.lengthTime} דקות
                            </Typography>

                            {/* כפתורי פעולה */}
                            <Box className="appointment-actions">

                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={() =>
                                        navigate(`/admin/appointments/edit/${appointment._id}`)
                                    }
                                >
                                    עריכה
                                </Button>

                                <Button className="delete-appointment-button"
                                    variant="outlined"                                    startIcon={<DeleteIcon />}
                                    onClick={() => handleDelete(appointment._id)}
                                >
                                    מחיקה
                                </Button>

                            </Box>

                        </CardContent>
                    </Card>
                ))}

            </Box>
        )}

    </Box>
)
}

export default AdminAppointments