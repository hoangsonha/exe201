import React, { useContext } from 'react'
import './Sidebar.css'
import { BiBell, BiBookmark, BiQuestionMark, BiSearch, BiFile, BiFileBlank, BiInfoCircle, BiHomeAlt } from 'react-icons/bi'
import { IoMegaphoneOutline } from "react-icons/io5"
import { useNavigate } from 'react-router-dom'
import toi from '../../assets/toi.png'
import { UserContext } from '../../App'

const Sidebar = () => {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)

  const publicMenuItems = [
    { id: 'home', icon: <BiHomeAlt />, label: 'trang chủ', path: '/' },
    { id: 'help', icon: <BiQuestionMark />, label: 'trợ giúp', path: '/' },
    { id: 'explore', icon: <BiSearch />, label: 'khám phá', path: '/explore' },
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
        {sortedMenuItems.map(item => (
          <li 
            key={item.id} 
            className="sidebar-item"
            onClick={() => handleItemClick(item.path)}
          >
            <div className="sidebar-icon-container">
              <span className="sidebar-icon">{item.icon}</span>
            </div>
            <span className="sidebar-label">{item.label}</span>
          </li>
        ))}
      </ul>
      <div className="sidebar-toi-container">
        <img src={toi} alt="Toi" className="sidebar-toi-image" />
      </div>
    </div>
  )
}

export default Sidebar