import { useContext, useState } from 'react'
import { FaHeart, FaRegHeart, FaRegCommentDots, FaRegClock, FaBookmark, FaRegBookmark } from 'react-icons/fa'
import { BiSolidLike, BiLike } from 'react-icons/bi'
import { LuStar } from "react-icons/lu"

import { saveReview, unSaveReview } from "../../serviceAPI/reviewService"
import { useToast } from '../../component/Toast'
import { UserContext } from '../../App'
import { useNavigate } from 'react-router'

const ReviewActions = ({ post, onToggleComments }) => {
  const [review, setReview] = useState(post)
  const { user } = useContext(UserContext)
  const [liked, setLiked] = useState(false)
  const [hearted, setHearted] = useState(false)
  const [bookmarked, setBookmarked] = useState(post.isSaved)
  const likeCount = review.likes.filter((like) => like.type === "LIKE").length
  const heartCount = review.likes.filter((like) => like.type === "HEART").length

  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const navigate = useNavigate()

  const { addToast } = useToast();

  const handleLikeClick = () => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }
    setLiked(!liked)
  }

  const handleHeartClick = () => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }
    setHearted(!hearted)
  }

    const handleLogin = () => {
    setShowLoginPrompt(false)
    navigate("/login")
  }

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false)
  }

  const handleBookmarkClick = () => {

    if (!user) {
      setShowLoginPrompt(true)
      return
    }

    setBookmarked(!bookmarked)

    const params = {
        reviewerID: review.reviewID,
        userID: user.id
    }

    if (!bookmarked) {
      saveReviewAPI(params);
    } else {
      unSaveReviewAPI(params);
    }

  }

  const saveReviewAPI = async (formData) => {
    try {
      const resultPurposes = await saveReview(formData)

      if (resultPurposes.status == "Success") {

        setReview(resultPurposes.data)
        addToast("Bạn đã lưu lại bài đăng thành công", true, false);
      } else {
        addToast(`Dã có lỗi, Vui lòng thử lại`, false, true);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi gọi api review:", error)
      alert(error.error)
    } 
  }

    const unSaveReviewAPI = async (formData) => {
    try {
      const resultPurposes = await unSaveReview(formData)

      if (resultPurposes.status == "Success") {

        setReview(resultPurposes.data)
        addToast("Bạn đã gỡ lưu lại bài đăng thành công", true, false);
      } else {
        addToast(`Dã có lỗi, Vui lòng thử lại`, false, true);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi gọi api review:", error)
      alert(error.error)
      } 
  }

  return (
    <div className="review-actions">
      <div className={`action-item ${likeCount > 0 ? 'liked' : ''}`} 
          onClick={(e) => {
            e.stopPropagation()
            handleLikeClick()
          }}>
        <span className="like-icon">
          {liked ? <BiSolidLike /> : <BiLike />}
        </span>
        <span>{likeCount > 0 ? likeCount : '0'}</span>
      </div>

      <div className={`action-item ${heartCount > 0 ? 'hearted' : ''}`} 
          onClick={(e) => {
            e.stopPropagation()
            handleHeartClick()
          }}>
        <span className="heart-icon">
          {hearted > 0 ? <FaHeart /> : <FaRegHeart />}
        </span>
        <span>{heartCount > 0 ? heartCount : '0'}</span>
      </div>

      <div className="action-item" onClick={onToggleComments}>
        <span className="comment-icon">
          <FaRegCommentDots />
        </span>
        <span>{review.comments ? review.comments.length : 0}</span>
      </div>

      <div className="action-item">
        <span className="action-star-icon"><LuStar /></span> 20%
      </div>

      {/* <div className="action-item">
        <span className="time-icon"><FaRegClock /></span> 1 day ago
      </div> */}

      <div className={`action-item bookmark ${review.isSaved ? 'bookmarked' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            handleBookmarkClick()
          }}>
        <span className="bookmark-icon">
          {review.isSaved ? <FaBookmark /> : <FaRegBookmark />}
        </span>
      </div>
      {showLoginPrompt && (
          <div className="home-login-popup-overlay" onClick={handleCloseLoginPrompt}>
            <div className="home-login-popup-modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="home-login-popup-title">
                Đăng nhập để tiếp tục
              </h3>
              
              <div className="home-login-popup-buttons">
                <button 
                  onClick={handleCloseLoginPrompt}
                  className="home-login-popup-btn home-login-popup-btn-close"
                >
                  Đóng
                </button>
                <button 
                  onClick={handleLogin}
                  className="home-login-popup-btn home-login-popup-btn-login"
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default ReviewActions