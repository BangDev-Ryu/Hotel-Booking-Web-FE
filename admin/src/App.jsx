import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/SideBar/SideBar';
import Room from './components/Pages/Room/Room';
import Khu from './components/Pages/Khu/Khu';
import TienNghi from './components/Pages/TienNghi/TienNghi';
import NoiThat from './components/Pages/NoiThat/NoiThat';

function App() {
  return (
    <Router>
      <div className='App'>
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/room" element={<Room />} />
            <Route path="/khu" element={<Khu />} />
            <Route path="/tien-nghi" element={<TienNghi />} />
            <Route path="/noi-that" element={<NoiThat />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;