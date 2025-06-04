import { BiLike } from "react-icons/bi"
import { FaHeart, FaComment, FaShare, FaBookmark, FaRegBookmark } from "react-icons/fa"

const ReviewActions = ({ post, onToggleComments }) => {
  const likeCount = post.likes.filter((like) => like.type === "LIKE").length
  const heartCount = post.likes.filter((like) => like.type === "HEART").length

  return (
    <div style={{ padding: "12px 16px", borderTop: "1px solid #eee" }}>
      <div style={{ display: "flex", gap: "16px" }}>
        <button
          onClick={() => console.log(`Like review ${post.reviewID}`)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            color: likeCount > 0 ? "#007bff" : "#666",
            cursor: "pointer",
            padding: "8px 12px",
            borderRadius: "20px",
            fontSize: "14px",
          }}
        >
          <BiLike />
          {likeCount > 0 && <span>{likeCount}</span>}
        </button>

        <button
          onClick={() => console.log(`Heart review ${post.reviewID}`)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            color: heartCount > 0 ? "#ff4757" : "#666",
            cursor: "pointer",
            padding: "8px 12px",
            borderRadius: "20px",
            fontSize: "14px",
          }}
        >
          <FaHeart />
          {heartCount > 0 && <span>{heartCount}</span>}
        </button>

        <button
          onClick={onToggleComments}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            color: "#666",
            cursor: "pointer",
            padding: "8px 12px",
            borderRadius: "20px",
            fontSize: "14px",
          }}
        >
          <FaComment />
          <span>{post.comments ? post.comments.length : 0}</span>
        </button>

        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            color: "#666",
            cursor: "pointer",
            padding: "8px 12px",
            borderRadius: "20px",
            fontSize: "14px",
          }}
        >
          <FaShare />
        </button>

        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            color: post.isSaved ? "#007bff" : "#666",
            cursor: "pointer",
            padding: "8px 12px",
            borderRadius: "20px",
            fontSize: "14px",
          }}
        >
          {post.isSaved ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>
    </div>
  )
}

export default ReviewActions