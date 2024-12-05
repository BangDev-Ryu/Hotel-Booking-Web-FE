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
    country: 'Việt Nam'
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
        country: 'Việt Nam'
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
    const numberOfDays = differenceInDays(dateRange[0].endDate, dateRange[0].startDate) || 1;
    return selectedRooms.reduce((total, room) => {
      return total + (room.price * room.quantity * numberOfDays);
    }, 0);
  };

  const handleConfirmBooking = async () => {
    if (!userInfo) {
      message.error('Vui lòng đăng nhập để tiếp tục');
      return;
    }

    try {
      const bookingData = {
        accountId: userInfo.id,
        rooms: selectedRooms.map(room => ({
          loaiPhongId: room.id,
          soLuong: room.quantity
        })),
        checkIn: dateRange[0].startDate,
        checkOut: dateRange[0].endDate,
        soNguoiLon: guestInfo.adult,
        soTreEm: guestInfo.children,
        tongTien: calculateTotalPrice()
      };

      // API đặt phòng sẽ được thêm sau
      const response = await fetch('http://localhost:8080/dat-phong', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        message.success('Đặt phòng thành công!');
        navigate('/booking-history');
      } else {
        throw new Error('Đặt phòng thất bại');
      }
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
            <p>{differenceInDays(dateRange[0].endDate, dateRange[0].startDate)} đêm</p>
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
            <p className="text-sm text-gray-500 mt-1">Email xác nhận đặt phòng sẽ được gửi đến địa chỉ này</p>
          </div>

          {/* <div className="col-span-2">
            <label className="block mb-2">Vùng/quốc gia <span className="text-red-500">*</span></label>
            <select 
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            >
              <option value="Việt Nam">Việt Nam</option>
            </select>
          </div> */}

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
                {differenceInDays(dateRange[0].endDate, dateRange[0].startDate)} đêm x {room.price.toLocaleString('vi-VN')}đ
              </p>
            </div>
            <span>{(room.price * room.quantity * differenceInDays(dateRange[0].endDate, dateRange[0].startDate)).toLocaleString('vi-VN')}đ</span>
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