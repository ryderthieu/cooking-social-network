import React, { useState, useRef, useEffect } from 'react';
import bgImage from '../../../assets/images/register/background.png';
import bowl from '../../../assets/images/register/bowl.png';
import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.svg';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agree: false
    });

    const [errors, setErrors] = useState({});
    const [shakeFields, setShakeFields] = useState([]);

    // Khai báo ref
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const agreeRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validate = () => {
        const newErrors = {};
        const shake = [];

        if (!formData.name.trim()) {
            newErrors.name = "Vui lòng nhập họ tên.";
            shake.push("name");
        }

        if (!formData.email.trim()) {
            newErrors.email = "Vui lòng nhập email.";
            shake.push("email");
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ.";
            shake.push("email");
        }

        if (!formData.password) {
            newErrors.password = "Vui lòng nhập mật khẩu.";
            shake.push("password");
        } else if (formData.password.length < 6) {
            newErrors.password = "Mật khẩu phải ít nhất 6 ký tự.";
            shake.push("password");
        }

        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
            shake.push("confirmPassword");
        }

        if (!formData.agree) {
            newErrors.agree = "Bạn cần đồng ý với điều khoản.";
            shake.push("agree");
        }

        setShakeFields(shake);
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            if (newErrors.name) nameRef.current.focus();
            else if (newErrors.email) emailRef.current.focus();
            else if (newErrors.password) passwordRef.current.focus();
            else if (newErrors.confirmPassword) confirmPasswordRef.current.focus();
            else if (newErrors.agree) agreeRef.current.focus();


            setTimeout(() => setShakeFields([]), 500);
        } else {
            console.log("Dữ liệu hợp lệ:", formData);
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
                <div className="w-1/2 flex justify-center items-center p-6">
                    <img src={bowl} alt="Fruit Bowl" className="max-w-[80%] md:max-w-[70%]" />
                </div>

                <div className="w-1/2 flex justify-center items-center p-6">
                    <div className="w-full max-w-md">
                        <h2 className="text-3xl font-bold text-black mb-6 text-center">Tạo tài khoản mới</h2>

                        <form className="space-y-4 flex flex-col" onSubmit={handleSubmit}>
                            <div>
                                <input
                                    ref={nameRef}
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Họ tên"
                                    className={`w-full px-4 py-3 rounded-lg bg-white/90 border transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
                                        errors.name ? 'border-red-500' : 'border-gray-300'
                                    } ${shakeFields.includes("name") ? "animate-shake" : ""}`}
                                />
                                {errors.name && <p className="text-red-600 text-xs italic ml-2 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <input
                                    ref={emailRef}
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className={`w-full px-4 py-3 rounded-lg bg-white/90 border transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    } ${shakeFields.includes("email") ? "animate-shake" : ""}`}
                                />
                                {errors.email && <p className="text-red-600 text-xs italic ml-2 mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <input
                                    ref={passwordRef}
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Mật khẩu"
                                    className={`w-full px-4 py-3 rounded-lg bg-white/90 border transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
                                        errors.password ? 'border-red-500' : 'border-gray-300'
                                    } ${shakeFields.includes("password") ? "animate-shake" : ""}`}
                                />
                                {errors.password && <p className="text-red-600 text-xs italic ml-2 mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <input
                                    ref={confirmPasswordRef}
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Xác nhận mật khẩu"
                                    className={`w-full px-4 py-3 rounded-lg bg-white/90 border transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
                                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                    } ${shakeFields.includes("confirmPassword") ? "animate-shake" : ""}`}
                                />
                                {errors.confirmPassword && <p className="text-red-600 text-xs italic ml-2 mt-1">{errors.confirmPassword}</p>}
                            </div>

                            <div className="flex items-center space-x-2 mt-1 ml-1 self-start">
                                <input
                                    ref={agreeRef}
                                    type="checkbox"
                                    id="agree"
                                    name="agree"
                                    checked={formData.agree}
                                    onChange={handleChange}
                                    className={`form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out border rounded ${
                                        errors.agree ? 'border-red-500' : 'border-gray-300'
                                    } ${shakeFields.includes("agree") ? "animate-shake" : ""} focus:ring-blue-500`}
                                />
                                <label htmlFor="agree" className="text-sm text-gray-700 select-none">
                                    Tôi đồng ý với các điều khoản của SHISHA
                                </label>
                            </div>
                            {errors.agree && <p className="text-red-600 text-xs italic ml-2 -mt-3">{errors.agree}</p>}

                            <button
                                type="submit"
                                className="w-full bg-[#04043F] hover:bg-[#1a1a5f] text-white py-3 rounded-lg font-semibold mt-6 transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
                            >
                                Đăng ký
                            </button>
                        </form>

                        <p className="text-sm text-center text-gray-600 mt-6">
                            Bạn đã có tài khoản?{" "}
                            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium transition duration-300 ease-in-out">
                                Đăng nhập ngay
                            </Link>
                        </p>

                        <div className="flex items-center my-6">
                            <hr className="flex-grow border-gray-300" />
                            <span className="mx-4 text-sm text-gray-500 font-medium">Hoặc tiếp tục với</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>

                        <div className="flex justify-center items-center gap-5">
                            <button className="w-11 h-11 rounded-full border border-gray-200 hover:bg-gray-100 flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-110 shadow-sm">
                                <img
                                    className="w-6 h-6"
                                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                                    alt="Google"
                                />
                            </button>
                            <button className="w-11 h-11 rounded-full border border-gray-200 hover:bg-gray-100 flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-110 shadow-sm">
                                <img
                                    className="w-6 h-6"
                                    src="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg"
                                    alt="Facebook"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
