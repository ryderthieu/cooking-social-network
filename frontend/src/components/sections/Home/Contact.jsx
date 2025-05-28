import React from "react";
import contact from "../../../assets/Home/Contact.png";
import appStore from "../../../assets/Home/AppStore.png";
import googlePlay from "../../../assets/Home/GooglePlay.png";

const Contact = () => {
  return (
    <div className="relative my-[40px] justify-center items-center flex mx-[110px]">
      <img className="w-[100%] h-[350px]" src={contact} alt="" />
      <div className="max-w-[600px] absolute top-2 bottom-0 right-0 left-0 mx-auto text-center">
        <h2 className="mt-[40px] text-[22px] font-bold">
          Liên hệ với chúng tôi để nhận thông tin mới nhất
        </h2>
        <p className="mt-[10px] text-[14px] leading-7">
          Chúng tôi luôn sẵn sàng lắng nghe ý kiến và phản hồi của bạn. Hãy để
          lại thông tin liên hệ của bạn để chúng tôi có thể gửi đến bạn những
          cập nhật mới nhất về sản phẩm, dịch vụ và các chương trình khuyến mãi
          hấp dẫn.
        </p>
        <div className="flex justify-center items-center gap-4 mt-[40px] cursor-pointer">
          <img className="w-[25%]" src={googlePlay} alt="" />
          <img className="w-[25%]" src={appStore} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
