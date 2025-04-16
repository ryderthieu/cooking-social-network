import React from 'react'
import bgImage from '../../../assets/images/login/background.png'
import bowl from '../../../assets/images/login/bowl.png'

const Login = () => {
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
                        <h2 className="text-3xl font-bold text-black mb-6 text-center">Đăng nhập</h2>

                        <button className="w-full bg-[#DB4437] hover:bg-red-600 text-white py-3 rounded-[30px] font-semibold my-4">
                            Tiếp tục với Google
                        </button>
                        <button className="w-full bg-[#3D538F] hover:bg-blue-800 text-white py-3 rounded-[30px] font-semibold">
                            Tiếp tục với Facebook
                        </button>

                        <div className="flex items-center my-4">
                            <hr className="flex-grow border-gray-300" />
                            <span className="mx-3 text-gray-500">Hoặc</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>

                        <form className="space-y-4 items-center justify-center flex flex-col ">
                            <input
                                type="text"
                                placeholder="Email"
                                className="w-full px-4 py-3 rounded-[30px] bg-white/80 shadow-sm border border-gray-200 focus:outline-none"
                            />
                            <input
                                type="password"
                                placeholder="Mật khẩu"
                                className="w-full px-4 py-3 rounded-[30px] bg-white/80 shadow-sm border border-gray-200 focus:outline-none"
                            />
                            <p className="mx-3 text-gray-500 self-end italic font-light">Quên mật khẩu?</p>
                            <button className="w-full bg-[#04043F] hover:bg-[#000050] text-white py-3 rounded-[30px] font-bold mt-4">
                                Đăng nhập
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
