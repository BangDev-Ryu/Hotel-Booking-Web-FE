import { useState } from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Paper,
    Box,
    Button,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/vi';

const generateRandomData = (count) => {
    const data = [];
    for (let i = 1; i <= count; i++) {
        data.push({
            name: `Tháng ${i}`,
            doanhThu: Math.floor(Math.random() * 100000000),
            donDat: Math.floor(Math.random() * 100),
        });
    }
    return data;
};

function ThongKe() {
    // Form states
    const [thoiGian, setThoiGian] = useState('thang');
    const [loaiThongKe, setLoaiThongKe] = useState('doanhThu');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Chart data state
    const [chartData, setChartData] = useState([]);

    const handleThongKe = () => {
        // Kiểm tra điều kiện trước khi thống kê
        if (!startDate || !endDate) {
            alert('Vui lòng chọn khoảng thời gian');
            return;
        }

        // Tạo dữ liệu mới khi nhấn nút thống kê
        const newData = generateRandomData(12);
        setChartData(newData);
    };

    return (
        <div className="p-4">
            <h2 className="mb-4">Thống kê</h2>
            
            <Grid container spacing={3} className="mb-4">
                <Grid item xs={12} md={3}>
                    <Paper className="p-3">
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                            <DatePicker
                                label="Từ ngày"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </LocalizationProvider>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Paper className="p-3">
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                            <DatePicker
                                label="Đến ngày"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                slotProps={{ textField: { fullWidth: true } }}
                                minDate={startDate}
                            />
                        </LocalizationProvider>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={2}>
                    <Paper className="p-3">
                        <FormControl fullWidth>
                            <InputLabel>Thời gian</InputLabel>
                            <Select
                                value={thoiGian}
                                label="Thời gian"
                                onChange={(e) => setThoiGian(e.target.value)}
                            >
                                <MenuItem value="thang">Theo tháng</MenuItem>
                                <MenuItem value="quy">Theo quý</MenuItem>
                                <MenuItem value="nam">Theo năm</MenuItem>
                            </Select>
                        </FormControl>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={2}>
                    <Paper className="p-3">
                        <FormControl fullWidth>
                            <InputLabel>Loại thống kê</InputLabel>
                            <Select
                                value={loaiThongKe}
                                label="Loại thống kê"
                                onChange={(e) => setLoaiThongKe(e.target.value)}
                            >
                                <MenuItem value="doanhThu">Doanh thu</MenuItem>
                                <MenuItem value="donDat">Đơn đặt phòng</MenuItem>
                            </Select>
                        </FormControl>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={2}>
                    <Paper className="p-3 h-100 d-flex align-items-center">
                        <Button 
                            variant="contained" 
                            fullWidth
                            onClick={handleThongKe}
                            sx={{ height: '56px' }}  // Để căn chỉnh chiều cao giống với các input khác
                        >
                            Thống kê
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            <Paper className="p-3">
                <Box sx={{ width: '100%', height: 400 }}>
                    <BarChart
                        width={1000}
                        height={400}
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey={loaiThongKe === 'doanhThu' ? 'doanhThu' : 'donDat'}
                            fill="#8884d8"
                            name={loaiThongKe === 'doanhThu' ? 'Doanh thu (VNĐ)' : 'Số đơn đặt'}
                        />
                    </BarChart>
                </Box>
            </Paper>
        </div>
    );
}

export default ThongKe;
