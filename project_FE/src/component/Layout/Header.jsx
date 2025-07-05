import { useState, useRef, useEffect, useContext } from 'react'
import { InputGroup, FormControl, Button } from 'react-bootstrap'
import logo from '@/assets/logo3.png'
import avatar from '@/assets/toi.png'
import { FaUser, FaSignOutAlt } from 'react-icons/fa'

import { getHashtags } from "../../serviceAPI/hashtagService"
import './Header.css'
import { UserContext } from '../../App'
import { useNavigate } from 'react-router'
import { SearchContext } from '../SearchContext'

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [showCategories, setShowCategories] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [hashtags, setHashtags] = useState([])
  const [filteredHashtags, setFilteredHashtags] = useState([])
  const [categorySearchTerm, setCategorySearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)
  const avatarRef = useRef(null)
  const userMenuRef = useRef(null)
  const { user, signOut } = useContext(UserContext)
  const navigate = useNavigate()
  const [selectedCategories, setSelectedCategories] = useState([])

  const { handleSearch } = useContext(SearchContext)

    useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const result = await getHashtags()
        const allHashtags = result.data.data || []
        
        const sortedHashtags = allHashtags.sort((a, b) => {
          const aSelected = selectedCategories.includes(a.name)
          const bSelected = selectedCategories.includes(b.name)
          
          if (aSelected && !bSelected) return -1
          if (!aSelected && bSelected) return 1
          return 0
        })
        
        setHashtags(sortedHashtags)
        setFilteredHashtags(sortedHashtags.slice(0, 15))
        setLoading(false)
      } catch (err) {
        console.error("Error fetching categories:", err)
        setLoading(false)
      }
    }

    fetchCategories()
  }, [selectedCategories])

  useEffect(() => {
    if (categorySearchTerm) {
      const filtered = hashtags.filter(category => 
        category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
      )
      const sortedFiltered = filtered.sort((a, b) => {
        const aSelected = selectedCategories.includes(a.name)
        const bSelected = selectedCategories.includes(b.name)
        
        if (aSelected && !bSelected) return -1
        if (!aSelected && bSelected) return 1
        return 0
      })
      setFilteredHashtags(sortedFiltered)
    } else {
      const sortedHashtags = [...hashtags].sort((a, b) => {
        const aSelected = selectedCategories.includes(a.name)
        const bSelected = selectedCategories.includes(b.name)
        
        if (aSelected && !bSelected) return -1
        if (!aSelected && bSelected) return 1
        return 0
      })
      setFilteredHashtags(sortedHashtags.slice(0, 15))
    }
  }, [categorySearchTerm, hashtags, selectedCategories])

  useEffect(() => {
    handleSearch(searchTerm, selectedCategories);
  }, [searchTerm, selectedCategories])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowCategories(false)
      }

      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    signOut()
    navigate("/")
  }

  const toggleCategoriesDropdown = () => {
    setShowCategories(!showCategories)
    if (!showCategories) {
      setCategorySearchTerm("")
    }
  }

  const toggleUserMenu = () => {
    setShowUserMenu((prev) => !prev)
  }

  const handleAvatarClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleUserMenu()
  }

  const handleCategoryClick = (categoryName) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryName)) {
        return prev.filter((name) => name !== categoryName)
      } else {
        return [...prev, categoryName]
      }
    })
  }

  return (
    <header className="home-header">
      <div className="header-content">
        <img
          src={logo || "/placeholder.svg"}
          alt=""
          className="logo-img"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />

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
                <div ref={dropdownRef} className="categories-dropdown">
                  {loading ? (
                    <div className="categories-loading">Loading categories...</div>
                  ) : (
                    <>
                      <div className="category-search-container">
                        <InputGroup className="mb-5">
                          <FormControl
                            placeholder="Tìm kiếm chủ đề..."
                            value={categorySearchTerm}
                            onChange={(e) => setCategorySearchTerm(e.target.value)}
                          />
                          <InputGroup.Text>
                            <i className="bi bi-search"></i>
                          </InputGroup.Text>
                        </InputGroup>
                      </div>
                      <div className="categories-grid">
                        {filteredHashtags.map((category) => (
                          <div
                            key={category.id}
                            className={`category-item ${selectedCategories.includes(category.name) ? "selected" : ""}`}
                            onClick={() => handleCategoryClick(category.name)}
                            style={{ cursor: "pointer", position: "relative" }}
                          >
                            {selectedCategories.includes(category.name) && (
                              <div className="category-checkmark">
                                <i className="bi bi-check-circle-fill" style={{ color: "#28a745", fontSize: "16px" }}></i>
                              </div>
                            )}
                            <div className="category-icon-container">
                              {typeof category.icon === "string" ? (
                                <img
                                  src={category.icon || "/placeholder.svg"}
                                  alt={category.name}
                                  className="category-svg-icon"
                                />
                              ) : (
                                category.icon
                              )}
                            </div>
                            <span className="category-name">{category.name}</span>
                          </div>
                        ))}
                      </div>
                      {filteredHashtags.length === 0 && (
                        <div className="no-categories-found">Không tìm thấy chủ đề phù hợp</div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {user ? (
              <>
                <Button className="upgrade-btn" onClick={() => navigate("/upgrade")}>
                  Nâng cấp gói
                </Button>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div className="controls-container">
          <div className="user-avatar-container" ref={avatarRef}>
            <div className="user-avatar" onClick={handleAvatarClick}>
              {user ? (
                <img src={user.avatar || "/placeholder.svg"} alt="User Avatar" className="avatar-img" />
              ) : (
                <img src={avatar || "/placeholder.svg"} alt="User Avatar" className="avatar-img" />
              )}
            </div>

            {showUserMenu && (
              <div className="user-menu" ref={userMenuRef}>
                {user ? (
                  <>
                    <div className="user-menu-item" onClick={() => navigate("/profile")}>
                      <FaUser className="user-menu-icon" />
                      <span>Trang cá nhân</span>
                    </div>
                    <div className="user-menu-item" onClick={handleLogout}>
                      <FaSignOutAlt className="user-menu-icon" />
                      <span>Đăng xuất</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="user-menu-item" onClick={() => navigate("/login")}>
                      <FaUser className="user-menu-icon" />
                      <span>Đăng nhập</span>
                    </div>
                    <div className="user-menu-item" onClick={() => navigate("/signup")}>
                      <FaUser className="user-menu-icon" />
                      <span>Đăng ký</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header