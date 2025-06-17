import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoHome } from 'react-icons/io5'
import { Button } from 'react-bootstrap'
import logo from '@/assets/logo3.png'
import banner from '@/assets/ads/banner.svg'
import UserInfo from './UserInfo'
import UserContent from './UserContent'
import { UserContext } from '../../App'
import { getUserById, getUserPosts, getUserSavedPosts } from '@/serviceAPI/userService'
import { getCommentByUserId } from '@/serviceAPI/commentService'
import './UserProfile.css'

const UserProfile = () => {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [userLogin, setUserLogin] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [userComments, setUserComments] = useState([])
  const [userSaves, setUserSaves] = useState([])
  const [displayData, setDisplayData] = useState(null)
  const [activeTab, setActiveTab] = useState('posts')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const result = await getUserById(user.id)
      const posts = await getUserPosts(user.id)
      const comments = await getCommentByUserId(user.id)
      const savedPosts = await getUserSavedPosts(user.id)

      setUserLogin(result.data)
      setUserPosts(posts.data)
      setUserComments(comments.data)
      setUserSaves(savedPosts.data)

      setDisplayData(posts.data)

      console.log('Comments:', comments.data)

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
          setDisplayData(userPosts)
          break;
        case 'comments':
          setDisplayData(userComments)
          break;
        case 'saves':
          setDisplayData(userSaves)
          break;
        default:
          setDisplayData(userPosts)
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
          displayData={displayData} 
          setActiveTab={handleTabChange}
          loading={loading}
        />

        <img src={banner} alt="Banner" className="banner-img" />
      </div>
    </div>
  )
}

export default UserProfile