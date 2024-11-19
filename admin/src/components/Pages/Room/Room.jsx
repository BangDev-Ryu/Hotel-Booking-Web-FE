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
  const [khus, setKhus] = useState([]);
  const [loaiPhongs, setLoaiPhongs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedKhu, setSelectedKhu] = useState({});
  const [selectedLoaiPhong, setSelectedLoaiPhong] = useState({});

  // Thêm useEffect để fetch dữ liệu khi component mount
  useEffect(() => {
    fetchRooms();
    fetchKhus();
    fetchLoaiPhongs();
  }, []);

  // Hàm fetch
  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:8080/room');
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      message.error('Không thể tải danh sách phòng!');
    }
  };

  const fetchKhus = async () => {
    try {
      const response = await fetch('http://localhost:8080/khu');
      const data = await response.json();
      setKhus(data);
    } catch (error) {
      message.error("Không thể tải danh sách khu!")
    }
  }

  const fetchLoaiPhongs = async () => {
    try {
      const response = await fetch('http://localhost:8080/loai-phong');
      const data = await response.json();
      setLoaiPhongs(data);
    } catch (error) {
      message.error("Không thể tải danh sách khu!")
    }
  }

  // Xử lý thêm/sửa phòng
  const handleSubmit = async (values) => {
    try {
        // Kiểm tra dữ liệu trước khi gửi
        if (!values.khu || !values.name || !values.dienTich || !values.loaiPhong || !values.status) {
            message.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }
        if (editingRoom) {
            // Cập nhật phòng
            const response = await fetch(`http://localhost:8080/room/${editingRoom.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ...values,
                  khu: {id: values.khu},
                  loaiPhong: {id: values.loaiPhong}
                })
            });
            if (response.ok) {
                message.success('Cập nhật phòng thành công!');
                fetchRooms();
            } else {
                message.error('Cập nhật phòng thất bại!');
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
                  khu: {id: values.khu},
                  loaiPhong: {id: values.loaiPhong}
                })
            });
            if (response.ok) {
                message.success('Thêm phòng mới thành công!');
                console.log(values);
                fetchRooms();
            } else {
                console.log(values)
                message.error('Thêm phòng mới thất bại!');
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
    form.setFieldValue("khu", room.khu.name);
    form.setFieldValue("loaiPhong", room.loaiPhong.name);
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
      render: (khu) => `${khu.name}`
    },
    {
      title: 'Tên phòng',
      dataIndex: 'name',
      key: 'name',
      render: (name) => `${name}`,
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
      dataIndex: 'loaiPhong',
      key: 'loaiPhong',
      render: (loaiPhong) => `${loaiPhong.name}`
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
            <Select
              placeholder="Chọn khu"
              onChange={setSelectedKhu}
              value={selectedKhu}
              options={khus.map(k => ({ value: k.id, label: k.name }))}
            >

            </Select>
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên phòng"
            rules={[{ required: true, message: 'Vui lòng nhập số phòng!' }]}
          >
            <Input type="text" />
          </Form.Item>

          <Form.Item
            name="dienTich"
            label="Diện tích (m²)"
            rules={[{ required: true, message: 'Vui lòng nhập diện tích!' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="loaiPhong"
            label="Loại phòng"
            rules={[{ required: true, message: 'Vui lòng chọn loại phòng!' }]}
          >
            <Select
              placeholder="Chọn loại phòng"
              onChange={setSelectedLoaiPhong}
              value={selectedLoaiPhong}
              options={loaiPhongs.map(lp => ({ value: lp.id, label: lp.name }))}
            >
    
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Option value="Trống">Trống</Option>
              <Option value="Đang sử dụng">Đang sử dụng</Option>
              <Option value="Đã đặt">Đã đặt</Option>
              <Option value="Bảo trì">Bảo trì</Option>
            </Select>
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
                setSelectedKhu([]);
                setSelectedLoaiPhong([]);
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