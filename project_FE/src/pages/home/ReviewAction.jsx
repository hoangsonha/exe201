import { useContext, useState, useEffect } from 'react'
import { FaHeart, FaRegHeart, FaRegCommentDots, FaBookmark, FaRegBookmark } from 'react-icons/fa'
import { BiSolidLike, BiLike } from 'react-icons/bi'
import { IoStar, IoStarOutline, IoStarHalf } from 'react-icons/io5'
import { LuStar } from 'react-icons/lu'
import { saveReview, unSaveReview } from '../../serviceAPI/reviewService'
import { createRating } from '../../serviceAPI/ratingService'
import { useToast } from '../../component/Toast'
import { UserContext } from '../../App'
import { useNavigate } from 'react-router'
import { toggleLike, toggleHeart } from '../../serviceAPI/likeService'
import { getUserSavedPosts } from '../../serviceAPI/userService'
import { toast } from 'react-toastify'
import { Modal } from 'react-bootstrap'
import StarRating from './StarRating'

const ReviewActions = ({ post, onToggleComments }) => {
  const [review, setReview] = useState(post)
  const { user } = useContext(UserContext)
  const [liked, setLiked] = useState(false)
  const [hearted, setHearted] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const likeCount = review.likes?.filter((like) => like.type === "LIKE").length || 0
  const heartCount = review.likes?.filter((like) => like.type === "HEART").length || 0
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  const navigate = useNavigate()
  const { addToast } = useToast()

  useEffect(() => {
    const initPostInteractionStates = async () => {
      if (!user) return

      const isLiked = post.likes?.some(
        like => like.type === "LIKE" && like.user?.userId === user.id
      )
      const isHearted = post.likes?.some(
        like => like.type === "HEART" && like.user?.userId === user.id
      )

      setLiked(isLiked)
      setHearted(isHearted)

      const existingRating = review.ratings?.find(rating => rating.user?.userId === user.id)
      if (existingRating) {
        setUserRating(existingRating.stars)
        setHasRated(true)
      }

      try {
        const saved = await getUserSavedPosts(user.id)
        const savedPosts = saved.data || []
        const isBookmarked = savedPosts.some(p => p.reviewID === post.reviewID)
        setBookmarked(isBookmarked)
      } catch (err) {
        console.error("Failed to fetch saved posts:", err)
      }
    }

    initPostInteractionStates()
  }, [user, review.reviewID, review.likes, review.ratings])

  useEffect(() => {
    if (user && review?.ratings?.length > 0) {
      const existingRating = review.ratings.find(rating => rating.userId === user.id)
      if (existingRating) {
        setUserRating(existingRating.stars)
      }
    }
  }, [user, review, showRatingModal])

  const handleLikeClick = async () => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }

    try {
      await toggleLike("REVIEW", review.reviewID)

      const updatedLikes = liked
        ? review.likes.filter(like => !(like.type === "LIKE" && like.user?.userId === user.id))
        : [...review.likes, { type: "LIKE", user: { userId: user.id } }]

      setReview(prev => ({ ...prev, likes: updatedLikes }))
      setLiked(!liked)
    } catch (error) {
      console.error("Toggle like failed:", error)
      toast.error("Đã có lỗi khi like bài viết", false, true)
    }
  }

  const handleHeartClick = async () => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }

    try {
      await toggleHeart("REVIEW", review.reviewID)
      const updatedLikes = hearted
        ? review.likes.filter(like => !(like.type === "HEART" && like.user?.userId === user.id))
        : [...review.likes, { type: "HEART", user: { userId: user.id } }]

      setReview(prev => ({ ...prev, likes: updatedLikes }))
      setHearted(!hearted)
    } catch (error) {
      console.error("Toggle heart failed:", error)
      toast.error("Đã có lỗi khi tim bài viết", false, true)
    }
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

  const handleOpenRatingModal = () => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }
    setShowRatingModal(true)
  }

  const handleCloseRatingModal = () => {
    setShowRatingModal(false)
    setHoveredRating(0)
  }

  const handleUserRatingClick = async (rating) => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }

    try {
      const response = await createRating(user.id, review.reviewID, rating)
      
      if (response.status === "Success" || response.data) {
        setUserRating(rating)
        setHasRated(true)
        addToast("Đánh giá của bạn đã được lưu thành công", true, false)
        
        const updatedRatings = review.ratings ? [...review.ratings] : []
        const existingRatingIndex = updatedRatings.findIndex(r => r.userId === user.id)
        
        if (existingRatingIndex >= 0) {
          updatedRatings[existingRatingIndex] = { ...updatedRatings[existingRatingIndex], stars: rating }
        } else {
          updatedRatings.push({ userId: user.id, stars: rating })
        }

        setReview(prev => ({ ...prev, ratings: updatedRatings }))
      } else {
        addToast("Đã có lỗi khi lưu đánh giá", false, true)
      }
    } catch (error) {
      console.error("Create rating failed:", error)
      addToast("Đã có lỗi khi lưu đánh giá", false, true)
    }
  }

  const saveReviewAPI = async (formData) => {
    try {
      const resultPurposes = await saveReview(formData)

      if (resultPurposes.status == "Success") {

        setReview(resultPurposes.data)
      } else {
        addToast(`Đã có lỗi, Vui lòng thử lại`, false, true)
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
      } else {
        addToast(`Đã có lỗi, Vui lòng thử lại`, false, true);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi gọi api review:", error)
      alert(error.error)
      } 
  }

  return (
    <div className="review-actions">
      <div className={`action-item ${liked ? 'liked' : ''}`} 
        onClick={(e) => {
          e.stopPropagation()
          handleLikeClick()
        }}
      >
        <span className="like-icon">
          {liked ? <BiSolidLike /> : <BiLike />}
        </span>
        <span>{likeCount}</span>
      </div>

      {/* <div className={`action-item ${hearted ? 'hearted' : ''}`} 
        onClick={(e) => {
          e.stopPropagation()
          handleHeartClick()
        }}
      >
        <span className="heart-icon">
          {hearted ? <FaHeart /> : <FaRegHeart />}
        </span>
        <span>{heartCount}</span>
      </div> */}

      <div className="action-item" onClick={onToggleComments}>
        <span className="comment-icon">
          <FaRegCommentDots />
        </span>
        <span>{review.comments ? review.comments.length : 0}</span>
      </div>

      <div className="action-item"
        onClick={(e) => {
          e.stopPropagation()
          handleOpenRatingModal()
        }}
      >
        <span className="action-star-icon">
          <LuStar />
        </span>%
      </div>

      <div className={`action-item bookmark ${bookmarked ? 'bookmarked' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          handleBookmarkClick()
        }}
      >
        <span className="bookmark-icon">
          {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
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

      <Modal
        show={showRatingModal}
        onHide={handleCloseRatingModal}
        className='star-rating-modal'
      >
        <Modal.Body>
          <div className="star-rating-content">
            <div className="star-rating-header">
              <h3 className="star-rating-title">
                điểm tin cậy
                <span className="star-rating-beta">(beta)</span>
              </h3>
            </div>
            
            <div className="star-rating-section">
              <div className="star-rating-section-title">góc nhìn của bài viết:</div>
              <div className="star-rating-section-content">{post.perspective}</div>
            </div>

            <div className="star-rating-section">
              <div className="star-rating-section-title">độ liên quan:</div>
              <div className="star-rating-stars">
                {[1, 2, 3, 4, 5].map((star) => {
                  const rating = post.relevantStar || 0
                  return (
                    <span key={star} className="star">
                      {rating >= star ? (
                        <IoStar />
                      ) : rating >= star - 0.5 ? (
                        <IoStarHalf />
                      ) : (
                        <IoStarOutline />
                      )}
                    </span>
                  )
                })}
              </div>
            </div>

            <div className="star-rating-section">
              <div className="star-rating-section-title">tính khách quan:</div>
              <div className="star-rating-stars">
                {[1, 2, 3, 4, 5].map((star) => {
                  const rating = post.objectiveStar || 0
                  return (
                    <span key={star} className="star">
                      {rating >= star ? (
                        <IoStar />
                      ) : rating >= star - 0.5 ? (
                        <IoStarHalf />
                      ) : (
                        <IoStarOutline />
                      )}
                    </span>
                  )
                })}
              </div>
            </div>

            <div className="star-rating-divider"></div>

            <div className="star-rating-section">
              <div className="star-rating-section-title">Đánh giá chung:</div>
              <StarRating rating={review.ratings?.find(r => r.userId !== user?.id)?.stars || 0} />
            </div>

            <div className="star-rating-section">
              <div className="star-rating-section-title">Đánh giá của bạn:</div>
              <div className="user-rating-stars">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= (hoveredRating || userRating)
                  return (
                    <span 
                      key={star}
                      className={`star interactive-star ${isFilled ? 'filled' : 'empty'}`}
                      onClick={() => {
                        handleUserRatingClick(star)
                      }}
                      onMouseEnter={() => {
                        setHoveredRating(star)
                      }}
                      onMouseLeave={() => {
                        setHoveredRating(0)
                      }}
                    >
                      <IoStar />
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ReviewActions