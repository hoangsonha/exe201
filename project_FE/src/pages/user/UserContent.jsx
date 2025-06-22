import { useEffect, useState } from 'react'
import { Spinner, Card } from 'react-bootstrap'
import { FaRegHeart, FaRegCommentDots } from 'react-icons/fa'
import { BiLike } from 'react-icons/bi'
import { getParentCommentByCommentId } from '@/serviceAPI/commentService'
import Review from '@/pages/home/Review'
import { useNavigate } from 'react-router-dom'
import './UserProfile.css'

const UserContent = ({ activeTab, displayData, setActiveTab, loading }) => {
  const navigate = useNavigate()
  const [parentComments, setParentComments] = useState({})

  const fetchParentComments = async () => {
    if (!displayData || displayData.length === 0) {
      console.log('No displayData available')
      return
    }

    const parentData = {}
    
    for (const comment of displayData) {
      if (!comment.commentID) {
        console.warn('Comment missing ID:', comment)
        continue
      }

      try {
        const response = await getParentCommentByCommentId(comment.commentID)
        if (response && response.data) {
          parentData[comment.commentID] = response.data
        }
      } catch (error) {
        console.error(`Error fetching parent comment for ID ${comment.commentID}:`, error)
      }
    }
    
    setParentComments(parentData)
  }

  useEffect(() => {
    if (activeTab === 'comments' && displayData && displayData.length > 0) {
      fetchParentComments()
    }
  }, [activeTab, displayData])

  const getTabCounts = () => {
    const counts = {
      posts: 0,
      comments: 0,
      saves: 0
    }
    
    if (!loading && displayData) {
      if (activeTab === 'posts') counts.posts = displayData.length
      if (activeTab === 'comments') counts.comments = displayData.length
      if (activeTab === 'saves') counts.saves = displayData.length
    }

    return counts
  }

  const handleCommentClick = (comment) => {
    // navigate(`/post/${comment.reviewID}`)
    // window.scrollTo(0, 0)
  }

  const counts = getTabCounts()

  const renderPostItem = (post) => (
    <Review post={post} showCommentSection={false} />
  )

  const renderCommentItem = (comment) => {
    const parentComment = parentComments[comment.commentID]
    const commentLikes = comment.likes?.filter((like) => like.type === "LIKE")?.length || 0
    const commentHearts = comment.likes?.filter((like) => like.type === "HEART")?.length || 0
    const parentLikes = parentComment?.likes?.filter((like) => like.type === "LIKE")?.length || 0
    const parentHearts = parentComment?.likes?.filter((like) => like.type === "HEART")?.length || 0

    return (
      <Card className="review-card post-detail-card" key={comment.id} onClick={() => handleCommentClick(comment)}>
        <Card.Body>
          {parentComment && (
            <div className="comment-parent-container">
              <div className="comment-content-wrapper">
                <span className="comment-username">
                  @{parentComment?.user?.userName}
                </span>
                <p className="comment-text">
                  {parentComment?.content}
                </p>
              </div>
              <div className="comment-actions">
                <button
                  className={`comment-action-btn like ${parentLikes > 0 ? 'active' : ''}`}
                >
                  <BiLike /> {parentLikes > 0 && parentLikes}
                </button>
                <button
                  className={`comment-action-btn heart ${parentHearts > 0 ? 'active' : ''}`}
                >
                  <FaRegHeart /> {parentHearts > 0 && parentHearts}
                </button>
                <button
                  className={`comment-action-btn comment ${parentHearts > 0 ? 'active' : ''}`}
                >
                  <FaRegCommentDots /> {parentHearts > 0 && parentHearts}
                </button>
              </div>
            </div>
          )}
          
          <div className={parentComment ? "comment-child-container" : "comment-standalone-container"}>
            <div className="comment-content-wrapper">
              <span className={parentComment ? "comment-main-username" : "comment-standalone-username"}>
                @{comment?.user?.userName}
              </span>
              <p className={parentComment ? "comment-main-text" : "comment-standalone-text"}>
                {comment?.content}
              </p>
            </div>

            <div className="comment-actions">
              <button
                className={`comment-action-btn like ${commentLikes > 0 ? 'active' : ''}`}
              >
                <BiLike /> {commentLikes > 0 && commentLikes}
              </button>
              <button
                className={`comment-action-btn heart ${commentHearts > 0 ? 'active' : ''}`}
              >
                <FaRegHeart /> {commentHearts > 0 && commentHearts}
              </button>
              <button
                className={`comment-action-btn comment ${commentHearts > 0 ? 'active' : ''}`}
              >
                <FaRegCommentDots /> {commentHearts > 0 && commentHearts}
              </button>
            </div>
          </div>
        </Card.Body>
      </Card>
    )
  }

  return (
    <div className="profile-content-section">
      <div className="profile-tabs">
        <Card className="tab-card" onClick={() => setActiveTab('posts')}>
          <Card.Body className={`tab-body ${activeTab === 'posts' ? 'active' : ''}`}>
            {counts.posts > 0 ? `${counts.posts} bài viết` : 'bài viết'}
          </Card.Body>
        </Card>
        <Card className="tab-card" onClick={() => setActiveTab('comments')}>
          <Card.Body className={`tab-body ${activeTab === 'comments' ? 'active' : ''}`}>
            {counts.comments > 0 ? `${counts.comments} trả lời` : 'trả lời'}
          </Card.Body>
        </Card>
        <Card className="tab-card" onClick={() => setActiveTab('saves')}>
          <Card.Body className={`tab-body ${activeTab === 'saves' ? 'active' : ''}`}>
            đã lưu
          </Card.Body>
        </Card>
      </div>

      <div className="profile-content-display">
        {loading ? (
          <div className="profile-content-loading">
            <Spinner animation="border" variant="primary" size="sm" />
            <p>Đang tải...</p>
          </div>
        ) : displayData && displayData.length > 0 ? (
          <div className="content-container">
            {activeTab === 'posts' && displayData.map(post => renderPostItem(post))}
            {activeTab === 'comments' && displayData.map(comment => renderCommentItem(comment))}
            {activeTab === 'saves' && displayData.map(post => renderPostItem(post))}
          </div>
        ) : (
          <div className="profile-no-content">
            <p>Không có nội dung nào để hiển thị</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserContent