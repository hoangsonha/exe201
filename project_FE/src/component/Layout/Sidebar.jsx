import React from 'react';
import './Sidebar.css';
import { FaBell, FaBookmark, FaQuestionCircle, FaSearch, FaAd, FaFileAlt, FaFileContract, FaInfoCircle } from 'react-icons/fa';

const Sidebar = () => {
  const menuItems = [
    { id: 'notification', icon: <FaBell />, label: 'thông báo' },
    { id: 'bookmarks', icon: <FaBookmark />, label: 'lưu trữ' },
    { id: 'help', icon: <FaQuestionCircle />, label: 'trợ giúp' },
    { id: 'explore', icon: <FaSearch />, label: 'khám phá' },
    { id: 'ads', icon: <FaAd />, label: 'quảng cáo' },
    { id: 'privacy', icon: <FaFileAlt />, label: 'chính sách quyền riêng tư' },
    { id: 'terms', icon: <FaFileContract />, label: 'điều khoản sử dụng' },
    { id: 'about', icon: <FaInfoCircle />, label: 'về chúng tôi' },
  ];

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li key={item.id} className="sidebar-item">
            <div className="sidebar-icon-container">
              <span className="sidebar-icon">{item.icon}</span>
            </div>
            <span className="sidebar-label">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar; 