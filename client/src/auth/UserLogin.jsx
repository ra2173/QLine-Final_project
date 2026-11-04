
import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import "../css/user/Login.css"
// import "../css/admin/ProviderLogin.css"

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

 const submitForm = async (e) => {
    e.preventDefault()
    setError("")

    try {
        const res = await axios.post(
            "http://localhost:2173/api/auth/login",
            { username, password }
        )

        const token = res.data.accessToken
        localStorage.setItem("token", token)

        // קריאת מזהה הלקוחה מתוך הטוקן
        const payload = JSON.parse(
            atob(token.split(".")[1])
        )

        const userId = payload.UserInfo._id

        setPassword("")
        setUsername("")

        // מעבר לדף הבית עם מזהה הלקוחה
        navigate(`/user/home`)
    } catch (error) {
        console.log("שגיאת התחברות:", error.response?.data)

        setError(
            error.response?.data?.message ||
            "ההתחברות נכשלה"
        )
    }
}

return (
    <div className="user-login-page">

        <div className="user-login-decoration user-login-decoration-top"></div>
        <div className="user-login-decoration user-login-decoration-bottom"></div>

        <div className="user-login-card">

            <div className="user-login-brand">
                <img className="user-login-logo" src="/logo.jpg" alt="Qline" />
                <h1>Qline</h1>
                <p>הדרך שלך להתחיל לזוז</p>
            </div>

            <div className="user-login-heading">
                <h2>טוב שחזרת!</h2>
                <p>התחברי לחשבון שלך והמשיכי בדרך שלך</p>
            </div>

            <form onSubmit={submitForm} className="user-login-form">

                <div className="user-login-field">
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

                <div className="user-login-field">
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
                    <p className="user-login-error" role="alert">
                        {error}
                    </p>
                )}

                <button type="submit" className="user-login-submit">
                    התחברות
                    <span aria-hidden="true">←</span>
                </button>

            </form>

            <div className="user-login-register">
                <span>עדיין אין לך חשבון?</span>
                <Link to="/user/register">להרשמה</Link>
            </div>

            <div className="user-login-footer">
                <span className="user-login-footer-dot"></span>
                המקום שלך להתקדם, להתחזק ולהתמיד
            </div>

        </div>
    </div>
)
}

export default Login

