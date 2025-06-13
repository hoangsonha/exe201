import { Spinner } from 'react-bootstrap'
import './UserProfile.css'

const UserContent = ({ activeTab, displayData, setActiveTab, loading }) => {
  const getTabCounts = () => {
    const counts = {
      posts: 0,
      comments: 0,
      likes: 0
    }
    
    if (!loading && displayData) {
      if (activeTab === 'posts') counts.posts = displayData.length;
      if (activeTab === 'comments') counts.comments = displayData.length;
      if (activeTab === 'likes') counts.likes = displayData.length;
    }
    
    return counts;
  }
  
  const counts = getTabCounts()

  const renderPostItem = (post) => (
    <div key={post.id} className="profile-content-item">
      <div className="profile-content-header">
        <div className="profile-content-category">{post.category}</div>
        <h3 className="profile-content-title">{post.title}</h3>
      </div>
      <p className="profile-content-text">{post.content}</p>
      <div className="profile-content-stats">
        <div className="profile-content-stat">❤️ {post.likes}</div>
        <div className="profile-content-stat">💬 {post.comments}</div>
        <div className="profile-content-stat">⭐ {post.rating}%</div>
        <div className="profile-content-stat">📅 {post.date}</div>
      </div>
    </div>
  )

  const renderCommentItem = (comment) => (
    <div key={comment.id} className="profile-content-item">
      <div className="profile-content-header">
        <h4 className="profile-content-title">Re: {comment.postTitle}</h4>
      </div>
      <p className="profile-content-text">{comment.comment}</p>
      <div className="profile-content-stats">
        <div className="profile-content-stat">❤️ {comment.likes}</div>
        <div className="profile-content-stat-empty"></div>
        <div className="profile-content-stat-empty"></div>
        <div className="profile-content-stat">📅 {comment.date}</div>
      </div>
    </div>
  )

  return (
    <div className="profile-content-section">
      <div className="profile-tabs">
        <button 
          className={`profile-tab-button ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          {counts.posts > 0 ? `${counts.posts} bài viết` : 'Bài viết'}
        </button>
        <button 
          className={`profile-tab-button ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          {counts.comments > 0 ? `${counts.comments} trả lời` : 'Trả lời'}
        </button>
        <button 
          className={`profile-tab-button ${activeTab === 'likes' ? 'active' : ''}`}
          onClick={() => setActiveTab('likes')}
        >
          đã thích
        </button>
      </div>

      <div className="profile-content-display">
        {loading ? (
          <div className="profile-content-loading">
            <Spinner animation="border" variant="primary" size="sm" />
            <p>Đang tải...</p>
          </div>
        ) : displayData && displayData.length > 0 ? (
          <>
            {activeTab === 'posts' && displayData.map(post => renderPostItem(post))}
            {activeTab === 'comments' && displayData.map(comment => renderCommentItem(comment))}
            {activeTab === 'likes' && displayData.map(post => renderPostItem(post))}
          </>
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