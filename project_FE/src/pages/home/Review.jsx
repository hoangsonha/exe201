// import React, { useState, useRef, useEffect } from 'react';
// import { Card } from 'react-bootstrap';
// import { FaRegHeart, FaRegCommentDots, FaRegStar, FaRegClock, FaEllipsisH, FaHeart } from "react-icons/fa";
// import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
// import { IoMdEyeOff } from "react-icons/io";
// import { MdOutlineBlock, MdOutlineReport, MdOutlineShare } from "react-icons/md";
// import { useNavigate } from 'react-router-dom';
// import './ReviewPost.css';

// const ReviewPost = ({ post }) => {
//   const [liked, setLiked] = useState(false);
//   const [bookmarked, setBookmarked] = useState(false);
//   const [likeCount, setLikeCount] = useState(post.likes);
//   const [showOptions, setShowOptions] = useState(false);
//   const navigate = useNavigate();
//   const optionsRef = useRef(null);

//   const handleLikeClick = (e) => {
//     e.stopPropagation();
//     setLiked(!liked);
//     setLikeCount(prevCount => liked ? prevCount - 1 : prevCount + 1);
//   };

//   const handleBookmarkClick = (e) => {
//     e.stopPropagation();
//     setBookmarked(!bookmarked);
//   };

//   const handlePostClick = () => {
//     navigate(`/post/${post.id}`);
//   };

//   const handleCommentClick = (e) => {
//     e.stopPropagation();
//     navigate(`/post/${post.id}?section=comments`);
//   };

//   const handleStarClick = (e) => {
//     e.stopPropagation();
//     navigate(`/post/${post.id}?section=rating`);
//   };

//   const handleOptionsClick = (e) => {
//     e.stopPropagation();
//     setShowOptions(!showOptions);
//   };

