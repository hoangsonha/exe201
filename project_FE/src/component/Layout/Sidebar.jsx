import { useContext, useEffect, useState } from 'react'
import './Sidebar.css'
import { BiBell, BiQuestionMark, BiSearch, BiFile, BiInfoCircle, BiHomeAlt } from 'react-icons/bi'
import { IoMegaphoneOutline } from "react-icons/io5"
import { useNavigate } from 'react-router-dom'
import toi from '../../assets/toi.png'
import { getMyUnreadNotifications } from '../../serviceAPI/notificationService'
import { UserContext } from '../../App'

const Sidebar = () => {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false)

  useEffect(() => {
    const fetchUnread = async () => {
      if (!user) return
      try {
        const res = await getMyUnreadNotifications()
        setHasUnreadNotifications(res.data && res.data.length > 0)
      } catch (err) {
        console.error('Failed to fetch unread notifications:', err)
      }
    }

    fetchUnread()
  }, [user])

  const publicMenuItems = [
    { id: 'home', icon: <BiHomeAlt />, label: 'trang chủ', path: '/' },
    { id: 'explore', icon: <BiSearch />, label: 'khám phá', path: '/explore' },
    { id: 'help', icon: <BiQuestionMark />, label: 'trợ giúp', path: '/' },
    { id: 'ads', icon: <IoMegaphoneOutline />, label: 'quảng cáo', path: '/' },
    { id: 'privacy', icon: <BiFile />, label: 'chính sách và điều khoản sử dụng', path: '/' },
    { id: 'about', icon: <BiInfoCircle />, label: 'về chúng tôi', path: '/about-us' },
  ]

  const privateMenuItems = [
    { id: 'notification', icon: <BiBell />, label: 'thông báo', path: '/notifications' },
    // { id: 'bookmarks', icon: <BiBookmark />, label: 'lưu trữ', path: '/bookmarks' },
  ]

  const menuItems = user 
    ? [...privateMenuItems, ...publicMenuItems]
    : [...publicMenuItems];

    const sortedMenuItems = [
    ...menuItems.filter(item => item.id === 'home'),
    ...menuItems.filter(item => item.id !== 'home')
  ]

  const handleItemClick = (path) => {
    navigate(path)
  }

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        {sortedMenuItems.map(item => {
          const showDot = item.id === 'notification' && hasUnreadNotifications
          return (
            <li 
              key={item.id} 
              className="sidebar-item"
              onClick={() => handleItemClick(item.path)}
            >
              <div className="sidebar-icon-container">
                <span className="sidebar-icon">
                  {item.icon}
                  {showDot && <span className="notification-dot" />}
                </span>
              </div>
              <span className="sidebar-label">{item.label}</span>
            </li>
          )
        })}
      </ul>
      <div className="sidebar-toi-container">
        <img src={toi} alt="Toi" className="sidebar-toi-image" />
      </div>
    </div>
  )
}

export default Sidebar