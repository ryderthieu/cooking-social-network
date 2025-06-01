import React, { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import {
  editProfile,
  getUserInfo,
  resetPassword,
  forgotPassword,
  confirmOtp,
} from "@/services/UserService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AccountPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  useEffect(() => {
    getUserInfo()
      .then((response) => {
        const { firstName, lastName, email, avatar } = response.data;
        setForm({
          firstName: firstName || "",
          lastName: lastName || "",
          email: email || "",
          password: "",
        });
        setAvatar(avatar || "");
        setOriginalEmail(email || "");
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.email !== originalEmail || form.password) {
      try {
        await forgotPassword({ email: form.email });
        setShowOtp(true);
        setPendingData({ ...form });
        toast.info("Vui lòng kiểm tra email để lấy mã OTP xác nhận.");
      } catch (error) {
        toast.error("Không gửi được mã OTP. Vui lòng thử lại!");
      }
    } else {
      try {
        await editProfile({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
        });
        toast.success("Cập nhật thông tin thành công!");
      } catch (error) {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    }
  };

  const handleConfirmOtp = async (e) => {
    e.preventDefault();
    try {
      await confirmOtp({ email: pendingData.email, otp });
      await editProfile({
        firstName: pendingData.firstName,
        lastName: pendingData.lastName,
        email: pendingData.email,
      });
      if (pendingData.password) {
        await resetPassword({
          email: pendingData.email,
          newPassword: pendingData.password,
        });
      }
      toast.success("Cập nhật thông tin thành công!");
      setShowOtp(false);
      setOtp("");
      setPendingData(null);
      setForm((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      toast.error("OTP không đúng hoặc đã hết hạn!");
    }
  };

  return (
    <div className="px-[110px] bg-gray-100 h-screen">
      <div className="flex gap-4 pt-[30px]">
        <div className="bg-white rounded-md w-[70%] h-[600px]">
          <div className="relative p-4">
            <div className="w-full h-[250px] rounded-3xl bg-gradient-to-r from-amber-200 via-orange-200 to-yellow-200"></div>
            <div>
              <img
                src={avatar || "https://via.placeholder.com/140"}
                className="bg-black rounded-full w-[140px] h-[140px] absolute bottom-[-70px] left-[50px] border-4 border-white"
                alt="avatar"
              />
              <div className="flex items-center gap-4 absolute bottom-[-35px] left-[210px]">
                <h4 className="font-semibold text-[20px] text-gray-800">
                  {form.lastName} {form.firstName}
                </h4>
                <MdEdit className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="mt-[80px] mx-[40px] p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="lastName"
                    className="text-sm text-gray-600 mb-1"
                  >
                    Họ
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                    name="lastName"
                    className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#FF6363]"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="firstName"
                    className="text-sm text-gray-600 mb-1"
                  >
                    Tên
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={handleChange}
                    name="firstName"
                    className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#FF6363]"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="email" className="text-sm text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    name="email"
                    className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#FF6363]"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="password"
                    className="text-sm text-gray-600 mb-1"
                  >
                    Mật khẩu mới
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#FF6363]"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#FF6363] text-white px-6 py-2 rounded-md hover:opacity-90 transition"
                >
                  Chỉnh sửa
                </button>
              </div>
            </form>

            {showOtp && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <form
                  onSubmit={handleConfirmOtp}
                  className="bg-white p-6 rounded-xl shadow-2xl border w-full max-w-xs"
                >
                  <h4 className="font-semibold mb-2 text-center">
                    Nhập mã OTP đã gửi về email
                  </h4>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="border rounded-md p-2 w-full mb-4"
                    placeholder="Nhập mã OTP"
                  />
                  <button
                    type="submit"
                    className="bg-[#FF6363] text-white px-4 py-2 rounded w-full hover:opacity-90"
                  >
                    Xác nhận OTP
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
        <div className="w-[30%] rounded-md">
          <div className="bg-white h-[60%] mb-4 rounded-md">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Lịch sử cập nhật</h3>
              <p className="text-sm text-gray-600">
                Bạn có thể cập nhật thông tin cá nhân của mình tại đây.
              </p>
            </div>
          </div>
          <div className="bg-white h-[calc(40%-16px)] rounded-md">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Thông báo</h3>
              <p className="text-sm text-gray-600">
                Bạn có thể cập nhật thông tin cá nhân của mình tại đây.
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AccountPage;
