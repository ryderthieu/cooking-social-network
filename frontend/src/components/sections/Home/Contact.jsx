import { useState } from "react";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Contact form submitted:", { name, email, message });
      setIsSubmitting(false);
      setName("");
      setEmail("");
      setMessage("");
      alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.");
    }, 1500);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsSubscribing(true);

    setTimeout(() => {
      console.log("Newsletter subscription:", subscribeEmail);
      setIsSubscribing(false);
      setSubscribeEmail("");
      alert("Cảm ơn bạn đã đăng ký nhận tin!");
    }, 1000);
  };

  return (
    <div className="w-full">
      {/* Newsletter Section - Matches the "Deliciousness to your inbox" section */}
      <section className="w-full py-10 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 flex items-center">
              <div className="relative">
                <img
                  src="/placeholder.svg?height=200&width=200"
                  alt="Fresh ingredients"
                  className="w-[200px] h-[200px] object-contain"
                />
                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4">
                  <img
                    src="/placeholder.svg?height=80&width=80"
                    alt="Herb decoration"
                    className="w-[80px] h-[80px] object-contain"
                  />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                  Deliciousness to your inbox
                </h3>
                <p className="text-gray-600 mb-4">
                  Đăng ký để nhận những công thức nấu ăn tuyệt vời và cập nhật
                  mới nhất từ Oshisha
                </p>
                <form onSubmit={handleSubscribe} className="flex">
                  <input
                    type="email"
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    placeholder="Email của bạn"
                    required
                    className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-r-md transition-colors duration-300"
                  >
                    {isSubscribing ? "Đang gửi..." : "Đăng ký"}
                  </button>
                </form>
              </div>
            </div>

            <div className="md:w-1/2">
              <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4">
                  Liên hệ với chúng tôi
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Họ và tên"
                      required
                      className="w-full px-4 py-2 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      required
                      className="w-full px-4 py-2 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                  <div className="mb-4">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Nội dung tin nhắn"
                      required
                      rows={3}
                      className="w-full px-4 py-2 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-pink-500 hover:bg-gray-100 font-medium px-4 py-2 rounded-md transition-colors duration-300"
                  >
                    {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
