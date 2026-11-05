import { Outlet, Navigate } from "react-router-dom"
import Sidebar from "./Sidebar"
import "../css/Sidebar.css"

const AppLayout = () => {

    const accountType = localStorage.getItem("accountType")

    const role = JSON.parse(
        localStorage.getItem("role") || "[]"
    )

    if (!localStorage.getItem("token")) {
        return <Navigate to="/user/login" replace />
    }

    return (
        <div className="app-layout">

            <Sidebar
                accountType={accountType}
                role={role}
            />

            <main className="main-content">
                <Outlet />
            </main>

        </div>
    )
}

export default AppLayout