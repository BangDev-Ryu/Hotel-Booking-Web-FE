import { useState } from "react";
import "../../../App.css"
import "./SideBar.css"
import BedIcon from '@mui/icons-material/Bed';
import PersonIcon from '@mui/icons-material/Person';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import CategoryIcon from '@mui/icons-material/Category';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import WeekendIcon from '@mui/icons-material/Weekend';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const SidebarData = [
    {
        title: "Quản lý phòng",
        icon: <BedIcon/>,
        subItems: [
            { title: "Phòng", icon: <BedIcon/>, link: "/room" },
            { title: "Loại phòng", icon: <CategoryIcon/>, link: "/loai-phong" },
            { title: "Khu", icon: <LocationOnIcon/>, link: "/khu" },
            { title: "Tiện nghi", icon: <RestaurantIcon/>, link: "/tien-nghi" },
            { title: "Nội thất", icon: <WeekendIcon/>, link: "/noi-that" }
        ]
    },
    {
        title: "Quản lý tài khoản",
        icon: <PersonIcon/>,
        subItems: [
            { title: "Tài khoản", icon: <PersonIcon/>, link: "/account" },
            { title: "Quyền", icon: <SecurityIcon/>, link: "/quyen" },
            { title: "Chức năng", icon: <SettingsIcon/>, link: "/chuc-nang" }
        ]
    },
    {
        title: "Quản lý đơn đặt phòng",
        icon: <BookOnlineIcon/>,
        subItems: [
            { title: "Đơn đặt phòng", icon: <BookOnlineIcon/>, link: "/booking" },
            { title: "Hóa đơn", icon: <ReceiptIcon/>, link: "/hoa-don" },
            { title: "Dịch vụ", icon: <RoomServiceIcon/>, link: "/dich-vu" }
        ]
    },
];

function Sidebar() {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [openMenus, setOpenMenus] = useState({});
    const [selectedSubItem, setSelectedSubItem] = useState(null);
    const navigate = useNavigate();

    const handleMainMenuClick = (index) => {
        setOpenMenus(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleSubItemClick = (link, mainIndex, subIndex) => {
        setSelectedIndex(mainIndex);
        setSelectedSubItem(subIndex);
        navigate(link);
    };

    const handleLogout = () => {
        console.log("Logout clicked");
    };

    return (
        <div className="Sidebar">
            <div className="sidebar-content">
                <div className="logo d-flex align-items-center justify-content-center p-3">
                    <h2 className="ms-2 mb-0">HOTEL AIKO</h2>
                </div>

                <nav className="nav flex-column">
                    {SidebarData.map((item, index) => (
                        <div key={index} className="menu-item">
                            <button
                                className={`main-menu-btn ${selectedIndex === index ? 'active' : ''}`}
                                onClick={() => handleMainMenuClick(index)}
                            >
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    <div className="d-flex align-items-center">
                                        <span className="icon">{item.icon}</span>
                                        <span className="title">{item.title}</span>
                                    </div>
                                    {openMenus[index] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </div>
                            </button>
                            
                            <div className={`sub-menu ${openMenus[index] ? 'show' : ''}`}>
                                {item.subItems.map((subItem, subIndex) => (
                                    <button
                                        key={subIndex}
                                        className={`sub-menu-btn ${selectedIndex === index && selectedSubItem === subIndex ? 'active' : ''}`}
                                        onClick={() => handleSubItemClick(subItem.link, index, subIndex)}
                                    >
                                        <span className="icon">{subItem.icon}</span>
                                        <span className="title">{subItem.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>

            <button
                className="logout-btn main-menu-btn"
                onClick={handleLogout}
            >
                <div className="d-flex align-items-center">
                    <span className="icon"><LogoutIcon /></span>
                    <span className="title">Đăng xuất</span>
                </div>
            </button>
        </div>
    );
}

export default Sidebar