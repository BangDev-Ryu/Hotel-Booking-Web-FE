import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="landing-page">
            <header className="header">
                <h1>Chào mừng đến với dịch vụ đặt phòng khách sạn của chúng tôi</h1>
                <p>Tìm kiếm và đặt phòng khách sạn dễ dàng chỉ với vài cú nhấp chuột!</p>
            </header>
            <section className="search-section">
                <h2>Tìm kiếm phòng</h2>
                <form className="search-form">
                    <input type="text" placeholder="Địa điểm" required />
                    <input type="date" placeholder="Ngày nhận phòng" required />
                    <input type="date" placeholder="Ngày trả phòng" required />
                    <button type="submit">Tìm kiếm</button>
                </form>
            </section>
            <section className="features">
                <h2>Tính năng nổi bật</h2>
                <ul>
                    <li>Đặt phòng nhanh chóng và dễ dàng</li>
                    <li>Giá cả cạnh tranh</li>
                    <li>Hỗ trợ khách hàng 24/7</li>
                </ul>
            </section>
            <footer className="footer">
                <p>&copy; 2023 Dịch vụ đặt phòng khách sạn. Tất cả quyền được bảo lưu.</p>
            </footer>
        </div>
    );
};

export default Home;
