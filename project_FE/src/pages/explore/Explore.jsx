import Header from '@/component/Layout/Header'
import Sidebar from '@/component/Layout/Sidebar';
import Advertisement from '@/pages/home/Advertisement';
import './Explore.css';
import Review from '../home/Review';
import { useEffect, useState } from 'react';

import {getTopTradingGlobal} from '../../serviceAPI/reviewService'

const Explore = () => {
    const [userSaves, setUserSaves] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0)
        fetchUserInfo()
    }, [])
    
    const fetchUserInfo = async () => {
        setLoading(true)
        try {
            const savedPosts = await getTopTradingGlobal()
            setUserSaves(savedPosts.data.data)
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
                            {loading ? (
                              <div className="profile-loading">
                                <p>Đang tải nội dung thịnh hành...</p>
                              </div>
                            ) : userSaves && userSaves.length > 0 ? (
                              userSaves.map(saved => renderPostItem(saved))
                            ) : (
                              <div className="profile-no-content">
                                <p>Không có nội dung nào để hiển thị</p>
                              </div>
                            )}
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default Explore
