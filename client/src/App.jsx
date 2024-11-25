import './App.css'
import Banner from './components/Banner/Banner'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import Offer from './components/Offer/Offer'
import Rooms from './components/Rooms/Rooms'

function App() {

  return (
    <>
      <Header></Header>
      <Banner></Banner>
      <Rooms></Rooms>
      <Offer></Offer>
      <Contact></Contact>
      <Footer></Footer>
    </>
  )
}

export default App
