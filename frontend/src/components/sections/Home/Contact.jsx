import { useState } from "react";
import { Send, Bell, Sparkles } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Contact() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  // Form validation
  const validateForm = (type) => {
    const errors = {};

    if (type === "contact") {
      if (!name.trim()) errors.name = "Vui lòng nhập họ tên";
      if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Email không hợp lệ";
      if (!message.trim()) errors.message = "Vui lòng nhập tin nhắn";
    } else if (type === "subscribe") {
      if (!/^\S+@\S+\.\S+$/.test(subscribeEmail))
        errors.subscribeEmail = "Email không hợp lệ";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm("contact");
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);

    const formData = {
      access_key: "ec50783c-36db-4d7d-82b7-f06c8d80ef67",
      name,
      email,
      message,
      subject: "Liên hệ từ Oshisha",
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Kết quả trả về:", data);
      if (data.success) {
        toast.success(
          "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể."
        );
        setName("");
        setEmail("");
        setMessage("");
        setFormErrors({});
      } else {
        toast.error("Gửi thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
      console.error("Lỗi khi gửi email: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    const errors = validateForm("subscribe");
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubscribing(true);

    const formData = {
      access_key: "ec50783c-36db-4d7d-82b7-f06c8d80ef67",
      email: subscribeEmail,
      subject: "Đăng ký nhận công thức mới",
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Kết quả trả về:", data);
      if (data.success) {
        toast.success(
          "Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi những công thức ngon nhất."
        );
        setSubscribeEmail("");
        setFormErrors({});
      } else {
        toast.error("Đăng ký thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-200/20 to-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-amber-200/15 to-orange-200/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-100/10 to-amber-100/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto px-[120px] py-10">
        {/* Header */}
        <div className="text-center mb-16">
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Kết nối với <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-transparent bg-clip-text">Oshisha</span>
          </h1>
          <p className="text-lg text-gray-600 mx-auto">
            Khám phá thế giới ẩm thực cùng chúng tôi và chia sẻ những công thức
            tuyệt vời
          </p>
        </div>
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-400 rounded-lg flex items-center justify-center">
                <Send className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Liên hệ với chúng tôi
                </h3>
                <p className="text-gray-600 text-sm">
                  Chia sẻ ý tưởng hoặc đặt câu hỏi
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (formErrors.name) {
                      setFormErrors({ ...formErrors, name: null });
                    }
                  }}
                  placeholder="Nguyễn Văn A"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-[#FFB800] transition-colors ${
                    formErrors.name
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formErrors.email) {
                      setFormErrors({ ...formErrors, email: null });
                    }
                  }}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-[#FFB800] transition-colors ${
                    formErrors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tin nhắn
                </label>
                <textarea
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (formErrors.message) {
                      setFormErrors({ ...formErrors, message: null });
                    }
                  }}
                  placeholder="Chia sẻ công thức hoặc đặt câu hỏi của bạn..."
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-[#FFB800] transition-colors resize-none ${
                    formErrors.message
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                {formErrors.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-tr from-rose-500 via-orange-500/80 to-yellow-400/70 hover:from-bg-[#ff9900] hover:to-bg-amber-200 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Gửi tin nhắn
                  </>
                )}
              </button>
            </form>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-orange-800 leading-relaxed">
                <strong>Cam kết bảo mật:</strong> Chúng tôi tôn trọng quyền
                riêng tư của bạn và cam kết không chia sẻ thông tin với bên thứ
                ba.
              </p>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-6">
            {/* Newsletter Banner */}
            <div className="bg-gradient-to-tr from-rose-400 via-orange-500/50 to-yellow-400/70 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    Nhận công thức mới mỗi tuần!
                  </h3>
                  <p className="text-white/90 text-sm">
                    Miễn phí và không spam
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  value={subscribeEmail}
                  onChange={(e) => {
                    setSubscribeEmail(e.target.value);
                    if (formErrors.subscribeEmail) {
                      setFormErrors({ ...formErrors, subscribeEmail: null });
                    }
                  }}
                  placeholder="Email của bạn"
                  className="w-full px-4 py-3 rounded-lg border-0 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                {formErrors.subscribeEmail && (
                  <p className="text-white/90 text-xs">
                    {formErrors.subscribeEmail}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full bg-white text-[black] px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubscribing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#FFB800] border-t-transparent"></div>
                  ) : (
                    "Đăng ký ngay"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
