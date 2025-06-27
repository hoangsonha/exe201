import { useState } from "react"
import { FaRegComment, FaHeart, FaRegHeart } from "react-icons/fa"
import { BiLike } from "react-icons/bi"
import { IoSend } from "react-icons/io5"
import { replyComment } from "../../serviceAPI/commentService"
import "./CommentSection.css"

const CommentItem = ({ comment, reviewId, isReply = false, activeReplyId, onReplyToggle }) => {
  const [replyContent, setReplyContent] = useState("")
  const [replies, setReplies] = useState(comment.replies || [])
  
  const commentLikes = comment.likes.filter((like) => like.type === "LIKE").length
  const commentHearts = comment.likes.filter((like) => like.type === "HEART").length

  const isReplying = activeReplyId === comment.commentID

  const toggleReply = () => {
    onReplyToggle(comment.commentID)
    if (isReplying) {
      setReplyContent("")
    }
  }

  const handleReply = async () => {
    if (replyContent.trim()) {
      const res = await replyComment(comment.commentID, replyContent)
      if (res) {
        console.log(`Replying to comment ${comment.commentID}:`, replyContent)
        setReplies(prev => [...prev, res.data])
        setReplyContent("")
        onReplyToggle(null)
      }
    }
  }

  return (
    <div className={`comment-item ${isReply ? 'comment-item--reply' : ''}`}>
      <div className="comment-item__header">
        <span className="comment-item__username">@{comment.user.userName}</span>
        <p className="comment-item__content">{comment.content}</p>
      </div>

      <div className="comment-item__actions">
        <button
          onClick={toggleReply}
          className="comment-item__action-btn comment-item__reply-btn"
        >
          <FaRegComment /> Trả lời
        </button>

        <button
          onClick={() => console.log(`Like comment ${comment.commentID}`)}
          className={`comment-item__action-btn comment-item__like-btn ${commentLikes > 0 ? 'comment-item__like-btn--active' : ''}`}
        >
          <BiLike /> {commentLikes > 0 && commentLikes}
        </button>

        <button
          onClick={() => console.log(`Heart comment ${comment.commentID}`)}
          className={`comment-item__action-btn comment-item__heart-btn ${commentHearts > 0 ? 'comment-item__heart-btn--active' : ''}`}
        >
          <FaRegHeart /> {commentHearts > 0 && commentHearts}
        </button>
      </div>

      {isReplying && (
        <div className="comment-item__reply-input-container">
          <input
            type="text"
            placeholder={`Trả lời ${comment.user.userName}...`}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleReply()}
            className="comment-item__reply-input"
            autoFocus
          />
          <button
            onClick={handleReply}
            className="comment-item__reply-submit-btn"
          >
            <IoSend />
          </button>
        </div>
      )}

      {replies && replies.length > 0 && (
        <div className="comment-item__replies">
          {replies.map((reply) => (
            <CommentItem 
              key={reply.commentID} 
              comment={reply} 
              reviewId={reviewId} 
              isReply={true}
              activeReplyId={activeReplyId}
              onReplyToggle={onReplyToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentItem