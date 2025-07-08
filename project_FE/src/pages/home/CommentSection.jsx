import { useState } from "react"
import { IoSend } from "react-icons/io5"
import CommentItem from "./CommentItem"
import { createReviewComment } from "../../serviceAPI/commentService"
import "./CommentSection.css"
import { useNavigate } from "react-router"

const CommentSection = ({ post, user }) => {
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState(post.comments || [])
  const [activeReplyId, setActiveReplyId] = useState(null)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const navigate = useNavigate()

  const handleAddComment = async () => {
    if (!user){
      setShowLoginPrompt(true)
      return
    }
    if (newComment.trim()) {
      const res = await createReviewComment(post.reviewID, newComment)
      if (res) {
        console.log(`Adding comment to review ${post.reviewID}:`, newComment)
        setComments((prev) => [...prev, res.data])
        setNewComment("")
      }
    }
  }

  const handleReplyToggle = (commentId) => {
    setActiveReplyId(activeReplyId === commentId ? null : commentId)
  }

  const handleLogin = () => {
    setShowLoginPrompt(false)
    navigate("/login")
  }

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false)
  }

  return (
    <div className="comment-section">
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

      <div className="comment-input-container">
        <input
          type="text"
          placeholder="Bình luận của bạn..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
          className="comment-input"
        />
        <button
          onClick={handleAddComment}
          className="comment-submit-btn"
        >
          <IoSend />
        </button>
      </div>
      
      <div className="comments-list">
        {comments.map((comment) => (
          <CommentItem 
            key={comment.commentID} 
            comment={comment} 
            reviewId={post.reviewID}
            activeReplyId={activeReplyId}
            onReplyToggle={handleReplyToggle}
          />
        ))}
      </div>
    </div>
  )
}

export default CommentSection