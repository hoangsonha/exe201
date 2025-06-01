import React from 'react';
import './Sidebar.css';
import { BiBell, BiBookmark, BiQuestionMark, BiSearch, BiFile, BiFileBlank, BiInfoCircle } from 'react-icons/bi';
import { IoMegaphoneOutline } from "react-icons/io5";
import toi from '../../assets/toi.png';

const Sidebar = () => {
  const menuItems = [
    { id: 'notification', icon: <BiBell />, label: 'thông báo' },
    { id: 'bookmarks', icon: <BiBookmark />, label: 'lưu trữ' },
    { id: 'help', icon: <BiQuestionMark />, label: 'trợ giúp' },
    { id: 'explore', icon: <BiSearch />, label: 'khám phá' },
    { id: 'ads', icon: <IoMegaphoneOutline />, label: 'quảng cáo' },
    { id: 'privacy', icon: <BiFile />, label: 'chính sách quyền riêng tư' },
    { id: 'terms', icon: <BiFileBlank />, label: 'điều khoản sử dụng' },
    { id: 'about', icon: <BiInfoCircle />, label: 'về chúng tôi' },
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
      <div className="sidebar-toi-container">
        <img src={toi} alt="Toi" className="sidebar-toi-image" />
      </div>
    </div>
  );
};

export default Sidebar; 