import React from "react";
import contact from "../../../assets/Home/Contact.png";
import appStore from "../../../assets/Home/AppStore.png";
import googlePlay from "../../../assets/Home/GooglePlay.png";

const Contact = () => {
  return (
    <div className="relative mt-[10px]]">
      <img src={contact} alt="" />
      <div className="max-w-[600px] absolute top-2 bottom-0 right-0 left-0 mx-auto text-center">
        <h2 className="mt-[40px] text-[35px] font-bold">
          Deliciousness to your inbox
        </h2>
        <p className="mt-[10px] text-[18px]">
          Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqut enim ad minim{" "}
        </p>
        <div className="flex justify-center items-center gap-4 mt-[40px] cursor-pointer">
          <img src={googlePlay} alt="" />
          <img src={appStore} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
