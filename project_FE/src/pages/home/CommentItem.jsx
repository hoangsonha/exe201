import { useState, useContext, useEffect } from "react"
import { FaRegComment, FaHeart, FaRegHeart } from "react-icons/fa"
import { BiLike, BiSolidLike } from "react-icons/bi"
import { IoSend } from "react-icons/io5"
import { replyComment } from "../../serviceAPI/commentService"
import { toggleLike } from "../../serviceAPI/likeService"
import { UserContext } from "../../App"
import { toast } from "react-toastify"
import "./CommentSection.css"

const CommentItem = ({ comment, reviewId, isReply = false, activeReplyId, onReplyToggle }) => {
  const [replyContent, setReplyContent] = useState("")
  const [replies, setReplies] = useState(comment.replies || [])
  const [commentData, setCommentData] = useState(comment)
  const [liked, setLiked] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  
  const { user } = useContext(UserContext)
  
  const commentLikes = commentData.likes?.filter((like) => like.type === "LIKE").length || 0
  const commentHearts = commentData.likes?.filter((like) => like.type === "HEART").length || 0

  const isReplying = activeReplyId === comment.commentID

  useEffect(() => {
    if (user && commentData.likes) {
      const isLiked = commentData.likes.some(
        like => like.type === "LIKE" && like.user?.userId === user.id
      )
      setLiked(isLiked)
    }
  }, [user, commentData.likes])

  const handleLikeClick = async () => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }

    try {
      await toggleLike("COMMENT", commentData.commentID)

      const updatedLikes = liked
        ? commentData.likes.filter(like => !(like.type === "LIKE" && like.user?.userId === user.id))
        : [...(commentData.likes || []), { type: "LIKE", user: { userId: user.id } }]

      setCommentData(prev => ({ ...prev, likes: updatedLikes }))
      setLiked(!liked)
    } catch (error) {
      console.error("Toggle like failed:", error)
      toast.error("Đã có lỗi khi like bình luận")
    }
  }

  const handleLogin = () => {
    setShowLoginPrompt(false)
  }

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false)
  }

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
    <>
      <div className={`comment-item ${isReply ? 'comment-item--reply' : ''}`}>
        <div className="comment-item__header">
          <span className="comment-item__username">@{commentData.user.userName}</span>
          <p className="comment-item__content">{commentData.content}</p>
        </div>

        <div className="comment-item__actions">
          <button
            onClick={handleLikeClick}
            className={`comment-item__action-btn comment-item__like-btn ${liked ? 'comment-item__like-btn--active' : ''}`}
          >
            {liked ? <BiSolidLike /> : <BiLike />} {commentLikes > 0 && commentLikes}
          </button>

          {/* <button
            onClick={() => console.log(`Heart comment ${commentData.commentID}`)}
            className={`comment-item__action-btn comment-item__heart-btn ${commentHearts > 0 ? 'comment-item__heart-btn--active' : ''}`}
          >
            <FaRegHeart /> {commentHearts > 0 && commentHearts}
          </button> */}
          
          <button
            onClick={toggleReply}
            className="comment-item__action-btn comment-item__reply-btn"
          >
            <FaRegComment /> Trả lời
          </button>
        </div>

        {isReplying && (
          <div className="comment-item__reply-input-container">
            <input
              type="text"
              placeholder={`Trả lời ${commentData.user.userName}...`}
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
    </>
  )
}

export default CommentItem