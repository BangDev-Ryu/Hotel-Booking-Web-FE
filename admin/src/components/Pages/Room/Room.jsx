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
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [filters, setFilters] = useState({});

  // Thêm useEffect để fetch dữ liệu khi component mount
  useEffect(() => {
    fetchRooms();
    fetchKhus();
    fetchLoaiPhongs();
  }, []);

  // Thêm useEffect để xử lý lọc dữ liệu khi rooms hoặc filters thay đổi
  useEffect(() => {
    let result = [...rooms];
    
    if (filters.khu) {
      result = result.filter(room => room.khu.id === filters.khu);
    }
    
    if (filters.dienTich) {
      result = result.filter(room => {
        if (filters.dienTich === '20') return room.dienTich < 20;
        if (filters.dienTich === '20-30') return room.dienTich >= 20 && room.dienTich <= 30;
        if (filters.dienTich === '30') return room.dienTich > 30;
        return true;
      });
    }
    
    if (filters.loaiPhong) {
      result = result.filter(room => room.loaiPhong.id === filters.loaiPhong);
    }
    
    if (filters.status) {
      result = result.filter(room => room.status === filters.status);
    }
    
    if (searchText) {
      result = result.filter(room => 
        room.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    setFilteredRooms(result);
  }, [rooms, filters, searchText]);

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
            console.log(values);
            const response = await fetch(`http://localhost:8080/room/${editingRoom.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editingRoom.id,
                    name: values.name,
                    dienTich: values.dienTich,
                    status: values.status,
                    khu: { id: values.khu },
                    loaiPhong: { id: values.loaiPhong }
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
    form.setFieldsValue({
        name: room.name,
        dienTich: room.dienTich,
        status: room.status,
        khu: room.khu.id,
        loaiPhong: room.loaiPhong.id
    });
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
      render: (khu) => `${khu.name}`,
      filters: khus.map(khu => ({
        text: khu.name,
        value: khu.id,
      }))
    },
    {
      title: 'Tên phòng',
      dataIndex: 'name',
      key: 'name',
      render: (name) => `${name}`
    },
    {
      title: 'Diện tích',
      dataIndex: 'dienTich',
      key: 'dienTich',
      render: (dienTich) => `${dienTich} m²`,
      sorter: (a, b) => a.dienTich - b.dienTich,
      filters: [
        { text: '< 20m²', value: '20' },
        { text: '20m² - 30m²', value: '20-30' },
        { text: '> 30m²', value: '30' },
      ]
    },
    {
      title: 'Loại phòng',
      dataIndex: 'loaiPhong',
      key: 'loaiPhong',
      render: (loaiPhong) => `${loaiPhong.name}`,
      filters: loaiPhongs.map(lp => ({
        text: lp.name,
        value: lp.id,
      }))
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Trống', value: 'Trống' },
        { text: 'Đang sử dụng', value: 'Đang sử dụng' },
        { text: 'Đã đặt', value: 'Đã đặt' },
        { text: 'Bảo trì', value: 'Bảo trì' },
      ]
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

  // Cột cho bảng
  const handleTableChange = (pagination, filters, sorter) => {
    const newFilters = {
      khu: filters.khu?.[0],
      dienTich: filters.dienTich?.[0],
      loaiPhong: filters.loaiPhong?.[0],
      status: filters.status?.[0]
    };
    setFilters(newFilters);
  };

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

      <Table 
        columns={columns} 
        dataSource={filteredRooms.length > 0 ? filteredRooms : rooms} 
        rowKey="id" 
        onChange={handleTableChange}
      />

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