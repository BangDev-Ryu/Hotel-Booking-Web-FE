import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';

const BookingHistoryModal = ({ isOpen, onClose, user }) => {
  const [bookings, setBookings] = useState([]);
  const [bookingDetails, setBookingDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      fetchBookingHistory();
    }
  }, [isOpen, user]);

  const fetchBookingHistory = async () => {
    try {
      const response = await fetch(`http://localhost:8080/booking`);
      if (response.ok) {
        const allBookings = await response.json();
        // Lọc các booking của user hiện tại
        const userBookings = allBookings.filter(booking => booking.id_account === user.id);
        setBookings(userBookings);
        
        // Fetch chi tiết loại phòng cho mỗi booking
        await Promise.all(
          userBookings.map(async (booking) => {
            const detailsResponse = await fetch(
              `http://localhost:8080/booking/${booking.id_booking}/loai-phong`
            );
            if (detailsResponse.ok) {
              const details = await detailsResponse.json();
              setBookingDetails(prev => ({
                ...prev,
                [booking.id_booking]: details
              }));
            }
          })
        );
      }
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử đặt phòng:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="booking-history-modal"
      className="flex items-center justify-center"
    >
      <div className="bg-white rounded-lg p-6 w-[800px] max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Lịch sử đặt phòng</h2>
        
        {loading ? (
          <div className="text-center py-4">Đang tải...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-4">Chưa có lịch sử đặt phòng</div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id_booking} className="border rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p>Ngày nhận phòng: {formatDate(booking.checkInDate)}</p>
                    <p>Ngày trả phòng: {formatDate(booking.checkOutDate)}</p>
                  </div>
                  <div>
                    <p>Số người lớn: {booking.adult}</p>
                    <p>Số trẻ em: {booking.children}</p>
                  </div>
                </div>

                <div className="mt-2">
                  <p className="font-semibold mb-2">Chi tiết phòng:</p>
                  {bookingDetails[booking.id_booking]?.map((detail, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <span>{detail.loaiPhong.name}</span>
                      <span>Số lượng: {detail.roomQuantity}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t">
                  <div className="text-right">
                    <p className="font-bold">
                      Tổng tiền: {(booking.totalPrice || 0).toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BookingHistoryModal; 