import { useState, useRef, useEffect, useContext } from "react"
import { useNavigate } from "react-router"
import { Card } from "react-bootstrap"
import { IoMdEyeOff, IoMdClose } from "react-icons/io"
import { FaEllipsisH } from "react-icons/fa"
import { MdOutlineBlock, MdOutlineReport, MdOutlineShare, MdDelete, MdZoomIn, MdZoomOut } from "react-icons/md"
import CommentSection from "./CommentSection"
import ReviewActions from "./ReviewAction"
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
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const mediaRef = useRef(null)

  const handlePostClick = () => {
    navigate(`/post/${post.reviewID}`)
    window.scrollTo(0, 0)
  }

  const handleOptionsClick = (e) => {
    e.stopPropagation()
    setShowOptions(!showOptions)
  }

  const handleOptionAction = (e, action) => {
    e.stopPropagation()
    if (action === 'share') {
      handleShare()
      setShowOptions(false)
      return
    }

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

  const handleMediaClick = (e, index) => {
    e.stopPropagation()
    setCurrentMediaIndex(index)
    setShowMediaModal(true)
    setZoomLevel(1)
    setPanPosition({ x: 0, y: 0 })
  }

  const handleCloseModal = () => {
    setShowMediaModal(false)
    setZoomLevel(1)
    setPanPosition({ x: 0, y: 0 })
  }

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - panPosition.x,
        y: e.clientY - panPosition.y
      })
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheelZoom = (e) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      handleZoomIn()
    } else {
      handleZoomOut()
    }
  }

  const goToPreviousMedia = () => {
    setCurrentMediaIndex(prev => 
      prev === 0 ? post.reviewMedias.length - 1 : prev - 1
    )
    setZoomLevel(1)
    setPanPosition({ x: 0, y: 0 })
  }

  const goToNextMedia = () => {
    setCurrentMediaIndex(prev => 
      prev === post.reviewMedias.length - 1 ? 0 : prev + 1
    )
    setZoomLevel(1)
    setPanPosition({ x: 0, y: 0 })
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showMediaModal) {
        switch (e.key) {
          case 'Escape':
            handleCloseModal()
            break
          case 'ArrowLeft':
            goToPreviousMedia()
            break
          case 'ArrowRight':
            goToNextMedia()
            break
          case '+':
          case '=':
            handleZoomIn()
            break
          case '-':
            handleZoomOut()
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showMediaModal, post.reviewMedias?.length])

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

  const sortedMedias = post.reviewMedias?.sort((a, b) => a.orderDisplay - b.orderDisplay) || []

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
          <div className="report-modal-overlay" onClick={() => setShowReportModal(false)}>
            <div className="report-modal-content" onClick={(e) => e.stopPropagation()}>
              <p>Vui lòng ghi rõ lý do báo cáo bài viết này</p>
              <textarea
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                placeholder="Nhập lý do báo cáo..."
                className="report-textarea"
                rows={4}
              />
              <div className="report-modal-buttons">
                <button 
                  onClick={() => setShowReportModal(false)}
                  className="report-btn-cancel"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleReportSubmit}
                  className="report-btn-submit"
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>
        )}

        {showMediaModal && sortedMedias.length > 0 && (
          <div className="media-modal-overlay" onClick={handleCloseModal}>
            <div className="media-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="media-modal-close" onClick={handleCloseModal}>
                <IoMdClose />
              </button>

              {sortedMedias.length > 1 && (
                <>
                  <button className="media-modal-nav media-modal-prev" onClick={goToPreviousMedia}>
                    &#8249;
                  </button>
                  <button className="media-modal-nav media-modal-next" onClick={goToNextMedia}>
                    &#8250;
                  </button>
                </>
              )}

              <div className="media-modal-controls">
                <button className="media-control-btn" onClick={handleZoomOut}>
                  <MdZoomOut />
                </button>
                <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
                <button className="media-control-btn" onClick={handleZoomIn}>
                  <MdZoomIn />
                </button>
              </div>

              <div 
                className="media-modal-media-container"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheelZoom}
              >
                {sortedMedias[currentMediaIndex].typeUploadReview === "IMAGE" ? (
                  <img
                    ref={mediaRef}
                    src={sortedMedias[currentMediaIndex].urlImageGIFVideo || "/placeholder.svg?height=200&width=300"}
                    alt={`Review media ${sortedMedias[currentMediaIndex].orderDisplay}`}
                    className="media-modal-media"
                    style={{
                      transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
                      cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                      transition: isDragging ? 'none' : 'transform 0.2s ease'
                    }}
                    draggable={false}
                  />
                ) : (
                  <video
                    ref={mediaRef}
                    src={sortedMedias[currentMediaIndex].urlImageGIFVideo}
                    controls
                    className="media-modal-media"
                    style={{
                      transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
                      transition: isDragging ? 'none' : 'transform 0.2s ease'
                    }}
                  />
                )}
              </div>

              {sortedMedias.length > 1 && (
                <div className="media-modal-counter">
                  {currentMediaIndex + 1} / {sortedMedias.length}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="review-header">
          <div className="review-tags-container">
            {post.reviewHashtags.length > 0 ? (
              post.reviewHashtags.map(tag => (
                <div key={tag.id} className="review-tag">{tag.name}</div>
              ))
            ) : (
              <div className="review-tag">toireview</div>
            )}
          </div>
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
            {sortedMedias.map((media, index) => (
              <div 
                key={media.id} 
                style={{ 
                  borderRadius: "8px", 
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative"
                }}
                onClick={(e) => handleMediaClick(e, index)}
              >
                {media.typeUploadReview === "IMAGE" ? (
                  <img
                    src={media.urlImageGIFVideo || "/placeholder.svg?height=200&width=300"}
                    alt={`Review media ${media.orderDisplay}`}
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      maxHeight: "600px", 
                      objectFit: "cover",
                      transition: "transform 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                    onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                  />
                ) : (
                  <video
                    src={media.urlImageGIFVideo}
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      maxHeight: "600px", 
                      objectFit: "cover",
                      transition: "transform 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                    onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                  />
                )}
                <div 
                  className="media-overlay"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.2s ease"
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = "1"}
                  onMouseLeave={(e) => e.target.style.opacity = "0"}
                >
                  <MdZoomIn style={{ color: "white", fontSize: "2rem" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        <ReviewActions
          post={post}
          onToggleComments={() => setShowComments(!showComments)}
        />

        {showCommentSection && <CommentSection post={post} user={user} />}
      </Card.Body>
    </Card>
  )
}

export default Review