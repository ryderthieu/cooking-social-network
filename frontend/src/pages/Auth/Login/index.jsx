import React, { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import bgImage from '../../../assets/images/login/background.png'
import bowl from '../../../assets/images/login/bowl.png'
import logo from '../../../assets/logo.svg'

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [shakeFields, setShakeFields] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
        setApiError('');
    };

    const validate = () => {
        const newErrors = {};
        const shake = [];

        if (!formData.email.trim()) {
            newErrors.email = "Vui lòng nhập email.";
            shake.push("email");
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) { 
            newErrors.email = "Email không hợp lệ.";
            shake.push("email");
        }

        if (!formData.password) {
            newErrors.password = "Vui lòng nhập mật khẩu.";
            shake.push("password");
        }

        setShakeFields(shake);
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            if (validationErrors.email) emailRef.current.focus();
            else if (validationErrors.password) passwordRef.current.focus();
            setTimeout(() => setShakeFields([]), 500);
            return;
        }

        try {
            setIsLoading(true);
            setApiError('');
            const result = await login(formData.email, formData.password);
            console.log(result);
            
            if (result.success) {
                navigate('/'); // Chuyển hướng về trang chủ sau khi đăng nhập thành công
            } else {
                setApiError(result.error || 'Đăng nhập thất bại. Vui lòng thử lại.');
                setShakeFields(['email', 'password']);
                setTimeout(() => setShakeFields([]), 500);
            }
        } catch (error) {
            setApiError('Có lỗi xảy ra. Vui lòng thử lại sau.');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 animated-bg">
            <div
                className="w-full max-w-6xl flex flex-row rounded-3xl shadow-2xl overflow-hidden border border-white/30 p-6 gap-5 relative"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className="w-1/2 flex justify-center items-center p-6 min-h-[610px]">
                    <img src={bowl} alt="Fruit Bowl" className="max-w-[80%] md:max-w-[70%]" />
                </div>

                <div className="w-1/2 flex justify-center items-center p-6">
                    <div className="w-full max-w-md">
                        <div className="flex justify-center mb-6">
                            <img src={logo} alt="SHISHA Logo" className="h-10" />
                        </div>
                        <h2 className="text-3xl font-bold text-black mb-6 text-center">Đăng nhập</h2>

                        {apiError && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                {apiError}
                            </div>
                        )}

                        <form className="space-y-4 flex flex-col mb-6" onSubmit={handleSubmit}>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Email"
                                    className={`w-full px-4 py-3 rounded-lg bg-white/90 border transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    } ${shakeFields.includes("email") ? "animate-shake" : ""}`}
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    ref={emailRef}
                                    disabled={isLoading}
                                />
                                {errors.email && <p className="text-red-600 text-xs italic ml-2 mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Mật khẩu"
                                    className={`w-full px-4 py-3 rounded-lg bg-white/90 border transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
                                        errors.password ? 'border-red-500' : 'border-gray-300'
                                    } ${shakeFields.includes("password") ? "animate-shake" : ""}`}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    ref={passwordRef}
                                    disabled={isLoading}
                                />
                                {errors.password && <p className="text-red-600 text-xs italic ml-2 mt-1">{errors.password}</p>}
                                <div className="text-right mt-2">
                                    <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition duration-300 ease-in-out">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className={`w-full bg-[#04043F] hover:bg-[#1a1a5f] text-white py-3 rounded-lg font-semibold mt-6 transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg pt-4 ${
                                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </button>
                        </form>

                        <div className="flex items-center my-6">
                            <hr className="flex-grow border-gray-300" />
                            <span className="mx-4 text-sm text-gray-500 font-medium">Hoặc tiếp tục với</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>

                        <div className="flex justify-center items-center gap-5 mb-6">
                            <button 
                                className="w-11 h-11 rounded-full border border-gray-200 hover:bg-gray-100 flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-110 shadow-sm"
                                disabled={isLoading}
                            >
                                <img
                                    className="w-6 h-6"
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    alt="Google"
                                />
                            </button>
                            <button 
                                className="w-11 h-11 rounded-full border border-gray-200 hover:bg-gray-100 flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-110 shadow-sm"
                                disabled={isLoading}
                            >
                                <img
                                    className="w-6 h-6"
                                    src="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg"
                                    alt="Facebook"
                                />
                            </button>
                        </div>

                        <p className="text-sm text-center text-gray-600 mt-6">
                            Bạn chưa có tài khoản?{" "}
                            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium transition duration-300 ease-in-out">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
