import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ForgotPasswordModal from '../ForgotPasswordModal/ForgotPasswordModal';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router';

const SignInModal = ({ isOpen, onClose, onSwitchToSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const openForgotPassword = () => {
      setShowForgotPassword(true);
    };
  
    const closeForgotPassword = () => {
      setShowForgotPassword(false);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      
      try {
          const response = await axios.post('http://localhost:8080/account/login', {
              email,
              password
          });

          if (response.data.quyen !== "USER") {
            setError("Email hoặc mật khẩu không đúng");
            return;
          }
          
          // Lưu thông tin người dùng vào localStorage
          localStorage.setItem('user', JSON.stringify(response.data));
          
          console.log('Login successful:', response.data);
          onClose();
          window.location.reload(); // Tải lại trang để cập nhật trạng thái đăng nhập
      } catch (error) {
          setError('Email hoặc mật khẩu không đúng');
          console.error('Login error:', error);
      }
    };

  
    if (!isOpen) return null;
  
    return (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative">
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              <CloseIcon/>
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <button 
                    type="button"
                    onClick={openForgotPassword}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign In
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account? 
                <button 
                  onClick={onSwitchToSignUp}
                  className="ml-1 font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign Up
                </button>
              </p>
            </div>

            {error && (
                <div className="text-red-500 text-sm mt-2 text-center">
                    {error}
                </div>
            )}
          </div>
        </div>


        <ForgotPasswordModal 
          isOpen={showForgotPassword} 
          onClose={closeForgotPassword}
          onSwitchToSignIn={() => {
            closeForgotPassword();
            // Có thể thêm logic chuyển về modal đăng nhập nếu cần
          }}
        />
      </>
    );
  };

export default SignInModal;