import { useState } from "react"
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
    <div style={{ borderTop: "1px solid #eee", padding: "16px" }}>
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
          style={{
            flex: "1",
            padding: "10px 16px",
            border: "1px solid #ddd",
            borderRadius: "20px",
            outline: "none",
            fontSize: "14px",
          }}
        />
        <button
          onClick={handleAddComment}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Post
        </button>
      </div>

      <div>
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