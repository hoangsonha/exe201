import { useState } from "react"
import { IoSend } from "react-icons/io5"
import CommentItem from "./CommentItem"
import { createReviewComment } from "../../serviceAPI/commentService"
import "./CommentSection.css"

const CommentSection = ({ post }) => {
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState(post.comments || [])
  const [activeReplyId, setActiveReplyId] = useState(null)
  
  const handleAddComment = async () => {
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

  return (
    <div className="comment-section">
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