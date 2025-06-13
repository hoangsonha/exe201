import { useNavigate } from 'react-router-dom'
import { FaMale, FaFemale, FaStar } from 'react-icons/fa'
import { BsGenderAmbiguous, BsStar } from 'react-icons/bs'
import pointLogo from '@/assets/logo.png'
import './UserProfile.css'

const UserInfo = ({ userData }) => {
  const navigate = useNavigate();

  const getGenderIcon = () => {
    switch (userData.gender) {
      case 'Male':
        return <FaMale />
      case 'Female':
        return <FaFemale />
      default:
        return <BsGenderAmbiguous />
    }
  }

  return (
    <div className="profile-info-section">
      <div className="point-display">
        <img src={pointLogo} alt="Point Logo" className="point-logo-img" />
        <span>{userData.point}</span>
        <span>tỏi</span>
      </div>

      <div className="profile-avatar">
        <img src={userData.avatar} alt="User Avatar" />
      </div>

      <div className="profile-details">
        <h2 className="profile-username">@{userData.username}</h2>
        
        <div className="gender-display">
          {getGenderIcon()}
          <span>không phải nam</span>
        </div>

        <div className="rating-display">
          <FaStar className='rating-display-icon'/>
          <span className='rating-display-point'>{userData.rating}%</span>
        </div>

        <div className="interests-section">
          <p>hứng thú với</p>
          <div className="hashtags-container">
            {userData.userHashtags?.map((tag, index) => (
              <span key={index} className="hashtag">{tag}</span>
            ))}
          </div>
        </div>

        <button 
          className="edit-profile-btn"
          onClick={() => navigate('/edit-profile')}
        >
          Chỉnh sửa
        </button>
      </div>
    </div>
  )
}

export default UserInfo