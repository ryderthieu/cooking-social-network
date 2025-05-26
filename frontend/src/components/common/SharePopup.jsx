import React from 'react';
import { FaTimes, FaCopy, FaFacebook, FaTwitter } from 'react-icons/fa';

const SharePopup = ({ open, onClose, postId }) => {
  if (!open) return null;
  
  const shareUrl = `https://mycookingapp.com/post/${postId}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Đã copy link!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadein">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm relative animate-popup border border-[#FFB800]/10">
        <button 
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#FFB800] hover:scale-110 transition-all duration-300" 
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Chia sẻ bài viết</h3>
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleCopy} 
            className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-[#FFF4D6] text-gray-700 font-medium transition-all duration-300 group"
          >
            <div className="p-2 rounded-full bg-gray-100 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
              <FaCopy className="w-5 h-5" />
            </div>
            <span>Copy link</span>
          </button>
          <a 
            href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-[#FFF4D6] text-gray-700 font-medium transition-all duration-300 group"
          >
            <div className="p-2 rounded-full bg-gray-100 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
              <FaFacebook className="w-5 h-5 text-blue-600" />
            </div>
            <span>Chia sẻ Facebook</span>
          </a>
          <a 
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-[#FFF4D6] text-gray-700 font-medium transition-all duration-300 group"
          >
            <div className="p-2 rounded-full bg-gray-100 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
              <FaTwitter className="w-5 h-5 text-sky-500" />
            </div>
            <span>Chia sẻ Twitter</span>
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadein {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadein {
          animation: fadein 0.3s ease-out;
        }
        @keyframes popup {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-popup {
          animation: popup 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default SharePopup; 