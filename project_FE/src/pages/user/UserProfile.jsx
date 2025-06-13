import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiArrowGoBackFill } from "react-icons/ri"
import { Button } from 'react-bootstrap'
import logo from '@/assets/logo3.png'
import banner from '@/assets/ads/banner.svg'
import UserInfo from './UserInfo'
import UserContent from './UserContent'
import './UserProfile.css'

const fakeUserData = {
  username: "lùn_củ_tỏi",
  point: 45,
  avatar: "https://placehold.co/200x200",
  gender: "Male",
  rating: 93,
  userHashtags: [
    "nghệ thuật",
    "âm nhạc",
    "sức khoẻ",
    "công việc",
    "công nghệ",
    "giải trí",
    "phim ảnh"
  ]
}

const fakePosts = [
  {
    id: 1,
    title: "TẠI SAO KHÔNG PHẢI BẮC NINH MÀ LÀ BẮC BLING ?",
    content: "Dạ thưa, đã là tên riêng của 1 bài hát, nó phải có chất riêng. Khi tìm kiếm Bắc Bling ra ngay bài hát của Hoà, còn tìm Bắc Ninh nó hiện tùm lum. Chưa kể nay nhạc cho nhiều lứa tuổi nhưng giới trẻ chiếm phần lớn, cần có sự đổi mới tuổi trẻ.",
    likes: 153,
    comments: 48,
    rating: 97,
    date: "11/2/25",
    category: "âm nhạc"
  },
  {
    id: 2,
    title: "KHÔNG NÓI ĐƯỢC THÌ VIẾT...",
    content: "Là một nhà tri liệu tâm lý, tôi mong bạn biết rằng: viết về cảm xúc của bạn trong 15-20 phút mỗi ngày, liên tục trong 4 ngày, có thể giảm 37% mức độ căng thẳng và lo âu.",
    likes: 89,
    comments: 23,
    rating: 92,
    date: "10/28/25",
    category: "sức khoẻ"
  }
]

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
  const [activeTab, setActiveTab] = useState('posts')
  const [displayData, setDisplayData] = useState(fakePosts)
  const [loading, setLoading] = useState(false)

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
        <RiArrowGoBackFill />
      </Button>

      <div className="profile-content">
        <UserInfo userData={fakeUserData} />
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