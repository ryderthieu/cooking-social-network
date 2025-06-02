import React from "react";
import { Link } from "react-router-dom";
import {Backgrounds} from '../../../assets/Recipe/images'

export default function Banner() {
  return (
   <div className="relative h-[580px] overflow-hidden mt-4">
        {/* BreadCrumb navigation */}
        {/* <div className="absolute top-4 left-4 z-40">
          <BreadCrumb />
        </div> */}
        
        {/* Gradient background layers */}
        <div className="absolute inset-0 bg-[#ffefd0]"></div>

        {/* Decorative raspberry (top right) */}
        <img
          src="https://pngimg.com/d/raspberry_PNG104.png"
          alt="Raspberry"
          className="absolute top-8 right-8 w-20 z-20"
        />

        {/* Decorative strawberry (bottom center) */}
        <img
          src="https://pngimg.com/d/strawberry_PNG2637.png"
          alt="Strawberry"
          className="absolute bottom-10 right-1/4 w-24 z-20"
          style={{ transform: "translateX(-50%)" }}
        />

        {/* Main content */}
        <div className="relative z-30 flex flex-row items-center justify-between h-full pl-[110px]">
          {/* Left text section */}
          <div className="max-w-lg">
            <h1 className="text-white text-5xl font-bold mb-2 flex items-center gap-2">
              {displayCategoryName}
            </h1>
            <h2 className="text-white text-4xl font-bold mb-4">{displayItemName.toUpperCase()}</h2>
            <p className="text-white/90 text-lg leading-relaxed mb-8">
              {categoryDescription}
            </p>
          </div>

          {/* Right smoothie bowl */}
          <div className="relative flex mr-[100px]">
            <img
              src="https://pngimg.com/d/smoothie_PNG18.png"
              alt="Smoothie Bowl"
              className="w-96 h-96 rounded-full shadow-2xl object-cover p-2 border-8 border-white"
            />
          </div>
        </div>

        {/* Big wavy shape top-left */}
        <div className="absolute -top-10 -left-5 z-0 pointer-events-none w-full h-full">
          <svg
            width="833"
            height="556"
            viewBox="0 0 833 556"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: "drop-shadow(0 8px 32px #FF6B8A55)" }}
          >
            <g filter="url(#filter0_d_66_4)">
              <path
                d="M0 539.311L1.23565 485.838C1.23565 485.838 0 575.741 0 539.311Z"
                fill="#FF6B8A50"
                fillOpacity="0.85"
              />
              <path
                d="M1.23545 0H644.343C644.343 0 858.4 69.2099 825.577 205.309C792.755 341.408 691.334 281.114 631.722 281.114C572.11 281.114 521.615 346.743 596.12 378.892C670.626 411.042 602.744 568.339 516.638 503.407C430.532 438.476 439.639 558.408 286.469 476.671C133.3 394.934 200.363 507.227 134.127 476.671C67.8915 446.115 60.44 550.769 0 539.311L1.23545 0Z"
                fill="#FF6B8A50"
                fillOpacity="0.85"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_66_4"
                x="-4"
                y="0"
                width="837"
                height="556"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_66_4"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_66_4"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>

        {/* Bottom ellipse */}
        <div className="absolute -bottom-40 -right-40 ">
          <svg
            width="512"
            height="405"
            viewBox="0 0 512 405"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_d_69_2)">
              <ellipse cx="305.5" cy="299" rx="296.5" ry="290" fill="#FF6B8A90" />
            </g>
            <defs>
              <filter
                id="filter0_d_69_2"
                x="0"
                y="0"
                width="603"
                height="590"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx="-4" dy="-4" />
                <feGaussianBlur stdDeviation="2.5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_69_2"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_69_2"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>
      </div>

  );
}