//   const handleOptionAction = (e, action) => {
//     e.stopPropagation();
//     setShowOptions(false);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (optionsRef.current && !optionsRef.current.contains(event.target)) {
//         setShowOptions(false);
//       }
//     };
    
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   return (
//     <Card className="review-card" onClick={handlePostClick}>
//       <Card.Body>
//         <div className="review-header">
//           <div className="review-tag">toireview</div>
//           <div className="review-options-container" ref={optionsRef}>
//             <div className="review-options" onClick={handleOptionsClick}>
//               <FaEllipsisH />
//             </div>
//             {showOptions && (
//               <div className="options-dropdown">
//                 <div className="option-item" onClick={(e) => handleOptionAction(e, 'hide')}>
//                   <IoMdEyeOff /> ẩn bài viết
//                 </div>
//                 <div className="option-item" onClick={(e) => handleOptionAction(e, 'block')}>
//                   <MdOutlineBlock /> chặn
//                 </div>
//                 <div className="option-item" onClick={(e) => handleOptionAction(e, 'report')}>
//                   <MdOutlineReport /> báo cáo
//                 </div>
//                 <div className="option-item" onClick={(e) => handleOptionAction(e, 'share')}>
//                   <MdOutlineShare /> chia sẻ liên kết
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//         <h4 className="review-title">{post.title}</h4>
//         <p className="review-content">{post.content}</p>
//         <div className="review-actions">
//           <div className={`action-item ${liked ? 'liked' : ''}`} onClick={handleLikeClick}>
//             <span className="heart-icon">
//               {liked ? <FaHeart /> : <FaRegHeart />}
//             </span> {likeCount}
//           </div>
//           <div className="action-item" onClick={handleCommentClick}>
//             <span className="comment-icon"><FaRegCommentDots /></span> {post.comments}
//           </div>
//           <div className="action-item" onClick={handleStarClick}>
//             <span className="star-icon"><FaRegStar /></span> {post.rating}%
//           </div>
//           <div className="action-item">
//             <span className="time-icon"><FaRegClock /></span> {post.time}
//           </div>
//           <div className={`action-item bookmark ${bookmarked ? 'bookmarked' : ''}`} onClick={handleBookmarkClick}>
//             <span className="bookmark-icon">
//               {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
//             </span>
//           </div>
//         </div>
//       </Card.Body>
//     </Card>
//   );
// };

// export default ReviewPost; 



import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router"
import { Card } from "react-bootstrap"
import { FaRegHeart, FaRegCommentDots, FaRegStar, FaRegClock, FaEllipsisH, FaHeart } from "react-icons/fa"
import { FaRegBookmark, FaBookmark } from "react-icons/fa6"
import { IoMdEyeOff } from "react-icons/io"
import { MdOutlineBlock, MdOutlineReport, MdOutlineShare } from "react-icons/md"
import ReviewActions from "./ReviewAction"
import StarRating from "./StarRating"
import './Review.css';

const Review = ({ post }) => {
  const [likeCount, setLikeCount] = useState(post.likes.filter((like) => like.type === "LIKE").length)
  const [showOptions, setShowOptions] = useState(false)
  const navigate = useNavigate()
  const optionsRef = useRef(null)
  const [showComments, setShowComments] = useState(false)

  const handlePostClick = () => {
    navigate(`/post/${post.reviewID}`)
    window.scrollTo(0, 0)
  }

  const handleCommentClick = (e) => {
    e.stopPropagation()
    navigate(`/post/${post.reviewID}?section=comments`)
  }

  const handleStarClick = (e) => {
    e.stopPropagation()
    navigate(`/post/${post.reviewID}?section=rating`)
  }

  const handleOptionsClick = (e) => {
    e.stopPropagation()
    setShowOptions(!showOptions)
  }

  const handleOptionAction = (e, action) => {
    e.stopPropagation()
    setShowOptions(false)
  }

  useEffect(() => {
    console.log(post)
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target))
        setShowOptions(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <Card className="review-card" onClick={handlePostClick}>
      <Card.Body>
        <div className="review-header">
          <div className="review-tag">{post.reviewHashtags}</div>
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
        

        {post.reviewMedias && post.reviewMedias.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            {post.reviewMedias
              .sort((a, b) => a.orderDisplay - b.orderDisplay)
              .map((media) => (
                <div key={media.id} style={{ borderRadius: "8px", overflow: "hidden" }}>
                  {media.typeUploadReview === "IMAGE" ? (
                    <img
                      src={media.urlImageGIFVideo || "/placeholder.svg?height=200&width=300"}
                      alt={`Review media ${media.orderDisplay}`}
                      style={{ width: "100%", height: "200px", objectFit: "cover" }}
                    />
                  ) : (
                    <video
                      src={media.urlImageGIFVideo}
                      controls
                      style={{ width: "100%", height: "200px", objectFit: "cover" }}
                    />
                  )}
                </div>
              ))}
          </div>
        )}

        <ReviewActions
          post={post}
          onToggleComments={() => setShowComments(!showComments)}
        />
      </Card.Body>
    </Card>
    // <div
    //   style={{
    //     background: "white",
    //     borderRadius: "12px",
    //     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    //     marginBottom: "20px",
    //     overflow: "hidden",
    //   }}
    // >
    //   <div
    //     style={{
    //       padding: "16px",
    //       borderBottom: "1px solid #eee",
    //       display: "flex",
    //       justifyContent: "space-between",
    //       alignItems: "center",
    //     }}
    //   >
    //     <div>
    //       <span
    //         style={{
    //           padding: "4px 12px",
    //           borderRadius: "20px",
    //           fontSize: "12px",
    //           fontWeight: "600",
    //           textTransform: "uppercase",
    //           background: post.status === "PUBLISHED" ? "#e8f5e8" : "#fff3cd",
    //           color: post.status === "PUBLISHED" ? "#2d5a2d" : "#856404",
    //         }}
    //       >
    //         {post.status}
    //       </span>
    //     </div>

    //     <div style={{ display: "flex", gap: "20px" }}>
    //       <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    //         <span style={{ fontSize: "12px", color: "#666" }}>Relevant:</span>
    //         <StarRating rating={post.relevantStar} />
    //         <span style={{ fontSize: "12px", fontWeight: "600", color: "#333" }}>{post.relevantStar}</span>
    //       </div>
    //       <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    //         <span style={{ fontSize: "12px", color: "#666" }}>Objective:</span>
    //         <StarRating rating={post.objectiveStar} />
    //         <span style={{ fontSize: "12px", fontWeight: "600", color: "#333" }}>{post.objectiveStar}</span>
    //       </div>
    //     </div>
    //   </div>

    //   <div style={{ padding: "16px" }}>
    //     <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px", color: "#333" }}>{post.title}</h3>
    //     <p style={{ fontSize: "14px", color: "#666", fontStyle: "italic", marginBottom: "12px" }}>
    //       {post.perspective}
    //     </p>
    //     <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#333", marginBottom: "16px" }}>{post.content}</p>

    //     {post.reviewMedias && post.reviewMedias.length > 0 && (
    //       <div
    //         style={{
    //           display: "grid",
    //           gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    //           gap: "12px",
    //           marginBottom: "16px",
    //         }}
    //       >
    //         {post.reviewMedias
    //           .sort((a, b) => a.orderDisplay - b.orderDisplay)
    //           .map((media) => (
    //             <div key={media.id} style={{ borderRadius: "8px", overflow: "hidden" }}>
    //               {media.typeUploadReview === "IMAGE" ? (
    //                 <img
    //                   src={media.urlImageGIFVideo || "/placeholder.svg?height=200&width=300"}
    //                   alt={`Review media ${media.orderDisplay}`}
    //                   style={{ width: "100%", height: "200px", objectFit: "cover" }}
    //                 />
    //               ) : (
    //                 <video
    //                   src={media.urlImageGIFVideo}
    //                   controls
    //                   style={{ width: "100%", height: "200px", objectFit: "cover" }}
    //                 />
    //               )}
    //             </div>
    //           ))}
    //       </div>
    //     )}
    //   </div>

    //   <ReviewActions 
    //     post={post} 
    //     onToggleComments={toggleComments} 
    //   />

    //   {showComments && <CommentSection post={post} />}
    // </div>
  )
}

export default Review