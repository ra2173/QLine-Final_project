import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import axios from "axios"

const UserRegister = () => {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [idNumber, setIdNumber] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const submitForm = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        try {
            await axios.post(
                "http://localhost:2173/api/auth/register",
                {
                    name,
                    lastName,
                    username,
                    idNumber,
                    email,
                    phone,
                    password
                }
            )

            setSuccess("נרשמת בהצלחה! אפשר להתחבר עכשיו.")

            setName("")
            setLastName("")
            setUsername("")
            setIdNumber("")
            setEmail("")
            setPhone("")
            setPassword("")

            setSuccess("נרשמת בהצלחה! מעבירים אותך להתחברות...")

            setTimeout(() => {
                navigate("/user/login")
            }, 1500)
        } catch (error) {
            setError(
                error.response?.data?.message || "ההרשמה נכשלה"
            )
        }
    }

    return (
        <>
            <h2>הרשמה ללקוחות</h2>

            <form onSubmit={submitForm}>
                <label htmlFor="name">שם פרטי</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label htmlFor="lastName">שם משפחה</label>
                <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />

                <label htmlFor="username">שם משתמש</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label htmlFor="idNumber">מספר זהות</label>
                <input
                    id="idNumber"
                    type="text"
                    inputMode="numeric"
                    maxLength={9}
                    pattern="[0-9]{9}"
                    title="יש להזין 9 ספרות"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    required
                />

                <label htmlFor="email">אימייל</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="phone">טלפון</label>
                <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <label htmlFor="password">סיסמה</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                />

                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>{success}</p>}

                <button type="submit">הרשמה</button>
                <p>
                    כבר יש לך חשבון?
                    <Link to="/user/login"> להתחברות</Link>
                </p>
            </form>
        </>
    )
}

export default UserRegister
