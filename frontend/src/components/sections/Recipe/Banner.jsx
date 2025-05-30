import React from "react";
import { Link } from "react-router-dom";
import {Backgrounds} from '../../../assets/Recipe/images'

export default function Banner() {
  return (
    <div className="w-full h-screen flex justify-center overflow-hidden">
      <div className="container mx-auto relative">
        {/* Decorative gradient circle */}
        <div className="absolute size-60 rounded-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 opacity-50 bg-gradient-to-tr from-yellow-400 via-orange-400 to-yellow-300 blur-lg shadow-[0_10px_30px_rgba(255,214,107, 0.5)]"></div>
        {/* Main banner with gradient background */}
        <div className="w-[85%] h-[60%] bg-gradient-to-r from-[#FF9D6C] to-[#ffd66b] px-12 py-10 rounded-[50px] mx-auto flex flex-col relative">
          <nav className="flex items-center" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center ">
                <Link
                  to="/"
                  className="text-gray-800 hover:text-gray-900 font-bold"
                >
                  Oshisha
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-800">&gt;</span>
                  <Link
                    to="/categories"
                    className="text-gray-800 hover:text-gray-900 font-bold"
                  >
                    Khám phá công thức
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-800">&gt;</span>
                  <span className="text-gray-800 font-bold">Ăn kiêng</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-center text-1em sm:text-[2em] md:text-[3em] right-30 text-white font-black pt-10">
            Khám phá công thức
          </h1>
        </div>
        {/* Main content card */}{" "}
        <div className="absolute w-[75%] left-1/2 transform -translate-x-1/2 top-[12em] rounded-[30px] p-8 z-20">
        <img src={Backgrounds.BannerGreen} alt="" />
          <div className="flex items-center justify-between h-full">
            {/* Left side content */}
            <div className="max-w-md">
              <h2 className="text-3xl font-bold text-[#2D3748] mb-3">
                Ăn kiêng
              </h2>
              <p className="text-gray-700">
                Whether you're feeling indulgent or healthy, we have the best
                snack recipe ideas for you.
              </p>
            </div>

            {/* Right side with image and circle */}
            <div className="relative">
              {/* Circle outline */}
              <div className="w-64 h-64 rounded-full border-2 border-[#E8DBC5]"></div>

              {/* Main image */}
              <img
                src="/images/fruit-bowl.png"
                alt="Colorful fruit bowl"
                className="w-60 h-60 object-cover rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </div>

          {/* Bottom glow effect */}
          <div className="absolute -bottom-5 left-0 right-0 h-10 bg-gradient-to-t from-[#FFDA9E] to-transparent opacity-30 blur-lg rounded-b-[30px]"></div>
        </div>
      </div>
    </div>
  );
}
