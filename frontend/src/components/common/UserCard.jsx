import { useState, useEffect } from 'react';
import { getUserById, toggleFollow } from '../../services/userService';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';


const UserCard = ({ user }) => {
    const { user: currentUser } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoadingFollow, setIsLoadingFollow] = useState(false);
    const {sendNotification} = useSocket()
    const [userInfo, setUserInfo] = useState(user)
    useEffect(() => {
        const getUserInfo = async () => {
            const res = await getUserById({userId: user._id})
            console.log(res)
            setUserInfo(res.data)
        }
        getUserInfo()
    }, [isLoadingFollow])

    const handleFollowToggle = async () => {
        if (!currentUser || currentUser._id === userInfo._id) return;
        setIsLoadingFollow(true);
        try {
            const action = isFollowing ? 'unfollow' : 'follow';
            await toggleFollow({ followingId: userInfo._id, action });
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error("Failed to toggle follow:", error);
        } finally {
            setIsLoadingFollow(false);
            sendNotification({
                receiverId: userInfo._id,
                type: 'follow'
            })
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-5 transition-all hover:shadow-xl">
            <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-5">
                <img
                    src={userInfo.avatar}
                    alt={`${userInfo.lastName} ${userInfo.firstName}`}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#FFB800] shadow-md"
                />
                <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-gray-800 hover:text-[#FFB800] transition-colors">
                        <Link to={`/profile/${userInfo._id}`}>{userInfo.lastName} {userInfo.firstName}</Link>
                    </h3>
                    <p className="text-sm text-gray-500">@{userInfo.username || userInfo._id.substring(0, 10)}</p>

                    <div className="mt-3 flex justify-center sm:justify-start space-x-4 text-sm text-gray-600">
                        <div>
                            <span className="font-semibold text-gray-700">{userInfo.followers?.length || 0}</span> Người theo dõi
                        </div>
                        <div>
                            <span className="font-semibold text-gray-700">{userInfo.following?.length || 0}</span> Đang theo dõi
                        </div>
                    </div>
                </div>
                {currentUser && userInfo._id !== currentUser._id && (
                    <button
                        onClick={handleFollowToggle}
                        disabled={isLoadingFollow}
                        className={`mt-4 sm:mt-0 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out 
                                    ${isFollowing
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                : 'bg-[#FFB800] text-white hover:bg-[#E6A600] shadow-sm'}
                                    ${isLoadingFollow ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoadingFollow ? 'Đang xử lý...' : (isFollowing ? 'Đang theo dõi' : 'Theo dõi')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserCard;