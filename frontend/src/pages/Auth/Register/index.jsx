import React from 'react'
import bgImage from '../../../assets/images/register/background.png'
import bowl from '../../../assets/images/register/bowl.png'

const Register = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#FFC369] to-[#FFFAF1]">

            <div
                className="w-full max-w-6xl flex flex-row rounded-3xl shadow-2xl overflow-hidden border border-white/30 p-6 gap-5"
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
                        <h2 className="text-3xl font-bold text-black mb-6 text-center">Đăng ký</h2>

                        <form className="space-y-4 items-center justify-center flex flex-col ">
                            <input
                                type="text"
                                placeholder="Số di động hoặc email"
                                className="w-full px-4 py-3 rounded-[30px] bg-white/80 shadow-sm border border-gray-200 focus:outline-none"
                            />
                            <input
                                type="password"
                                placeholder="Mật khẩu"
                                className="w-full px-4 py-3 rounded-[30px] bg-white/80 shadow-sm border border-gray-200 focus:outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Tên người dùng"
                                className="w-full px-4 py-3 rounded-[30px] bg-white/80 shadow-sm border border-gray-200 focus:outline-none"
                            />
                            <div className="flex items-center space-x-2 mt-2 ml-2 self-start">
                                <input type="checkbox" id="agree" className="w-4 h-4" />
                                <label htmlFor="agree" className="text-sm text-gray-700">
                                    Tôi đồng ý với các điều khoản của SHISHA
                                </label>
                            </div>
                            <div className="flex items-center my-4">
                                <hr className="flex-grow border-gray-300" />
                                <span className="mx-3 text-gray-500">Hoặc</span>
                                <hr className="flex-grow border-gray-300" />
                            </div>

                            <button className="w-full bg-[#DB4437] hover:bg-red-600 text-white py-3 rounded-[30px] font-semibold">
                                Tiếp tục với Google
                            </button>
                            <button className="w-full bg-[#3D538F] hover:bg-blue-800 text-white py-3 rounded-[30px] font-semibold">
                                Tiếp tục với Facebook
                            </button>

                            <button className="w-full bg-[#04043F] hover:bg-[#000050] text-white py-3 rounded-[30px] font-bold mt-4">
                                Đăng ký
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
