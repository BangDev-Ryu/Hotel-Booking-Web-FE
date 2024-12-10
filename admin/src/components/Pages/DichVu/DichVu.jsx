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
import './DichVu.css';

function DichVu() {
  const [dichVus, setDichVus] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingDichVu, setEditingDichVu] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchDichVus();
  }, []);

  // Hàm fetch danh sách dịch vụ
  const fetchDichVus = async () => {
    try {
      const response = await fetch('http://localhost:8080/dich-vu');
      const data = await response.json();
      setDichVus(data);
    } catch (error) {
      console.log(error);
      message.error('Không thể tải danh sách dịch vụ!');
    }
  };

  // Xử lý thêm/sửa dịch vụ
  const handleSubmit = async (values) => {
    try {
      if (editingDichVu) {
        // Cập nhật dịch vụ
        const response = await fetch(`http://localhost:8080/dich-vu/${editingDichVu.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values)
        });
        if (response.ok) {
          message.success('Cập nhật dịch vụ thành công!');
          fetchDichVus();
        }
      } else {
        // Thêm dịch vụ mới
        const response = await fetch('http://localhost:8080/dich-vu', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values)
        });
        if (response.ok) {
          message.success('Thêm dịch vụ mới thành công!');
          fetchDichVus();
        }
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingDichVu(null);
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  // Xử lý sửa dịch vụ
  const handleEdit = (dichVu) => {
    setEditingDichVu(dichVu);
    form.setFieldsValue(dichVu);
    setIsModalVisible(true);
  };

  // Xử lý xóa dịch vụ
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/dich-vu/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        message.success('Xóa dịch vụ thành công!');
        fetchDichVus();
      }
    } catch (error) {
      message.error('Không thể xóa dịch vụ!');
    }
  };

  // Cột cho bảng
  const columns = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'name',
      key: 'name',
      width: '45%',
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
      width: '30%',
      render: (price) => `${price.toLocaleString()} VNĐ`,
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
            title="Xóa dịch vụ"
            description="Bạn có chắc chắn muốn xóa dịch vụ này không?"
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
            icon={<DeleteOutlined style={{ color: '#ff4d4f' }}/>}
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
    <div className="dichvu-management">
      <div className="dichvu-header">
        <h1>Quản lý dịch vụ</h1>
        <div className="dichvu-actions">
          <Input
            placeholder="Tìm kiếm dịch vụ..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300, marginRight: 16 }}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setIsModalVisible(true);
              setEditingDichVu(null);
              form.resetFields();
            }}
          >
            Thêm dịch vụ mới
          </Button>
        </div>
      </div>

      <Table columns={columns} dataSource={dichVus} rowKey="id" />

      <Modal
        title={editingDichVu ? "Sửa thông tin dịch vụ" : "Thêm dịch vụ mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingDichVu(null);
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
            label="Tên dịch vụ"
            rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: 'Vui lòng nhập giá dịch vụ!' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingDichVu ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setEditingDichVu(null);
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

export default DichVu;