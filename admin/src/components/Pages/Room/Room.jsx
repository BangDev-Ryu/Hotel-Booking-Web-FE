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
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './Room.css';

const { Option } = Select;

function Room() {
  const [rooms, setRooms] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Thêm useEffect để fetch dữ liệu khi component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  // Hàm fetch danh sách phòng
  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:8080/room');
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      message.error('Không thể tải danh sách phòng!');
    }
  };

  // Xử lý thêm/sửa phòng
  const handleSubmit = async (values) => {
    try {
      if (editingRoom) {
        // Cập nhật phòng
        const response = await fetch(`http://localhost:8080/room/${editingRoom.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,
            price: new BigDecimal(values.price)
          })
        });
        if (response.ok) {
          message.success('Cập nhật phòng thành công!');
          fetchRooms();
        }
      } else {
        // Thêm phòng mới
        const response = await fetch('http://localhost:8080/room', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,
            price: new BigDecimal(values.price)
          })
        });
        if (response.ok) {
          message.success('Thêm phòng mới thành công!');
          fetchRooms();
        }
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingRoom(null);
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  // Xử lý sửa phòng
  const handleEdit = (room) => {
    setEditingRoom(room);
    form.setFieldsValue(room);
    setIsModalVisible(true);
  };

  // Xử lý xóa phòng
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/room/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        message.success('Xóa phòng thành công!');
        fetchRooms();
      }
    } catch (error) {
      message.error('Không thể xóa phòng!');
    }
  };

  // Cột cho bảng
  const columns = [
    {
      title: 'Khu',
      dataIndex: 'khu',
      key: 'khu',
    },
    {
      title: 'Số phòng',
      dataIndex: 'soPhong',
      key: 'soPhong',
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return String(record.soPhong).toLowerCase().includes(value.toLowerCase()) ||
               String(record.roomType).toLowerCase().includes(value.toLowerCase()) ||
               String(record.status).toLowerCase().includes(value.toLowerCase())
      }
    },
    {
      title: 'Diện tích',
      dataIndex: 'dienTich',
      key: 'dienTich',
      render: (dienTich) => `${dienTich} m²`
    },
    {
      title: 'Loại phòng',
      dataIndex: 'roomType',
      key: 'roomType',
    },
    {
      title: 'Khuyến mãi',
      dataIndex: 'khuyenMai',
      key: 'khuyenMai',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => price.toLocaleString('vi-VN')
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa phòng này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="room-management">
      <div className="room-header">
        <h1>Quản lý phòng</h1>
        <div className="room-actions">
          <Input
            placeholder="Tìm kiếm phòng..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300, marginRight: 16 }}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setIsModalVisible(true);
              setEditingRoom(null);
              form.resetFields();
            }}
          >
            Thêm phòng mới
          </Button>
        </div>
      </div>

      <Table columns={columns} dataSource={rooms} rowKey="id" />

      <Modal
        title={editingRoom ? "Sửa thông tin phòng" : "Thêm phòng mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingRoom(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="khu"
            label="Khu"
            rules={[{ required: true, message: 'Vui lòng nhập khu!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="soPhong"
            label="Số phòng"
            rules={[{ required: true, message: 'Vui lòng nhập số phòng!' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="dienTich"
            label="Diện tích (m²)"
            rules={[{ required: true, message: 'Vui lòng nhập diện tích!' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="roomType"
            label="Loại phòng"
            rules={[{ required: true, message: 'Vui lòng chọn loại phòng!' }]}
          >
            <Select>
              <Option value="Standard">Standard</Option>
              <Option value="Deluxe">Deluxe</Option>
              <Option value="Suite">Suite</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="khuyenMai"
            label="Khuyến mãi"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Option value="Trống">Trống</Option>
              <Option value="Đã đặt">Đã đặt</Option>
              <Option value="Đang dọn">Đang dọn</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá phòng (VNĐ)"
            rules={[{ required: true, message: 'Vui lòng nhập giá phòng!' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingRoom ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setEditingRoom(null);
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Room; 