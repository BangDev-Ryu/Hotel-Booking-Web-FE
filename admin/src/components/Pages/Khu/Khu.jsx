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
import './Khu.css';

function Khu() {
  const [khus, setKhus] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKhu, setEditingKhu] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchKhus();
  }, []);

  // Hàm fetch danh sách khu
  const fetchKhus = async () => {
    try {
      const response = await fetch('http://localhost:8080/khu');
      const data = await response.json();
      setKhus(data);
    } catch (error) {
        console.log(error)
      message.error('Không thể tải danh sách khu!');
    }
  };

  // Xử lý thêm/sửa khu
  const handleSubmit = async (values) => {
    try {
      if (editingKhu) {
        // Cập nhật khu
        const response = await fetch(`http://localhost:8080/khu/${editingKhu.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values)
        });
        if (response.ok) {
          message.success('Cập nhật khu thành công!');
          fetchKhus();
        }
      } else {
        // Thêm khu mới
        const response = await fetch('http://localhost:8080/khu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values)
        });
        if (response.ok) {
          message.success('Thêm khu mới thành công!');
          fetchKhus();
        }
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingKhu(null);
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  // Xử lý sửa khu
  const handleEdit = (khu) => {
    setEditingKhu(khu);
    form.setFieldsValue(khu);
    setIsModalVisible(true);
  };

  // Xử lý xóa khu
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/khu/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        message.success('Xóa khu thành công!');
        fetchKhus();
      }
    } catch (error) {
      message.error('Không thể xóa khu!');
    }
  };

  // Cột cho bảng
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên khu',
      dataIndex: 'name',
      key: 'name',
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return String(record.name)
          .toLowerCase()
          .includes(value.toLowerCase())
      }
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
            title="Bạn có chắc chắn muốn xóa khu này?"
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
    <div className="khu-management">
      <div className="khu-header">
        <h1>Quản lý khu</h1>
        <div className="khu-actions">
          <Input
            placeholder="Tìm kiếm khu..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300, marginRight: 16 }}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setIsModalVisible(true);
              setEditingKhu(null);
              form.resetFields();
            }}
          >
            Thêm khu mới
          </Button>
        </div>
      </div>

      <Table columns={columns} dataSource={khus} rowKey="id" />

      <Modal
        title={editingKhu ? "Sửa thông tin khu" : "Thêm khu mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingKhu(null);
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
            label="Tên khu"
            rules={[{ required: true, message: 'Vui lòng nhập tên khu!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingKhu ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setEditingKhu(null);
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

export default Khu;
