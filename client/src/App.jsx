
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import UserLogin from "./auth/UserLogin"
import UserRegister from "./auth/UserRegister"
import ProviderLogin from "./auth/ProviderLogin"

import UserHome from "./user/UserHome"
import UserAppointments from "./user/UserAppointments"
import UserBookAppointment from "./user/UserBookAppointment"
import SingleUser from "./user/SingleUser"
import CalendarPage from "./user/CalendarPage"
import UpdateUser from "./user/UpdateUser"
import AppointmentDetails from "./user/AppointmentDetails"
import WaitlistPage from "./user/WaitlistPage"

import ProviderHome from "./provider/ProviderHome"
import ProviderCalendar from "./provider/ProviderCalendar"
import ProviderAppointmentDetails from "./provider/ProviderAppointmentDetails"
import ProviderNewService from "./provider/ProviderNewService"
import ProviderEditService from "./provider/ProviderEditService"
import ProviderServices from "./provider/ProviderServices"
import ProviderClients from "./provider/ProviderClients"
import ProviderProfile from "./provider/ProviderProfile"
import ProviderAppointments from "./provider/ProviderAppointments"

import AdminHome from "./admin/AdminHome"
import AdminProviders from "./admin/AdminProviders"
import AdminNewProvider from "./admin/AdminNewProvider"
import AdminEditProvider from "./admin/AdminEditProvider"
import AdminClients from "./admin/AdminClients"
import AdminAppointments from "./admin/AdminAppointments"
import AdminNewAppointment from "./admin/AdminNewAppointment"
import AdminEditAppointment from "./admin/AdminEditAppointment"
import AdminServices from "./admin/AdminServices"
import AdminNewService from "./admin/AdminNewService"
import AdminEditService from "./admin/AdminEditService"

import AppLayout from "./Sidebar/AppLayout"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/user/login" replace />} />

        {/* עמודי התחברות והרשמה - ללא תפריט */}
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/provider/login" element={<ProviderLogin />} />

        {/* אזור הלקוחה */}
        <Route element={<AppLayout />}>
          <Route path="/user/calendar" element={<CalendarPage />} />
          <Route path="/user/home" element={<UserHome />} />
          <Route path="/user/appointments" element={<UserAppointments />} />
          <Route path="/user/book" element={<UserBookAppointment />} />
          <Route path="/user/profile/:id" element={<SingleUser />} />
          <Route path="/user/profile/edit/:id" element={<UpdateUser />} />
          <Route path="/appointment/:id" element={<AppointmentDetails />} />
          <Route path="/user/waitlist" element={<WaitlistPage />} />
        </Route>

        {/* אזור המדריכה */}
        <Route element={<AppLayout />}>
          <Route path="/provider/home" element={<ProviderHome />} />
          <Route path="/provider/calendar" element={<ProviderCalendar />} />
          <Route path="/provider/appointment/:id" element={<ProviderAppointmentDetails />} />
          <Route path="/provider/services/new" element={<ProviderNewService />} />
          <Route path="/provider/services/edit/:id" element={<ProviderEditService />} />
          <Route path="/provider/services" element={<ProviderServices />} />
          <Route path="/provider/clients" element={<ProviderClients />} />
          <Route path="/provider/profile" element={<ProviderProfile />} />
          <Route path="/provider/appointments" element={<ProviderAppointments />}/>
          <Route path="/provider/appointments" element={<ProviderAppointments />}/>
          
        </Route>

        {/* אזור המנהלת */}
        <Route element={<AppLayout />}>
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/providers" element={<AdminProviders />} />
          <Route path="/admin/providers/new" element={<AdminNewProvider />} />
          <Route path="/admin/providers/edit/:id" element={<AdminEditProvider />} />
          <Route path="/admin/clients" element={<AdminClients />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/appointments/new" element={<AdminNewAppointment />} />
          <Route path="/admin/appointments/edit/:id" element={<AdminEditAppointment />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/services/new" element={<AdminNewService />} />
          <Route path="/admin/services/edit/:id" element={<AdminEditService />} />
        </Route>

        {/* נתיב לא מוכר */}
        <Route path="*" element={<Navigate to="/user/login" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
