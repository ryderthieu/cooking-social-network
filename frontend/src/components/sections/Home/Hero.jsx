import cmnt2 from "../../../assets/About/cmnt2.jpg";
const Hero = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl mx-6 mt-6 px-[90px]">
      <div
        className="relative rounded-2xl overflow-hidden px-[40px]"
        style={{
          background: "linear-gradient(135deg, #fb923c 0%, #ec4899 100%)",
        }}
      >
        <div className="relative z-10 px-12 md:py-10 text-center md:text-left md:flex md:items-center md:justify-between">
          <div className="md:w-[60%] mb-8 md:mb-0">
            <h1 className="text-3xl font-bold text-white mb-4 leading-[45px]">
              Khám phá công thức ngon <br />
              <span className="text-yellow-300">
                chia sẻ niềm vui nấu nướng
              </span>
            </h1>
            <p className="text-white/90 text-[17px] mb-6 max-w-md leading-7 text-justify">
              Nơi mỗi bữa ăn là một hành trình sáng tạo và gắn kết yêu thương.
              Từ những món ăn truyền thống đến công thức hiện đại, Oshisha giúp
              bạn dễ dàng vào bếp, kết nối với cộng đồng yêu ẩm thực và lan tỏa
              cảm hứng mỗi ngày.
            </p>
          </div>
          <div className="md:w-[40%] flex justify-center md:justify-end">
            <img
              src={cmnt2}
              alt="Món ăn đặc sắc"
              className="rounded-xl shadow-lg w-full h-auto max-w-xs md:max-w-md"
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
