import { useState, useRef, useEffect } from "react";
import GaNuongVid from "../../../assets/Home/videos/GaNuong.mp4";
import { GaNuong, video1, video2, video3 } from "../../../assets/Home";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const VideoShorts = () => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const { user } = useAuth();
  const isAuthenticated = !!user;

  // Hàm xử lý khi nhấn đăng nhập
  const handleLogin = () => {
    // Lưu lại URL hiện tại để sau khi đăng nhập có thể quay lại
    sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
    navigate("/login");
  };

  // Hàm xử lý tương tác
  const handleInteraction = (callback) => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!isAuthenticated) {
      setShowLoginModal(true);
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }
    callback();
  };

  const handleLike = () => {
    handleInteraction(() => {
      // Gọi API để lưu trạng thái like
      // axios.post('/api/videos/like', { videoId: videoId });

      setLiked(!liked);
      if (disliked) setDisliked(false);
    });
  };

  const handleDislike = () => {
    handleInteraction(() => {
      // Gọi API để lưu trạng thái dislike
      // axios.post('/api/videos/dislike', { videoId: videoId });

      setDisliked(!disliked);
      if (liked) setLiked(false);
    });
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Kiểm tra trạng thái like/dislike từ server khi component mount
  useEffect(() => {
    // Nếu đã đăng nhập, lấy thông tin tương tác của người dùng với video này
    if (isAuthenticated) {
      // Ví dụ call API:
      // axios.get(`/api/videos/interaction?videoId=${videoId}&userId=${user.id}`)
      //   .then(response => {
      //     if (response.data.liked) setLiked(true);
      //     if (response.data.disliked) setDisliked(true);
      //   })
      //   .catch(error => console.error("Error fetching interaction status:", error));
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    // Theo dõi thời gian video đã phát
    const handleTimeUpdate = () => {
      setVideoTime(video.currentTime);
      
      console.log("Video time:", video.currentTime, "isAuthenticated:", isAuthenticated);

      // Nếu chưa đăng nhập và đã xem được 10 giây
      if (
        !isAuthenticated &&
        video.currentTime >= 10 &&
        !showLoginModal
      ) {
        console.log("Dừng video vì chưa đăng nhập và đã xem 10 giây");
        video.pause();
        setIsPlaying(false);
        setShowLoginModal(true);
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [isAuthenticated, showLoginModal]);

  // Effect riêng để kiểm tra khi user thay đổi
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Nếu người dùng chưa đăng nhập và video đã phát quá 10 giây
    if (!isAuthenticated && video.currentTime >= 10 && !showLoginModal) {
      console.log("Dừng video vì chưa đăng nhập và đã xem 10 giây (effect)");
      video.pause();
      setIsPlaying(false);
      setShowLoginModal(true);
    }
  }, [user, isAuthenticated, showLoginModal]);

  return (
    <div className="mt-[100px]">
      <div className="flex flex-row gap-6">
        {/* Left side - Main content */}
        <div className="md:w-[45%] relative">
          <div
            className="relative rounded-3xl overflow-hidden group"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <video
              ref={videoRef}
              src={GaNuongVid}
              poster={GaNuong}
              className="w-full object-contain h-[600px] rounded-lg shadow-lg bg-black"
              onClick={togglePlayPause}
              muted={isMuted}
              loop
            />

            {/* Custom video controls */}
            <div
              className={`absolute inset-0 flex items-center justify-center ${
                showControls || !isPlaying ? "opacity-100" : "opacity-70"
              } transition-opacity duration-300 bg-black/20`}
            >
              <button
                onClick={togglePlayPause}
                className={`w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform transform ${
                  showControls
                    ? "scale-100"
                    : isPlaying
                    ? "scale-0"
                    : "scale-100"
                } hover:scale-110`}
              >
                {isPlaying ? (
                  <svg
                    className="w-8 h-8 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-8 h-8 text-white ml-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Progress bar at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-500/30">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-orange-500"
                style={{
                  width: `${
                    (videoTime / (videoRef.current?.duration || 1)) * 100
                  }%`,
                }}
              />
            </div>

            {/* User info overlay at bottom */}
            <div className="absolute bottom-1 left-0 right-0 bg-black/20 backdrop-blur-sm p-3 text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
                  <img
                    src="https://i.pravatar.cc/150?img=32"
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-medium text-sm">@KhuyenDuong</span>
                <button
                  onClick={() => handleInteraction(() => {})}
                  className="ml-auto bg-pink-500 hover:bg-pink-600 transition-colors text-white text-xs px-3 py-1 rounded-full"
                >
                  Theo dõi
                </button>
              </div>
              <p className="text-xs mt-2">
                Chị là chị thích ăn lẩu gà bình thuận nhưng cái này cũng được
                nha mấy em
              </p>
            </div>

            {/* Interaction buttons on right side */}
            <div className="absolute right-3 top-1/3 flex flex-col items-center">
              {/* Mute/Unmute button */}
              <button
                onClick={toggleMute}
                className={`w-9 h-9 flex items-center justify-center ${
                  isMuted ? "bg-red-500" : "bg-black/30"
                } rounded-full transition-colors hover:bg-red-500/70 mb-3`}
              >
                {isMuted ? (
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
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    />
                  </svg>
                ) : (
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
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                )}
              </button>

              <button
                onClick={handleLike}
                className={`w-9 h-9 flex items-center justify-center ${
                  liked ? "bg-pink-500" : "bg-black/30"
                } rounded-full transition-colors hover:bg-pink-500/70`}
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
                className={`w-9 h-9 flex items-center justify-center ${
                  disliked ? "bg-pink-500" : "bg-black/30"
                } rounded-full mt-3 transition-colors hover:bg-pink-500/70`}
              >
                <svg
                  className="w-5 h-5 text-white transform rotate-180"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                </svg>
              </button>
              <span className="text-white text-xs">12</span>

              <button
                onClick={() => handleInteraction(() => {})}
                className="w-9 h-9 flex items-center justify-center bg-black/30 hover:bg-pink-500/70 transition-colors rounded-full mt-3"
              >
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

              <button
                onClick={() => handleInteraction(() => {})}
                className="w-9 h-9 flex items-center justify-center bg-black/30 hover:bg-pink-500/70 transition-colors rounded-full mt-3"
              >
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

              <button
                onClick={() => handleInteraction(() => {})}
                className="w-9 h-9 flex items-center justify-center bg-black/30 hover:bg-pink-500/70 transition-colors rounded-full mt-3"
              >
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

            {/* Login modal */}
            {showLoginModal && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white rounded-xl p-6 max-w-md w-full">
                  <h3 className="text-lg font-bold text-gray-900">
                    Đăng nhập để tiếp tục xem
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Để xem toàn bộ video và có thể thích, bình luận, vui lòng đăng nhập hoặc
                    đăng ký tài khoản.
                  </p>
                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      onClick={handleLogin}
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 rounded-lg"
                    >
                      Đăng nhập
                    </button>
                    <button
                      onClick={() => setShowLoginModal(false)}
                      className="w-full border border-gray-300 text-gray-700 font-medium py-2 rounded-lg"
                    >
                      Đóng
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Chưa có tài khoản?{" "}
                    <a href="/register" className="text-pink-500">
                      Đăng ký ngay
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Content */}
        <div className="md:w-[55%] ml-[40px]">
          <h2 className="text-[28px] font-bold mb-4">
            Một cú lướt
            <br />
            Ngàn cảm hứng nấu ăn!
          </h2>

          {/* Video */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Video 1 */}
            <div className="rounded-md overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="relative">
                <img
                  src={video1}
                  alt="Thịt heo chiên sốt chua ngọt"
                  className="w-full h-56 object-cover"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-full">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>120K</span>
                </div>
              </div>
              <div className="px-2 py-1 text-gray-800">
                <h3 className="font-medium text-[13px] truncate whitespace-nowrap overflow-hidden">
                  Thịt heo chiên sốt chua chua ngọt ngọt
                </h3>
              </div>
              <div className="px-2 pb-2 flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-pink-500">
                  <img
                    src="https://i.pravatar.cc/150?img=12"
                    alt="vugialao"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-2">
                  <p className="text-xs font-semibold">vugialao</p>
                  <p className="text-xs text-gray-500">2024-5-5</p>
                </div>
              </div>
            </div>

            {/* Video 2 */}
            <div className="rounded-md overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="relative">
                <img
                  src={video2}
                  alt="Gà rang bơ tỏi"
                  className="w-full h-56 object-cover"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-full">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>71.3K</span>
                </div>
              </div>
              <div className="px-2 py-1 text-gray-800">
                <h3 className="font-medium text-[13px] truncate whitespace-nowrap overflow-hidden">
                  Thịt heo chiên sốt chua chua ngọt ngọt
                </h3>
              </div>
              <div className="px-2 pb-2 flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-pink-500">
                  <img
                    src="https://i.pravatar.cc/150?img=32"
                    alt="sammy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-2">
                  <p className="text-xs font-semibold">sammy.beo...</p>
                  <p className="text-xs text-gray-500">2024-9-9</p>
                </div>
              </div>
            </div>

            {/* Video 3 */}
            <div className="rounded-md overflow-hidden bg-gray-50 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="relative">
                <img
                  src={video3}
                  alt="Ba chỉ sốt tỏi"
                  className="w-full h-56 object-cover"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-full">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>351.2K</span>
                </div>
              </div>
              <div className="px-2 py-1 text-gray-800">
                <h3 className="font-medium text-[13px] truncate whitespace-nowrap overflow-hidden">
                  Thịt heo chiên sốt chua chua ngọt ngọt
                </h3>
              </div>
              <div className="px-2 pb-2 flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-pink-500 relative">
                  <img
                    src="https://i.pravatar.cc/150?img=57"
                    alt="genjadao"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full border border-white flex items-center justify-center">
                    <svg
                      className="w-2 h-2 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-2">
                  <p className="text-xs font-semibold flex items-center">
                    genjadao
                    <svg
                      className="w-3 h-3 ml-0.5 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </p>
                  <p className="text-xs text-gray-500">2024-7-5</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="mt-12">
            <h3 className="text-3xl font-semibold mb-4 bg-gradient-to-r from-pink-500 to-orange-500 text-transparent bg-clip-text">
              Hàng ngàn video hấp dẫn khác <br />
              đang chờ bạn
            </h3>
            <div className="flex items-center relative group cursor-pointer mt-2">
              <h4 className="bg-gradient-to-r from-orange-500 to-amber-500 text-transparent bg-clip-text text-2xl font-medium transition-colors relative">
                Xem ngay
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 group-hover:bg-pink-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </h4>

              <div className="mt-2 ml-4 relative ">
                <div className="w-[330px] h-[5px] bg-gradient-to-r from-transparent  to-pink-500 group-hover:to-pink-600 transition-colors"></div>

                {/* Arrow with animation */}
                <div className="absolute -right-[8px] -top-[10px] transform group-hover:scale-110 transition-all duration-300">
                  <svg
                    className="w-6 h-6 text-pink-500 group-hover:text-pink-600 transition-colors"
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

              {/* Floating badges */}
              <div className="absolute -top-6 right-10 animate-bounce-slow opacity-80">
                <div className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">
                  Hot trend
                </div>
              </div>
              <div className="absolute -top-12 right-[120px] animate-pulse opacity-80">
                <div className="bg-amber-700/20 text-amber-900 text-xs px-2 py-1 rounded-full">
                  Mới nhất
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoShorts;
