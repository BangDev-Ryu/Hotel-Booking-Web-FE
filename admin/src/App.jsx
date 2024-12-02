import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/SideBar/SideBar';
import Room from './components/pages/Room/Room';
import Khu from './components/pages/Khu/Khu';
import TienNghi from './components/pages/TienNghi/TienNghi';
import NoiThat from './components/pages/NoiThat/NoiThat';
import LoaiPhong from './components/pages/LoaiPhong/LoaiPhong';
import Account from './components/pages/Account/Account';

function App() {
  return (
    <Router>
      <div className='App'>
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/room" element={<Room />} />
            <Route path="/loai-phong" element={<LoaiPhong />} />
            <Route path="/khu" element={<Khu />} />
            <Route path="/tien-nghi" element={<TienNghi />} />
            <Route path="/noi-that" element={<NoiThat />} />
            <Route path="/account" element={<Account />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;