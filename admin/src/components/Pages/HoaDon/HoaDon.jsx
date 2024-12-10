import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Modal,
  Space,
  message,
  Form,
  Select,
  InputNumber,
  Divider
} from 'antd';
import { SearchOutlined, PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import './HoaDon.css';

const HoaDon = () => {
  const [hoaDons, setHoaDons] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [accounts, setAccounts] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredHoaDons, setFilteredHoaDons] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedHoaDon, setSelectedHoaDon] = useState(null);
  const [hoaDonDetails, setHoaDonDetails] = useState({
    roomTypes: [],    // Chi tiết loại phòng từ booking
    services: []      // Chi tiết dịch vụ của hóa đơn
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceQuantity, setServiceQuantity] = useState(1);
  const [editForm] = Form.useForm();

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

  const fetchHoaDonDetails = async (hoaDon) => {
    try {
      // Lấy chi tiết dịch vụ của hóa đơn
      const servicesResponse = await fetch(`http://localhost:8080/hoa-don/${hoaDon.id}/dich-vu`);
      const servicesData = await servicesResponse.json();
      
      // Lấy chi tiết loại phòng từ booking
      const bookingResponse = await fetch(`http://localhost:8080/booking/${hoaDon.booking.id_booking}/loai-phong`);
      const roomTypesData = await bookingResponse.json();
      
      // Lấy thông tin booking
      const bookingDetailsResponse = await fetch(`http://localhost:8080/booking/${hoaDon.booking.id_booking}`);
      const bookingDetails = await bookingDetailsResponse.json();
      
      setHoaDonDetails({
        roomTypes: roomTypesData,
        services: servicesData,
        bookingInfo: bookingDetails // Thêm thông tin booking
      });
    } catch (error) {
      console.error('Error fetching hoa don details:', error);
      message.error('Không thể tải chi tiết hóa đơn!');
    }
  };

  const handleViewDetails = (hoaDon) => {
    setSelectedHoaDon(hoaDon);
    fetchHoaDonDetails(hoaDon);
    setIsDetailModalVisible(true);
  };

  const fetchAvailableServices = async () => {
    try {
      const response = await fetch('http://localhost:8080/dich-vu');
      const data = await response.json();
      setAvailableServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      message.error('Không th�� tải danh sách dịch vụ!');
    }
  };

  const handleEdit = (hoaDon) => {
    if (hoaDon.status === 'Đã thanh toán') {
      message.error('Không thể sửa hóa đơn đã thanh toán!');
      return;
    }
    setSelectedHoaDon(hoaDon);
    fetchHoaDonDetails(hoaDon);
    fetchAvailableServices();
    editForm.setFieldsValue({
      status: hoaDon.status
    });
    setIsEditModalVisible(true);
  };

  const handleAddService = async () => {
    if (!selectedService || serviceQuantity < 1) {
      message.error('Vui lòng chọn dịch vụ và số lượng hợp lệ!');
      return;
    }

    try {
      // Thêm dịch vụ vào hóa đơn
      const addServiceResponse = await fetch(`http://localhost:8080/hoa-don/${selectedHoaDon.id}/dich-vu/${selectedService}?quantity=${serviceQuantity}`, {
        method: 'POST'
      });

      if (addServiceResponse.ok) {
        // Lấy thông tin dịch vụ vừa thêm
        const selectedServiceInfo = availableServices.find(s => s.id === selectedService);
        const newServiceTotal = selectedServiceInfo.price * serviceQuantity;
        
        // Tính tổng tiền mới
        const newTotal = selectedHoaDon.tongTien + newServiceTotal;

        // Cập nhật tổng tiền trong hóa đơn
        const updateHoaDonResponse = await fetch(`http://localhost:8080/hoa-don/${selectedHoaDon.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...selectedHoaDon,
            tongTien: newTotal
          })
        });

        if (updateHoaDonResponse.ok) {
          message.success('Thêm dịch vụ và cập nhật tổng tiền thành công!');
          setSelectedService(null);
          setServiceQuantity(1);
          fetchHoaDonDetails(selectedHoaDon);
          fetchHoaDons(); // Refresh danh sách hóa đơn
        }
      }
    } catch (error) {
      console.error('Error handling service addition:', error);
      message.error('Không thể thêm dịch vụ hoặc cập nhật tổng tiền!');
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      const response = await fetch(`http://localhost:8080/hoa-don/${selectedHoaDon.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...selectedHoaDon,
          status: values.status
        })
      });

      if (response.ok) {
        message.success('Cập nhật hóa đơn thành công!');
        setIsEditModalVisible(false);
        fetchHoaDons();
      }
    } catch (error) {
      console.error('Error updating hoa don:', error);
      message.error('Không thể cập nhật hóa đơn!');
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
            onClick={() => handleViewDetails(record)}
          >
            Chi tiết
          </Button>
          <Button 
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={record.status === 'Đ�� thanh toán'}
          >
            Sửa
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

      {/* Thêm Modal xem chi tiết hóa đơn */}
      <Modal
        title="Chi tiết Hóa đơn"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedHoaDon && (
          <div>
            <h3>Thông tin chung</h3>
            <p>Khách hàng: {accounts[selectedHoaDon.booking?.id_account]?.username}</p>
            <p>Người tạo: {selectedHoaDon.nguoiTao}</p>
            <p>Ngày tạo: {new Date(selectedHoaDon.ngayTao).toLocaleDateString('vi-VN')}</p>
            <p>Trạng thái: {selectedHoaDon.status}</p>
            <p>Phương thức thanh toán: {hoaDonDetails.bookingInfo?.payment}</p>
            <p>Tiền cọc đã thanh toán: {(() => {
              const payment = hoaDonDetails.bookingInfo?.payment;
              const totalPrice = selectedHoaDon.booking.totalPrice;
              let depositPercent = 0;
              
              switch (payment) {
                case 'Cọc 20%': depositPercent = 0.2; break;
                case 'Cọc 50%': depositPercent = 0.5; break;
                case 'Trả trước 100%': depositPercent = 1; break;
                default: depositPercent = 0;
              }
              
              return (totalPrice * depositPercent)?.toLocaleString('vi-VN');
            })()} VNĐ</p>
            
            <h3>Chi tiết loại phòng đặt:</h3>
            <Table
              dataSource={hoaDonDetails.roomTypes}
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

            <h3>Dịch vụ sử dụng:</h3>
            <Table
              dataSource={hoaDonDetails.services}
              columns={[
                {
                  title: 'Tên dịch vụ',
                  dataIndex: ['dichVu', 'name'],
                  key: 'name',
                },
                {
                  title: 'Số lượng',
                  dataIndex: 'quantity',
                  key: 'quantity',
                },
                {
                  title: 'Đơn giá',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price) => `${price?.toLocaleString('vi-VN')} VNĐ`,
                },
                {
                  title: 'Thành tiền',
                  key: 'total',
                  render: (_, record) => 
                    `${(record.quantity * record.price)?.toLocaleString('vi-VN')} VNĐ`,
                },
              ]}
              pagination={false}
              summary={(pageData) => {
                const totalServices = pageData.reduce(
                  (sum, record) => sum + (record.quantity * record.price), 
                  0
                );
                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={3}>Tổng tiền dịch vụ:</Table.Summary.Cell>
                    <Table.Summary.Cell>
                      {totalServices.toLocaleString('vi-VN')} VNĐ
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                );
              }}
            />

            <div style={{ marginTop: 16 }}>
              <h3>Chi tiết thanh toán:</h3>
              <p>Tiền phòng: {selectedHoaDon.booking.totalPrice?.toLocaleString('vi-VN')} VNĐ</p>
              <p>Tiền dịch vụ: {hoaDonDetails.services.reduce(
                (sum, service) => sum + (service.quantity * service.price),
                0
              ).toLocaleString('vi-VN')} VNĐ</p>
              <p>Tiền cọc đã thanh toán: {hoaDonDetails.bookingInfo?.deposit?.toLocaleString('vi-VN')} VNĐ</p>
              <p style={{ fontSize: 18, fontWeight: 'bold', color: '#ff4d4f' }}>
                Số tiền cần thanh toán: {(selectedHoaDon.tongTien - (hoaDonDetails.bookingInfo?.deposit || 0))?.toLocaleString('vi-VN')} VNĐ
              </p>
              <p style={{ fontSize: 18, fontWeight: 'bold' }}>
                Tổng hóa đơn: {selectedHoaDon.tongTien?.toLocaleString('vi-VN')} VNĐ
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Thêm Modal sửa hóa đơn */}
      <Modal
        title="Sửa Hóa đơn"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedHoaDon && (
          <div>
            <Form
              form={editForm}
              onFinish={handleEditSubmit}
              layout="vertical"
            >
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="Chưa thanh toán">Chưa thanh toán</Option>
                  <Option value="Đã thanh toán">Đã thanh toán</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Cập nhật
                </Button>
              </Form.Item>
            </Form>

            <Divider />

            <h3>Thêm dịch vụ:</h3>
            <Space style={{ marginBottom: 16 }}>
              <Select
                style={{ width: 200 }}
                placeholder="Chọn dịch vụ"
                value={selectedService}
                onChange={setSelectedService}
              >
                {availableServices.map(service => (
                  <Option key={service.id} value={service.id}>
                    {service.name} - {service.price.toLocaleString('vi-VN')} VNĐ
                  </Option>
                ))}
              </Select>
              <InputNumber
                min={1}
                value={serviceQuantity}
                onChange={setServiceQuantity}
                placeholder="Số lượng"
              />
              <Button type="primary" onClick={handleAddService}>
                Thêm dịch vụ
              </Button>
            </Space>

            <Table
              dataSource={hoaDonDetails.services}
              columns={[
                {
                  title: 'Tên dịch vụ',
                  dataIndex: ['dichVu', 'name'],
                  key: 'name',
                },
                {
                  title: 'Số lượng',
                  dataIndex: 'quantity',
                  key: 'quantity',
                },
                {
                  title: 'Đơn giá',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price) => `${price?.toLocaleString('vi-VN')} VNĐ`,
                },
                {
                  title: 'Thành tiền',
                  key: 'total',
                  render: (_, record) => 
                    `${(record.quantity * record.price)?.toLocaleString('vi-VN')} VNĐ`,
                },
              ]}
              pagination={false}
              summary={(pageData) => {
                const totalServices = pageData.reduce(
                  (sum, record) => sum + (record.quantity * record.price), 
                  0
                );
                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={3}>Tổng tiền dịch vụ:</Table.Summary.Cell>
                    <Table.Summary.Cell>
                      {totalServices.toLocaleString('vi-VN')} VNĐ
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                );
              }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HoaDon;