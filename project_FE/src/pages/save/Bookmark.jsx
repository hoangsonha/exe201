import Header from '@/component/Layout/Header'
import Sidebar from '@/component/Layout/Sidebar';
import Advertisement from '@/pages/home/Advertisement';
import './Bookmark.css';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';

import { getUserSavedPosts } from '@/serviceAPI/userService'
import Review from '../home/Review';

const Bookmark = () => {

    const [userSaves, setUserSaves] = useState([])
    const [loading, setLoading] = useState(false)

    const { user } = useContext(UserContext)

    useEffect(() => {
        fetchUserInfo()
      }, [])
    
    const fetchUserInfo = async () => {
        setLoading(true)
        try {

            const savedPosts = await getUserSavedPosts(user.id)

            setUserSaves(savedPosts.data)

        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error)
        } finally {
            setLoading(false)
        }
    }

    const renderPostItem = (post) => (
        <Review post={post} showCommentSection={false} isOwner={true} />
    )

    return (
        <div className="home-page">
            <Header />
            <Advertisement />
            <div className="home-content">
                <Sidebar />
                    <div className="main-content">
                        <div className="content-container">
                            {userSaves ? userSaves.map(saved => renderPostItem(saved)) 
                                        :   <div className="profile-no-content">
                                                <p>Không có nội dung nào để hiển thị</p>
                                            </div>}
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default Bookmark