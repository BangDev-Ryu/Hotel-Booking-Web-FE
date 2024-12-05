import React, { useState, useEffect } from 'react';
import {message} from 'antd';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import BookingHeader from '../../layout/BookingHeader/BookingHeader'
import BookingBanner from '../../layout/BookingBanner/BookingBanner'
import BookingSearchBar from '../../layout/BookingSearchBar/BookingSearchBar'
import BookingRoomCard from '../../layout/BookingRoomCard/BookingRoomCard';
import Modal from 'react-modal';
import { Select, Slider } from 'antd';
const { Option } = Select;

import './Booking.css'

const Booking = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomImages, setSelectedRoomImages] = useState([]);
  const [noiThats, setNoiThats] = useState([]);
  const [tienNghis, setTienNghis] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [sortOrder, setSortOrder] = useState(null);
  const [selectedBookingRooms, setSelectedBookingRooms] = useState([]);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dateRange, setDateRange] = useState([{
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  }]);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Lấy danh sách loại phòng
        const roomsResponse = await fetch('http://localhost:8080/loai-phong');
        const roomsData = await roomsResponse.json();

        // Lấy hình ảnh cho mỗi loại phòng
        const roomsWithImages = await Promise.all(
          roomsData.map(async (room) => {
            const imagesResponse = await fetch(`http://localhost:8080/loai-phong/${room.id}/hinh-anh`);
            const images = await imagesResponse.json();
            return {
              ...room,
              image: images.length > 0 ? images[0].base64Data : null
            };
          })
        );


        setRooms(roomsWithImages);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    const checkLoginStatus = async () => {
      try {
        // Lấy user từ localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          setIsLoggedIn(false);
          return;
        }

        const userId = user.id;
        // Kiểm tra xem userId có hợp lệ không bằng cách gọi API account
        const response = await fetch(`http://localhost:8080/account/${userId}`);
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const fetchNoiThatByLoaiPhong = async (loaiPhongId) => {
    try {
      const response = await fetch(`http://localhost:8080/loai-phong/${loaiPhongId}/noi-that`);
      return await response.json();
    } catch (error) {
      message.error('Không thể tải nội thất của loại phòng!');
      return [];
    }
  };

  const fetchTienNghiByLoaiPhong = async (loaiPhongId) => {
    try {
      const response = await fetch(`http://localhost:8080/loai-phong/${loaiPhongId}/tien-nghi`);
      return await response.json();
    } catch (error) {
      message.error('Không thể tải tiện nghi của loại phòng!');
      return [];
    }
  };

  const handleRoomClick = async (room) => {
    try {
      // Fetch hình ảnh chi tiết khi click vào card
      const imagesResponse = await fetch(`http://localhost:8080/loai-phong/${room.id}/hinh-anh`);
      const images = await imagesResponse.json();

      const noiThatData = await fetchNoiThatByLoaiPhong(room.id);
      const tienNghiData = await fetchTienNghiByLoaiPhong(room.id);
      
      setSelectedRoom(room);
      setSelectedRoomImages(images);
      setNoiThats(noiThatData);
      setTienNghis(tienNghiData);

    } catch (error) {
      console.error('Error fetching room images:', error);
    }
  };

  const closeModal = () => {
    setSelectedRoom(null);
    setSelectedRoomImages([]);
  };

  const getFilteredAndSortedRooms = () => {
    let filteredRooms = rooms.filter(room => 
      room.price >= priceRange[0] && room.price <= priceRange[1]
    );

    if (sortOrder === 'asc') {
      filteredRooms.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      filteredRooms.sort((a, b) => b.price - a.price);
    }

    return filteredRooms;
  };

  const addRoomToCart = (room) => {
    setSelectedBookingRooms((prevRooms) => {
      const existingRoom = prevRooms.find(r => r.id === room.id);
      if (existingRoom) {
        return prevRooms.map(r => 
          r.id === room.id ? { ...r, quantity: r.quantity + 1 } : r
        );
      }
      return [...prevRooms, { ...room, quantity: 1 }];
    });
    closeModal();
  };

  const updateRoomQuantity = (roomId, quantity) => {
    setSelectedBookingRooms((prevRooms) =>
      prevRooms.map(r => 
        r.id === roomId ? { ...r, quantity } : r
      )
    );
  };

  const removeRoomFromCart = (roomId) => {
    setSelectedBookingRooms((prevRooms) => prevRooms.filter(r => r.id !== roomId));
  };

  const calculateTotalPrice = () => {
    return selectedBookingRooms.reduce((total, room) => total + room.price * room.quantity, 0);
  };

  const handleContinueBooking = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !isLoggedIn) {
      message.error('Vui lòng đăng nhập để tiếp tục đặt phòng');
      return;
    }

    if (selectedBookingRooms.length === 0) {
      message.error('Vui lòng chọn ít nhất một phòng');
      return;
    }

    navigate('/booking-confirm', {
      state: {
        selectedRooms: selectedBookingRooms,
        dateRange: dateRange, // Lấy từ BookingSearchBar
        guestInfo: options // Lấy từ BookingSearchBar
      }
    });
  };

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const handleOptionsChange = (newOptions) => {
    setOptions(newOptions);
  };

  return (
    <>
      <BookingHeader/>
      <BookingBanner/>
      <BookingSearchBar 
        onDateRangeChange={handleDateRangeChange}
        onOptionsChange={handleOptionsChange}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Phòng có sẵn</h2>
        
    

        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="min-w-[300px]">
            <p className="mb-2 font-semibold">Khoảng giá (VNĐ):</p>
            <Slider
              range
              min={0}
              max={10000000}
              step={50000}
              value={priceRange}
              onChange={setPriceRange}
              tipFormatter={value => `${value.toLocaleString('vi-VN')}đ`}
            />
          </div>
          
          <div className="min-w-[200px]">
            <p className="mb-2 font-semibold">Sắp xếp theo giá:</p>
            <Select
              style={{ width: '100%' }}
              placeholder="Sắp xếp theo giá"
              onChange={setSortOrder}
              allowClear
            >
              <Option value="asc">Giá tăng dần</Option>
              <Option value="desc">Giá giảm dần</Option>
            </Select>
          </div>
        </div>


        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-6">
            {getFilteredAndSortedRooms().map((room) => (
              <BookingRoomCard
                key={room.id}
                title={room.name}
                price={room.price}
                image={room.image}
                onClick={() => handleRoomClick(room)}
                onBookNow={() => addRoomToCart(room)}
              />
            ))}

          </div>

          <div className="flex flex-col min-h-[300px] max-h-[500px] overflow-y-auto flex-1 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-center">Booking</h3>
            {selectedBookingRooms.length === 0 ? (
              <p className="text-gray-500 text-center">Booking trống</p>
            ) : (
              <>
                {selectedBookingRooms.map((room) => (
                  <div key={room.id} className="flex justify-between items-center mb-2">
                    <span className="font-medium">{room.name}</span>
                    <span>{(room.price * room.quantity).toLocaleString('vi-VN')}đ</span>
                    <input 
                      type="number" 
                      min="1" 
                      value={room.quantity} 
                      onChange={(e) => updateRoomQuantity(room.id, parseInt(e.target.value))}
                      className="w-16 text-center border rounded"
                    />
                    <button 
                      onClick={() => removeRoomFromCart(room.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Tổng tiền:</span>
                    <span>{calculateTotalPrice().toLocaleString('vi-VN')}đ</span>
                  </div>
                  <button 
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors mt-4"
                    onClick={handleContinueBooking}
                  >
                    Tiếp tục đặt phòng
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {selectedRoom && (
          <Modal 
            isOpen={selectedRoom} 
            onRequestClose={closeModal}
            className="modal-content"
            overlayClassName="modal-overlay"
          >
            <div className="p-6 max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-4xl font-bold text-gray-700">{selectedRoom.name}</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="col-span-2">
                  <img 
                    src={selectedRoomImages[0]?.base64Data} 
                    alt="Ảnh chính"
                    className="w-full h-[400px] object-cover rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-3 col-span-2 gap-2">
                  {selectedRoomImages.slice(1).map((img, index) => (
                    <img 
                      key={index} 
                      src={img.base64Data} 
                      alt={`Ảnh ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Thông tin phòng</h3>
                    {/* <p className="text-gray-600">Mô tả chi tiết về phòng sẽ được hiển thị ở đây.</p> */}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2">Nội thất</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        {noiThats.map((nt, index) => (
                          <li key={index}> {nt.name} </li>
                        ))}
                        
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Tiện nghi</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        {tienNghis.map((tn, index) => (
                          <li key={index}> {tn.name} </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg h-fit">
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-green-600">
                      {selectedRoom.price.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-gray-500 ml-2">/ đêm</span>
                  </div>

                  <button 
                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors mb-3"
                    onClick={() => addRoomToCart(selectedRoom)}
                  >
                    Thêm phòng
                  </button>
                  
                  <button onClick={closeModal} className="w-full border border-green-500 text-green-500 py-3 rounded-lg hover:bg-green-50 transition-colors">
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </main>
    </>
  );
}

export default Booking