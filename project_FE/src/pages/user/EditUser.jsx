import { useState, useEffect, useContext, useRef } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import logo from '@/assets/logo3.png'
import pointLogo from '@/assets/logo.png'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { FaTimes, FaPlus } from 'react-icons/fa'
import { getHashtags } from '@/serviceAPI/hashtagService'
import { getUserById } from '@/serviceAPI/userService'
import { UserContext } from '../../App'
import './EditUser.css'

const EditUser = () => {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [loading, setLoading] = useState(true)
  const [hashtags, setHashtags] = useState([])
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const [isVIP, setIsVIP] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    gender: '',
    selectedTags: [],
    showPersonalAccount: false,
    showPoints: false,
    showHotTopics: false,
    point: 0,
    avatar: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResult, hashtagsResult] = await Promise.all([
          getUserById(user.id),
          getHashtags()
        ])
        
        if (userResult.status === "Success") {
          setFormData(prev => ({
            ...prev,
            username: userResult.data.userName || '',
            gender: userResult.data.gender || '',
            selectedTags: userResult.data.listHashTagUser || [],
            point: userResult.data.point || 0,
            avatar: userResult.data.avatar || ''
          }))
          setIsVIP(false)
        }
        
        setHashtags(hashtagsResult.data.data || [])
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [user.id])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTagDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    navigate('/profile')
  }

  const handleSwitchChange = (name) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  const toggleTagDropdown = () => {
    setShowTagDropdown(!showTagDropdown)
  }

  const handleTagSelect = (tag) => {
    if (!formData.selectedTags.some(t => t.id === tag.id)) {
      setFormData(prev => ({
        ...prev,
        selectedTags: [...prev.selectedTags, tag]
      }))
    }
    setShowTagDropdown(false)
  }

  const removeTag = (tagId) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.filter(tag => tag.id !== tagId)
    }))
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-header">
        <img src={logo} alt="Logo" className="logo-img" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
      </div>
      <Button className="back-button" onClick={() => navigate('/profile')}>
        <RiArrowGoBackFill />
      </Button>

      <div className="edit-profile-container">
        <div className="settings-section">
          <h2>cài đặt</h2>
          <div className="switch-group">
            <Form.Check
              type="switch"
              id="personal-account-switch"
              checked={formData.showPersonalAccount}
              onChange={() => handleSwitchChange('showPersonalAccount')}
              label="tài khoản cá nhân"
              className="switch-right"
            />
            <Form.Check
              type="switch"
              id="points-switch"
              checked={formData.showPoints}
              onChange={() => handleSwitchChange('showPoints')}
              label="hiển thị điểm tỏi"
              className="switch-right"
            />
            <Form.Check
              type="switch"
              id="hot-topics-switch"
              checked={formData.showHotTopics}
              onChange={() => handleSwitchChange('showHotTopics')}
              label="gợi ý chủ đề hot"
              className="switch-right"
            />
          </div>
        </div>

        <div className="user-info-section">
          <div className="user-info-left">
            <div className="user-profile-avatar-container">
              <img src={formData.avatar} alt="User Avatar" />
            </div>
            <div className="user-points-display">
              <img src={pointLogo} alt="Point Logo" className="user-points-logo" />
              <span className="user-points-value">{formData.point}</span>
              <span>tỏi</span>
            </div>
          </div>

          <div className="user-info-right">
            <div className="info-header">
              <h2>tên tài khoản</h2>
            </div>

            <Form.Group className="mb-4 username-group">
              <Form.Control
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                disabled={!isVIP}
                className="username-input"
              />
              {!isVIP && (
                <div className="input-vip-notice">
                  <i>** bạn cần là tôi vip để sử dụng chức năng này</i>
                </div>
              )}
            </Form.Group>

            <div className="gender-selection">
              <div className="info-header">
                <h2>giới tính</h2>
              </div>
              <div className="gender-options">
                <div className={`gender-option ${formData.gender === 'Male' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="gender"
                    id="male"
                    checked={formData.gender === 'Male'}
                    onChange={() => setFormData(prev => ({ ...prev, gender: 'Male' }))}
                  />
                  <label htmlFor="male">nam</label>
                </div>
                <div className={`gender-option ${formData.gender === 'Female' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="gender"
                    id="female"
                    checked={formData.gender === 'Female'}
                    onChange={() => setFormData(prev => ({ ...prev, gender: 'Female' }))}
                  />
                  <label htmlFor="female">nữ</label>
                </div>
                <div className={`gender-option ${formData.gender === 'Other' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="gender"
                    id="other"
                    checked={formData.gender === 'Other'}
                    onChange={() => setFormData(prev => ({ ...prev, gender: 'Other' }))}
                  />
                  <label htmlFor="other">khác</label>
                </div>
              </div>
            </div>

            <div className="interests-container">
              <div className="info-header">
                <h2>hứng thú với</h2>
              </div>
              <div className="interests-section-row">
                <div className="selected-interests">
                  {formData.selectedTags.map(tag => (
                    <div
                      key={tag.id}
                      className="interest-tag"
                    >
                      #{tag.name}
                      <button
                        onClick={() => removeTag(tag.id)}
                        className="interest-remove"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="interests-add-button" onClick={toggleTagDropdown}>
                  <FaPlus />
                </button>
              </div>
                  
              {showTagDropdown && (
                <div className="interests-dropdown" ref={dropdownRef}>
                  <div className="interests-dropdown-content">
                    <div className="interests-dropdown-header">Gợi ý tag</div>
                    <div className="interests-dropdown-divider"></div>
                    {hashtags.map(tag => (
                      <button
                        key={tag.id}
                        className="interests-dropdown-item"
                        onClick={() => handleTagSelect(tag)}
                      >
                        #{tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button className="save-button" onClick={handleSubmit}>
              lưu
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditUser