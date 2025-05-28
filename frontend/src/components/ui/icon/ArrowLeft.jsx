import React from "react";
import arrowLeftImage from "../../../assets/Home/Polygon 2.png";

const ArrowLeft = ({ className, size = 24, ...props }) => {
  return (
    <img
      src={arrowLeftImage}
      alt="Arrow Left"
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );
};

export default ArrowLeft;