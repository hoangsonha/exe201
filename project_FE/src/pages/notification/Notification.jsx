import './Notification.css'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../component/Layout/Header.jsx'
import Sidebar from '../../component/Layout/Sidebar.jsx'
import Advertisement from '../home/Advertisement.jsx'
import { Button } from 'react-bootstrap'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { use } from 'react'
import { getMyNotifications } from '../../serviceAPI/notificationService.jsx'

const Notification = () => {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  
  useEffect(() => {
    window.scrollTo(0, 0)
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await getMyNotifications()
      console.log('Notifications:', response)
      setNotifications(response)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  return (
    <div className="home-page">
      <Header />
      <Advertisement />
      <div className="home-content">
        <Sidebar />
          <div className="main-content">
            <div className="content-container">
              <div className="profile-no-content">
                <p>Không có thông báo mới...</p>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}

export default Notification
