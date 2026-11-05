import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import "../css/user/UserRegister.css"

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
    <div className="auth-page" dir="rtl">

        <div className="auth-card register-card">

            <div className="auth-logo">
                Q<span>LINE</span>
                <small>FITNESS MANAGEMENT</small>
            </div>

            <div className="auth-heading">
                <span>JOIN QLINE</span>
                <h2>יוצרים חשבון חדש</h2>
                <p>ממלאים את הפרטים ומצטרפים אלינו</p>
            </div>

            <form onSubmit={submitForm}>

                <div className="register-grid">

                    <div className="auth-field">
                        <label htmlFor="name">שם פרטי</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="השם הפרטי שלך"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="lastName">שם משפחה</label>
                        <input
                            id="lastName"
                            type="text"
                            placeholder="שם המשפחה"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="username">שם משתמש</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="בחרי שם משתמש"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="idNumber">מספר זהות</label>
                        <input
                            id="idNumber"
                            type="text"
                            inputMode="numeric"
                            maxLength={9}
                            pattern="[0-9]{9}"
                            title="יש להזין 9 ספרות"
                            placeholder="9 ספרות"
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="email">אימייל</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="example@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="phone">טלפון</label>
                        <input
                            id="phone"
                            type="tel"
                            placeholder="מספר טלפון"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="auth-field full-width">
                        <label htmlFor="password">סיסמה</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="לפחות 8 תווים"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={8}
                            required
                        />
                    </div>

                </div>

                {error && (
                    <p className="auth-error">{error}</p>
                )}

                {success && (
                    <p className="auth-success">{success}</p>
                )}

                <button type="submit" className="auth-submit">
                    יצירת חשבון
                    <span>↖</span>
                </button>

                <p className="auth-switch">
                    כבר יש לך חשבון?
                    <Link to="/user/login"> להתחברות</Link>
                </p>

            </form>

        </div>

    </div>
)
}

export default UserRegister
