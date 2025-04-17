import React from "react";
import BS from "../../../assets/Home/BuaSang.png";
import MC from "../../../assets/Home/MC.png";
import Banh from "../../../assets/Home/Banh.png";
import Sua from "../../../assets/Home/Sua.png";
import TM from "../../../assets/Home/TM.png";
import Thit from "../../../assets/Home/Thit.png";

const Menu = () => {
  return (
    <div className="grid grid-cols-6 gap-1 place-items-center mb-[60px]">
      <div className="bg-gradient-to-b from-white to-[#d9dbd3] w-[180px] p-4 rounded-[30px]">
        <img className="mx-auto" src={BS} alt="" />
        <p className="font-semibold text-center mt-[40px] text-[18px]">
          Bữa sáng
        </p>
      </div>

      <div className="bg-gradient-to-b from-white to-[#d4f1c6] w-[180px] p-4 rounded-[30px]">
        <img className="mx-auto" src={MC} alt="" />
        <p className="font-semibold text-center mt-[40px] text-[18px]">
          Món chay
        </p>
      </div>

      <div className="bg-gradient-to-b from-white to-[#f4c9c5] w-[180px] p-4 rounded-[30px]">
        <img className="mx-auto" src={Thit} alt="" />
        <p className="font-semibold text-center mt-[40px] text-[18px]">
          Bữa trưa
        </p>
      </div>

      <div className="bg-gradient-to-b from-white to-[#ffdb97] w-[180px] p-4 rounded-[30px]">
        <img className="mx-auto" src={TM} alt="" />
        <p className="font-semibold text-center mt-[40px] text-[18px]">
          Tráng miệng
        </p>
      </div>

      <div className="bg-gradient-to-b from-white to-[#dfc6a8] w-[180px] p-4 rounded-[30px]">
        <img className="mx-auto" src={Banh} alt="" />
        <p className="font-semibold text-center mt-[40px] text-[18px]">
          Ăn vặt
        </p>
      </div>

      <div className="bg-gradient-to-b from-white to-[#c9daea] w-[180px] p-4 rounded-[30px]">
        <img className="mx-auto" src={Sua} alt="" />
        <p className="font-semibold text-center -mt-1 text-[18px]">Thức uống</p>
      </div>
    </div>
  );
};

export default Menu;
