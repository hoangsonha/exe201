import { useState, useEffect, useContext, useRef } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import logo from '@/assets/logo3.png'
import pointLogo from '@/assets/logo.png'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { FaTimes, FaPlus } from 'react-icons/fa'
import { getHashtags } from '@/serviceAPI/hashtagService'
import { getUserById, updateAccount, changeUsername } from '@/serviceAPI/userService'
import { UserContext } from '../../App'
import './EditUser.css'
import { useToast } from '../../component/Toast'

const EditUser = () => {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [loading, setLoading] = useState(true)
  const [hashtags, setHashtags] = useState([])
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const [isVIP, setIsVIP] = useState(false)

  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    username: '',
    gender: '',
    selectedTags: [],
    showPersonalAccount: false,
    showPoints: true,
    showHotTopics: true,
    point: 0,
    avatar: ''
  })

  useEffect(() => {
    window.scrollTo(0, 0)
    const fetchData = async () => {
      try {
        const [userResult, hashtagsResult] = await Promise.all([
          getUserById(user.id),
          getHashtags()
        ])
        
        if (userResult.status === "Success") {
          console.log("User data fetched successfully:", userResult.data)
          setFormData(prev => ({
            ...prev,
            username: userResult.data.userName || '',
            gender: userResult.data.gender || '',
            selectedTags: userResult.data.listHashTagUser || [],
            point: userResult.data.point || 0,
            avatar: userResult.data.avatar || '',
            title: userResult.data.title,
            subscriptionId: userResult.data.subscriptionId,
          }))
        }

        if (userResult.data.title != 'tỏi thường') setIsVIP(true)
        else setIsVIP(false)
        
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.username.length > 20) {
      addToast("Tên người dùng không được dài hơn 20 ký tự", false, true)
      return
    }

    if (!formData.gender) {
      addToast("Vui lòng chọn giới tính", false, true)
      return
    }
    
    if (formData.selectedTags.length === 0) {
      addToast("Vui lòng chọn ít nhất một hashtag", false, true)
      return
    }

    try {
      const promises = []
      if (isVIP) {
        promises.push(changeUsername(user.id, formData.username))
      }

      const updateData = {
        gender: formData.gender.toUpperCase(),
        hashTags: formData.selectedTags.map(tags => tags.name),
      }
      promises.push(updateAccount(updateData, user.id))
      const results = await Promise.all(promises)
      
      if (results.every(result => result.status === "Success")) {
        addToast("Bạn đã sửa thông tin tài khoản thành công.", true, false)
        navigate('/profile')
      } else {
        addToast(`Đã có lỗi xảy ra, vui lòng thử lại.`, false, true)
      }
      
    } catch (error) {
      console.error("Có lỗi xảy ra khi gọi api:", error)
      addToast(`Đã có lỗi xảy ra, vui lòng thử lại.`, false, true)
    }
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

  console.log(formData)

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
              disabled={true}
            />
            <Form.Check
              type="switch"
              id="points-switch"
              checked={formData.showPoints}
              onChange={() => handleSwitchChange('showPoints')}
              label="hiển thị điểm tỏi"
              className="switch-right"
              disabled={true}
            />
            <Form.Check
              type="switch"
              id="hot-topics-switch"
              checked={formData.showHotTopics}
              onChange={() => handleSwitchChange('showHotTopics')}
              label="gợi ý chủ đề hot"
              className="switch-right"
              disabled={true}
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

            <div className="username-wrapper mb-4">
              <Form.Control
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value}))}
                disabled={!isVIP}
                className="edit-profile-username-input"
              />
            </div>

            <div className="gender-selection">
              <div className="info-header">
                <h2>giới tính</h2>
              </div>
              <div className="gender-options">
                <div className={`gender-option ${formData.gender.toLowerCase().charAt(0).toUpperCase() + formData.gender.toLowerCase().slice(1) == 'Male' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="gender"
                    id="male"
                    checked={formData.gender === 'Male'}
                    onChange={() => setFormData(prev => ({ ...prev, gender: 'Male' }))}
                  />
                  <label htmlFor="male">nam</label>
                </div>
                <div className={`gender-option ${formData.gender.toLowerCase().charAt(0).toUpperCase() + formData.gender.toLowerCase().slice(1) == 'Female' ? 'selected' : ''}`}>
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