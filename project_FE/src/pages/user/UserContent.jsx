import { Spinner, Card } from 'react-bootstrap'
import { FaRegHeart, FaRegCommentDots, FaRegStar, FaRegClock } from "react-icons/fa";
import './UserProfile.css'

const UserContent = ({ activeTab, displayData, setActiveTab, loading }) => {
  const getTabCounts = () => {
    const counts = {
      posts: 0,
      comments: 0,
      saves: 0
    }
    
    if (!loading && displayData) {
      if (activeTab === 'posts') counts.posts = displayData.length;
      if (activeTab === 'comments') counts.comments = displayData.length;
      if (activeTab === 'saves') counts.saves = displayData.length;
    }
    
    return counts;
  }
  
  const counts = getTabCounts()

  const renderPostItem = (post) => (
    <Card className="review-card post-detail-card" key={post.id}>
      <Card.Body>
        <div className="review-header">
          <div className="review-tag">{post.category}</div>
        </div>
        <h4 className="review-title">{post.title}</h4>
        <p className="review-content">{post.content}</p>
        <div className="review-actions">
          <div className="action-item">
            <span className="heart-icon"><FaRegHeart /></span> {post.likes}
          </div>
          <div className="action-item">
            <span className="comment-icon"><FaRegCommentDots /></span> {post.comments}
          </div>
          <div className="action-item">
            <span className="star-icon"><FaRegStar /></span> {post.rating}%
          </div>
          <div className="action-item">
            <span className="time-icon"><FaRegClock /></span> {post.date}
          </div>
        </div>
      </Card.Body>
    </Card>
  )

  const renderCommentItem = (comment) => (
    <Card className="review-card post-detail-card" key={comment.id}>
      <Card.Body>
        <div className="review-header">
          <div className="review-tag">Trả lời</div>
        </div>
        <h4 className="review-title">Re: {comment.postTitle}</h4>
        <p className="review-content">{comment.comment}</p>
        <div className="review-actions">
          <div className="action-item">
            <span className="heart-icon"><FaRegHeart /></span> {comment.likes}
          </div>
          <div className="action-item">
            <span className="time-icon"><FaRegClock /></span> {comment.date}
          </div>
        </div>
      </Card.Body>
    </Card>
  )

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
            {activeTab === 'likes' && displayData.map(post => renderPostItem(post))}
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