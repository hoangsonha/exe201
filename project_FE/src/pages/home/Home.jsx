// import React, { useEffect, useRef, useState } from 'react';
// import Header from '@/component/Layout/Header';
// import Sidebar from '@/component/Layout/Sidebar';
// import Advertisement from './Advertisement';
// import { RiArrowUpDownLine } from "react-icons/ri";
// import { SiFireship } from "react-icons/si";
// import { FaRegPenToSquare } from "react-icons/fa6";
// import Typed from 'typed.js';
// import adsGif from '@/assets/gif/ads.gif';

// import { getTopTradingGlobal } from "../../serviceAPI/reviewService";
// import ReviewPost from './ReviewPost';
// import './Home.css';

// const Home = () => {
//   const el = useRef(null);
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//           const apiAll = async () => {
      
//             try {
//                 const resultPurposes = await getTopTradingGlobal();

//                 if (resultPurposes.data.code == 'Success') {
//                   setPosts(resultPurposes.data.data)
//                 } else {
//                   setPosts([])
//                 }

//             } catch (error) {
//                 console.error("Có lỗi xảy ra khi gọi api công dụng:", error);
//             }
//           };
//           apiAll();
//       }, []);

//   const handleCreatePostClick = () => {
    
//   };

//   useEffect(() => {
//     const typed = new Typed(el.current, {
//       strings: ['các tỏi đang review gì zayyy?'],
//       typeSpeed: 50,
//       loop: true,
//       backSpeed: 30,
//       startDelay: 500,
//       showCursor: false
//     });

//     return () => {
//       typed.destroy();
//     };
//   }, []);

//   return (
//     <div className="home-page">
//       <Header />
//       <div className="home-content">
//         <Sidebar />
//         <div className="main-content">
//           <div className="content-container">
//             <div className="trending-header">
//               <div className="fire-icon"><SiFireship /></div>
//               <h3 className="trending-title"><span ref={el} /></h3>
//               <button className="trending-button">
//                 <span className="arrow-icon">
//                   <RiArrowUpDownLine />
//                 </span> nổi bật
//               </button>
//             </div>

//             <div className="create-post">
//               <div className="post-input" onClick={handleCreatePostClick}>
//                 <span className="edit-icon"><FaRegPenToSquare /></span>
//                 <span className="post-placeholder">Tỏi ơi review gì i nè...</span> 
//               </div>
//             </div>

//             <div className="ads-container">
//               <img src={adsGif} alt="Advertisement" className="ads-banner" />
//             </div>

//             <div className="review-posts">
//               {posts.map(post => (
//                 <ReviewPost key={post.id} post={post} />
//               ))}
//             </div>
//           </div>
//         </div>
        
//         <Advertisement />
//       </div>
//     </div>
//   );
// };

// export default Home; 


import { useContext, useEffect, useRef, useState } from "react"
import { RiArrowUpDownLine } from "react-icons/ri"
import { SiFireship } from "react-icons/si"
import { FaRegPenToSquare } from "react-icons/fa6"
import Typed from "typed.js"
import adsGif from "@/assets/gif/ads.gif"

import Header from "@/component/Layout/Header"
import Sidebar from "@/component/Layout/Sidebar"
import Advertisement from "./Advertisement"
import PostReview from "./PostReview";
import { getHashtags } from "../../serviceAPI/hashtagService"
import { getTopTradingGlobal } from "../../serviceAPI/reviewService"
import { getReviewByUserHashTag } from "../../serviceAPI/userService"
import { createReview } from "../../serviceAPI/reviewService"
import ReviewPost from "./Review"
import "./Home.css"
import { UserContext } from "../../App"

