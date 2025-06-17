import { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { Card, Button } from 'react-bootstrap'
import { RiArrowGoBackFill } from 'react-icons/ri'
import { IoMdEyeOff } from 'react-icons/io'
import { MdOutlineBlock, MdOutlineReport, MdOutlineShare } from 'react-icons/md'
import { FaEllipsisH } from 'react-icons/fa'
import Header from '@/component/Layout/Header.jsx'
import Sidebar from '@/component/Layout/Sidebar.jsx'
import Advertisement from './Advertisement'
import CommentSection from './CommentSection'
import ReviewActions from './ReviewAction'
import StarRating from './StarRating'
import { getReviewById } from '@/serviceAPI/reviewService'
import './PostDetail.css'

const PostDetail = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const section = searchParams.get('section')
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showOptions, setShowOptions] = useState(false)
  const [showComments, setShowComments] = useState(true)
  const optionsRef = useRef(null)

  useEffect(() => {
    fetchPost()
  }, [])

  const fetchPost = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getReviewById(id)
      console.log('Fetched post:', response.data)
      setPost(response.data)
    } catch (error) {
      console.error('Error fetching post:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleOptionsClick = (e) => {
    e.stopPropagation()
    setShowOptions(!showOptions)
  }

  const handleOptionAction = (e, action) => {
    e.stopPropagation()
    setShowOptions(false)
    console.log(`Action: ${action}`)
  }

  const toggleComments = () => {
    setShowComments(!showComments)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="post-detail-container">
      <Header />
      <div className="home-content">
        <Sidebar />
        <div className="main-content">
          <div className="content-container">
            <Button className="home-back-button" onClick={handleBack}>
              <RiArrowGoBackFill />
            </Button>
            
            {loading ? (
              <div className="loading">Đang tải bài viết...</div>
            ) : error ? (
              <div className="loading-error-message">
                <p>Có lỗi xảy ra khi tải bài viết. Vui lòng thử lại sau.</p>
              </div>
            ) : (
              <>
                <Card className="review-card post-detail-card">
                  <Card.Body>
                    <div className="review-header">
                      <div className="review-tag">toireview</div>
                      {/* <div className="review-user">
                        <img
                          src={post.user.avatar}
                          alt={post.user.userName}
                          className="review-user-avatar"
                        />
                        <span className="review-user-name">@{post.user.userName}</span>
                      </div> */}
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
                      onToggleComments={toggleComments} 
                    />  

                    {showComments && <CommentSection post={post} />}
                  </Card.Body>
                </Card>
              </>
            )}
          </div>
        </div>
        
        <Advertisement />
      </div>
    </div>
  )
}

export default PostDetail