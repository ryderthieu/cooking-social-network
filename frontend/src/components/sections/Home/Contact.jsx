import { useState, useEffect } from "react";
import {
  Mail,
  User,
  Send,
  Gift,
  X,
  Check,
  Bell,
  Sparkles,
  Phone,
  Clock,
} from "lucide-react";

export default function Contact() {
  // State management
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [formErrors, setFormErrors] = useState({});

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

    // Simulate API call
    setTimeout(() => {
      console.log("Contact form submitted:", { name, email, message });
      setIsSubmitting(false);
      setName("");
      setEmail("");
      setMessage("");

      setSuccessMessage({
        type: "contact",
        message:
          "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.",
      });

      setTimeout(() => setSuccessMessage(null), 4000);
    }, 1000);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    const errors = validateForm("subscribe");
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubscribing(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Recipe subscription:", { subscribeEmail });
      setIsSubscribing(false);
      setSubscribeEmail("");

      setSuccessMessage({
        type: "subscribe",
        message:
          "Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi những công thức ngon nhất.",
      });

      setTimeout(() => setSuccessMessage(null), 4000);
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-200/20 to-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-amber-200/15 to-orange-200/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-100/10 to-amber-100/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto px-[100px] py-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-orange-200/50 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-700">
              Kết nối cùng chúng tôi
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kết nối với <span className="text-[#FFB800]">Oshisha</span>
          </h1>
          <p className="text-lg text-gray-600 mx-auto">
            Khám phá thế giới ẩm thực cùng chúng tôi và chia sẻ những công thức
            tuyệt vời
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="fixed top-6 right-6 z-50 max-w-sm">
            <div className="bg-white rounded-lg shadow-lg border border-green-200 p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {successMessage.message}
                </p>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#ffa200] rounded-lg flex items-center justify-center">
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
                className="w-full bg-[#ffa200] hover:bg-[#ff9900] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  <strong>Cam kết bảo mật:</strong> Chúng tôi tôn trọng quyền riêng tư của bạn và cam kết không chia sẻ
                  thông tin với bên thứ ba.
                </p>
              </div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-6">
            {/* Newsletter Banner */}
            <div className="bg-gradient-to-tr from-orange-500/80 to-yellow-400/70 rounded-2xl p-6 text-white">
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
                  className="w-full bg-white text-[#ff9500] px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
    </div>
  );
}
