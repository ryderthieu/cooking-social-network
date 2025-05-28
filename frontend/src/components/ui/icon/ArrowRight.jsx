import React from "react";
import arrowRightImage from "../../../assets/Home/Polygon 3.png";

const ArrowRight = ({ className, size = 20, ...props }) => {
  return (
    <img
      src={arrowRightImage}
      alt="Arrow Right"
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );
};

export default ArrowRight;