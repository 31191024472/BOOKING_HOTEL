import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    TextField,
    MenuItem,
    Card,
    CardContent,
    CircularProgress,
    Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ReportManagement = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [status, setStatus] = useState('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [bookingData, setBookingData] = useState(null);
    const [revenueData, setRevenueData] = useState(null);
    const [occupancyData, setOccupancyData] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch booking reports
            const bookingResponse = await axios.get(
                `http://localhost:5000/api/partner/reports/bookings?startDate=${format(startDate, 'yyyy-MM-dd')}&endDate=${format(endDate, 'yyyy-MM-dd')}&status=${status}`,
                { headers }
            );
            setBookingData(bookingResponse.data.data);

            // Fetch revenue reports
            const revenueResponse = await axios.get(
                `http://localhost:5000/api/partner/reports/revenue?startDate=${format(startDate, 'yyyy-MM-dd')}&endDate=${format(endDate, 'yyyy-MM-dd')}`,
                { headers }
            );
            setRevenueData(revenueResponse.data.data);

            // Fetch occupancy reports
            const occupancyResponse = await axios.get(
                `http://localhost:5000/api/partner/reports/occupancy?startDate=${format(startDate, 'yyyy-MM-dd')}&endDate=${format(endDate, 'yyyy-MM-dd')}`,
                { headers }
            );
            setOccupancyData(occupancyResponse.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate, status]);

    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();

        // Booking data
        if (bookingData) {
            const bookingSheet = XLSX.utils.json_to_sheet(
                bookingData.bookings.map(booking => ({
                    'Mã đặt phòng': booking._id,
                    'Khách sạn': booking.hotelId,
                    'Ngày đặt': format(new Date(booking.createdAt), 'dd/MM/yyyy'),
                    'Ngày nhận phòng': format(new Date(booking.checkIn), 'dd/MM/yyyy'),
                    'Ngày trả phòng': format(new Date(booking.checkOut), 'dd/MM/yyyy'),
                    'Số phòng': booking.rooms,
                    'Số khách': booking.guests,
                    'Tổng tiền': booking.totalPrice,
                    'Trạng thái': booking.status,
                }))
            );
            XLSX.utils.book_append_sheet(wb, bookingSheet, 'Đặt phòng');
        }

        // Revenue data
        if (revenueData) {
            const revenueSheet = XLSX.utils.json_to_sheet(
                revenueData.dailyRevenue.map(item => ({
                    'Ngày': item.date,
                    'Doanh thu': item.revenue,
                    'Số đặt phòng': item.bookingCount,
                }))
            );
            XLSX.utils.book_append_sheet(wb, revenueSheet, 'Doanh thu');
        }

        // Occupancy data
        if (occupancyData) {
            const occupancySheet = XLSX.utils.json_to_sheet(
                Object.entries(occupancyData.occupancyByDate).map(([date, data]) => ({
                    'Ngày': date,
                    'Tổng số phòng': data.totalRooms,
                    'Số phòng đã đặt': data.bookedRooms,
                    'Tỷ lệ đặt phòng': `${data.occupancyRate.toFixed(2)}%`,
                }))
            );
            XLSX.utils.book_append_sheet(wb, occupancySheet, 'Tỷ lệ đặt phòng');
        }

        XLSX.writeFile(wb, `BaoCao_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text('Báo cáo thống kê', 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Từ ${format(startDate, 'dd/MM/yyyy')} đến ${format(endDate, 'dd/MM/yyyy')}`, 105, 30, { align: 'center' });

        // Booking data
        if (bookingData) {
            doc.setFontSize(16);
            doc.text('Thống kê đặt phòng', 20, 50);
            doc.autoTable({
                startY: 60,
                head: [['Mã đặt phòng', 'Khách sạn', 'Ngày đặt', 'Tổng tiền', 'Trạng thái']],
                body: bookingData.bookings.map(booking => [
                    booking._id,
                    booking.hotelId,
                    format(new Date(booking.createdAt), 'dd/MM/yyyy'),
                    booking.totalPrice,
                    booking.status,
                ]),
            });
        }

        // Revenue data
        if (revenueData) {
            doc.setFontSize(16);
            doc.text('Thống kê doanh thu', 20, doc.lastAutoTable.finalY + 20);
            doc.autoTable({
                startY: doc.lastAutoTable.finalY + 30,
                head: [['Ngày', 'Doanh thu', 'Số đặt phòng']],
                body: revenueData.dailyRevenue.map(item => [
                    item.date,
                    item.revenue,
                    item.bookingCount,
                ]),
            });
        }

        // Occupancy data
        if (occupancyData) {
            doc.setFontSize(16);
            doc.text('Thống kê tỷ lệ đặt phòng', 20, doc.lastAutoTable.finalY + 20);
            doc.autoTable({
                startY: doc.lastAutoTable.finalY + 30,
                head: [['Ngày', 'Tổng số phòng', 'Số phòng đã đặt', 'Tỷ lệ đặt phòng']],
                body: Object.entries(occupancyData.occupancyByDate).map(([date, data]) => [
                    date,
                    data.totalRooms,
                    data.bookedRooms,
                    `${data.occupancyRate.toFixed(2)}%`,
                ]),
            });
        }

        doc.save(`BaoCao_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    {/* Filters */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" gutterBottom>
                                Bộ lọc
                            </Typography>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={3}>
                                    <DatePicker
                                        label="Từ ngày"
                                        value={startDate}
                                        onChange={setStartDate}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <DatePicker
                                        label="Đến ngày"
                                        value={endDate}
                                        onChange={setEndDate}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        select
                                        label="Trạng thái"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        fullWidth
                                    >
                                        <MenuItem value="all">Tất cả</MenuItem>
                                        <MenuItem value="Pending">Chờ xác nhận</MenuItem>
                                        <MenuItem value="Confirmed">Đã xác nhận</MenuItem>
                                        <MenuItem value="Cancelled">Đã hủy</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={exportToExcel}
                                            fullWidth
                                        >
                                            Xuất Excel
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={exportToPDF}
                                            fullWidth
                                        >
                                            Xuất PDF
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {error && (
                        <Grid item xs={12}>
                            <Alert severity="error">{error}</Alert>
                        </Grid>
                    )}

                    {loading ? (
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Grid>
                    ) : (
                        <>
                            {/* Summary Cards */}
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Tổng số đặt phòng
                                        </Typography>
                                        <Typography variant="h4">
                                            {bookingData?.stats?.totalBookings || 0}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Tổng doanh thu
                                        </Typography>
                                        <Typography variant="h4">
                                            {revenueData?.totalRevenue?.toLocaleString('vi-VN')} VNĐ
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>
                                            Tỷ lệ đặt phòng trung bình
                                        </Typography>
                                        <Typography variant="h4">
                                            {occupancyData?.averageOccupancyRate?.toFixed(2)}%
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Charts */}
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Doanh thu theo ngày
                                    </Typography>
                                    <ResponsiveContainer>
                                        <LineChart
                                            data={revenueData?.dailyRevenue || []}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Tỷ lệ đặt phòng theo ngày
                                    </Typography>
                                    <ResponsiveContainer>
                                        <BarChart
                                            data={Object.entries(occupancyData?.occupancyByDate || {}).map(([date, data]) => ({
                                                date,
                                                occupancyRate: data.occupancyRate,
                                            }))}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="occupancyRate" fill="#82ca9d" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Phân bố trạng thái đặt phòng
                                    </Typography>
                                    <Box sx={{ height: 400 }}>
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie
                                                    data={Object.entries(bookingData?.stats?.statusBreakdown || {}).map(
                                                        ([status, count]) => ({
                                                            name: status,
                                                            value: count,
                                                        })
                                                    )}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={150}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {Object.entries(bookingData?.stats?.statusBreakdown || {}).map(
                                                        (entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        )
                                                    )}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Paper>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Container>
        </LocalizationProvider>
    );
};

export default ReportManagement;
