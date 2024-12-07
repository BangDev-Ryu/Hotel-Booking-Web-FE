import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { differenceInDays } from 'date-fns';
import { message } from 'antd';

const BookingConfirm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const { selectedRooms, dateRange, guestInfo } = location.state || {};

  // Thêm state cho form thông tin
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '', 
    email: '',
    phone: '',
  });

  useEffect(() => {
    // Kiểm tra nếu không có dữ liệu
    if (!selectedRooms || !dateRange || !guestInfo) {
      message.error('Không tìm thấy thông tin đặt phòng');
      navigate('/booking');
      return;
    }

    // Lấy thông tin user từ localStorage (được lưu khi đăng nhập)
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      message.error('Vui lòng đăng nhập để tiếp tục');
      return;
    }

    // Lấy thông tin chi tiết user từ API
    const userId = user.id;
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8080/account/${userId}`);
        if (!response.ok) {
          throw new Error('Không thể lấy thông tin người dùng');
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Error fetching user info:', error);
        message.error('Không thể lấy thông tin người dùng');
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    // Điền thông tin người dùng vào form khi có data
    if (userInfo) {
      setFormData({
        username: userInfo.username || '',
        email: userInfo.email || '',
        phone: userInfo.sdt || '',
      });
    }
  }, [userInfo]);

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateTotalPrice = () => {
    const numberOfDays = differenceInDays(dateRange[0].endDate, dateRange[0].startDate) + 1 || 1;
    return selectedRooms.reduce((total, room) => {
      return total + (room.price * room.quantity * numberOfDays);
    }, 0);
  };

  const calculateTotalRoom = () => {
    return selectedRooms.reduce((total, room) => {
      return total + (room.quantity);
    }, 0);
  }

  const handleConfirmBooking = async () => {
    if (!userInfo) {
      message.error('Vui lòng đăng nhập để tiếp tục');
      return;
    }

    try {
      // 1. Tạo booking trước
      const bookingData = {
        id_account: userInfo.id,
        checkInDate: dateRange[0].startDate,
        checkOutDate: dateRange[0].endDate,
        adult: guestInfo.adult,
        children: guestInfo.children,
        totalRoom: calculateTotalRoom(),
        totalPrice: calculateTotalPrice(),
        status: "Pending",
        payment: "Pending"
      };

      const bookingResponse = await fetch('http://localhost:8080/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!bookingResponse.ok) {
        throw new Error('Đặt phòng thất bại');
      }

      // 2. Lấy booking vừa t�o
      const newBooking = await bookingResponse.json();

      // 3. Chuẩn bị dữ liệu chi tiết booking
      const bookingRooms = selectedRooms.map(room => ({
        loaiPhongId: room.id,
        soLuong: room.quantity
      }));

      // 4. Thêm chi tiết booking
      const ctBookingResponse = await fetch(`http://localhost:8080/booking/${newBooking.id_booking}/loai-phong`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingRooms)
      });

      if (!ctBookingResponse.ok) {
        throw new Error('Không thể thêm chi tiết phòng');
      }

      message.success('Đặt phòng thành công!');
      navigate('/booking-history');
      
    } catch (error) {
      console.error('Error creating booking:', error);
      message.error('Có lỗi xảy ra khi đặt phòng');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Xác nhận đặt phòng</h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Chi tiết đặt phòng của bạn</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Nhận phòng:</strong></p>
            <p className="text-gray-600">{dateRange[0].startDate.toLocaleDateString()}</p>
            <p className="text-gray-500">14:00 - 23:00</p>
          </div>
          <div>
            <p><strong>Trả phòng:</strong></p>
            <p className="text-gray-600">{dateRange[0].endDate.toLocaleDateString()}</p>
            <p className="text-gray-500">12:00 - 13:00</p>
          </div>
          <div className="col-span-2">
            <p><strong>Tổng thời gian lưu trú:</strong></p>
            <p>{differenceInDays(dateRange[0].endDate, dateRange[0].startDate) + 1} đêm</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Nhập thông tin chi tiết của bạn</h3>
        <p className="text-sm text-gray-500 mb-4">Vui lòng nhập thông tin của bạn bằng ký tự Latin để chỗ nghỉ có thể hiểu được</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block mb-2">Họ tên <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="lastName"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>
      
          
          <div className="col-span-2">
            <label className="block mb-2">Địa chỉ email <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-2">Số điện thoại <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
            
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="flex-1 border p-2 rounded"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Số điện thoại sẽ được dùng để xác nhận đặt phòng</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Chi tiết giá</h3>
        {selectedRooms.map((room) => (
          <div key={room.id} className="flex justify-between items-center mb-2">
            <div>
              <p>{room.name} x {room.quantity}</p>
              <p className="text-sm text-gray-500">
                {differenceInDays(dateRange[0].endDate, dateRange[0].startDate) + 1} đêm x {room.price.toLocaleString('vi-VN')}đ
              </p>
            </div>
            <span>{(room.price * room.quantity * (differenceInDays(dateRange[0].endDate, dateRange[0].startDate) + 1)).toLocaleString('vi-VN')}đ</span>
          </div>
        ))}
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between items-center font-bold">
            <span>Tổng tiền:</span>
            <span>{calculateTotalPrice().toLocaleString('vi-VN')}đ</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleConfirmBooking}
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Xác nhận đặt phòng
      </button>
    </div>
  );
};

export default BookingConfirm;