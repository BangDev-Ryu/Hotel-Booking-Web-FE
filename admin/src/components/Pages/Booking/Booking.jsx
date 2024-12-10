import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Select,
  Space,
  Popconfirm,
  message
} from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import './Booking.css'

const { Option } = Select;


const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [accounts, setAccounts] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    roomTypes: [], // Chi tiết loại phòng
    rooms: []      // Chi tiết phòng cụ thể
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const filtered = bookings.filter(booking => 
      accounts[booking.id_account]?.username.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchText.toLowerCase()) ||
      booking.payment?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredBookings(filtered);
  }, [searchText, bookings, accounts]);

  const fetchBookings = async () => {
    try {
      // Lấy danh sách booking
      const bookingResponse = await fetch('http://localhost:8080/booking');
      const bookingsData = await bookingResponse.json();

      // Lấy thông tin account cho từng booking
      const accountPromises = bookingsData.map(booking => 
        fetch(`http://localhost:8080/account/${booking.id_account}`)
          .then(res => res.json())
          .catch(() => null) // Xử lý trường hợp không tìm thấy account
      );

      const accountsData = await Promise.all(accountPromises);
      
      // Tạo map account với key là id_account
      const accountsMap = {};
      accountsData.forEach(account => {
        if (account) {
          accountsMap[account.id] = account;
        }
      });

      setBookings(bookingsData);
      setAccounts(accountsMap);
      setFilteredBookings(bookingsData); // Cập nhật luôn filtered bookings

    } catch (error) {
      console.error('Error fetching bookings:', error);
      message.error('Không thể tải danh sách booking!');
    } 
  };

  const fetchBookingDetails = async (bookingId) => {
    try {
      // Gọi đồng thời cả 2 API
      const [roomTypesResponse, roomsResponse] = await Promise.all([
        fetch(`http://localhost:8080/booking/${bookingId}/loai-phong`),
        fetch(`http://localhost:8080/booking/${bookingId}/room`)
      ]);

      const [roomTypesData, roomsData] = await Promise.all([
        roomTypesResponse.json(),
        roomsResponse.json()
      ]);

      setBookingDetails({
        roomTypes: roomTypesData,
        rooms: roomsData
      });
    } catch (error) {
      console.error('Error fetching booking details:', error);
      message.error('Không thể tải chi tiết booking!');
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    fetchBookingDetails(booking.id_booking);
    setIsDetailModalVisible(true);
  };

  const handleDelete = async (booking) => {
    if (booking.status !== 'Đã hủy') {
      message.error('Chỉ có thể xóa booking ở trạng thái đã hủy!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/booking/${booking.id_booking}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        message.success('Xóa booking thành công!');
        fetchBookings();
      }
    } catch (error) {
      message.error('Không thể xóa booking!');
    }
  };

  const handleEdit = async (booking) => {
    if (booking.status === 'Cancelled' || booking.status === 'Checked in') {
      message.error('Không thể sửa booking ở trạng thái này!');
      return;
    }
    setSelectedBooking(booking);
    
    // Đợi lấy dữ liệu chi tiết booking và phòng trống trước
    await Promise.all([
      fetchBookingDetails(booking.id_booking),
      fetchAvailableRooms(booking.id_booking)
    ]);

    // Lấy danh sách phòng của booking hiện tại
    const bookingRoomsResponse = await fetch(`http://localhost:8080/booking/${booking.id_booking}/room`);
    const currentBookingRooms = await bookingRoomsResponse.json();
    
    // Cập nhật form với dữ liệu hiện tại
    editForm.setFieldsValue({
      payment: booking.payment,
      status: booking.status,
      selectedRooms: currentBookingRooms.map(room => room.id)
    });
    
    setIsEditModalVisible(true);
  };

  const fetchAvailableRooms = async (bookingId) => {
    try {
      // Lấy chi tiết booking để biết loại phòng cần hiển thị
      const bookingDetailsResponse = await fetch(`http://localhost:8080/booking/${bookingId}/loai-phong`);
      const bookingDetails = await bookingDetailsResponse.json();
      
      // Lấy tất cả phòng
      const response = await fetch(`http://localhost:8080/room`);
      const allRooms = await response.json();
      
      // Lấy phòng đã được đặt cho booking này
      const bookingRoomsResponse = await fetch(`http://localhost:8080/booking/${bookingId}/room`);
      const bookingRooms = await bookingRoomsResponse.json();
      
      // Lọc ra các phòng phù hợp (trống hoặc thuộc booking hiện tại)
      const availableRoomsByType = allRooms.filter(room => 
        (room.status === 'Trống' || bookingRooms.some(br => br.id === room.id)) && 
        bookingDetails.some(bd => bd.loaiPhong.id === room.loaiPhong.id)
      );
      
      setAvailableRooms(availableRoomsByType);
      setSelectedRooms(bookingRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      message.error('Không thể tải danh sách phòng!');
    }
  };

  const handleEditSubmit = async (values) => {
    if (values.status === 'Confirmed' && values.payment === 'Chưa thanh toán') {
      message.error('Phải chọn phương thức thanh toán trước khi xác nhận booking!');
      return;
    }

    try {
      // Tính tiền cọc dựa trên phương thức thanh toán
      let depositPercent = 0;
      switch (values.payment) {
        case 'Cọc 20%': depositPercent = 0.2; break;
        case 'Cọc 50%': depositPercent = 0.5; break;
        case 'Trả trước 100%': depositPercent = 1; break;
      }
      
      const updatedBooking = {
        ...selectedBooking,
        payment: values.payment,
        status: values.status,
        deposit: selectedBooking.totalPrice * depositPercent
      };

      // Cập nhật booking
      await fetch(`http://localhost:8080/booking/${selectedBooking.id_booking}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBooking)
      });

      // Cập nhật danh sách phòng cho booking
      await fetch(`http://localhost:8080/booking/${selectedBooking.id_booking}/room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values.selectedRooms)
      });

      message.success('Cập nhật booking thành công!');
      setIsEditModalVisible(false);
      fetchBookings();
    } catch (error) {
      message.error('Không thể cập nhật booking!');
    }
  };

  const columns = [
    {
      title: 'Người đặt',
      dataIndex: 'id_account',
      key: 'id_account',
      render: (id_account) => accounts[id_account]?.username || 'Loading...',
    },
    {
      title: 'Ngày nhận phòng',
      dataIndex: 'checkInDate',
      key: 'checkInDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Ngày trả phòng',
      dataIndex: 'checkOutDate',
      key: 'checkOutDate',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `${price.toLocaleString('vi-VN')} VNĐ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary"
            onClick={() => handleViewDetails(record)}
          >
            Chi tiết
          </Button>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa booking này?"
            onConfirm={() => handleDelete(record)}
            okText="Có"
            cancelText="Không"
            disabled={record.status !== 'Đã hủy'}
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />}
              disabled={record.status !== 'Đã hủy'}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="booking-management">
      <div className="booking-header">
        <h1>Quản lý Booking</h1>
        <div className="booking-actions">
          <Input
            placeholder="Tìm kiếm booking..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300, marginRight: 16 }}
          />
          
        </div>
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredBookings} 
        rowKey="id_booking" 
      />

      {/* Modal xem chi tiết booking */}
      <Modal
        title="Chi tiết Booking"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedBooking && (
          <div>
            <h3>Thông tin người đặt: {accounts[selectedBooking.id_account]?.username}</h3>
            <p>Số người lớn: {selectedBooking.adult}</p>
            <p>Số trẻ em: {selectedBooking.children}</p>
            <p>Tổng số phòng: {selectedBooking.totalRoom}</p>
            <p>Phương thức thanh toán: {selectedBooking.payment}</p>
            <p>Tiền cọc: {selectedBooking.deposit?.toLocaleString('vi-VN')} VNĐ</p>
            
            <h3>Chi tiết loại phòng đặt:</h3>
            <Table
              dataSource={bookingDetails.roomTypes}
              columns={[
                {
                  title: 'Loại phòng',
                  dataIndex: ['loaiPhong', 'name'],
                  key: 'name',
                },
                {
                  title: 'Số lượng',
                  dataIndex: 'roomQuantity',
                  key: 'roomQuantity',
                },
                {
                  title: 'Giá',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price) => `${price?.toLocaleString('vi-VN')} VNĐ`,
                },
              ]}
              pagination={false}
            />

            <h3>Danh sách phòng cụ thể:</h3>
            <Table
              dataSource={bookingDetails.rooms}
              columns={[
                {
                  title: 'Khu',
                  dataIndex: ['khu', 'name'],
                  key: 'khuName',
                },
                {
                  title: 'Tên phòng',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'Loại phòng',
                  dataIndex: ['loaiPhong', 'name'],
                  key: 'loaiPhongName',
                },
              ]}
              pagination={false}
            />
          </div>
        )}
      </Modal>

      <Modal
        title="Sửa Booking"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={editForm}
          onFinish={handleEditSubmit}
          layout="vertical"
        >
          <Form.Item
            name="payment"
            label="Phương thức thanh toán"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Chưa thanh toán">Chưa thanh toán</Option>
              <Option value="Cọc 20%">Cọc 20%</Option>
              {selectedBooking?.totalRoom > 5 && (
                <Option value="Cọc 50%">Cọc 50%</Option>
              )}
              <Option value="Trả trước 100%">Trả trước 100%</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Confirmed">Confirmed</Option>
              <Option value="Cancelled">Cancelled</Option>
              <Option value="Checked in">Checked in</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="selectedRooms"
            label="Chọn phòng"
            rules={[{ 
              required: true,
              validator: (_, value) => {
                if (!value || value.length !== selectedBooking?.totalRoom) {
                  return Promise.reject('Vui lòng chọn đủ số phòng theo yêu cầu!');
                }
                return Promise.resolve();
              }
            }]}
            
          >
            <Select
              mode="multiple"
              placeholder="Chọn phòng"
            >
              {availableRooms.map(room => (
                <Option key={room.id} value={room.id}>
                  {`${room.name} - ${room.loaiPhong.name}`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Booking;