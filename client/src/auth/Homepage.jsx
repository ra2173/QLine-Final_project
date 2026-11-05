
import { useEffect } from "react"
import "../css/homepage.css"
import { useNavigate } from "react-router-dom"

const Homepage = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const elements = document.querySelectorAll(".reveal")

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible")
                    observer.unobserve(entry.target)
                }
            })
        }, {
            threshold: 0.15
        })

        elements.forEach((element) => observer.observe(element))

        return () => observer.disconnect()
    }, [])
    const features = [
        {
            icon: "📅",
            title: "ניהול שיעורים",
            text: "כל השיעורים, הזמנים וההרשמות במקום אחד."
        },
        {
            icon: "👥",
            title: "ניהול משתתפות",
            text: "מעקב אחר נרשמות, מקומות פנויים ונוכחות."
        },
        {
            icon: "📊",
            title: "נתונים וסטטיסטיקות",
            text: "תמונה ברורה של הפעילות והביצועים."
        },
        {
            icon: "🔔",
            title: "התראות חכמות",
            text: "עדכונים על הרשמות, ביטולים ושינויים."
        }
    ]

    return (
        <div className="home-page" dir="rtl">

            {/* HEADER */}
            <header className="home-header">
                <div className="home-logo">
                    Q<span>LINE</span>
                    <small>FITNESS MANAGEMENT</small>
                </div>

                <nav className="home-nav">
                    <a href="#features">היתרונות שלנו</a>
                    <a href="#dashboard">המערכת</a>
                    <a href="#about">על QLINE</a>
                </nav>

                <div className="header-actions">
                    <button
                        className="header-login"
                        onClick={() => navigate("/user/login")}
                    >
                        כניסה למערכת
                    </button>

                    <button
                        className="header-staff"
                        onClick={() => navigate("/provider/login")}
                    >
                        כניסת צוות ↗
                    </button>
                </div>
            </header>

            {/* HERO */}
            <section className="hero-section">

                <div className="hero-content">
                    <div className="hero-label">
                        <span></span>
                        SMART FITNESS MANAGEMENT
                    </div>

                    <h1>
                        חדר הכושר שלך.
                        <br />
                        <span>בשליטה מלאה.</span>
                    </h1>

                    <p>
                        כל השיעורים, המדריכות והמשתתפות
                        שלך במקום אחד.
                        ניהול חכם ופשוט שמאפשר לך
                        להתמקד במה שחשוב באמת.
                    </p>

                    <div className="hero-buttons">
                        <button
                            className="primary-button"
                            onClick={() => navigate("/user/login")}
                        >
                            כניסה למערכת
                            <span>↖</span>
                        </button>

                        <button
                            className="secondary-button"
                            onClick={() => navigate("/provider/login")}
                        >
                            כניסת צוות
                        </button>
                    </div>

                    <div className="hero-note">
                        <span>✦</span>
                        כל הניהול שלך. במקום אחד.
                    </div>
                </div>

                {/* DASHBOARD MOCKUP */}
                <div className="hero-visual">
                    <div className="visual-glow"></div>

                    <div className="dashboard-card">
                        <div className="dashboard-top">
                            <div>
                                <small>QLINE DASHBOARD</small>
                                <h3>הפעילות שלך</h3>
                            </div>
                            <span className="dashboard-dot"></span>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-box">
                                <small>שיעורים היום</small>
                                <strong>08</strong>
                                <span>השבוע</span>
                            </div>

                            <div className="stat-box orange-stat">
                                <small>משתתפות</small>
                                <strong>64</strong>
                                <span>רשומות לשיעורים</span>
                            </div>
                        </div>

                        <div className="schedule-preview">
                            <div className="schedule-heading">
                                <strong>השיעורים הקרובים</strong>
                                <span>היום</span>
                            </div>

                            <div className="schedule-item">
                                <div className="schedule-time">09:00</div>
                                <div className="schedule-info">
                                    <strong>פילאטיס</strong>
                                    <small>סטודיו A</small>
                                </div>
                                <div className="schedule-count">12/15</div>
                            </div>

                            <div className="schedule-item">
                                <div className="schedule-time">10:30</div>
                                <div className="schedule-info">
                                    <strong>אימון כוח</strong>
                                    <small>סטודיו B</small>
                                </div>
                                <div className="schedule-count">10/12</div>
                            </div>

                            <div className="schedule-item">
                                <div className="schedule-time">12:00</div>
                                <div className="schedule-info">
                                    <strong>יוגה</strong>
                                    <small>סטודיו A</small>
                                </div>
                                <div className="schedule-count">8/15</div>
                            </div>
                        </div>

                        <div className="dashboard-footer">
                            <span>YOUR FITNESS. YOUR CONTROL.</span>
                            <strong>QLINE ↗</strong>
                        </div>
                    </div>

                    <div className="floating-tag">
                        <span>✦</span>
                        ניהול חכם ופשוט
                    </div>
                </div>
            </section>
            {/* FEATURES */}
            <section className="features-section reveal" id="features">
                <div className="section-heading">
                    <span>WHAT WE DO</span>
                    <h2>
                        פחות התעסקות.
                        <br />
                        <span>יותר תנועה.</span>
                    </h2>
                    <p>
                        כל הכלים שאת צריכה כדי לנהל את הפעילות
                        של חדר הכושר בצורה מסודרת ונוחה.
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div className="feature-card reveal" key={index}>
                            <div className="feature-icon">
                                {feature.icon}
                            </div>

                            <span className="feature-number">
                                0{index + 1}
                            </span>

                            <h3>{feature.title}</h3>
                            <p>{feature.text}</p>

                            <div className="feature-arrow">↙</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* DASHBOARD SECTION */}
            <section className="dashboard-section reveal" id="dashboard">
                <div className="dashboard-text">
                    <span>ONE PLACE. FULL CONTROL.</span>

                    <h2>
                        כל מה שקורה
                        <br />
                        <span>בחדר הכושר.</span>
                    </h2>

                    <p>
                        מלוח השיעורים ועד ניהול הצוות.
                        QLINE מרכזת את כל הפעילות שלך
                        במערכת אחת ברורה ונוחה.
                    </p>

                    <button
                        className="primary-button"
                        onClick={() => navigate("/provider/login")}
                    >
                        כניסת צוות
                        <span>↖</span>
                    </button>
                </div>

                <div className="dashboard-highlight">
                    <div className="highlight-top">
                        <span>QLINE</span>
                        <span>SMART MANAGEMENT</span>
                    </div>

                    <div className="highlight-number">
                        <strong>ALL</strong>
                        <span>YOUR CLASSES</span>
                    </div>

                    <div className="highlight-bottom">
                        <span>PLAN. MANAGE. MOVE.</span>
                        <strong>↗</strong>
                    </div>
                </div>
            </section>

            {/* ABOUT */}
            <section className="about-section reveal" id="about">
                <span>MEET QLINE</span>
                <h2>
                    ניהול חכם.
                    <br />
                    <span>ראש שקט.</span>
                </h2>

                <p>
                    QLINE נועדה להפוך את ניהול חדר הכושר
                    לפשוט, יעיל ומדויק יותר.
                    פחות בלגן, יותר סדר, וכל הפעילות
                    שלך במקום אחד.
                </p>

                <button
                    className="about-button"
                    onClick={() => navigate("/user/login")}
                >
                    מתחילים כאן ↖
                </button>
            </section>

            {/* FOOTER */}
            <footer className="home-footer">
                <div className="home-logo">
                    Q<span>LINE</span>
                    <small>FITNESS MANAGEMENT</small>
                </div>

                <p>YOUR FITNESS. YOUR CONTROL.</p>

                <span>© QLINE 2026</span>
            </footer>

        </div>
    )
}

export default Homepage
