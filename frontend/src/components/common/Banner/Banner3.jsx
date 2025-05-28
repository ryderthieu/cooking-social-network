import React from "react";
import traidep from "../../../assets/Home/park-bogum.png";

const Banner3 = () => {
  return (
    <div className="relative w-full h-[350px] md:h-[400px] rounded-3xl overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#E53DA2] to-[#F6DDB1]"></div>

      {/* Content Container */}
      <div className="relative h-full max-w-6xl mx-auto px-6 flex items-center">
        {/* Text Content */}
        <div className="w-full md:w-2/3 mr-4 h-[60%] text-white flex flex-col justify-start">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 tracking-[0.02em]">
            Hôm nay ăn gì
            <div className="h-2"></div>
            <span>Để <span className="text-rose-200">Oshisha</span> gợi ý !!</span>
          </h2>
          <p className="text-sm md:text-base opacity-90 max-w-lg mb-8">
            Không còn phải băn khoăn về thực đơn hằng ngày. 
            <span className="font-semibold text-pink-100"> Oshisha</span> sẽ gợi ý những công thức phù hợp với nguyên liệu bạn đang có!
          </p>

          <button className="max-w-[250px] bg-[#091054] hover:bg-[#080c35] transition-all text-white py-3 px-8 rounded-full font-medium transform hover:-translate-y-1 ease-in duration-300">
            TÌM HIỂU THÊM
          </button>
        </div>

        <div className="flex absolute -right-10 flex-col ">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="font-chango font-bold text-[100px] text-white/30"
            >
              OSHISHA
            </div>
          ))}
        </div>

        {/* Illustration Area */}
        <div className="hidden md:block absolute -right-20 top-1/2 transform -translate-y-[45%]">
          <img
            src={traidep}
            alt="Cute boy character"
            className="w-[680px] h-[680px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner3;
