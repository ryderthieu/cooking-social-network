import { useState } from "react";
import BunQuay from "../../../assets/Home/Bunquay.png";

const VideoShorts = () => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  return (
    <div className="bg-white mx-[120px] p-4 mt-10">
      <div className="flex flex-row gap-6">
        {/* Left side - Main content */}
        <div className="md:w-[55%] relative">
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={BunQuay}
              alt="Bún quậy"
              className="w-full object-contain h-[600px] rounded-lg shadow-lg"
            />

            {/* User info overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm p-3 text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                <span className="font-medium text-sm">@Kenhlediem</span>
                <button className="ml-auto bg-transparent border border-white text-white text-xs px-3 py-1 rounded-full">
                  Đăng ký
                </button>
              </div>
              <p className="text-xs mt-2">
                Dạ đây là cách nấu bún quậy của ba Dì ruột ế đó rất là ngon
                luôn@Kenhlediem
              </p>
            </div>

            {/* Interaction buttons on right side */}
            <div className="absolute right-3 top-1/3 flex flex-col items-center gap-1">
              <button
                onClick={handleLike}
                className="w-9 h-9 flex items-center justify-center bg-black/30 rounded-full"
              >
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                </svg>
              </button>
              <span className="text-white text-xs">26 N</span>

              <button
                onClick={handleDislike}
                className="w-9 h-9 flex items-center justify-center bg-black/30 rounded-full mt-3"
              >
                <svg
                  className="w-5 h-5 text-white transform rotate-180"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                </svg>
              </button>
              <span className="text-white text-xs">Không ...</span>

              <button className="w-9 h-9 flex items-center justify-center bg-black/30 rounded-full mt-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </button>
              <span className="text-white text-xs">201</span>

              <button className="w-9 h-9 flex items-center justify-center bg-black/30 rounded-full mt-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
              </button>
              <span className="text-white text-xs">Chia sẻ</span>

              <button className="w-9 h-9 flex items-center justify-center bg-black/30 rounded-full mt-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right side - Content */}
        <div className="md:w-[45%] ml-[30px]">
          <h2 className="text-[22px] font-bold mb-6">
            Một cú lướt
            <br />
            Ngàn cảm hứng nấu ăn!
          </h2>

          {/* Video thumbnails */}
          <div className="space-y-4">
            {/* Video 1 */}
            <div className="flex gap-3">
              <div className="relative">
                <img
                  src="/placeholder.svg?height=120&width=120"
                  alt="Thịt heo chiên"
                  className="w-[120px] h-[120px] object-cover rounded-lg"
                />
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                  120K
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium">
                  Thịt heo chiên sốt chua ngọt...
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                  <p className="text-xs text-gray-600">tugialam.2...</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">2024-3-5</p>
              </div>
            </div>

            {/* Video 2 */}
            <div className="flex gap-3">
              <div className="relative">
                <img
                  src="/placeholder.svg?height=120&width=120"
                  alt="Gà rang bơ tỏi"
                  className="w-[120px] h-[120px] object-cover rounded-lg"
                />
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                  71.5K
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium">
                  Gà rang bơ tỏi. Quá dễ để chế...
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                  <p className="text-xs text-gray-600">sammy.beo...</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">2024-3-9</p>
              </div>
            </div>

            {/* Video 3 */}
            <div className="flex gap-3">
              <div className="relative">
                <img
                  src="/placeholder.svg?height=120&width=120"
                  alt="Bún mắn nghĩ"
                  className="w-[120px] h-[120px] object-cover rounded-lg"
                />
                <div className="absolute top-1 right-1 bg-orange-500 text-white text-xs px-1 py-0.5 rounded">
                  Đặc sắc
                </div>
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                  351.7K
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium">
                  Bún mắn nghĩ ra món tôm chả...
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                  <p className="text-xs text-gray-600">anphucho.30</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">2024-7-3</p>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="mt-8">
            <h3 className="text-base font-semibold mb-4">
              Hàng ngàn video hấp dẫn khác
              <br />
              đang chờ bạn
            </h3>
            <div className="flex items-center">
              <span className="text-pink-500 font-medium">Xem ngay</span>
              <div className="ml-4 relative">
                <div className="w-24 h-0.5 bg-gradient-to-r from-transparent to-pink-500"></div>
                <svg
                  className="absolute -right-1 -top-2 w-5 h-5 text-pink-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoShorts;
