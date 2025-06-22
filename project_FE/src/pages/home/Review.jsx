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
import { blockReview } from "../../serviceAPI/reviewService"
import { reportReview } from "../../serviceAPI/reportService"
import { toast } from "react-toastify"
import './Review.css'

const Review = ({ post, showCommentSection = false }) => {
  const [showOptions, setShowOptions] = useState(false)
  const navigate = useNavigate()
  const optionsRef = useRef(null)
  const [showComments, setShowComments] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportContent, setReportContent] = useState('')
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

    switch (action) {
      case 'hide':
        handleHide()
        break
      case 'block':
        handleBlock()
        break
      case 'report':
        handleReport()
        break
      case 'share':
        handleShare()
        break
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

  const handleHide = () => {
    console.log("Hide post action triggered")
  }

  const handleBlock = async () => {
    try {
      const blockData = {
        reviewerID: post.reviewID,
        userID: user.id
      }
      
      const result = await blockReview(blockData)
      if (result.status === "Success") {
        toast.success("Đã chặn thành công!")
      } else {
        toast.error("Có lỗi xảy ra khi chặn.")
      }
    } catch (error) {
      console.error("Error blocking user:", error)
      toast.error("Có lỗi xảy ra")
    }
  }

  const handleReport = () => {
    setShowReportModal(true)
  }

  const handleReportSubmit = async () => {
    if (!reportContent.trim()) {
      toast.info("Vui lòng nhập lý do báo cáo")
      return
    }
    
    try {
      const result = await reportReview(post.reviewID, { content: reportContent })
      console.log("Report result:", result)
      if (result) {
        toast.success("Đã báo cáo bài viết thành công!")
        setShowReportModal(false)
        setReportContent('')
      } else {
        toast.error("Có lỗi xảy ra khi báo cáo. Vui lòng thử lại sau.")
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra")
    }
  }

  const handleShare = async () => {
    try {
      const currentUrl = `${window.location.origin}/post/${post.reviewID}`
      await navigator.clipboard.writeText(currentUrl)
      
      toast.success("Đã sao chép liên kết bài viết vào clipboard")
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      toast.error("Không thể sao chép liên kết")
    }
  }

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

        {showReportModal && (
          <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <p>Vui lòng ghi rõ lý do báo cáo bài viết này</p>
              <textarea
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                placeholder="Nhập lý do báo cáo..."
                className="report-textarea"
                rows={4}
              />
              <div className="modal-buttons">
                <button 
                  onClick={() => setShowReportModal(false)}
                  className="btn-cancel"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleReportSubmit}
                  className="btn-submit"
                >
                  Gửi
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