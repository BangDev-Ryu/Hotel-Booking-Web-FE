import React, { useState } from 'react';

const ForgotPasswordModal = ({ isOpen, onClose, onSwitchToSignIn }) => {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic gửi email đặt lại mật khẩu 
    try {
      // Giả định có một service để gửi email đặt lại mật khẩu
      // resetPasswordService(email);
      console.log('Password reset email sent to:', email);
      setIsEmailSent(true);
    } catch (error) {
      console.error('Failed to send reset password email', error);
      // Xử lý hiển thị thông báo lỗi
    }
  };

  const handleReset = () => {
    setEmail('');
    setIsEmailSent(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          ×
        </button>
        
        {!isEmailSent ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                  Enter your email to reset password
                </label>
                <input
                  type="email"
                  id="reset-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password? 
                <button 
                  onClick={onSwitchToSignIn}
                  className="ml-1 font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign In
                </button>
              </p>
            </div>
          </>
        ) : (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-600">Check Your Email</h2>
            <p className="text-gray-600">
              A password reset link has been sent to {email}. 
              Please check your inbox and follow the instructions.
            </p>
            <div className="flex justify-between space-x-4">
              <button
                onClick={handleReset}
                className="flex-1 py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
              >
                Try Another Email
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;