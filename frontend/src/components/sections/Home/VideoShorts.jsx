import React from "react";
import video from "../../../assets/Home/video.mp4";
const VideoShorts = () => {
  return (
    <div>
      <div>
        <video src={video} className="w-[600px] h-[400px] "></video>

        <div>icon</div>
      </div>
      <div>
        <h2>
          Một cú lướt <br />
          Ngàn cảm hứng nấu ăn!
        </h2>
        <div></div>
        <div>
          <h2>Hàng ngàn video hấp dẫn khác đang chờ bạn</h2>
          <div>
            <p>Xem ngay</p>
          </div>
          icon
        </div>
      </div>
    </div>
  );
};

export default VideoShorts;
