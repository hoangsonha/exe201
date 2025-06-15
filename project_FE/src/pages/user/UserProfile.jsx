import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoHome } from 'react-icons/io5'
import { Button } from 'react-bootstrap'
import logo from '@/assets/logo3.png'
import banner from '@/assets/ads/banner.svg'
import UserInfo from './UserInfo'
import UserContent from './UserContent'
import { UserContext } from '../../App'
import './UserProfile.css'

const fakeComments = [
  {
    id: 1,
    postTitle: "Review món ăn mới tại nhà hàng XYZ",
    comment: "Tôi rất thích cách bạn mô tả món ăn, sẽ thử vào cuối tuần này!",
    date: "11/1/25",
    likes: 12
  },
  {
    id: 2,
    postTitle: "Đánh giá sách mới xuất bản",
    comment: "Quan điểm rất hay và sâu sắc, cảm ơn bạn đã chia sẻ!",
    date: "10/30/25",
    likes: 8
  }
]

const fakeLikedPosts = [
  {
    id: 3,
    title: "Top 10 địa điểm du lịch phải đến trong năm 2025",
    content: "Danh sách những địa điểm du lịch tuyệt vời mà bạn không nên bỏ lỡ trong năm tới...",
    likes: 245,
    comments: 67,
    rating: 98,
    date: "11/5/25",
    category: "du lịch"
  },
  {
    id: 4,
    title: "Review phim mới: Thế giới song song",
    content: "Bộ phim với cốt truyện độc đáo và kỹ xảo đỉnh cao...",
    likes: 178,
    comments: 42,
    rating: 95,
    date: "11/3/25",
    category: "giải trí"
  }
]

const UserProfile = () => {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [userLogin, setUserLogin] = useState(null)
  const [userPosts, setUserPosts] = useState(null)
  const [activeTab, setActiveTab] = useState('posts')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const result = await getUserById(user.id)
      const posts = await getUserPosts(user.id)
      setUserLogin(result.data)
      setUserPosts(posts.data)
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    setLoading(true)
    
    setTimeout(() => {
      switch(tab) {
        case 'posts':
          setDisplayData(fakePosts)
          break;
        case 'comments':
          setDisplayData(fakeComments)
          break;
        case 'likes':
          setDisplayData(fakeLikedPosts)
          break;
        default:
          setDisplayData(fakePosts)
      }
      setActiveTab(tab)
      setLoading(false)
    }, 500)
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src={logo} alt="Logo" className="logo-img" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
      </div>
      <Button className="back-button" onClick={() => navigate('/')}>
        <IoHome />
      </Button>

      <div className="profile-content">
        <UserInfo userData={userLogin} />
        <UserContent 
          activeTab={activeTab} 
          displayData={userPosts} 
          setActiveTab={handleTabChange}
          loading={loading}
        />

        <img src={banner} alt="Banner" className="banner-img" />
      </div>
    </div>
  )
}

export default UserProfile