import React, { useState, useEffect, useRef } from 'react';
import SignUpModal from '../SignUpModal/SignUpModal';
import SignInModal from '../SignInModal/SignInModal';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router';
import ProfileModal from '../ProfileModal/ProfileModal';
import BookingHistoryModal from '../BookingHistoryModal/BookingHistoryModal';

const BookingHeader = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBookingHistory, setShowBookingHistory] = useState(false);

  useEffect(() => {
    // Kiểm tra người dùng đã đăng nhập
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }

    // Xử lý click outside để đóng dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openSignInModal = () => {
    setActiveModal('signIn');
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const switchToSignUp = () => {
    setActiveModal('signUp');
  };

  const switchToSignIn = () => {
    setActiveModal('signIn');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    window.location.reload();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div onClick={() => {navigate("/")}} className="flex items-center space-x-2">
              <span className="text-2xl font-semibold text-gray-900 cursor-pointer">
                Hotel Aiko
              </span>
            </div>
            <nav className="flex items-center space-x-8">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                  >
                    <AccountCircleIcon className="w-8 h-8" />
                    <span>{user.username}</span>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <button
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                        onClick={() => setShowProfileModal(true)}
                      >
                        <PersonIcon className="mr-2" />
                        Thông tin cá nhân
                      </button>
                      <button
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                        onClick={() => setShowBookingHistory(true)}
                      >
                        <HistoryIcon className="mr-2" />
                        Lịch sử đặt phòng
                      </button>
                      <button
                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                        onClick={handleLogout}
                      >
                        <LogoutIcon className="mr-2" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={openSignInModal}
                  className="text-gray-700 hover:text-blue-600"
                >
                  Sign In
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <SignInModal
        isOpen={activeModal === 'signIn'}
        onClose={closeModal}
        onSwitchToSignUp={switchToSignUp}
      />

      <SignUpModal
        isOpen={activeModal === 'signUp'}
        onClose={closeModal}
        onSwitchToSignIn={switchToSignIn}
      />

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onUpdateProfile={handleUpdateProfile}
      />

      <BookingHistoryModal
        isOpen={showBookingHistory}
        onClose={() => setShowBookingHistory(false)}
        user={user}
      />
    </>
  );
};

export default BookingHeader;