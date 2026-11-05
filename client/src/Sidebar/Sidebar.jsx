
import AdminSidebar from "./AdminSidebar"
import ProviderSidebar from "./ProviderSidebar"
import UserSidebar from "./UserSidebar"

const Sidebar = ({ accountType, role }) => {

    // מנהלת היא Provider עם הרשאת Admin
    if (accountType === "Provider" && role?.includes("Admin")) {
        return <AdminSidebar />
    }

    if (accountType === "Provider") {
        return <ProviderSidebar />
    }

    if (accountType === "User") {
        return <UserSidebar />
    }

    return null
}

export default Sidebar
