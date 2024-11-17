import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Space,
  Popconfirm,
  message
} from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './LoaiPhong.css';

function LoaiPhong() {
  const [loaiPhongs, setLoaiPhongs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingLoaiPhong, setEditingLoaiPhong] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchLoaiPhongs();
  }, []);

  // Hàm fetch danh sách loại phòng
  const fetchLoaiPhongs = async () => {
    try {
      const response = await fetch('http://localhost:8080/loai-phong');
      const data = await response.json();
      setLoaiPhongs(data);
    } catch (error) {
      message.error('Không thể tải danh sách loại phòng!');
    }
  };

  // Xử lý thêm/sửa loại phòng
  const handleSubmit = async (values) => {
    try {
      if (editingLoaiPhong) {
        // Cập nhật loại phòng
        const response = await fetch(`http://localhost:8080/loai-phong/${editingLoaiPhong.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values)
        });
        if (response.ok) {
          message.success('Cập nhật loại phòng thành công!');
          fetchLoaiPhongs();
        }
      } else {
        // Thêm loại phòng mới
        const response = await fetch('http://localhost:8080/loai-phong', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values)
        });
        if (response.ok) {
          message.success('Thêm loại phòng mới thành công!');
          fetchLoaiPhongs();
        }
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingLoaiPhong(null);
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  // Xử lý sửa loại phòng
  const handleEdit = (loaiPhong) => {
    setEditingLoaiPhong(loaiPhong);
    form.setFieldsValue(loaiPhong);
    setIsModalVisible(true);
  };

  // Xử lý xóa loại phòng
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/loai-phong/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        message.success('Xóa loại phòng thành công!');
        fetchLoaiPhongs();
      }
    } catch (error) {
      message.error('Không thể xóa loại phòng!');
    }
  };

  // Cột cho bảng
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '15%',
    },
    {
      title: 'Tên loại phòng',
      dataIndex: 'name',
      key: 'name',
      width: '60%',
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return String(record.name)
          .toLowerCase()
          .includes(value.toLowerCase())
      }
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: '25%',
      render: (text) => `${text} VNĐ`
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '25%',
      render: (_, record) => (
        <Space size="small" style={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa loại phòng"
            description="Bạn có chắc chắn muốn xóa loại phòng này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ 
              danger: true,
              size: 'small'
            }}
            cancelButtonProps={{
              size: 'small'
            }}
            icon={<DeleteOutlined style={{ color: '#ff4d4f' }}/> }
          >
            <Button 
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="loai-phong-management">
      <div className="loai-phong-header">
        <h1>Quản lý loại phòng</h1>
        <div className="loai-phong-actions">
          <Input
            placeholder="Tìm kiếm loại phòng..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300, marginRight: 16 }}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setIsModalVisible(true);
              setEditingLoaiPhong(null);
              form.resetFields();
            }}
          >
            Thêm loại phòng mới
          </Button>
        </div>
      </div>

      <Table columns={columns} dataSource={loaiPhongs} rowKey="id" />

      <Modal
        title={editingLoaiPhong ? "Sửa thông tin loại phòng" : "Thêm loại phòng mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingLoaiPhong(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Tên loại phòng"
            rules={[{ required: true, message: 'Vui lòng nhập tên loại phòng!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingLoaiPhong ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setEditingLoaiPhong(null);
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

export default LoaiPhong;
