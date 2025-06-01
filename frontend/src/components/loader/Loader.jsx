import React from "react";

const Loader = () => {
  return (
    <div className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-amber-300 mb-4"></div>
        <div className="h-4 w-32 bg-amber-200 rounded mb-2"></div>
        <div className="h-3 w-24 bg-amber-100 rounded"></div>
      </div>
    </div>
  );
};

export default Loader;
