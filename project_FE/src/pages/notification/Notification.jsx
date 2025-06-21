import './Notification.css'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../component/Layout/Header.jsx'
import Sidebar from '../../component/Layout/Sidebar.jsx'
import Advertisement from '../home/Advertisement.jsx'
import { Button } from 'react-bootstrap'
import { RiArrowGoBackFill } from 'react-icons/ri'

const Notification = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className='notification-page'>
      <Header />
      <Sidebar />
      <div className="home-content">
        <Sidebar />
        <div className="main-content">
          <div className="content-container">
            <Button className="home-back-button" onClick={handleBack}>
              <RiArrowGoBackFill />
            </Button>
            
            <div className="notification-message">
              <p>Không có thông báo mới...</p>
            </div>
          </div>
        </div>
        
        <Advertisement />
      </div>
    </div>
  )
}

export default Notification
