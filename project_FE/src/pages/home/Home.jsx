import React from 'react';
import { Card } from 'react-bootstrap';
import Header from '@/component/layout/Header';
import Sidebar from '@/component/layout/Sidebar';
import Advertisement from './Advertisement';
import './Home.css';

const Home = () => {
  const recentReviews = [
    {
      id: 1,
      title: 'các tỏi đang review gì zayyy?',
      content: 'tỏi ơi, review gì í nè...',
      author: 'toireview',
      likes: 609,
      comments: 27,
      rating: 96,
      time: '1h trước',
      description: 'review nhẹ web toireview',
      fullContent: "review web toireview nè: web nhìn mới lạ, trẻ trung rất là sì tai của gen z gen alpha, trên này đủ thứ loại review hết, mà còn ẩn danh nên không ai biết mình ghi cái review đó cả, ko sợ bị 'đánh giá' did you get the joke"
    }
  ];

  return (
    <div className="home-page">
      <Header />
      <div className="home-content">
        <Sidebar />
        <div className="main-content">
          <div className="content-container">
            <div className="trending-header">
              <div className="fire-icon">🔥</div>
              <h3 className="trending-title">các tỏi đang review gì zayyy?</h3>
              <button className="trending-button">
                <span className="arrow-icon">↑↓</span> nổi bật
              </button>
            </div>

            <div className="create-post">
              <div className="post-input">
                <span className="edit-icon">✏️</span>
                <input 
                  type="text" 
                  placeholder="tỏi ơi, review gì í nè..." 
                  className="post-text-input"
                />
              </div>
            </div>

            <div className="review-posts">
              {recentReviews.map(review => (
                <Card key={review.id} className="review-card">
                  <Card.Body>
                    <div className="review-header">
                      <div className="review-tag">toireview</div>
                      <div className="review-options">•••</div>
                    </div>
                    <h4 className="review-title">review nhẹ web toireview</h4>
                    <p className="review-content">{review.fullContent}</p>
                    <div className="review-actions">
                      <div className="action-item">
                        <span className="heart-icon">♥</span> {review.likes}
                      </div>
                      <div className="action-item">
                        <span className="comment-icon">💬</span> {review.comments}
                      </div>
                      <div className="action-item">
                        <span className="star-icon">★</span> {review.rating}%
                      </div>
                      <div className="action-item">
                        <span className="time-icon">🕒</span> {review.time}
                      </div>
                      <div className="action-item bookmark">
                        <span className="bookmark-icon">🔖</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
              
              {[...Array(5)].map((_, index) => (
                <Card key={`dummy-${index}`} className="review-card">
                  <Card.Body>
                    <div className="review-header">
                      <div className="review-tag">toireview</div>
                      <div className="review-options">•••</div>
                    </div>
                    <h4 className="review-title">Sample post {index + 1}</h4>
                    <p className="review-content">This is a sample post to test scrolling functionality.</p>
                    <div className="review-actions">
                      <div className="action-item">
                        <span className="heart-icon">♥</span> 123
                      </div>
                      <div className="action-item">
                        <span className="comment-icon">💬</span> 45
                      </div>
                      <div className="action-item">
                        <span className="star-icon">★</span> 98%
                      </div>
                      <div className="action-item">
                        <span className="time-icon">🕒</span> 2h trước
                      </div>
                      <div className="action-item bookmark">
                        <span className="bookmark-icon">🔖</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        <Advertisement />
      </div>
    </div>
  );
};

export default Home; 