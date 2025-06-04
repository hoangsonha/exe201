import { useState } from "react"
import { FaComment, FaHeart } from "react-icons/fa"
import { BiLike } from "react-icons/bi"

const CommentItem = ({ comment, reviewId, isReply = false }) => {
  const [replyContent, setReplyContent] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  
  const commentLikes = comment.likes.filter((like) => like.type === "LIKE").length
  const commentHearts = comment.likes.filter((like) => like.type === "HEART").length

  const toggleReply = () => {
    setIsReplying(!isReplying)
  }

  const handleReply = () => {
    if (replyContent.trim()) {
      console.log(`Replying to comment ${comment.commentID}:`, replyContent)
      setReplyContent("")
      setIsReplying(false)
    }
  }

  return (
    <div
      style={{
        marginBottom: "16px",
        marginLeft: isReply ? "40px" : "0",
        paddingLeft: isReply ? "16px" : "0",
        borderLeft: isReply ? "2px solid #eee" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <img 
          src={comment.user.avatar} 
          style={{
            width: "45px",
            height: "32px",
            borderRadius: "50%"
          }} 
          alt={comment.user.userName}
        />
        <span style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>{comment.user.userName}</span>
      </div>

      <div style={{ marginBottom: "8px" }}>
        <p style={{ fontSize: "14px", lineHeight: "1.5", color: "#333", margin: "0" }}>{comment.content}</p>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
        <button
          onClick={toggleReply}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: "none",
            border: "none",
            color: "#666",
            cursor: "pointer",
            fontSize: "12px",
            padding: "4px 8px",
            borderRadius: "12px",
          }}
        >
          <FaComment /> Reply
        </button>

        <button
          onClick={() => console.log(`Like comment ${comment.commentID}`)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: "none",
            border: "none",
            color: commentLikes > 0 ? "#007bff" : "#666",
            cursor: "pointer",
            fontSize: "12px",
            padding: "4px 8px",
            borderRadius: "12px",
          }}
        >
          <BiLike /> {commentLikes > 0 && commentLikes}
        </button>

        <button
          onClick={() => console.log(`Heart comment ${comment.commentID}`)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: "none",
            border: "none",
            color: commentHearts > 0 ? "#ff4757" : "#666",
            cursor: "pointer",
            fontSize: "12px",
            padding: "4px 8px",
            borderRadius: "12px",
          }}
        >
          <FaHeart /> {commentHearts > 0 && commentHearts}
        </button>
      </div>

      {isReplying && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <input
            type="text"
            placeholder={`Reply to ${comment.user.userName}...`}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleReply()}
            style={{
              flex: "1",
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "16px",
              outline: "none",
              fontSize: "12px",
            }}
          />
          <button
            onClick={handleReply}
            style={{
              padding: "8px 16px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "16px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Send
          </button>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: "12px" }}>
          {comment.replies.map((reply) => (
            <CommentItem 
              key={reply.commentID} 
              comment={reply} 
              reviewId={reviewId} 
              isReply={true} 
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentItem