import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Checkbox,
  Popconfirm,
} from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import './Quyen.css';

const Quyen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Dữ liệu mẫu
  const data = [
    { id: 1, tenQuyen: 'Admin' },
    { id: 2, tenQuyen: 'Nhân viên' },
    { id: 3, tenQuyen: 'Khách hàng' },
  ];

  // Các module trong hệ thống
  const modules = [
    'Phòng', 'Loại phòng', 'Khu', 'Tiện nghi', 'Nội thất', 
    'Tài khoản', 'Quyền', 'Đơn đặt phòng', 'Hóa đơn', 
    'Dịch vụ', 'Thống kê'
  ];

  const columns = [
    {
      title: 'Tên Quyền',
      dataIndex: 'tenQuyen',
      key: 'tenQuyen',
      width: '75%',
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return String(record.tenQuyen)
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
            icon={<EyeOutlined />}
            onClick={() => showDetailModal(record)}
          >
            Xem
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa quyền"
            description="Bạn có chắc chắn muốn xóa quyền này không?"
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

  const detailColumns = [
    { title: '', dataIndex: 'module', key: 'module' },
    { 
      title: 'Xem',
      key: 'view',
      render: () => <Checkbox />
    },
    {
      title: 'Thêm',
      key: 'add',
      render: () => <Checkbox />
    },
    {
      title: 'Sửa',
      key: 'edit',
      render: () => <Checkbox />
    },
    {
      title: 'Xóa',
      key: 'delete',
      render: () => <Checkbox />
    },
  ];

  const detailData = modules.map((module, index) => ({
    key: index,
    module: module,
  }));

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showEditModal = (record) => {
    setSelectedRecord(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const showDetailModal = (record) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        console.log('Success:', values);
        form.resetFields();
        setIsModalOpen(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleDelete = (id) => {
    console.log('Delete:', id);
  };

  return (
    <div className="quyen-management">
      <div className="quyen-header">
        <h1>Quản lý quyền</h1>
        <div className="quyen-actions">
          <Input
            placeholder="Tìm kiếm quyền..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300, marginRight: 16 }}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              showModal();
              setSelectedRecord(null);
              form.resetFields();
            }}
          >
            Thêm quyền mới
          </Button>
        </div>
      </div>

      <Table columns={columns} dataSource={data} rowKey="id" />

      <Modal
        title={selectedRecord ? "Sửa thông tin quyền" : "Thêm quyền mới"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setSelectedRecord(null);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleOk}
        >
          <Form.Item
            name="tenQuyen"
            label="Tên Quyền"
            rules={[{ required: true, message: 'Vui lòng nhập tên quyền!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item label="Chi tiết quyền">
            <Table 
              columns={detailColumns} 
              dataSource={detailData} 
              pagination={false}
              size="small"
              bordered
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {selectedRecord ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button onClick={() => {
                setIsModalOpen(false);
                form.resetFields();
                setSelectedRecord(null);
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết quyền"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        width={800}
        footer={null}
      >
        <Table 
          columns={detailColumns} 
          dataSource={detailData} 
          pagination={false}
          size="small"
          bordered
        />
      </Modal>
    </div>
  );
};

export default Quyen;