import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import Solutions from './pages/Solutions.jsx'
import Features from './pages/Features.jsx'
import WhyUs from './pages/WhyUs.jsx'
import Faq from './pages/Faq.jsx'
import Contact from './pages/Contact.jsx'
import FlightSearch from './pages/FlightSearch.jsx'
import HotelSearch from './pages/HotelSearch.jsx'
import Packages from './pages/Packages.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/features" element={<Features />} />
        <Route path="/why-us" element={<WhyUs />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/flights" element={<FlightSearch />} />
        <Route path="/hotels" element={<HotelSearch />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
