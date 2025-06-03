import React, { useState, useRef, useEffect } from "react";
import bgImage from "../../../assets/images/register/background.png";
import bowl from "../../../assets/images/register/bowl.png";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.svg";
import { useAuth } from "../../../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
    const { register, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // Thêm state để theo dõi bước đăng ký
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        gender: "",
        birthDate: "",
        agree: false,
    });

    const [errors, setErrors] = useState({});
    const [shakeFields, setShakeFields] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    // Khai báo ref
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const birthDateRef = useRef(null);
    const agreeRef = useRef(null);

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setIsLoading(true);
            setApiError('');
            const result = await loginWithGoogle(credentialResponse.credential);
            if (result.success) {
                navigate('/');
            } else {
                setApiError(result.error);
            }
        } catch (error) {
            console.error('Google login error:', error);
            setApiError('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        setApiError('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const validateStep1 = () => {
        const newErrors = {};
        const shake = [];

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

        setShakeFields(shake);
        return newErrors;
    };

    const validateStep2 = () => {
        const newErrors = {};
        const shake = [];

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Vui lòng nhập họ.";
            shake.push("lastName");
        }

        if (!formData.firstName.trim()) {
            newErrors.firstName = "Vui lòng nhập tên.";
            shake.push("firstName");
        }

        if (!formData.gender) {
            newErrors.gender = "Vui lòng chọn giới tính.";
            shake.push("gender");
        }

        if (!formData.birthDate) {
            newErrors.birthDate = "Vui lòng chọn ngày sinh.";
            shake.push("birthDate");
        }

        if (!formData.agree) {
            newErrors.agree = "Bạn cần đồng ý với điều khoản.";
            shake.push("agree");
        }

        setShakeFields(shake);
        return newErrors;
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        const newErrors = validateStep1();
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setStep(2);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateStep2();
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const userData = {
                    email: formData.email,
                    password: formData.password,
                    lastName: formData.lastName,
                    firstName: formData.firstName,
                    gender: formData.gender,
                    birthday: formData.birthDate,
                };
                await register(userData);
                navigate("/login");
            } catch (error) {
                console.log(error);
            }
        }
    };

    const renderStep1 = () => (
        <form className="space-y-4 flex flex-col" onSubmit={handleNextStep}>
            <div>
                <input
                    ref={emailRef}
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    disabled={isLoading}
                    className={`w-full px-4 py-3 rounded-lg bg-white/90 border transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-sm ${errors.email ? "border-red-500" : "border-gray-300"} ${shakeFields.includes("email") ? "animate-shake" : ""}`}
                />
                {errors.email && (
                    <p className="text-red-600 text-xs italic ml-2 mt-1">
                        {errors.email}
                    </p>
                )}
            </div>

            <div>
                <input
                    ref={passwordRef}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mật khẩu"
                    disabled={isLoading}
                    className={`w-full px-4 py-3 rounded-lg bg-white/90 border transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-sm ${errors.password ? "border-red-500" : "border-gray-300"} ${shakeFields.includes("password") ? "animate-shake" : ""}`}
                />
                {errors.password && (
                    <p className="text-red-600 text-xs italic ml-2 mt-1">
                        {errors.password}
                    </p>
                )}
            </div>

            <div>
                <input
                    ref={confirmPasswordRef}
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Xác nhận mật khẩu"
                    disabled={isLoading}
                    className={`w-full px-4 py-3 rounded-lg bg-white/90 border transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-sm ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} ${shakeFields.includes("confirmPassword") ? "animate-shake" : ""}`}
                />
                {errors.confirmPassword && (
                    <p className="text-red-600 text-xs italic ml-2 mt-1">
                        {errors.confirmPassword}
                    </p>
                )}
            </div>

            <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white py-3 rounded-lg font-semibold mt-6 transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
                disabled={isLoading}
            >
                {isLoading ? "Đang xử lý..." : "Tiếp theo"}
            </button>
        </form>
    );

    const renderStep2 = () => (
        <form className="space-y-4 flex flex-col" onSubmit={handleSubmit}>
            <div className="flex gap-4">
                <div className="flex-1">
                    <input
                        ref={lastNameRef}
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Họ"
                        disabled={isLoading}
                        className={`w-full px-4 py-3 rounded-lg bg-white/90 border transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-sm ${errors.lastName ? "border-red-500" : "border-gray-300"} ${shakeFields.includes("lastName") ? "animate-shake" : ""}`}
                    />
                    {errors.lastName && (
                        <p className="text-red-600 text-xs italic ml-2 mt-1">
                            {errors.lastName}
                        </p>
                    )}
                </div>
                <div className="flex-1">
                    <input
                        ref={firstNameRef}
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Tên"
                        disabled={isLoading}
                        className={`w-full px-4 py-3 rounded-lg bg-white/90 border transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-sm ${errors.firstName ? "border-red-500" : "border-gray-300"} ${shakeFields.includes("firstName") ? "animate-shake" : ""}`}
                    />
                    {errors.firstName && (
                        <p className="text-red-600 text-xs italic ml-2 mt-1">
                            {errors.firstName}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 rounded-lg bg-white/90 border transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-sm ${errors.gender ? "border-red-500" : "border-gray-300"}`}
                >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="other">Khác</option>
                </select>
                {errors.gender && (
                    <p className="text-red-600 text-xs italic ml-2 mt-1">
                        {errors.gender}
                    </p>
                )}
            </div>

            <div>
                <input
                    ref={birthDateRef}
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full px-4 py-3 rounded-lg bg-white/90 border transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-sm ${errors.birthDate ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.birthDate && (
                    <p className="text-red-600 text-xs italic ml-2 mt-1">
                        {errors.birthDate}
                    </p>
                )}
            </div>

            <div className="flex items-center space-x-2 mt-1 ml-1 self-start">
                <input
                    ref={agreeRef}
                    type="checkbox"
                    id="agree"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`form-checkbox h-4 w-4 text-pink-600 transition duration-150 ease-in-out border rounded ${errors.agree ? "border-red-500" : "border-gray-300"} ${shakeFields.includes("agree") ? "animate-shake" : ""} focus:ring-pink-500`}
                />
                <label htmlFor="agree" className="text-sm text-gray-700 select-none">
                    Tôi đồng ý với các điều khoản của SHISHA
                </label>
            </div>
            {errors.agree && (
                <p className="text-red-600 text-xs italic ml-2 -mt-3">{errors.agree}</p>
            )}

            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/2 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg font-semibold mt-6 transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
                    disabled={isLoading}
                >
                    Quay lại
                </button>
                <button
                    type="submit"
                    className="w-1/2 bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white py-3 rounded-lg font-semibold mt-6 transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
                    disabled={isLoading}
                >
                    {isLoading ? "Đang xử lý..." : "Đăng ký"}
                </button>
            </div>
        </form>
    );

    return (
        <div className="min-h-screen flex items-center justify-center p-6 animated-bg">
            <div
                className="w-full max-w-6xl flex flex-row rounded-3xl shadow-2xl overflow-hidden border border-pink-200/30 p-6 gap-5 relative bg-gradient-to-br from-pink-50 to-orange-50"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="w-1/2 flex justify-center items-center p-6 ">
                    <img
                        src={bowl}
                        alt="Fruit Bowl"
                        className="max-w-[80%] md:max-w-[70%]"
                    />
                </div>

                <div className="w-1/2 flex justify-center items-center p-6  min-h-[610px]">
                    <div className="w-full max-w-md">
                        <h2 className="text-3xl font-bold text-black mb-6 text-center">
                            {step === 1 ? "Tạo tài khoản mới" : "Thông tin cá nhân"}
                        </h2>

                        {apiError && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                {apiError}
                            </div>
                        )}

                        <div className="flex flex-col">
                            {step === 1 ? renderStep1() : renderStep2()}
                        </div>

                        <p className="text-sm text-center text-gray-600 mt-6">
                            Bạn đã có tài khoản?{" "}
                            <Link
                                to="/login"
                                className="text-pink-600 hover:text-pink-800 font-medium transition duration-300 ease-in-out"
                            >
                                Đăng nhập ngay
                            </Link>
                        </p>

                        <div className="flex items-center my-6">
                            <hr className="flex-grow border-gray-300" />
                            <span className="mx-4 text-sm text-gray-500 font-medium">
                                Hoặc tiếp tục với
                            </span>
                            <hr className="flex-grow border-gray-300" />
                        </div>

                        <div className="flex justify-center items-center gap-5 mb-6">
                            <div>
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    useOneTap
                                    theme="outline"
                                    size="large"
                                    width="100%"
                                    locale="vi"
                                    text="continue_with"
                                    shape="rectangular"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
