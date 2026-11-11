
import { useNavigate } from "react-router-dom"
import "../css/provider/ProviderHome.css"

const ProviderHome = () => {
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem("token")
        navigate("/provider/login")
    }

    const menuItems = [
        {
            title: "לוח השיעורים שלי",
            description: "צפייה בלוח השיעורים השבועי",
            icon: "📅",
            path: "/provider/calendar"
        },
        {
            title: "השיעורים שלי",
            description: "ניהול וצפייה בשיעורים",
            icon: "🗓️",
            path: "/provider/appointments"
        },
        {
            title: "ניהול השירותים שלי",
            description: "עדכון השירותים שאני מעבירה",
            icon: "🏋️",
            path: "/provider/services"
        },
        {
            title: "הפרופיל שלי",
            description: "צפייה ועדכון הפרטים האישיים",
            icon: "👤",
            path: "/provider/profile"
        },
        {
            title: "הלקוחות שלי",
            description: "צפייה בלקוחות הרשומים לשיעורים",
            icon: "👥",
            path: "/provider/clients"
        }
    ]

    return (
        <div className="providerHome">

            <header className="providerHomeHeader">
                <div className="providerHomeLogo">QLINE</div>

                <button
                    className="providerHomeLogout"
                    onClick={logout}
                >
                    התנתקות
                    <span>↗</span>
                </button>
            </header>

            <main className="providerHomeContent">

                <section className="providerHomeWelcome">
                    <div>
                        <span className="providerHomeLabel">
                            אזור אישי למדריכה
                        </span>

                        <h1>ברוכה הבאה!</h1>

                        <p>
                            כל מה שאת צריכה לניהול השיעורים שלך,
                            במקום אחד.
                        </p>
                    </div>

                    <div className="providerHomeDecoration">
                        Q
                    </div>
                </section>

                <section className="providerHomeSection">
                    <div className="providerHomeSectionTitle">
                        <h2>מה תרצי לעשות היום?</h2>
                        <span>הפעולות שלך</span>
                    </div>

                    <div className="providerHomeGrid">

                        {menuItems.map((item, index) => (
                            <button
                                key={item.path}
                                className={`providerHomeCard providerHomeCard${index + 1}`}
                                onClick={() => navigate(item.path)}
                            >
                                <div className="providerHomeCardTop">
                                    <div className="providerHomeIcon">
                                        {item.icon}
                                    </div>

                                    <span className="providerHomeArrow">
                                        ←
                                    </span>
                                </div>

                                <div className="providerHomeCardText">
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            </button>
                        ))}

                    </div>
                </section>

                <footer className="providerHomeFooter">
                    QLINE · מערכת ניהול השיעורים שלך
                </footer>

            </main>
        </div>
    )
}

export default ProviderHome
