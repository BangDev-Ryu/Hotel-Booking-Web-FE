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
import './NoiThat.css';

function NoiThat() {
  const [noiThats, setNoiThats] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingNoiThat, setEditingNoiThat] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchNoiThats();
  }, []);

  const fetchNoiThats = async () => {
    try {
      const response = await fetch('http://localhost:8080/noi-that');
      const data = await response.json();
      setNoiThats(data);
    } catch (error) {
      console.log(error);
      message.error('Không thể tải danh sách nội thất!');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingNoiThat) {
        const response = await fetch(`http://localhost:8080/noi-that/${editingNoiThat.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values)
        });
        if (response.ok) {
          message.success('Cập nhật nội thất thành công!');
          fetchNoiThats();
        }
      } else {
        const response = await fetch('http://localhost:8080/noi-that', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values)
        });
        if (response.ok) {
          message.success('Thêm nội thất mới thành công!');
          fetchNoiThats();
        }
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingNoiThat(null);
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  const handleEdit = (noiThat) => {
    setEditingNoiThat(noiThat);
    form.setFieldsValue(noiThat);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/noi-that/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        message.success('Xóa nội thất thành công!');
        fetchNoiThats();
      }
    } catch (error) {
      message.error('Không thể xóa nội thất!');
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
      title: 'Tên nội thất',
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
            title="Xóa nội thất"
            description="Bạn có chắc chắn muốn xóa nội thất này không?"
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
    <div className="noithat-management">
      <div className="noithat-header">
        <h1>Quản lý nội thất</h1>
        <div className="noithat-actions">
          <Input
            placeholder="Tìm kiếm nội thất..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300, marginRight: 16 }}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setIsModalVisible(true);
              setEditingNoiThat(null);
              form.resetFields();
            }}
          >
            Thêm nội thất mới
          </Button>
        </div>
      </div>

      <Table columns={columns} dataSource={noiThats} rowKey="id" />

      <Modal
        title={editingNoiThat ? "Sửa thông tin nội thất" : "Thêm nội thất mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingNoiThat(null);
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
            label="Tên nội thất"
            rules={[{ required: true, message: 'Vui lòng nhập tên nội thất!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingNoiThat ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setEditingNoiThat(null);
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

export default NoiThat;
