import { useEffect, useState } from 'react'
import { FaHeart, FaRegHeart, FaRegCommentDots, FaRegClock, FaBookmark, FaRegBookmark } from 'react-icons/fa'
import { BiSolidLike, BiLike } from 'react-icons/bi'
import { LuStar } from "react-icons/lu"

const ReviewActions = ({ post, onToggleComments }) => {
  const [liked, setLiked] = useState(false)
  const [hearted, setHearted] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const likeCount = post.likes.filter((like) => like.type === "LIKE").length
  const heartCount = post.likes.filter((like) => like.type === "HEART").length

  const handleLikeClick = () => {
    setLiked(!liked)
  }

  const handleHeartClick = () => {
    setHearted(!hearted)
  }

  const handleBookmarkClick = () => {
    setBookmarked(!bookmarked)
  }

  return (
    <div className="review-actions">
      <div className={`action-item ${likeCount > 0 ? 'liked' : ''}`} 
          onClick={(e) => {
            e.stopPropagation()
            handleLikeClick()
          }}>
        <span className="like-icon">
          {liked ? <BiSolidLike /> : <BiLike />}
        </span>
        <span>{likeCount > 0 ? likeCount : '0'}</span>
      </div>

      <div className={`action-item ${heartCount > 0 ? 'hearted' : ''}`} 
          onClick={(e) => {
            e.stopPropagation()
            handleHeartClick()
          }}>
        <span className="heart-icon">
          {hearted > 0 ? <FaHeart /> : <FaRegHeart />}
        </span>
        <span>{heartCount > 0 ? heartCount : '0'}</span>
      </div>

      <div className="action-item" onClick={onToggleComments}>
        <span className="comment-icon">
          <FaRegCommentDots />
        </span>
        <span>{post.comments ? post.comments.length : 0}</span>
      </div>

      <div className="action-item">
        <span className="action-star-icon"><LuStar /></span> 20%
      </div>

      {/* <div className="action-item">
        <span className="time-icon"><FaRegClock /></span> 1 day ago
      </div> */}

      <div className={`action-item bookmark ${post.isSaved ? 'bookmarked' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            handleBookmarkClick()
          }}>
        <span className="bookmark-icon">
          {post.isSaved ? <FaBookmark /> : <FaRegBookmark />}
        </span>
      </div>
    </div>
  )
}

export default ReviewActions