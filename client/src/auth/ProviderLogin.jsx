
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../css/admin/ProviderLogin.css"

const ProviderLogin = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const submitForm = async (e) => {
        e.preventDefault()
        setError("")

        try {
            const res = await axios.post(
                "http://localhost:2173/api/auth/provider/login",
                { username, password }
            )

            const token = res.data.accessToken
            localStorage.setItem("token", token)

            const payload = JSON.parse(
                atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
            )

            const role = payload.UserInfo?.role
            const providerId = payload.UserInfo?._id
            localStorage.setItem("providerId", providerId)

            setPassword("")
            setUsername("")

            if (Array.isArray(role) && role.includes("Admin")) {
                navigate("/admin")
            } else {
                navigate("/provider/home")
            }
        } catch (error) {
            setError(
                error.response?.data?.message || "ההתחברות נכשלה"
            )
        }
    }

    return (
        <div className="provider-login-page">

            <div className="login-decoration login-decoration-top"></div>
            <div className="login-decoration login-decoration-bottom"></div>

            <div className="provider-login-card">

                <div className="login-brand">
                    <img className="login-logo" src="/logo.jpg" alt="Qline" />
                    <h1>Qline</h1>
                    <p>הדרך שלך להתחיל לזוז</p>
                </div>

                <div className="login-heading">
                    <h2>טוב שחזרת!</h2>
                    <p>התחברי למערכת הניהול והצוות</p>
                </div>

                <form onSubmit={submitForm} className="provider-login-form">

                    <div className="login-field">
                        <label htmlFor="username">שם משתמש</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="הכניסי שם משתמש"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="password">סיסמה</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="הכניסי סיסמה"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <p className="login-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button type="submit" className="login-submit">
                        התחברות
                        <span aria-hidden="true">←</span>
                    </button>

                </form>

                <div className="login-footer">
                    <span className="login-footer-dot"></span>
                    סביבת העבודה שלך, במקום אחד
                </div>

            </div>
        </div>
    )
}

export default ProviderLogin
