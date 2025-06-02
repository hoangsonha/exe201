import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { FaRegHeart, FaRegCommentDots, FaRegStar, FaRegClock, FaEllipsisH, FaHeart } from "react-icons/fa";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { IoMdEyeOff } from "react-icons/io";
import { MdOutlineBlock, MdOutlineReport, MdOutlineShare } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import './ReviewPost.css';

const ReviewPost = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();
  const optionsRef = useRef(null);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(prevCount => liked ? prevCount - 1 : prevCount + 1);
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  const handlePostClick = () => {
    navigate(`/post/${post.id}`);
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    navigate(`/post/${post.id}?section=comments`);
  };

  const handleStarClick = (e) => {
    e.stopPropagation();
    navigate(`/post/${post.id}?section=rating`);
  };

  const handleOptionsClick = (e) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  const handleOptionAction = (e, action) => {
    e.stopPropagation();
    setShowOptions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Card className="review-card" onClick={handlePostClick}>
      <Card.Body>
        <div className="review-header">
          <div className="review-tag">toireview</div>
          <div className="review-options-container" ref={optionsRef}>
            <div className="review-options" onClick={handleOptionsClick}>
              <FaEllipsisH />
            </div>
            {showOptions && (
              <div className="options-dropdown">
                <div className="option-item" onClick={(e) => handleOptionAction(e, 'hide')}>
                  <IoMdEyeOff /> ẩn bài viết
                </div>
                <div className="option-item" onClick={(e) => handleOptionAction(e, 'block')}>
                  <MdOutlineBlock /> chặn
                </div>
                <div className="option-item" onClick={(e) => handleOptionAction(e, 'report')}>
                  <MdOutlineReport /> báo cáo
                </div>
                <div className="option-item" onClick={(e) => handleOptionAction(e, 'share')}>
                  <MdOutlineShare /> chia sẻ liên kết
                </div>
              </div>
            )}
          </div>
        </div>
        <h4 className="review-title">{post.title}</h4>
        <p className="review-content">{post.content}</p>
        <div className="review-actions">
          <div className={`action-item ${liked ? 'liked' : ''}`} onClick={handleLikeClick}>
            <span className="heart-icon">
              {liked ? <FaHeart /> : <FaRegHeart />}
            </span> {likeCount}
          </div>
          <div className="action-item" onClick={handleCommentClick}>
            <span className="comment-icon"><FaRegCommentDots /></span> {post.comments}
          </div>
          <div className="action-item" onClick={handleStarClick}>
            <span className="star-icon"><FaRegStar /></span> {post.rating}%
          </div>
          <div className="action-item">
            <span className="time-icon"><FaRegClock /></span> {post.time}
          </div>
          <div className={`action-item bookmark ${bookmarked ? 'bookmarked' : ''}`} onClick={handleBookmarkClick}>
            <span className="bookmark-icon">
              {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReviewPost; 