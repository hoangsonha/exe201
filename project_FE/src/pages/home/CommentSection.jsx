import { useState } from "react"
import { IoSend } from "react-icons/io5"
import CommentItem from "./CommentItem"

const CommentSection = ({ post }) => {
  const [newComment, setNewComment] = useState("")

  const handleAddComment = () => {
    if (newComment.trim()) {
      console.log(`Adding comment to review ${post.reviewID}:`, newComment)
      setNewComment("")
    }
  }

  return (
    <div style={{ borderTop: "1px solid black", padding: "16px", paddingTop: "23px" }}>
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Bình luận của bạn..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
          style={{
            width: "100%",
            padding: "10px 50px 10px 16px",
            outline: "none",
            fontSize: "1.4rem",
            fontWeight: "600",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={handleAddComment}
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            background: "transparent",
            color: "black",
            border: "none",
            padding: "6px 8px",
            cursor: "pointer",
            fontSize: "1.6rem",
          }}
        >
          <IoSend />
        </button>
      </div>
      
      <div style={{ marginBottom: "25px"}}>
        {post.comments && post.comments.map((comment) => (
          <CommentItem 
            key={comment.commentID} 
            comment={comment} 
            reviewId={post.reviewID} 
          />
        ))}
      </div>
    </div>
  )
}

export default CommentSection