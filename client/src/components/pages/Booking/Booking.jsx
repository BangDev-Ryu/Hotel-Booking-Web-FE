import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookingHeader from '../../layout/BookingHeader/BookingHeader'
import BookingBanner from '../../layout/BookingBanner/BookingBanner'
import BookingSearchBar from '../../layout/BookingSearchBar/BookingSearchBar'
import BookingRoomCard from '../../layout/BookingRoomCard/BookingRoomCard';
import Modal from 'react-modal';

import './Booking.css'

const Booking = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomImages, setSelectedRoomImages] = useState([]);

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

  const handleRoomClick = async (room) => {
    try {
      // Fetch hình ảnh chi tiết khi click vào card
      const imagesResponse = await fetch(`http://localhost:8080/loai-phong/${room.id}/hinh-anh`);
      const images = await imagesResponse.json();
      
      setSelectedRoom(room);
      setSelectedRoomImages(images);
    } catch (error) {
      console.error('Error fetching room images:', error);
    }
  };

  const closeModal = () => {
    setSelectedRoom(null);
    setSelectedRoomImages([]);
  };

  return (
    <>
      <BookingHeader/>
      <BookingBanner/>
      <BookingSearchBar/>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Phòng có sẵn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <BookingRoomCard
              key={room.id}
              title={room.name}
              price={room.price}
              image={room.image}
              onClick={() => handleRoomClick(room)}
            />
          ))}
        </div>

        {selectedRoom && (
          <Modal 
            isOpen={!!selectedRoom} 
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
                    <p className="text-gray-600">Mô tả chi tiết về phòng sẽ được hiển thị ở đây.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2">Tiện nghi</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        <li>Wi-Fi miễn phí</li>
                        <li>Điều hòa</li>
                        <li>TV màn hình phẳng</li>
                        {/* Thêm các tiện nghi khác nếu có */}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Nội thất</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        <li>Giường đôi</li>
                        <li>Bàn làm việc</li>
                        <li>Tủ quần áo</li>
                        {/* Thêm các nội thất khác nếu có */}
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

                  <button className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors mb-3">
                    ĐẶT NGAY
                  </button>
                  
                  <button onClick={closeModal} className="w-full border border-green-500 text-green-500 py-3 rounded-lg hover:bg-green-50 transition-colors">
                    HỦY
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