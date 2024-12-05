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
import './Account.css'

const { Option } = Select;


const Account = () => {
    const [account, setAccounts] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingAccount, setEditingAccount] = useState(null);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
      fetchAccounts();
    }, [])

    const fetchAccounts = async () => {
      try {
        const response = await fetch('http://localhost:8080/account')
        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        message.error('Không thể tải danh sách tài khoản!');
      }
    }

    const handleSubmit = async (values) => {
      try {
          if (!values.email || !values.username || !values.password || !values.quyen || !values.sdt) {
              message.error('Vui lòng điền đầy đủ thông tin!');
              return;
          }
          if (editingAccount) {
              const response = await fetch(`http://localhost:8080/account/${editingAccount.id}`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    values
                  })
              });
              if (response.ok) {
                  message.success('Cập nhật tài khoản thành công!');
                  fetchAccounts();
              } else {
                  message.error('Cập nhật tài khoản thất bại!');
              }
          } else {
              const response = await fetch('http://localhost:8080/account', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    values
                  })
              });
              if (response.ok) {
                  message.success('Thêm tài khoản mới thành công!');
                  console.log(values);
                  fetchAccounts();
              } else {
                  console.log(values)
                  message.error('Thêm tài khoản mới thất bại!');
              }
          }
          setIsModalVisible(false);
          form.resetFields();
          setEditingAccount(null);
      } catch (error) {
          message.error('Có lỗi xảy ra!');
      }
    };

    const handleEdit = (account) => {
      setEditingAccount(account);
      form.setFieldsValue(account);
      
      setIsModalVisible(true);
    };
  
    const handleDelete = async (id) => {
      try {
        const response = await fetch(`http://localhost:8080/account/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          message.success('Xóa tài khoản thành công!');
          fetchAccounts();
        }
      } catch (error) {
        message.error('Không thể xóa tài khoản!');
      }
    };

    const columns = [
        {
          title: 'Tên tài khoản',
          dataIndex: 'username',
          key: 'username',
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          filteredValue: [searchText],
          onFilter: (value, record) => {
            return String(record.soPhong).toLowerCase().includes(value.toLowerCase()) ||
                   String(record.roomType).toLowerCase().includes(value.toLowerCase()) ||
                   String(record.status).toLowerCase().includes(value.toLowerCase())
          }
        },
        {
          title: 'Mật khẩu',
          dataIndex: 'password',
          key: 'password',
        },
        {
          title: 'Số điện thoại',
          dataIndex: 'sdt',
          key: 'sdt',
        },
        {
          title: 'Quyền',
          dataIndex: 'quyen',
          key: 'quyen',
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
                title="Bạn có chắc chắn muốn xóa tài khoản này?"
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
        <div className="account-management">
        <div className="account-header">
            <h1>Quản lý tài khoản</h1>
            <div className="account-actions">
            <Input
                placeholder="Tìm kiếm tài khoản..."
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300, marginRight: 16 }}
            />
            <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                setIsModalVisible(true);
                setEditingAccount(null);
                form.resetFields();
                }}
            >
                Thêm tài khoản mới
            </Button>
            </div>
        </div>

        <Table columns={columns} dataSource={account} rowKey="id" />

        <Modal
            title={editingAccount ? "Sửa thông tin tài khoản" : "Thêm tài khoản mới"}
            open={isModalVisible}
            onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setEditingAccount(null);
            }}
            footer={null}
        >
            <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            >

            <Form.Item
                name="username"
                label="Tên tài khoản"
                rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}
            >
                <Input type="text" />
            </Form.Item>

            <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
                <Input type="password" autoComplete='new-password'/>
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Vui lòng nhập Email!' }]}
            >
                <Input type="email" autoComplete='new-password'/>
            </Form.Item>

            <Form.Item
                name="quyen"
                label="Quyền"
                rules={[{ required: true, message: 'Vui lòng chọn quyền!' }]}
            >
                <Select>
                <Option value="USER">USER</Option>
                <Option value="QUẢN LÝ PHÒNG">QUẢN LÝ PHÒNG</Option>
                <Option value="TIẾP TÂN">TIẾP TÂN</Option>
                <Option value="BẢO TRÌ PHÒNG">BẢO TRÌ PHÒNG</Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <Space>
                <Button type="primary" htmlType="submit">
                    {editingAccount ? 'Cập nhật' : 'Thêm mới'}
                </Button>
                <Button onClick={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                    setEditingAccount(null);
                }}>
                    Hủy
                </Button>
                </Space>
            </Form.Item>
            </Form>
        </Modal>
        </div>
    )
}

export default Account