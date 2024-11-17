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
import './TienNghi.css';

function TienNghi() {
  const [tienNghis, setTienNghis] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingTienNghi, setEditingTienNghi] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchTienNghis();
  }, []);

  const fetchTienNghis = async () => {
    try {
      const response = await fetch('http://localhost:8080/tien-nghi');
      const data = await response.json();
      setTienNghis(data);
    } catch (error) {
      console.log(error);
      message.error('Không thể tải danh sách tiện nghi!');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingTienNghi) {
        const response = await fetch(`http://localhost:8080/tien-nghi/${editingTienNghi.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values)
        });
        if (response.ok) {
          message.success('Cập nhật tiện nghi thành công!');
          fetchTienNghis();
        }
      } else {
        const response = await fetch('http://localhost:8080/tien-nghi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values)
        });
        if (response.ok) {
          message.success('Thêm tiện nghi mới thành công!');
          fetchTienNghis();
        }
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingTienNghi(null);
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  const handleEdit = (tienNghi) => {
    setEditingTienNghi(tienNghi);
    form.setFieldsValue(tienNghi);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/tien-nghi/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        message.success('Xóa tiện nghi thành công!');
        fetchTienNghis();
      }
    } catch (error) {
      message.error('Không thể xóa tiện nghi!');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '15%',
    },
    {
      title: 'Tên tiện nghi',
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
            title="Xóa tiện nghi"
            description="Bạn có chắc chắn muốn xóa tiện nghi này không?"
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
    <div className="tiennghi-management">
      <div className="tiennghi-header">
        <h1>Quản lý tiện nghi</h1>
        <div className="tiennghi-actions">
          <Input
            placeholder="Tìm kiếm tiện nghi..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300, marginRight: 16 }}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setIsModalVisible(true);
              setEditingTienNghi(null);
              form.resetFields();
            }}
          >
            Thêm tiện nghi mới
          </Button>
        </div>
      </div>

      <Table columns={columns} dataSource={tienNghis} rowKey="id" />

      <Modal
        title={editingTienNghi ? "Sửa thông tin tiện nghi" : "Thêm tiện nghi mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingTienNghi(null);
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
            label="Tên tiện nghi"
            rules={[{ required: true, message: 'Vui lòng nhập tên tiện nghi!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingTienNghi ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setEditingTienNghi(null);
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

export default TienNghi;
