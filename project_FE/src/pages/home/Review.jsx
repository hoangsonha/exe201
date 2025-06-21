import { useState, useRef, useEffect, useContext } from "react"
import { useNavigate } from "react-router"
import { Card } from "react-bootstrap"
import { IoMdEyeOff } from "react-icons/io"
import { FaEllipsisH } from "react-icons/fa"
import { MdOutlineBlock, MdOutlineReport, MdOutlineShare, MdDelete } from "react-icons/md"
import CommentSection from "./CommentSection"
import ReviewActions from "./ReviewAction"
import StarRating from "./StarRating"
import { UserContext } from "../../App"
import './Review.css'

const Review = ({ post, showCommentSection = false, isOwner = false }) => {
  const [likeCount, setLikeCount] = useState(post.likes.filter((like) => like.type === "LIKE").length)
  const [showOptions, setShowOptions] = useState(false)
  const navigate = useNavigate()
  const optionsRef = useRef(null)
  const [showComments, setShowComments] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const { user } = useContext(UserContext)

  const handlePostClick = () => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }
    navigate(`/post/${post.reviewID}`)
    window.scrollTo(0, 0)
  }

  const handleOptionsClick = (e) => {
    e.stopPropagation()
    setShowOptions(!showOptions)
  }

  const handleOptionAction = (e, action) => {
    e.stopPropagation()
    if (!user) {
      setShowLoginPrompt(true)
      return
    }
    setShowOptions(false)
  }

  const handleLogin = () => {
    setShowLoginPrompt(false)
    navigate("/login")
  }

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target))
        setShowOptions(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <Card className="review-card" onClick={handlePostClick}>
      <Card.Body>
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
        <div className="review-header">
          {post.reviewHashtags.length > 0 ? (
            post.reviewHashtags.map(tag => (
              <div key={tag.id} className="review-tag">{tag.name}</div>
            ))
          ) : (
            <div className="review-tag">toireview</div>
          )}
          <div className="review-options-container" ref={optionsRef}>
            <div className="review-options" onClick={handleOptionsClick}>
              <FaEllipsisH />
            </div>
            {showOptions && (
              <div className="options-dropdown">
                {isOwner ? (
                  <>
                    <div className="option-item" onClick={(e) => handleOptionAction(e, 'edit')}>
                      <IoMdEyeOff /> ẩn bài viết
                    </div>
                    <div className="option-item" onClick={(e) => handleOptionAction(e, 'delete')}>
                      <MdDelete /> xóa bài viết
                    </div>
                  </>
                ) : (
                  <>
                    <div className="option-item" onClick={(e) => handleOptionAction(e, 'hide')}>
                      <IoMdEyeOff /> ẩn bài viết
                    </div>
                    <div className="option-item" onClick={(e) => handleOptionAction(e, 'block')}>
                      <MdOutlineBlock /> chặn
                    </div>
                    <div className="option-item" onClick={(e) => handleOptionAction(e, 'report')}>
                      <MdOutlineReport /> báo cáo
                    </div>
                    <div className="option-item" onClick={(e) => handleOptionAction(e, 'share')}>
                      <MdOutlineShare /> chia sẻ liên kết
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <h4 className="review-title">{post.title}</h4>
        <p className="review-content">{post.content}</p>
        

        {post.reviewMedias && post.reviewMedias.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            {post.reviewMedias
              .sort((a, b) => a.orderDisplay - b.orderDisplay)
              .map((media) => (
                <div key={media.id} style={{ borderRadius: "8px", overflow: "hidden" }}>
                  {media.typeUploadReview === "IMAGE" ? (
                    <img
                      src={media.urlImageGIFVideo || "/placeholder.svg?height=200&width=300"}
                      alt={`Review media ${media.orderDisplay}`}
                      style={{ width: "100%", height: "100%", maxHeight: "600px", objectFit: "cover" }}
                    />
                  ) : (
                    <video
                      src={media.urlImageGIFVideo}
                      controls
                      style={{ width: "100%", height: "100%", maxHeight: "600px", objectFit: "cover" }}
                    />
                  )}
                </div>
              ))}
          </div>
        )}

        <ReviewActions
          post={post}
          onToggleComments={() => setShowComments(!showComments)}
        />

        {showCommentSection && <CommentSection post={post} />}
      </Card.Body>
    </Card>
  )
}

export default Review