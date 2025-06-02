import React, { useEffect, useRef, useState } from 'react';
import Header from '@/component/layout/Header';
import Sidebar from '@/component/layout/Sidebar';
import Advertisement from './Advertisement';
import { RiArrowUpDownLine } from "react-icons/ri";
import { SiFireship } from "react-icons/si";
import { FaRegPenToSquare } from "react-icons/fa6";
import Typed from 'typed.js';
import adsGif from '@/assets/gif/ads.gif';
import ReviewPost from './ReviewPost';
import './Home.css';

const Home = () => {
  const el = useRef(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setTimeout(() => {
          const mockPosts = [
            {
              id: 1,
              title: 'review nhẹ web toireview',
              content: "review web toireview nè: web nhìn mới lạ, trẻ trung rất là sì tai của gen z gen alpha, trên này đủ thứ loại review hết, mà còn ẩn danh nên không ai biết mình ghi cái review đó cả, ko sợ bị 'đánh giá' did you get the joke",
              likes: 609,
              comments: 27,
              rating: 96,
              time: '1h trước'
            },
            {
              id: 2,
              title: 'Sample post 1',
              content: 'This is a sample post to test scrolling functionality. This is a sample post to test scrolling functionality. This is a sample post to test scrolling functionality.',
              likes: 123,
              comments: 45,
              rating: 98,
              time: '2h trước'
            },
            {
              id: 3,
              title: 'Sample post 2',
              content: 'This is another sample post to test scrolling functionality. This is a sample post to test scrolling functionality. This is a sample post to test scrolling functionality.',
              likes: 87,
              comments: 32,
              rating: 94,
              time: '3h trước'
            }
          ];
          
          setPosts(mockPosts);
        }, 500);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePostClick = () => {
    
  };

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ['các tỏi đang review gì zayyy?'],
      typeSpeed: 50,
      loop: true,
      backSpeed: 30,
      startDelay: 500,
      showCursor: false
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="home-page">
      <Header />
      <div className="home-content">
        <Sidebar />
        <div className="main-content">
          <div className="content-container">
            <div className="trending-header">
              <div className="fire-icon"><SiFireship /></div>
              <h3 className="trending-title"><span ref={el} /></h3>
              <button className="trending-button">
                <span className="arrow-icon">
                  <RiArrowUpDownLine />
                </span> nổi bật
              </button>
            </div>

            <div className="create-post">
              <div className="post-input" onClick={handleCreatePostClick}>
                <span className="edit-icon"><FaRegPenToSquare /></span>
                <span className="post-placeholder">Tỏi ơi review gì i nè...</span> 
              </div>
            </div>

            <div className="ads-container">
              <img src={adsGif} alt="Advertisement" className="ads-banner" />
            </div>

            <div className="review-posts">
              {posts.map(post => (
                <ReviewPost key={post.id} post={post} />
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