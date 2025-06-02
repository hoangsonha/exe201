import React, { useState, useRef, useEffect } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import logo from '../../assets/logo3.png';
import avatar from '../../assets/toi.png';
import { FaEllipsisH, FaUser, FaSignOutAlt } from 'react-icons/fa';
import gamesIcon from '../../assets/categories/games.svg';
import techIcon from '../../assets/categories/technology.svg';
import tvIcon from '../../assets/categories/tv.svg';
import eduIcon from '../../assets/categories/edu.svg';
import artsIcon from '../../assets/categories/arts.svg';
import jobsIcon from '../../assets/categories/jobs.svg';
import fashionIcon from '../../assets/categories/fashion.svg';
import foodIcon from '../../assets/categories/food.svg';
import householdIcon from '../../assets/categories/household.svg';
import natureIcon from '../../assets/categories/nature.svg';
import musicIcon from '../../assets/categories/music.svg';
import trafficIcon from '../../assets/categories/traffic.svg';
import lawIcon from '../../assets/categories/law.svg';
import scienceIcon from '../../assets/categories/science.svg';
import travelIcon from '../../assets/categories/travel.svg';
import sportIcon from '../../assets/categories/sport.svg';
import './Header.css';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const avatarRef = useRef(null);
  const userMenuRef = useRef(null);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          const mockCategories = [
            { id: 'games', icon: gamesIcon, name: 'games' },
            { id: 'tech', icon: techIcon, name: 'công nghệ' },
            { id: 'tv', icon: tvIcon, name: 'phim & tv' },
            { id: 'education', icon: eduIcon, name: 'giáo dục' },
            { id: 'art', icon: artsIcon, name: 'hội họa' },
            { id: 'career', icon: jobsIcon, name: 'nghề nghiệp' },
            { id: 'fashion', icon: fashionIcon, name: 'thời trang' },
            { id: 'food', icon: foodIcon, name: 'đồ ăn' },
            { id: 'home', icon: householdIcon, name: 'gia dụng' },
            { id: 'nature', icon: natureIcon, name: 'tự nhiên' },
            { id: 'music', icon: musicIcon, name: 'âm nhạc' },
            { id: 'car', icon: trafficIcon, name: 'xe cộ' },
            { id: 'law', icon: lawIcon, name: 'luật pháp' },
            { id: 'science', icon: scienceIcon, name: 'khoa học' },
            { id: 'travel', icon: travelIcon, name: 'du lịch' },
            { id: 'sports', icon: sportIcon, name: 'thể thao' },
            { id: 'others', icon: <FaEllipsisH />, name: 'khác' },
          ];
          
          setCategories(mockCategories);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  
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
  };

  const handleAvatarClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
                  {loading ? (
                    <div className="categories-loading">Loading categories...</div>
                  ) : (
                    <div className="categories-grid">
                      {categories.map(category => (
                        <div key={category.id} className="category-item">
                          <div className="category-icon-container">
                            {typeof category.icon === 'string' ? (
                              <img src={category.icon} alt={category.name} className="category-svg-icon" />
                            ) : (
                              category.icon
                            )}
                          </div>
                          <span className="category-name">{category.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
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