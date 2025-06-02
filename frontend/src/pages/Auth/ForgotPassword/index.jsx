import React, { useState, useRef } from 'react';
import bgImage from '../../../assets/images/forgot-password/background.png'; 
import bowl from '../../../assets/images/forgot-password/bowl.png';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.svg';
import { forgotPassword, confirmOtp, resetPassword } from '../../../services/userService';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('enterEmail'); 
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errors, setErrors] = useState({});
    const [shakeFields, setShakeFields] = useState([]); 
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);

    const emailRef = useRef(null);
    const otpRef = useRef(null);
    const newPasswordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (errors.email) setErrors(prev => ({ ...prev, email: null }));
        setMessage('');
        setErrorMessage('');
    };

    const validateEmail = () => {
        const newErrors = {};
        let shake = [];
        if (!email.trim()) {
            newErrors.email = "Vui lòng nhập email.";
            shake.push('email');
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = "Email không hợp lệ.";
            shake.push('email');
        }
        setShakeFields(shake);
        return newErrors;
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setErrorMessage('');
        const validationErrors = validateEmail();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            emailRef.current.focus();
            setTimeout(() => setShakeFields([]), 500);
            return;
        }

        try {
            setIsLoading(true);
            await forgotPassword({ email });
            setMessage(`Mã OTP đã được gửi tới ${email}. Vui lòng kiểm tra và nhập vào bên dưới.`);
            setStep('enterOtp');
            setErrors({});
        } catch (error) {
            setErrorMessage(error?.response?.data?.error || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
        if (errors.otp) setErrors(prev => ({ ...prev, otp: null }));
        setErrorMessage('');
    };

    const validateOtp = () => { 
        const newErrors = {};
        let shake = [];
        if (!otp.trim()) {
            newErrors.otp = "Vui lòng nhập mã OTP.";
            shake.push('otp');
        } else if (!/^\d{6}$/.test(otp)) {
             newErrors.otp = "Mã OTP phải gồm 6 chữ số.";
             shake.push('otp');
        }
        setShakeFields(shake);
        return newErrors;
    };

    const handleOtpSubmit = async (e) => { 
        e.preventDefault();
        setMessage('');
        setErrorMessage('');
        const validationErrors = validateOtp();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            otpRef.current.focus();
            setTimeout(() => setShakeFields([]), 500);
            return;
        }

        try {
            setIsLoading(true);
            await confirmOtp({ email, otp });
            setStep('enterNewPassword');
            setMessage('Mã OTP chính xác. Vui lòng nhập mật khẩu mới.');
            setErrors({});
        } catch (error) {
            setErrorMessage(error?.response?.data?.error || 'Mã OTP không chính xác. Vui lòng thử lại.');
            setErrors({ otp: 'Mã OTP không chính xác.' });
            setShakeFields(['otp']);
            otpRef.current.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
        if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: null }));
        setErrorMessage('');
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: null }));
        setErrorMessage('');
    };

    const validateNewPassword = () => {
        const newErrors = {};
        let shake = [];
        if (!newPassword) {
            newErrors.newPassword = "Vui lòng nhập mật khẩu mới.";
            shake.push('newPassword');
        } else if (newPassword.length < 6) {
            newErrors.newPassword = "Mật khẩu mới phải ít nhất 6 ký tự.";
            shake.push('newPassword');
        }
        if (confirmPassword !== newPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
            shake.push('confirmPassword');
        }
        setShakeFields(shake);
        return newErrors;
    };

    const handlePasswordResetSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setErrorMessage('');
        const validationErrors = validateNewPassword();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            if (validationErrors.newPassword) newPasswordRef.current.focus();
            else if (validationErrors.confirmPassword) confirmPasswordRef.current.focus();
            setTimeout(() => setShakeFields([]), 500);
            return;
        }

        try {
            setIsLoading(true);
            await resetPassword({ email, newPassword });
            setStep('success');
            setMessage('Mật khẩu của bạn đã được đặt lại thành công!');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setErrorMessage(error?.response?.data?.error || 'Có lỗi xảy ra. Vui lòng thử lại.');
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

                        {step === 'enterEmail' && (
                            <>
                                <h2 className="text-3xl font-bold text-black mb-6 text-center">Quên Mật Khẩu</h2>
                                <p className="text-center text-gray-600 mb-6 text-sm">
                                    Nhập địa chỉ email đã đăng ký của bạn. Chúng tôi sẽ gửi mã OTP để xác thực.
                                </p>
                                {errorMessage && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                        <span className="block sm:inline">{errorMessage}</span>
                                    </div>
                                )}
                                <form className="space-y-4 flex flex-col mb-6" onSubmit={handleEmailSubmit}>
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className={`w-full px-4 py-3 rounded-lg bg-white/90 border transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
                                                errors.email ? 'border-red-500' : 'border-gray-300'
                                            } ${shakeFields.includes('email') ? "animate-shake" : ""}`}
                                            name="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            ref={emailRef}
                                            disabled={isLoading}
                                        />
                                        {errors.email && <p className="text-red-600 text-xs italic ml-2 mt-1">{errors.email}</p>}
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white py-3 rounded-lg font-semibold mt-6 transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Đang gửi...' : 'Gửi Mã OTP'}
                                    </button>
                                </form>
                                <p className="text-sm text-center text-gray-600 mt-6">
                                    <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium transition duration-300 ease-in-out">
                                        Quay lại Đăng nhập
                                    </Link>
                                </p>
                            </>
                        )}

                        {step === 'enterOtp' && (
                            <>
                                <h2 className="text-3xl font-bold text-black mb-6 text-center">Xác Nhận Mã OTP</h2>
                                {message && (
                                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">
                                        <span className="block sm:inline">{message}</span>
                                    </div>
                                )}
                                {errorMessage && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                        <span className="block sm:inline">{errorMessage}</span>
                                    </div>
                                )}
                                <form className="space-y-4 flex flex-col mb-6" onSubmit={handleOtpSubmit}>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Mã OTP (6 chữ số)"
                                            maxLength={6}
                                            className={`w-full px-4 py-3 rounded-lg bg-white/90 border transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
                                                errors.otp ? 'border-red-500' : 'border-gray-300'
                                            } ${shakeFields.includes('otp') ? "animate-shake" : ""}`}
                                            name="otp"
                                            value={otp}
                                            onChange={handleOtpChange}
                                            ref={otpRef}
                                            disabled={isLoading}
                                        />
                                        {errors.otp && <p className="text-red-600 text-xs italic ml-2 mt-1">{errors.otp}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white py-3 rounded-lg font-semibold mt-6 transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Đang xác thực...' : 'Xác Nhận OTP'}
                                    </button>
                                </form>
                                <p className="text-sm text-center text-gray-600 mt-6">
                                    <button 
                                        onClick={() => setStep('enterEmail')} 
                                        className="text-blue-600 hover:text-blue-800 font-medium transition duration-300 ease-in-out"
                                        disabled={isLoading}
                                    >
                                        Nhập lại Email?
                                    </button>
                                </p>
                            </>
                        )}

                        {step === 'enterNewPassword' && (
                            <>
                                <h2 className="text-3xl font-bold text-black mb-6 text-center">Đặt Lại Mật Khẩu</h2>
                                {message && (
                                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">
                                        <span className="block sm:inline">{message}</span>
                                    </div>
                                )}
                                {errorMessage && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                        <span className="block sm:inline">{errorMessage}</span>
                                    </div>
                                )}
                                <form className="space-y-4 flex flex-col mb-6" onSubmit={handlePasswordResetSubmit}>
                                    <div>
                                        <input
                                            type="password"
                                            placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
                                            className={`w-full px-4 py-3 rounded-lg bg-white/90 border transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
                                                errors.newPassword ? 'border-red-500' : 'border-gray-300'
                                            } ${shakeFields.includes('newPassword') ? "animate-shake" : ""}`}
                                            name="newPassword"
                                            value={newPassword}
                                            onChange={handleNewPasswordChange}
                                            ref={newPasswordRef}
                                            disabled={isLoading}
                                        />
                                        {errors.newPassword && <p className="text-red-600 text-xs italic ml-2 mt-1">{errors.newPassword}</p>}
                                    </div>
                                    <div>
                                        <input
                                            type="password"
                                            placeholder="Xác nhận mật khẩu mới"
                                            className={`w-full px-4 py-3 rounded-lg bg-white/90 border transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${
                                                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                            } ${shakeFields.includes('confirmPassword') ? "animate-shake" : ""}`}
                                            name="confirmPassword"
                                            value={confirmPassword}
                                            onChange={handleConfirmPasswordChange}
                                            ref={confirmPasswordRef}
                                            disabled={isLoading}
                                        />
                                        {errors.confirmPassword && <p className="text-red-600 text-xs italic ml-2 mt-1">{errors.confirmPassword}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white py-3 rounded-lg font-semibold mt-6 transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Đang xử lý...' : 'Xác Nhận và Đặt Lại Mật Khẩu'}
                                    </button>
                                </form>
                                <p className="text-sm text-center text-gray-600 mt-6">
                                    <button 
                                        onClick={() => setStep('enterEmail')} 
                                        className="text-blue-600 hover:text-blue-800 font-medium transition duration-300 ease-in-out"
                                        disabled={isLoading}
                                    >
                                        Bắt đầu lại?
                                    </button>
                                </p>
                            </>
                        )}

                        {step === 'success' && (
                            <>
                                <h2 className="text-3xl font-bold text-black mb-6 text-center">Thành Công!</h2>
                                {message && (
                                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                                        <span className="block sm:inline">{message}</span>
                                    </div>
                                )}
                                <p className="text-sm text-center text-gray-600 mt-6">
                                    <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium transition duration-300 ease-in-out">
                                        Quay lại Đăng nhập
                                    </Link>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
