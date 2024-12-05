import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Banner from './components/layout/Banner/Banner'
import Contact from './components/layout/Contact/Contact'
import Footer from './components/layout/Footer/Footer'
import Header from './components/layout/Header/Header'
import Offer from './components/layout/Offer/Offer'
import Rooms from './components/layout/Rooms/Rooms'
import Booking from './components/pages/Booking/Booking'
import BookingConfirm from './components/pages/BookingConfirm/BookingConfirm'
import './App.css'

function App() {

  return (
    <Router>
      <>
        <Routes>
          <Route path='/booking' element={<Booking />} />
          <Route path='/booking-confirm' element={<BookingConfirm />} />
          <Route path='*' element={
            <>
              <Header />
              <Banner />
              <Rooms />
              <Offer />
              <Contact />
              <Footer />
            </>
          } />
        </Routes>
      </>
    </Router>
  )
}

export default App
