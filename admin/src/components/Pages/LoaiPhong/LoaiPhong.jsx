import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Space,
  Popconfirm,
  message,
  Select,
  Tabs
} from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import './LoaiPhong.css';

const { TabPane } = Tabs;

function LoaiPhong() {
  const [loaiPhongs, setLoaiPhongs] = useState([]);
  const [noiThats, setNoiThats] = useState([]);
  const [tienNghis, setTienNghis] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [currentLoaiPhong, setCurrentLoaiPhong] = useState(null);
  const [noiThatDetails, setNoiThatDetails] = useState([]);
  const [tienNghiDetails, setTienNghiDetails] = useState([]);
  const [form] = Form.useForm();
  const [detailsForm] = Form.useForm();
  const [editingLoaiPhong, setEditingLoaiPhong] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedNoiThats, setSelectedNoiThats] = useState([]);
  const [selectedTienNghis, setSelectedTienNghis] = useState([]);

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchLoaiPhongs();
    fetchNoiThats();
    fetchTienNghis();
  }, []);

  // Fetch danh sách loại phòng
  const fetchLoaiPhongs = async () => {
    try {
      const response = await fetch('http://localhost:8080/loai-phong');
      const data = await response.json();
      setLoaiPhongs(data);
    } catch (error) {
      message.error('Không thể tải danh sách loại phòng!');
    }
  };

  // Fetch danh sách nội thất
  const fetchNoiThats = async () => {
    try {
      const response = await fetch('http://localhost:8080/noi-that');
      const data = await response.json();
      setNoiThats(data);
    } catch (error) {
      message.error('Không thể tải danh sách nội thất!');
    }
  };

  // Fetch danh sách tiện nghi
  const fetchTienNghis = async () => {
    try {
      const response = await fetch('http://localhost:8080/tien-nghi');
      const data = await response.json();
      setTienNghis(data);
    } catch (error) {
      message.error('Không thể tải danh sách tiện nghi!');
    }
  };

  // Fetch nội thất của loại phòng
  const fetchNoiThatByLoaiPhong = async (loaiPhongId) => {
    try {
      const response = await fetch(`http://localhost:8080/loai-phong/${loaiPhongId}/noi-that`);
      return await response.json();
    } catch (error) {
      message.error('Không thể tải nội thất của loại phòng!');
      return [];
    }
  };

  // Fetch tiện nghi của loại phòng
  const fetchTienNghiByLoaiPhong = async (loaiPhongId) => {
    try {
      const response = await fetch(`http://localhost:8080/loai-phong/${loaiPhongId}/tien-nghi`);
      return await response.json();
    } catch (error) {
      message.error('Không thể tải tiện nghi của loại phòng!');
      return [];
    }
  };

  // Xử lý thêm/sửa loại phòng
  const handleSubmit = async (values) => {
    try {
      let loaiPhongResponse;
      if (editingLoaiPhong) {
        // Cập nhật loại phòng
        loaiPhongResponse = await fetch(`http://localhost:8080/loai-phong/${editingLoaiPhong.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });
      } else {
        // Thêm loại phòng mới
        loaiPhongResponse = await fetch('http://localhost:8080/loai-phong', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        });
      }

      if (loaiPhongResponse.ok) {
        const loaiPhong = await loaiPhongResponse.json();
        
        // Cập nhật nội thất cho loại phòng
        await fetch(`http://localhost:8080/loai-phong/${loaiPhong.id}/noi-that`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selectedNoiThats)
        });

        // Cập nhật tiện nghi cho loại phòng
        await fetch(`http://localhost:8080/loai-phong/${loaiPhong.id}/tien-nghi`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selectedTienNghis)
        });

        message.success(editingLoaiPhong ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
        fetchLoaiPhongs();
        setIsModalVisible(false);
        form.resetFields();
        setEditingLoaiPhong(null);
        setSelectedNoiThats([]);
        setSelectedTienNghis([]);
      }
    } catch (error) {
      message.error('Có lỗi xảy ra!');
    }
  };

  // Xử lý sửa loại phòng
  const handleEdit = async (loaiPhong) => {
    setEditingLoaiPhong(loaiPhong);
    form.setFieldsValue(loaiPhong);
    
    // Lấy nội thất và tiện nghi của loại phòng
    const noiThatData = await fetchNoiThatByLoaiPhong(loaiPhong.id);
    const tienNghiData = await fetchTienNghiByLoaiPhong(loaiPhong.id);
    
    // Cập nhật state với các ID của nội thất và tiện nghi
    setSelectedNoiThats(noiThatData.map(nt => nt.id));
    setSelectedTienNghis(tienNghiData.map(tn => tn.id));
    
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

  // Render chi tiết loại phòng
  const renderLoaiPhongDetails = async (record) => {
    const noiThatData = await fetchNoiThatByLoaiPhong(record.id);
    const tienNghiData = await fetchTienNghiByLoaiPhong(record.id);

    return (
      <Tabs defaultActiveKey="1">
        <TabPane tab="Nội thất" key="1">
          <Table 
            size="small"
            columns={[
              { title: 'ID', dataIndex: 'id', width: '20%' },
              { title: 'Tên nội thất', dataIndex: 'name' }
            ]}
            dataSource={noiThatData}
            rowKey="id"
            pagination={false}
          />
        </TabPane>
        <TabPane tab="Tiện nghi" key="2">
          <Table 
            size="small"
            columns={[
              { title: 'ID', dataIndex: 'id', width: '20%' },
              { title: 'Tên tiện nghi', dataIndex: 'name' }
            ]}
            dataSource={tienNghiData}
            rowKey="id"
            pagination={false}
          />
        </TabPane>
      </Tabs>
    );
  };

  // Hiển thị chi tiết loại phòng
  const showLoaiPhongDetails = async (record) => {
    try {
      const noiThatResponse = await fetch(`http://localhost:8080/loai-phong/${record.id}/noi-that`);
      const tienNghiResponse = await fetch(`http://localhost:8080/loai-phong/${record.id}/tien-nghi`);
      
      const noiThatData = await noiThatResponse.json();
      const tienNghiData = await tienNghiResponse.json();

      // Đặt giá trị cho form chi tiết
      detailsForm.setFieldsValue({
        ...record,
        noiThats: noiThatData.map(nt => nt.name),
        tienNghis: tienNghiData.map(tn => tn.name)
      });

      setCurrentLoaiPhong(record);
      setNoiThatDetails(noiThatData);
      setTienNghiDetails(tienNghiData);
      setIsDetailsModalVisible(true);
    } catch (error) {
      message.error('Không thể tải chi tiết loại phòng!');
    }
  };

  // Cột cho bảng
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    {
      title: 'Tên loại phòng',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return String(record.name).toLowerCase().includes(value.toLowerCase())
      }
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: '20%',
      render: (text) => `${text.toLocaleString()} VNĐ`
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '40%',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showLoaiPhongDetails(record)}
          >
            Chi tiết
          </Button>
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
            okButtonProps={{ danger: true, size: 'small' }}
            cancelButtonProps={{ size: 'small' }}
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
              setSelectedNoiThats([]);
              setSelectedTienNghis([]);
            }}
          >
            Thêm loại phòng mới
          </Button>
        </div>
      </div>

      <Table 
        columns={columns} 
        dataSource={loaiPhongs} 
        rowKey="id"
      />

      <Modal
        title="Chi tiết loại phòng"
        open={isDetailsModalVisible}
        onCancel={() => {
          setIsDetailsModalVisible(false);
          detailsForm.resetFields();
        }}
        footer={[
          <Button key="back" onClick={() => {
            setIsDetailsModalVisible(false);
            detailsForm.resetFields();
          }}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        <Form
          form={detailsForm}
          layout="vertical"
          initialValues={{
            noiThats: [],
            tienNghis: []
          }}
        >
          <Form.Item
            name="name"
            label="Tên loại phòng"
          >
            <Input readOnly />
          </Form.Item>
          
          <Form.Item
            name="price"
            label="Giá"
          >
            <Input readOnly addonAfter="VNĐ" />
          </Form.Item>

          <Form.Item 
            name="noiThats" 
            label="Nội thất"
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Nội thất"
              options={noiThatDetails.map(nt => ({ value: nt.name, label: nt.name }))}
              disabled
            />
          </Form.Item>

          <Form.Item 
            name="tienNghis" 
            label="Tiện nghi"
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Tiện nghi"
              options={tienNghiDetails.map(tn => ({ value: tn.name, label: tn.name }))}
              disabled
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingLoaiPhong ? "Sửa thông tin loại phòng" : "Thêm loại phòng mới"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingLoaiPhong(null);
          setSelectedNoiThats([]);
          setSelectedTienNghis([]);
        }}
        footer={null}
        width={800}
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
            <Input type="number" addonAfter="VNĐ"/>
          </Form.Item>

          <Form.Item label="Nội thất">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Chọn nội thất"
              value={selectedNoiThats}
              onChange={setSelectedNoiThats}
              options={noiThats.map(nt => ({ value: nt.id, label: nt.name }))}
            />
          </Form.Item>

          <Form.Item label="Tiện nghi">
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Chọn tiện nghi"
              value={selectedTienNghis}
              onChange={setSelectedTienNghis}
              options={tienNghis.map(tn => ({ value: tn.id, label: tn.name }))}
            />
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
                setSelectedNoiThats([]);
                setSelectedTienNghis([]);
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