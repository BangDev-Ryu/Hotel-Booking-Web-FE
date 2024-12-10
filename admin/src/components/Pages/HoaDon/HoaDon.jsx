import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Modal,
  Space,
  message
} from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import './HoaDon.css';

const HoaDon = () => {
  const [hoaDons, setHoaDons] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [accounts, setAccounts] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredHoaDons, setFilteredHoaDons] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin người dùng đang đăng nhập từ localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    
    fetchHoaDons();
  }, []);

  useEffect(() => {
    const filtered = hoaDons.filter(hoaDon => 
      accounts[hoaDon.booking?.id_account]?.username.toLowerCase().includes(searchText.toLowerCase()) ||
      hoaDon.nguoiTao?.toLowerCase().includes(searchText.toLowerCase()) ||
      hoaDon.status?.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredHoaDons(filtered);
  }, [searchText, hoaDons, accounts]);

  const fetchHoaDons = async () => {
    try {
      // Lấy danh sách hóa đơn
      const hoaDonResponse = await fetch('http://localhost:8080/hoa-don');
      const hoaDonsData = await hoaDonResponse.json();

      // Lấy thông tin account cho từng booking trong hóa đơn
      const accountPromises = hoaDonsData.map(hoaDon => 
        fetch(`http://localhost:8080/account/${hoaDon.booking?.id_account}`)
          .then(res => res.json())
          .catch(() => null)
      );

      const accountsData = await Promise.all(accountPromises);
      
      const accountsMap = {};
      accountsData.forEach(account => {
        if (account) {
          accountsMap[account.id] = account;
        }
      });

      setHoaDons(hoaDonsData);
      setAccounts(accountsMap);
      setFilteredHoaDons(hoaDonsData);

    } catch (error) {
      console.error('Error fetching hoa don:', error);
      message.error('Không thể tải danh sách hóa đơn!');
    }
  };

  const fetchAvailableBookings = async () => {
    try {
      const response = await fetch('http://localhost:8080/booking');
      const bookingsData = await response.json();
      
      // Lọc các booking có trạng thái "Checked in"
      const availableBookings = bookingsData.filter(booking => 
        booking.status === 'Checked in' &&
        !hoaDons.some(hoaDon => hoaDon.booking?.id_booking === booking.id_booking)
      );

      // Lấy thông tin account cho từng booking
      const accountPromises = availableBookings.map(booking => 
        fetch(`http://localhost:8080/account/${booking.id_account}`)
          .then(res => res.json())
          .catch(() => null)
      );

      const accountsData = await Promise.all(accountPromises);
      
      const newAccountsMap = { ...accounts };
      accountsData.forEach(account => {
        if (account) {
          newAccountsMap[account.id] = account;
        }
      });

      setBookings(availableBookings);
      setAccounts(newAccountsMap);

    } catch (error) {
      console.error('Error fetching available bookings:', error);
      message.error('Không thể tải danh sách booking!');
    }
  };

  const handleCreateHoaDon = async (booking) => {
    try {
      const newHoaDon = {
        booking: booking,
        tenKhach: accounts[booking.id_account]?.username,
        nguoiTao: currentUser?.username,
        ngayTao: new Date().toISOString(),
        tongTien: booking.totalPrice,
        status: 'Chưa thanh toán'
      };

      const response = await fetch('http://localhost:8080/hoa-don', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHoaDon)
      });

      if (response.ok) {
        message.success('Tạo hóa đơn thành công!');
        setIsModalVisible(false);
        fetchHoaDons();
      }
    } catch (error) {
      console.error('Error creating hoa don:', error);
      message.error('Không thể tạo hóa đơn!');
    }
  };

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: ['booking', 'id_account'],
      key: 'khachHang',
      render: (id_account) => accounts[id_account]?.username || 'Loading...',
    },
    {
      title: 'Người tạo',
      dataIndex: 'nguoiTao',
      key: 'nguoiTao',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'tongTien',
      key: 'tongTien',
      render: (price) => `${price?.toLocaleString('vi-VN')} VNĐ`,
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
            icon={<EyeOutlined />}
            onClick={() => {/* Xử lý xem chi tiết */}}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  const bookingColumns = [
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
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary"
          onClick={() => handleCreateHoaDon(record)}
        >
          Tạo hóa đơn
        </Button>
      ),
    },
  ];

  return (
    <div className="hoadon-management">
      <div className="hoadon-header">
        <h1>Quản lý Hóa đơn</h1>
        <div className="hoadon-actions">
          <Input
            placeholder="Tìm kiếm hóa đơn..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300, marginRight: 16 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              fetchAvailableBookings();
              setIsModalVisible(true);
            }}
          >
            Tạo hóa đơn
          </Button>
        </div>
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredHoaDons} 
        rowKey="id" 
      />

      {/* Modal tạo hóa đơn */}
      <Modal
        title="Tạo hóa đơn mới"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={1000}
      >
        <Table 
          columns={bookingColumns} 
          dataSource={bookings}
          rowKey="id_booking"
        />
      </Modal>
    </div>
  );
};

export default HoaDon;