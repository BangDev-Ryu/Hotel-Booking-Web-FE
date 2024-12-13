import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/SideBar/SideBar';
import Room from './components/pages/Room/Room';
import Khu from './components/pages/Khu/Khu';
import TienNghi from './components/pages/TienNghi/TienNghi';
import NoiThat from './components/pages/NoiThat/NoiThat';
import LoaiPhong from './components/pages/LoaiPhong/LoaiPhong';
import Account from './components/pages/Account/Account';
import Login from './components/pages/Login/Login';
import Booking from './components/pages/Booking/Booking';
import DichVu from './components/pages/DichVu/DichVu';
import HoaDon from './components/pages/HoaDon/HoaDon';
import Quyen from './components/pages/Quyen/Quyen';
import ThongKe from './components/pages/ThongKe/ThongKe';
// Tạo PrivateRoute component để bảo vệ các route
const PrivateRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? children : <Navigate to="/login" />;
};

function App() {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <Router>
            <Routes>
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                
                <Route path="/*" element={
                    <PrivateRoute>
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
                                    <Route path="/booking" element={<Booking />} />
                                    <Route path="/dich-vu" element={<DichVu />} />
                                    <Route path="/hoa-don" element={<HoaDon />} />
                                    <Route path="/quyen" element={<Quyen />} />
                                    <Route path="/thong-ke" element={<ThongKe />} />
                                </Routes>
                            </div>
                        </div>
                    </PrivateRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App; 