const Home = () => {
  const { user } = useContext(UserContext);

  const el = useRef(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const [showPostReview, setShowPostReview] = useState(false);

  const [hashtags, setHashtags] = useState([])

  useEffect(() => {
    const apiAll = async () => {
      try {
        setLoading(true)

        if (user && user.id != null) {

          console.log('user id ne', user.id)

          const resultPurposes = await getReviewByUserHashTag(user.id)
          if (resultPurposes.data.status == "Success") {
            setPosts(resultPurposes.data.data)
          } else {
            setPosts([])
          }
        } else {
          const resultPurposes = await getTopTradingGlobal()
          
          if (resultPurposes.data.status == "Success") {
            setPosts(resultPurposes.data.data)
          } else {
            setPosts([])
          }
        }

        const result = await getHashtags()
        setHashtags(result.data.data || [])
        
      } catch (error) {
        console.error("Có lỗi xảy ra khi gọi api review:", error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    apiAll()
  }, [])

  const handleCreatePostClick = () => {
    setShowPostReview(true);
  };

  const handleCloseModal = () => {
    setShowPostReview(false);
  };

  const handleSubmitPost = (formData) => {
    console.log("Post data:", formData);

    createReviewAPI(formData);

  };

  const createReviewAPI = async (formData) => {
      try {
        // setLoading(true)
        const resultPurposes = await createReview(formData)

        if (resultPurposes.status == "Success") {
          alert("Bai cua ban da dduoc tao, Vui long cho duyet")
        } else {
          alert("Dã có lỗi, Vui long cho duyet123")
        }
      } catch (error) {
        console.error("Có lỗi xảy ra khi gọi api review:", error)
        alert(error.error)
      } finally {
        // setLoading(false)
        setShowPostReview(false);
      }
    }

  useEffect(() => {
    if (el.current) {
      const typed = new Typed(el.current, {
        strings: ["các tỏi đang review gì zayyy?"],
        typeSpeed: 50,
        loop: true,
        backSpeed: 30,
        startDelay: 500,
        showCursor: false,
      })

      return () => {
        typed.destroy()
      }
    }
  }, [])

  return (
    <div className="home-page">
      <Header />
      <div className="home-content">
        <Sidebar />
        <div className="main-content">
          <div className="content-container">
            <div className="trending-header">
              <div className="fire-icon">
                <SiFireship />
              </div>
              <h3 className="trending-title">
                <span ref={el} />
              </h3>
              <button className="trending-button">
                <span className="arrow-icon">
                  <RiArrowUpDownLine />
                </span>{" "}
                nổi bật
              </button>
            </div>

            <div className="create-post">
              <div className="post-input" onClick={handleCreatePostClick}>
                <span className="edit-icon">
                  <FaRegPenToSquare />
                </span>
                <span className="post-placeholder">Tỏi ơi review gì i nè...</span>
              </div>
            </div>

            {/* Thêm modal đăng bài */}
            <PostReview
              show={showPostReview}
              onClose={handleCloseModal}
              onSubmit={handleSubmitPost}
              // user={user}
              // tags={hashtags}
            />

            <div className="ads-container">
              <img src={adsGif || "/placeholder.svg"} alt="Advertisement" className="ads-banner" />
            </div>

            <div className="review-posts">
              {loading ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                  <p>Đang tải reviews...</p>
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <ReviewPost
                    key={post.reviewID} 
                    post={post} 
                  />
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                  <p>Chưa có review nào</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Advertisement />
      </div>
    </div>
  )
}

export default Home






// ---------------------------------------------------DRAFT CODE-------------------------------------------------

// import { useEffect, useRef, useState } from "react"
// import Header from "@/component/Layout/Header"
// import Sidebar from "@/component/Layout/Sidebar"
// import Advertisement from "./Advertisement"
// import { RiArrowUpDownLine } from "react-icons/ri"
// import { SiFireship } from "react-icons/si"
// import { FaRegPenToSquare, FaHeart, FaComment, FaShare, FaBookmark, FaRegBookmark } from "react-icons/fa6"
// import { BiLike } from "react-icons/bi"
// import { AiFillStar, AiOutlineStar } from "react-icons/ai"
// import Typed from "typed.js"
// import adsGif from "@/assets/gif/ads.gif"

// import { getTopTradingGlobal } from "../../serviceAPI/reviewService"
// import "./Home.css"

// const Home = () => {
//   const el = useRef(null)
//   const [posts, setPosts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [showComments, setShowComments] = useState({})
//   const [newComments, setNewComments] = useState({})
//   const [replyingTo, setReplyingTo] = useState({})
//   const [replyContents, setReplyContents] = useState({})

//   useEffect(() => {
//     const apiAll = async () => {
//       try {
//         setLoading(true)
//         const resultPurposes = await getTopTradingGlobal()

//         console.log(resultPurposes.data.data)

//         if (resultPurposes.data.status == "Success") {
//           setPosts(resultPurposes.data.data)
//         } else {
//           setPosts([])
//         }
//       } catch (error) {
//         console.error("Có lỗi xảy ra khi gọi api review:", error)
//         setPosts([])
//       } finally {
//         setLoading(false)
//       }
//     }

//     apiAll()
//   }, [])

//   console.log(posts);

//   const handleCreatePostClick = () => {
//     console.log("Create post clicked")
//   }

//   useEffect(() => {
//     if (el.current) {
//       const typed = new Typed(el.current, {
//         strings: ["các tỏi đang review gì zayyy?"],
//         typeSpeed: 50,
//         loop: true,
//         backSpeed: 30,
//         startDelay: 500,
//         showCursor: false,
//       })

//       return () => {
//         typed.destroy()
//       }
//     }
//   }, [])

//   // API Functions
//   const handleLikeReview = async (reviewId, type) => {
//     try {
//       console.log(`${type}ing review ${reviewId}`)
//       // TODO: await likeReviewAPI(reviewId, type);
//       // Refresh data after API call
//     } catch (error) {
//       console.error("Error liking review:", error)
//     }
//   }

//   const handleAddComment = async (reviewId) => {
//     const comment = newComments[reviewId]
//     if (comment && comment.trim()) {
//       try {
//         console.log(`Adding comment to review ${reviewId}:`, comment)
//         // TODO: await addCommentAPI(reviewId, comment);
//         setNewComments({ ...newComments, [reviewId]: "" })
//       } catch (error) {
//         console.error("Error adding comment:", error)
//       }
//     }
//   }

//   const handleReplyComment = async (reviewId, commentId) => {
//     const replyKey = `${reviewId}-${commentId}`
//     const reply = replyContents[replyKey]
//     if (reply && reply.trim()) {
//       try {
//         console.log(`Replying to comment ${commentId}:`, reply)
//         // TODO: await replyCommentAPI(commentId, reply);
//         setReplyContents({ ...replyContents, [replyKey]: "" })
//         setReplyingTo({ ...replyingTo, [reviewId]: null })
//       } catch (error) {
//         console.error("Error replying to comment:", error)
//       }
//     }
//   }

//   const handleLikeComment = async (commentId, type) => {
//     try {
//       console.log(`${type}ing comment ${commentId}`)
//       // TODO: await likeCommentAPI(commentId, type);
//     } catch (error) {
//       console.error("Error liking comment:", error)
//     }
//   }

//   const toggleComments = (reviewId) => {
//     setShowComments({ ...showComments, [reviewId]: !showComments[reviewId] })
//   }

//   const toggleReply = (reviewId, commentId) => {
//     const currentReplyingTo = replyingTo[reviewId]
//     setReplyingTo({
//       ...replyingTo,
//       [reviewId]: currentReplyingTo === commentId ? null : commentId,
//     })
//   }

//   const renderStars = (rating) => {
//     const stars = []
//     const fullStars = Math.floor(rating)
//     const hasHalfStar = rating % 1 !== 0

//     for (let i = 0; i < fullStars; i++) {
//       stars.push(<AiFillStar key={i} style={{ color: "#ffd700" }} />)
//     }

//     if (hasHalfStar) {
//       stars.push(<AiFillStar key="half" style={{ color: "#ffd700" }} />)
//     }

//     const emptyStars = 5 - Math.ceil(rating)
//     for (let i = 0; i < emptyStars; i++) {
//       stars.push(<AiOutlineStar key={`empty-${i}`} style={{ color: "#ddd" }} />)
//     }

//     return stars
//   }

//   const renderComment = (comment, reviewId, isReply = false) => {
//     const commentLikes = comment.likes.filter((like) => like.type === "LIKE").length
//     const commentHearts = comment.likes.filter((like) => like.type === "HEART").length
//     const replyKey = `${reviewId}-${comment.commentID}`

//     return (
//       <div
//         key={comment.commentID}
//         style={{
//           marginBottom: "16px",
//           marginLeft: isReply ? "40px" : "0",
//           paddingLeft: isReply ? "16px" : "0",
//           borderLeft: isReply ? "2px solid #eee" : "none",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
//             <img src={comment.user.avatar} style={{
//               width: "45px",
//               height: "32px",
//               borderRadius: "50%"
//             }} />
//           <span style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>{comment.user.userName}</span>
//         </div>

//         <div style={{ marginBottom: "8px" }}>
//           <p style={{ fontSize: "14px", lineHeight: "1.5", color: "#333", margin: "0" }}>{comment.content}</p>
//         </div>

//         <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
//           <button
//             onClick={() => toggleReply(reviewId, comment.commentID)}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "4px",
//               background: "none",
//               border: "none",
//               color: "#666",
//               cursor: "pointer",
//               fontSize: "12px",
//               padding: "4px 8px",
//               borderRadius: "12px",
//             }}
//           >
//             <FaComment /> Reply
//           </button>

//           <button
//             onClick={() => handleLikeComment(comment.commentID, "LIKE")}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "4px",
//               background: "none",
//               border: "none",
//               color: commentLikes > 0 ? "#007bff" : "#666",
//               cursor: "pointer",
//               fontSize: "12px",
//               padding: "4px 8px",
//               borderRadius: "12px",
//             }}
//           >
//             <BiLike /> {commentLikes > 0 && commentLikes}
//           </button>

//           <button
//             onClick={() => handleLikeComment(comment.commentID, "HEART")}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "4px",
//               background: "none",
//               border: "none",
//               color: commentHearts > 0 ? "#ff4757" : "#666",
//               cursor: "pointer",
//               fontSize: "12px",
//               padding: "4px 8px",
//               borderRadius: "12px",
//             }}
//           >
//             <FaHeart /> {commentHearts > 0 && commentHearts}
//           </button>
//         </div>

//         {replyingTo[reviewId] === comment.commentID && (
//           <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
//             <input
//               type="text"
//               placeholder={`Reply to ${comment.user.userName}...`}
//               value={replyContents[replyKey] || ""}
//               onChange={(e) => setReplyContents({ ...replyContents, [replyKey]: e.target.value })}
//               onKeyPress={(e) => e.key === "Enter" && handleReplyComment(reviewId, comment.commentID)}
//               style={{
//                 flex: "1",
//                 padding: "8px 12px",
//                 border: "1px solid #ddd",
//                 borderRadius: "16px",
//                 outline: "none",
//                 fontSize: "12px",
//               }}
//             />
//             <button
//               onClick={() => handleReplyComment(reviewId, comment.commentID)}
//               style={{
//                 padding: "8px 16px",
//                 background: "#007bff",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "16px",
//                 cursor: "pointer",
//                 fontSize: "12px",
//               }}
//             >
//               Send
//             </button>
//           </div>
//         )}

//         {comment.replies && comment.replies.length > 0 && (
//           <div style={{ marginTop: "12px" }}>
//             {comment.replies.map((reply) => renderComment(reply, reviewId, true))}
//           </div>
//         )}
//       </div>
//     )
//   }

//   const renderReviewPost = (post) => {
//     const likeCount = post.likes.filter((like) => like.type === "LIKE").length
//     const heartCount = post.likes.filter((like) => like.type === "HEART").length

//     return (
//       <div
//         key={post.reviewID}
//         style={{
//           background: "white",
//           borderRadius: "12px",
//           boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//           marginBottom: "20px",
//           overflow: "hidden",
//         }}
//       >
//         <div
//           style={{
//             padding: "16px",
//             borderBottom: "1px solid #eee",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <div>
//             <span
//               style={{
//                 padding: "4px 12px",
//                 borderRadius: "20px",
//                 fontSize: "12px",
//                 fontWeight: "600",
//                 textTransform: "uppercase",
//                 background: post.status === "PUBLISHED" ? "#e8f5e8" : "#fff3cd",
//                 color: post.status === "PUBLISHED" ? "#2d5a2d" : "#856404",
//               }}
//             >
//               {post.status}
//             </span>
//           </div>

//           <div style={{ display: "flex", gap: "20px" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//               <span style={{ fontSize: "12px", color: "#666" }}>Relevant:</span>
//               <div style={{ display: "flex", gap: "2px" }}>{renderStars(post.relevantStar)}</div>
//               <span style={{ fontSize: "12px", fontWeight: "600", color: "#333" }}>{post.relevantStar}</span>
//             </div>
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//               <span style={{ fontSize: "12px", color: "#666" }}>Objective:</span>
//               <div style={{ display: "flex", gap: "2px" }}>{renderStars(post.objectiveStar)}</div>
//               <span style={{ fontSize: "12px", fontWeight: "600", color: "#333" }}>{post.objectiveStar}</span>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div style={{ padding: "16px" }}>
//           <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px", color: "#333" }}>{post.title}</h3>
//           <p style={{ fontSize: "14px", color: "#666", fontStyle: "italic", marginBottom: "12px" }}>
//             {post.perspective}
//           </p>
//           <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#333", marginBottom: "16px" }}>{post.content}</p>

//           {/* Media */}
//           {post.reviewMedias && post.reviewMedias.length > 0 && (
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//                 gap: "12px",
//                 marginBottom: "16px",
//               }}
//             >
//               {post.reviewMedias
//                 .sort((a, b) => a.orderDisplay - b.orderDisplay)
//                 .map((media) => (
//                   <div key={media.id} style={{ borderRadius: "8px", overflow: "hidden" }}>
//                     {media.typeUploadReview === "IMAGE" ? (
//                       <img
//                         src={media.urlImageGIFVideo || "/placeholder.svg?height=200&width=300"}
//                         alt={`Review media ${media.orderDisplay}`}
//                         style={{ width: "100%", height: "200px", objectFit: "cover" }}
//                       />
//                     ) : (
//                       <video
//                         src={media.urlImageGIFVideo}
//                         controls
//                         style={{ width: "100%", height: "200px", objectFit: "cover" }}
//                       />
//                     )}
//                   </div>
//                 ))}
//             </div>
//           )}
//         </div>

//         {/* Actions */}
//         <div style={{ padding: "12px 16px", borderTop: "1px solid #eee" }}>
//           <div style={{ display: "flex", gap: "16px" }}>
//             <button
//               onClick={() => handleLikeReview(post.reviewID, "LIKE")}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 background: "none",
//                 border: "none",
//                 color: likeCount > 0 ? "#007bff" : "#666",
//                 cursor: "pointer",
//                 padding: "8px 12px",
//                 borderRadius: "20px",
//                 fontSize: "14px",
//               }}
//             >
//               <BiLike />
//               {likeCount > 0 && <span>{likeCount}</span>}
//             </button>

//             <button
//               onClick={() => handleLikeReview(post.reviewID, "HEART")}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 background: "none",
//                 border: "none",
//                 color: heartCount > 0 ? "#ff4757" : "#666",
//                 cursor: "pointer",
//                 padding: "8px 12px",
//                 borderRadius: "20px",
//                 fontSize: "14px",
//               }}
//             >
//               <FaHeart />
//               {heartCount > 0 && <span>{heartCount}</span>}
//             </button>

//             <button
//               onClick={() => toggleComments(post.reviewID)}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 background: "none",
//                 border: "none",
//                 color: "#666",
//                 cursor: "pointer",
//                 padding: "8px 12px",
//                 borderRadius: "20px",
//                 fontSize: "14px",
//               }}
//             >
//               <FaComment />
//               <span>{post.comments ? post.comments.length : 0}</span>
//             </button>

//             <button
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 background: "none",
//                 border: "none",
//                 color: "#666",
//                 cursor: "pointer",
//                 padding: "8px 12px",
//                 borderRadius: "20px",
//                 fontSize: "14px",
//               }}
//             >
//               <FaShare />
//             </button>

//             <button
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 background: "none",
//                 border: "none",
//                 color: post.isSaved ? "#007bff" : "#666",
//                 cursor: "pointer",
//                 padding: "8px 12px",
//                 borderRadius: "20px",
//                 fontSize: "14px",
//               }}
//             >
//               {post.isSaved ? <FaBookmark /> : <FaRegBookmark />}
//             </button>
//           </div>
//         </div>

//         {/* Comments Section */}
//         {showComments[post.reviewID] && (
//           <div style={{ borderTop: "1px solid #eee", padding: "16px" }}>
//             {/* Add Comment */}
//             <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
//               <input
//                 type="text"
//                 placeholder="Write a comment..."
//                 value={newComments[post.reviewID] || ""}
//                 onChange={(e) => setNewComments({ ...newComments, [post.reviewID]: e.target.value })}
//                 onKeyPress={(e) => e.key === "Enter" && handleAddComment(post.reviewID)}
//                 style={{
//                   flex: "1",
//                   padding: "10px 16px",
//                   border: "1px solid #ddd",
//                   borderRadius: "20px",
//                   outline: "none",
//                   fontSize: "14px",
//                 }}
//               />
//               <button
//                 onClick={() => handleAddComment(post.reviewID)}
//                 style={{
//                   padding: "10px 20px",
//                   background: "#007bff",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "20px",
//                   cursor: "pointer",
//                   fontSize: "14px",
//                 }}
//               >
//                 Post
//               </button>
//             </div>

//             {/* Comments List */}
//             <div>{post.comments && post.comments.map((comment) => renderComment(comment, post.reviewID))}</div>
//           </div>
//         )}
//       </div>
//     )
//   }

//   return (
//     <div className="home-page">
//       <Header />
//       <div className="home-content">
//         <Sidebar />
//         <div className="main-content">
//           <div className="content-container">
//             <div className="trending-header">
//               <div className="fire-icon">
//                 <SiFireship />
//               </div>
//               <h3 className="trending-title">
//                 <span ref={el} />
//               </h3>
//               <button className="trending-button">
//                 <span className="arrow-icon">
//                   <RiArrowUpDownLine />
//                 </span>{" "}
//                 nổi bật
//               </button>
//             </div>

//             <div className="create-post">
//               <div className="post-input" onClick={handleCreatePostClick}>
//                 <span className="edit-icon">
//                   <FaRegPenToSquare />
//                 </span>
//                 <span className="post-placeholder">Tỏi ơi review gì i nè...</span>
//               </div>
//             </div>

//             <div className="ads-container">
//               <img src={adsGif || "/placeholder.svg"} alt="Advertisement" className="ads-banner" />
//             </div>

//             <div className="review-posts">
//               {loading ? (
//                 <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
//                   <p>Đang tải reviews...</p>
//                 </div>
//               ) : posts.length > 0 ? (
//                 posts.map((post) => renderReviewPost(post))
//               ) : (
//                 <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
//                   <p>Chưa có review nào</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <Advertisement />
//       </div>
//     </div>
//   )
// }

// export default Home