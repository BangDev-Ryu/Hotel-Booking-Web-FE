import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/account/login', {
                email,
                password
            });

            if (response.data) {
                if (response.data.quyen === "USER") {
                    setError('Tài khoản không có quyền đăng nhập!');
                    return;
                }

                localStorage.setItem('user', JSON.stringify(response.data));
                console.log(response.data);
                navigate('/');
            }
        } catch (error) {
            setError('Email hoặc mật khẩu không chính xác');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h2>Login</h2>
                    
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-footer">
                        <div className="remember-me">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label>Remember me</label>
                        </div>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>
                    {error && <div className="error-message" >{error}</div>}
                    <button type="submit" className="sign-in-btn">Login</button>

                </form>
                
            </div>
        </div>
    );
};

export default Login;