import { useNavigate } from 'react-router-dom'
import { FaMale, FaFemale, FaStar } from 'react-icons/fa'
import { BsGenderAmbiguous, BsStar } from 'react-icons/bs'
import pointLogo from '@/assets/logo.png'
import './UserProfile.css'

const UserInfo = ({ userData }) => {
  const navigate = useNavigate();

  const getGenderDisplay = () => {
    if (!userData || !userData.gender) {
      return {
        icon: <BsGenderAmbiguous />,
        text: 'Không xác định'
      }
    }
    switch (userData.gender) {
      case 'Male':
        return {
          icon: <FaMale />,
          text: 'Không phải nữ'
        }
      case 'Female':
        return {
          icon: <FaFemale />,
          text: 'Không phải nam'
        }
      default:
        return {
          icon: <BsGenderAmbiguous />,
          text: 'Không xác định'
        }
    }
  }

  const genderDisplay = getGenderDisplay()

  return (
    <div className="profile-info-section">
      <div className="point-display">
        <img src={pointLogo} alt="Point Logo" className="point-logo-img" />
        <span className="point-display-value">{userData?.point ?? 0}</span>
        <span>tỏi</span>
      </div>

      <div className="profile-avatar">
        <img src={userData?.avatar} alt="User Avatar" />
      </div>

      <div className="profile-details">
        <h2 className="profile-username">
          <span className="at-symbol">@</span>{userData?.userName}
        </h2>
        <div className="gender-display">
          {genderDisplay.icon}
          <span>{genderDisplay.text}</span>
        </div>

        <div className="rating-display">
          <FaStar className='rating-display-icon'/>
          <span className='rating-display-point'>{userData?.rating ?? '--'}%</span>
        </div>

        <div className="interests-section">
          <p>hứng thú với</p>
          <div className="hashtags-container">
            {userData?.listHashTagUser && userData?.listHashTagUser.length > 0 ? (
              userData.listHashTagUser.map((hashtag, index) => (
                <span key={index} className="hashtag">{hashtag.name} </span>
              ))
            ) : (
              <span>Chưa chọn topic</span>
            )}
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