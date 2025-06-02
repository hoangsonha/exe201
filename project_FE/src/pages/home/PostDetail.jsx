import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { FaRegHeart, FaRegCommentDots, FaRegStar, FaRegClock, FaEllipsisH, FaHeart } from "react-icons/fa";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { RiArrowGoBackFill } from "react-icons/ri";
import { IoMdEyeOff } from "react-icons/io";
import { MdOutlineBlock, MdOutlineReport, MdOutlineShare } from "react-icons/md";
import Header from '@/component/Layout/Header.jsx';
import Sidebar from '@/component/Layout/Sidebar.jsx';
import Advertisement from './Advertisement';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section');
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setPost({
            id,
            title: 'Review nhẹ web toireview',
            content: "review web toireview nè: web nhìn mới lạ, trẻ trung rất là sì tai của gen z gen alpha, trên này đủ thứ loại review hết, mà còn ẩn danh nên không ai biết mình ghi cái review đó cả, ko sợ bị 'đánh giá' did you get the joke",
            likes: 609,
            comments: 27,
            rating: 96,
            time: '1h trước'
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching post:', error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleLikeClick = () => {
    setLiked(!liked);
  };

  const handleBookmarkClick = () => {
    setBookmarked(!bookmarked);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleOptionsClick = (e) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  const handleOptionAction = (e, action) => {
    e.stopPropagation();
    setShowOptions(false);
    console.log(`Action: ${action}`);
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
    <div className="post-detail-container">
      <Header />
      <div className="home-content">
        <Sidebar />
        <div className="main-content">
          <div className="content-container">
            <Button className="back-button" onClick={handleBack}>
              <RiArrowGoBackFill />
            </Button>
            
            {loading ? (
              <div className="loading">Loading post...</div>
            ) : (
              <>
                <Card className="review-card post-detail-card">
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
                        </span> {liked ? post.likes + 1 : post.likes}
                      </div>
                      <div className="action-item">
                        <span className="comment-icon"><FaRegCommentDots /></span> {post.comments}
                      </div>
                      <div className="action-item">
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

                {section === 'comments' && (
                  <div className="comments-section">
                    <h3>Comments</h3>
                    <p>This is the comments section. You can implement the comments UI here.</p>
                  </div>
                )}

                {section === 'rating' && (
                  <div className="rating-section">
                    <h3>Rating</h3>
                    <p>This is the rating section. You can implement the rating UI here.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <Advertisement />
      </div>
    </div>
  );
};

export default PostDetail; 