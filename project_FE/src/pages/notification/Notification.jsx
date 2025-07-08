import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../component/Layout/Header.jsx'
import Sidebar from '../../component/Layout/Sidebar.jsx'
import Advertisement from '../home/Advertisement.jsx'
import { Button } from 'react-bootstrap'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { BsThreeDots } from 'react-icons/bs'
import { IoMdSettings, IoMdCheckmark } from 'react-icons/io'
import { getMyNotifications, markNotificationAsRead,getMyUnreadNotifications } from '../../serviceAPI/notificationService.jsx'
import './Notification.css'

const Notification = () => {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [unreadNotifications, setUnreadNotifications] = useState([])
  const [showOptions, setShowOptions] = useState(false)
  const optionsRef = useRef(null)
  
  useEffect(() => {
    window.scrollTo(0, 0)
    fetchNotifications()
    fetchUnreadNotifications()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleOptionsClick = (e) => {
    e.stopPropagation()
    setShowOptions(!showOptions)
  }

  const handleOptionAction = (e, action) => {
    e.stopPropagation()
    setShowOptions(false)
    
    switch(action) {
      case 'mark-all-read':
        markAllAsRead()
        break
      default:
        break
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await getMyNotifications()
      console.log('Notifications:', response)
      setNotifications(response.data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const fetchUnreadNotifications = async () => {
    try {
      const response = await getMyUnreadNotifications()
      console.log('Unread Notifications:', response)
      setUnreadNotifications(response.data)
    } catch (error) {
      console.error('Error fetching unread notifications:', error)
    }
  }

  const translateMessage = (message) => {
    if (message.includes('commented on your review')) {
      const username = message.split(' ')[0]
      const comment = message.split("'")[1] || ''
      return `${username} đã bình luận về bài đánh giá của bạn: '${comment}'`
    } else if (message.includes('replied to your comment')) {
      const username = message.split(' ')[0]
      const reply = message.split("'")[1] || ''
      return `${username} đã trả lời bình luận của bạn: '${reply}'`
    } else if (message.includes('liked your review')) {
      const username = message.split(' ')[0]
      return `${username} đã thích đánh giá của bạn`
    } else if (message.includes('liked your comment')) {
      const username = message.split(' ')[0]
      return `${username} đã thích bình luận của bạn`
    }
    return message
  }

  const isUnread = (notificationId) => {
    return unreadNotifications.some(unread => unread.id === notificationId)
  }

  const markAllAsRead = async () => {
    try {
      const markPromises = unreadNotifications.map(notification => 
        markNotificationAsRead(notification.id)
      )
      await Promise.all(markPromises)
      
      await fetchNotifications()
      await fetchUnreadNotifications()
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const handleNotificationClick = async (notification) => {
    try {
      if (isUnread(notification.id)) {
        await markNotificationAsRead(notification.id)
        await fetchNotifications()
        await fetchUnreadNotifications()
      }
      
      if (notification.reviewId) {
        navigate(`/post/${notification.reviewId}`)
      }
    } catch (error) {
      console.error('Error handling notification click:', error)
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className="home-page">
      <Header />
      <Advertisement />
      <div className="home-content">
        <Sidebar />
          <div className="main-content">
            <div className="content-container">
              {notifications.length > 0 ? (
                <div className="notification-list">
                  <Button className="home-back-button" onClick={handleBack}>
                    <RiArrowGoBackFill />
                  </Button>
                  {unreadNotifications.length > 0 && (
                    <div className="mark-all-read-container">
                      <div className="notification-options-container" ref={optionsRef}>
                        <Button 
                          variant="outline-dark" 
                          onClick={handleOptionsClick}
                          className="mark-all-read-btn"
                        >
                          <BsThreeDots />
                        </Button>
                        {showOptions && (
                          <div className="noti-options-dropdown">
                            <div className="noti-option-item" onClick={(e) => handleOptionAction(e, 'mark-all-read')}>
                              <IoMdCheckmark className="noti-icon"/> đánh dấu tất cả là đã đọc
                            </div>
                            <div className="noti-option-item" onClick={(e) => handleOptionAction(e, 'other')}>
                              <IoMdSettings className="noti-icon"/> cài đặt thông báo
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {notifications.map((notification) => (
                    <div 
                      className={`notification-item ${isUnread(notification.id) ? 'unread' : 'read'}`}
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <p className="notification-message">
                        {translateMessage(notification.message)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="profile-no-content">
                  <p>Không có thông báo mới...</p>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  )
}

export default Notification