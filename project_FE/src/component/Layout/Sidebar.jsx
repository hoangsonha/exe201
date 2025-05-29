import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { id: 'notification', icon: '🔔', label: 'thông báo' },
    { id: 'bookmarks', icon: '🔖', label: 'lưu trữ' },
    { id: 'help', icon: '❓', label: 'trợ giúp' },
    { id: 'explore', icon: '🔍', label: 'khám phá' },
    { id: 'ads', icon: '📢', label: 'quảng cáo' },
    { id: 'privacy', icon: '📋', label: 'chính sách quyền riêng tư' },
    { id: 'terms', icon: '📜', label: 'điều khoản sử dụng' },
    { id: 'about', icon: 'ℹ️', label: 'về chúng tôi' },
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