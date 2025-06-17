import { useState } from "react"
import { FaRegComment, FaHeart, FaRegHeart } from "react-icons/fa"
import { BiLike } from "react-icons/bi"
import { IoSend } from "react-icons/io5"

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
        marginLeft: isReply ? "14px" : "0",
        paddingLeft: isReply ? "16px" : "0",
        borderLeft: isReply ? "1px solid black" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        {/* <img 
          src={comment.user.avatar} 
          style={{
            width: "45px",
            height: "32px",
            borderRadius: "50%"
          }} 
          alt={comment.user.userName}
        /> */}
        <span style={{ fontSize: "1.5rem", fontWeight: "700", color: "#333" }}>@{comment.user.userName}</span>
        <p style={{ fontSize: "1.5rem", lineHeight: "1.5", color: "#646464", margin: "0", marginTop: "1px", marginLeft: "2px" }}>{comment.content}</p>
      </div>

      {/* <div style={{ marginBottom: "8px" }}>
        <p style={{ fontSize: "14px", lineHeight: "1.5", color: "#333", margin: "0" }}>{comment.content}</p>
      </div> */}

      <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
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
            fontSize: "16px",
            padding: "4px 8px",
            borderRadius: "12px",
          }}
        >
          <FaRegComment /> Trả lời
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
            fontSize: "18px",
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
            fontSize: "16px",
            padding: "4px 8px",
            borderRadius: "12px",
          }}
        >
          <FaRegHeart /> {commentHearts > 0 && commentHearts}
        </button>
      </div>

      {isReplying && (
        <div style={{ position: "relative", marginBottom: "12px" }}>
          <input
            type="text"
            placeholder={`Trả lời ${comment.user.userName}...`}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleReply()}
            style={{
              width: "100%",
              padding: "10px 48px 10px 16px", // room for the button inside
              outline: "none",
              fontSize: "1.1rem",
              fontWeight: "600",
              border: "1px solid #ccc",
              borderRadius: "6px",
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={handleReply}
            style={{
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
              background: "transparent",
              color: "black",
              border: "none",
              padding: "6px 10px",
              cursor: "pointer",
              fontSize: "1.6rem",
            }}
          >
            <IoSend />
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