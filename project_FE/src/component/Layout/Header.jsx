import React, { useState, useRef, useEffect } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import './Header.css';
import logo from '../../assets/logo3.png';
import avatar from '../../assets/toi.png';
import { FaGamepad, FaLaptopCode, FaTv, FaGraduationCap, FaPalette, 
         FaBriefcase, FaTshirt, FaHamburger, FaHome, FaTree, 
         FaMusic, FaCar, FaBalanceScale, FaAtom, FaMapMarkerAlt, 
         FaVolleyballBall, FaEllipsisH, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const avatarRef = useRef(null);
  const userMenuRef = useRef(null);
  
  const categories = [
    { id: 'games', icon: <FaGamepad />, name: 'games' },
    { id: 'tech', icon: <FaLaptopCode />, name: 'công nghệ' },
    { id: 'tv', icon: <FaTv />, name: 'phim & tv' },
    { id: 'education', icon: <FaGraduationCap />, name: 'giáo dục' },
    { id: 'art', icon: <FaPalette />, name: 'hội họa' },
    { id: 'career', icon: <FaBriefcase />, name: 'nghề nghiệp' },
    { id: 'fashion', icon: <FaTshirt />, name: 'thời trang' },
    { id: 'food', icon: <FaHamburger />, name: 'đồ ăn' },
    { id: 'home', icon: <FaHome />, name: 'gia dụng' },
    { id: 'nature', icon: <FaTree />, name: 'tự nhiên' },
    { id: 'music', icon: <FaMusic />, name: 'âm nhạc' },
    { id: 'car', icon: <FaCar />, name: 'xe cộ' },
    { id: 'law', icon: <FaBalanceScale />, name: 'luật pháp' },
    { id: 'science', icon: <FaAtom />, name: 'khoa học' },
    { id: 'travel', icon: <FaMapMarkerAlt />, name: 'du lịch' },
    { id: 'sports', icon: <FaVolleyballBall />, name: 'thể thao' },
    { id: 'others', icon: <FaEllipsisH />, name: 'khác' },
  ];
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowCategories(false);
      }
      
      if (
        userMenuRef.current && 
        !userMenuRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleCategoriesDropdown = () => {
    setShowCategories(!showCategories);
  };
  
  const toggleUserMenu = () => {
    setShowUserMenu(prev => !prev);
    console.log("Avatar clicked, showUserMenu:", !showUserMenu);
  };

  const handleAvatarClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Avatar clicked, current showUserMenu:", showUserMenu);
    toggleUserMenu();
  };

  return (
    <header className="home-header">
      <div className="header-content">
        <img src={logo} alt="" className="logo-img" />
        
        <div className="search-container">
          <InputGroup className="search-bar">
            <FormControl
              placeholder="bạn muốn tìm review về cái gì?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </InputGroup>
          
          <div className="buttons-group">
            <div className="filter-dropdown-container">
              <Button 
                ref={buttonRef}
                variant="light" 
                className={showCategories ? "filter-btn filter-btn-active" : "filter-btn"}
                onClick={toggleCategoriesDropdown}
              >
                <i className="bi bi-funnel"></i> chủ đề
              </Button>
              
              {showCategories && (
                <div 
                  ref={dropdownRef}
                  className="categories-dropdown"
                >
                  <div className="categories-grid">
                    {categories.map(category => (
                      <div key={category.id} className="category-item">
                        <div className="category-icon-container">
                          {category.icon}
                        </div>
                        <span className="category-name">{category.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Button className="upgrade-btn">
              Nâng cấp gói
            </Button>
          </div>
        </div>
        
        <div className="controls-container">
          <div 
            className="user-avatar-container"
            ref={avatarRef}
          >
            <div 
              className="user-avatar"
              onClick={handleAvatarClick}
            >
              <img 
                src={avatar} 
                alt="User Avatar" 
                className="avatar-img"
              />
            </div>
            
            {showUserMenu && (
              <div className="user-menu" ref={userMenuRef}>
                <div className="user-menu-item">
                  <FaUser className="user-menu-icon" />
                  <span>Trang cá nhân</span>
                </div>
                <div className="user-menu-item">
                  <FaSignOutAlt className="user-menu-icon" />
                  <span>Đăng xuất</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;