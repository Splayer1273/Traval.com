import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import RequireRole from './components/RequireRole.jsx'
import Home from './pages/Home.jsx'
import CreateTrip from './pages/CreateTrip.jsx'
import TripReview from './pages/TripReview.jsx'
import TripDetail from './pages/TripDetail.jsx'
import Approvals from './pages/Approvals.jsx'
import Claims from './pages/Claims.jsx'
import SubmitClaim from './pages/SubmitClaim.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'
import CorporateProfile from './pages/CorporateProfile.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminPolicies from './pages/admin/AdminPolicies.jsx'
import AdminEmployees from './pages/admin/AdminEmployees.jsx'
import AdminBookings from './pages/admin/AdminBookings.jsx'
import AdminReports from './pages/admin/AdminReports.jsx'
import FlightSearch from './pages/FlightSearch.jsx'
import FlightDetails from './pages/FlightDetails.jsx'
import PassengerDetails from './pages/PassengerDetails.jsx'
import HotelSearch from './pages/HotelSearch.jsx'
import HotelDetails from './pages/HotelDetails.jsx'
import Packages from './pages/Packages.jsx'
import PackageDetail from './pages/PackageDetail.jsx'
import Destinations from './pages/Destinations.jsx'
import DestinationDetail from './pages/DestinationDetail.jsx'
import Offers from './pages/Offers.jsx'
import MyTrips from './pages/MyTrips.jsx'
import BookingDetail from './pages/BookingDetail.jsx'
import Wishlist from './pages/Wishlist.jsx'
import AccountLayout from './pages/account/AccountLayout.jsx'
import Profile from './pages/account/Profile.jsx'
import AccountBookings from './pages/account/AccountBookings.jsx'
import AccountSaved from './pages/account/AccountSaved.jsx'
import AccountPayments from './pages/account/AccountPayments.jsx'
import AccountSecurity from './pages/account/AccountSecurity.jsx'
import AccountNotifications from './pages/account/AccountNotifications.jsx'
import AccountPreferences from './pages/account/AccountPreferences.jsx'
import AccountSupport from './pages/account/AccountSupport.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import ResetPassword from './pages/auth/ResetPassword.jsx'
import Checkout from './pages/Checkout.jsx'
import Confirmation from './pages/Confirmation.jsx'
import ETicket from './pages/ETicket.jsx'
import FlightStatus from './pages/extras/FlightStatus.jsx'
import CurrencyConverter from './pages/extras/CurrencyConverter.jsx'
import TravelChecklist from './pages/extras/TravelChecklist.jsx'
import TravelGuides from './pages/extras/TravelGuides.jsx'
import VisaInfo from './pages/extras/VisaInfo.jsx'
import TravelInsurance from './pages/extras/TravelInsurance.jsx'
import AirportInfo from './pages/extras/AirportInfo.jsx'
import PriceAlerts from './pages/extras/PriceAlerts.jsx'
import HelpCenter from './pages/HelpCenter.jsx'
import Contact from './pages/Contact.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import Solutions from './pages/Solutions.jsx'
import Features from './pages/Features.jsx'
import WhyUs from './pages/WhyUs.jsx'
import Faq from './pages/Faq.jsx'
import Terms from './pages/Terms.jsx'
import Privacy from './pages/Privacy.jsx'
import CancellationPolicy from './pages/CancellationPolicy.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        {/* Corporate travel */}
        <Route path="/trips/new" element={<RequireRole><CreateTrip /></RequireRole>} />
        <Route path="/trips/review" element={<RequireRole><TripReview /></RequireRole>} />
        <Route path="/trips/:id" element={<RequireRole><TripDetail /></RequireRole>} />
        <Route path="/approvals" element={<RequireRole roles={['approver', 'admin']}><Approvals /></RequireRole>} />
        <Route path="/claims" element={<RequireRole roles={['employee', 'finance', 'admin']}><Claims /></RequireRole>} />
        <Route path="/claims/new" element={<RequireRole roles={['employee']}><SubmitClaim /></RequireRole>} />
        <Route path="/notifications" element={<RequireRole><NotificationsPage /></RequireRole>} />
        <Route path="/profile" element={<RequireRole><CorporateProfile /></RequireRole>} />

        {/* Admin console */}
        <Route path="/admin" element={<RequireRole roles={['admin']}><AdminDashboard /></RequireRole>} />
        <Route path="/admin/policies" element={<RequireRole roles={['admin']}><AdminPolicies /></RequireRole>} />
        <Route path="/admin/employees" element={<RequireRole roles={['admin']}><AdminEmployees /></RequireRole>} />
        <Route path="/admin/bookings" element={<RequireRole roles={['admin']}><AdminBookings /></RequireRole>} />
        <Route path="/admin/reports" element={<RequireRole roles={['admin']}><AdminReports /></RequireRole>} />

        {/* Flights */}
        <Route path="/flights" element={<FlightSearch />} />
        <Route path="/flights/:id" element={<FlightDetails />} />
        <Route path="/flights/:id/passengers" element={<PassengerDetails />} />

        {/* Hotels */}
        <Route path="/hotels" element={<HotelSearch />} />
        <Route path="/hotels/:id" element={<HotelDetails />} />

        {/* Holidays */}
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:id" element={<PackageDetail />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:slug" element={<DestinationDetail />} />

        {/* Deals & trips */}
        <Route path="/offers" element={<Offers />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/my-trips/:id" element={<BookingDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* Checkout */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation/:id" element={<Confirmation />} />
        <Route path="/e-ticket/:id" element={<ETicket />} />

        {/* Account */}
        <Route path="/account" element={<AccountLayout />}>
          <Route index element={<Profile />} />
          <Route path="bookings" element={<AccountBookings />} />
          <Route path="upcoming" element={<AccountBookings filter="upcoming" />} />
          <Route path="past" element={<AccountBookings filter="completed" />} />
          <Route path="saved" element={<AccountSaved />} />
          <Route path="wishlist" element={<AccountSaved />} />
          <Route path="payments" element={<AccountPayments />} />
          <Route path="notifications" element={<AccountNotifications />} />
          <Route path="preferences" element={<AccountPreferences />} />
          <Route path="security" element={<AccountSecurity />} />
          <Route path="support" element={<AccountSupport />} />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Tools & resources */}
        <Route path="/flight-status" element={<FlightStatus />} />
        <Route path="/currency-converter" element={<CurrencyConverter />} />
        <Route path="/checklist" element={<TravelChecklist />} />
        <Route path="/guides" element={<TravelGuides />} />
        <Route path="/visa" element={<VisaInfo />} />
        <Route path="/insurance" element={<TravelInsurance />} />
        <Route path="/airports" element={<AirportInfo />} />
        <Route path="/price-alerts" element={<PriceAlerts />} />

        {/* Company & legal */}
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/features" element={<Features />} />
        <Route path="/why-us" element={<WhyUs />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cancellation" element={<CancellationPolicy />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
