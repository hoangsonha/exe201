// import Header from '@/component/Layout/Header'
// import Sidebar from '@/component/Layout/Sidebar';
// import Advertisement from '@/pages/home/Advertisement';
// import './Explore.css';
// import Review from '../home/Review';
// import { useEffect, useState } from 'react';

// import {getTopTradingGlobal} from '../../serviceAPI/reviewService'

// const Explore = () => {
//     const [userSaves, setUserSaves] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [selectedHashtag, setSelectedHashtag] = useState(null);
//     const [hashtags, setHashtags] = useState([]);

//     useEffect(() => {
//         window.scrollTo(0, 0);
//         fetchUserInfo();
//     }, []);
    
//         const fetchUserInfo = async () => {
//         setLoading(true);
//         try {
//             const savedPosts = await getTopTradingGlobal();
//             setUserSaves(savedPosts.data.data);
            
//             // Extract unique hashtags from all posts
//             const allHashtags = savedPosts.data.data.flatMap(post => {
//                 return post.reviewHashtags.map(tag => {
//                     return {
//                         id: tag.id,
//                         name: tag.name,
//                         reviews: savedPosts.data.data.filter(p => {
//                             return p.reviewHashtags.some(ht => ht.id === tag.id);
//                         })
//                     };
//                 });
//             });
            
//             // Remove duplicate hashtags
//             const uniqueHashtags = Array.from(
//                 new Map(allHashtags.map(tag => [tag.id, tag]))
//             ).map(([, tag]) => tag);
            
//             setHashtags(uniqueHashtags);
            
//         } catch (error) {
//             console.error("Lỗi khi lấy thông tin người dùng:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const renderPostItem = (post) => (
//         <Review post={post} showCommentSection={false} isOwner={true} />
//     );

//     const handleHashtagClick = (hashtag) => {
//         setSelectedHashtag(hashtag);
//     };

//     const handleBackToHashtags = () => {
//         setSelectedHashtag(null);
//     };

//     return (
//         <div className="home-page">
//             <Header />
//             <Advertisement />
//             <div className="home-content">
//                 <Sidebar />
//                 <div className="main-content">
//                     <div className="content-container">
//                         {loading ? (
//                             <div className="profile-loading">
//                                 <p>Đang tải nội dung thịnh hành...</p>
//                             </div>
//                         ) : selectedHashtag ? (
//                             <>
//                                 <button 
//                                     onClick={handleBackToHashtags}
//                                     className="back-button"
//                                     style={{ marginBottom: '20px' }}
//                                 >
//                                     ← Quay lại danh sách hashtag
//                                 </button>
//                                 <h2>Bài viết với hashtag: #{selectedHashtag.name}</h2>
//                                 {selectedHashtag.reviews.length > 0 ? (
//                                     selectedHashtag.reviews.map(review => renderPostItem(review))
//                                 ) : (
//                                     <div className="profile-no-content">
//                                         <p>Không có bài viết nào với hashtag này</p>
//                                     </div>
//                                 )}
//                             </>
//                         ) : hashtags.length > 0 ? (
//                             <>
//                                 <h2>Các hashtag thịnh hành</h2>
//                                 <div className="hashtags-container">
//                                     {hashtags.map(hashtag => (
//                                         <button
//                                             key={hashtag.id}
//                                             className="hashtag-button"
//                                             onClick={() => handleHashtagClick(hashtag)}
//                                         >
//                                             #{hashtag.name} ({hashtag.reviews.length})
//                                         </button>
//                                     ))}
//                                 </div>
//                             </>
//                         ) : (
//                             <div className="profile-no-content">
//                                 <p>Không có hashtag nào để hiển thị</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Explore;


import { useEffect, useState } from "react"
import Header from '@/component/Layout/Header'
import Sidebar from '@/component/Layout/Sidebar';
import Advertisement from '@/pages/home/Advertisement';
import Review from "../home/Review"
import { getTopTradingGlobal } from "../../serviceAPI/reviewService"
import "bootstrap/dist/css/bootstrap.min.css"
import "./Explore.css"

const Explore = () => {
  const [userSaves, setUserSaves] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedHashtag, setSelectedHashtag] = useState(null)
  const [hashtags, setHashtags] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    setLoading(true)
    try {
      const savedPosts = await getTopTradingGlobal()
      setUserSaves(savedPosts.data.data)

      // Extract unique hashtags from all posts
      const allHashtags = savedPosts.data.data.flatMap((post) => {
        return post.reviewHashtags.map((tag) => {
          return {
            id: tag.id,
            name: tag.name,
            reviews: savedPosts.data.data.filter((p) => {
              return p.reviewHashtags.some((ht) => ht.id === tag.id)
            }),
          }
        })
      })

      // Remove duplicate hashtags and sort by number of reviews (descending)
      const uniqueHashtags = Array.from(new Map(allHashtags.map((tag) => [tag.id, tag])))
        .map(([, tag]) => tag)
        .sort((a, b) => b.reviews.length - a.reviews.length)

      setHashtags(uniqueHashtags)
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderPostItem = (post) => (
    <Review key={post.id} post={post} showCommentSection={false} isOwner={true} />
  )

  const handleHashtagClick = (hashtag) => {
    setSelectedHashtag(hashtag)
  }

  const handleBackToHashtags = () => {
    setSelectedHashtag(null)
  }

  const getHashtagBadgeClass = (index) => {
    const classes = ['hashtag-badge-red', 'hashtag-badge-blue', 'hashtag-badge-green', 'hashtag-badge-yellow', 'hashtag-badge-purple']
    return classes[index % classes.length]
  }

  return (
    <div className="home-page">
      <Header />
      <Advertisement />
      <div className="home-content">
        <Sidebar />
        <div className="main-content">
          <div className="content-container">
            {loading ? (
              <div className="profile-loading">
                <p>Đang tải nội dung thịnh hành...</p>
              </div>
            ) : selectedHashtag ? (
              // Selected hashtag view
              <div className="hashtag-detail-view">
                <div className="back-button-container">
                  <button className="back-button1" onClick={handleBackToHashtags}>
                    ← Quay lại
                  </button>
                </div>
                <div className="selected-hashtag-header">
                  <h2>Bài viết với hashtag: #{selectedHashtag.name}</h2>
                  <span className="post-count">({selectedHashtag.reviews.length} bài viết)</span>
                </div>
                <div className="posts-container">
                  {selectedHashtag.reviews.length > 0 ? (
                    selectedHashtag.reviews.map(review => renderPostItem(review))
                  ) : (
                    <div className="profile-no-content">
                      <p>Không có bài viết nào với hashtag này</p>
                    </div>
                  )}
                </div>
              </div>
            ) : hashtags.length > 0 ? (
              // Hashtag grid view
              <div className="hashtag-grid-view">
                <div className="hashtag-header">
                  <h2>🔥 Hashtag Thịnh Hành</h2>
                  <p>Khám phá các chủ đề hot nhất được cộng đồng quan tâm</p>
                </div>
                
                <div className="hashtag-grid">
                  {hashtags.map((hashtag, index) => (
                    <div 
                      key={hashtag.id} 
                      className="hashtag-card"
                      onClick={() => handleHashtagClick(hashtag)}
                    >
                      <div className="hashtag-card-header">
                        <div className="hashtag-info">
                          <span className="hashtag-symbol">#</span>
                          <span className="hashtag-name">{hashtag.name}</span>
                        </div>
                        {index < 3 && (
                          <span className="top-badge">TOP {index + 1}</span>
                        )}
                      </div>
                      
                      <div className="hashtag-stats">
                        <span className="post-count-icon">👥</span>
                        <span>{hashtag.reviews.length} bài viết</span>
                      </div>
                      
                      <div className="hashtag-badge-container">
                        <span className={`hashtag-badge ${getHashtagBadgeClass(index)}`}>
                          #{hashtag.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="statistics-section">
                  <div className="stats-header">
                    <span className="stats-icon">📊</span>
                    <h3>Thống kê</h3>
                  </div>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-number blue">{hashtags.length}</div>
                      <div className="stat-label">Hashtag</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number green">{userSaves.length}</div>
                      <div className="stat-label">Tổng bài viết</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="profile-no-content">
                <p>Không có hashtag nào để hiển thị</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Explore



// const Explore = () => {
//     const [userSaves, setUserSaves] = useState([])
//     const [loading, setLoading] = useState(false)

//     useEffect(() => {
//         window.scrollTo(0, 0)
//         fetchUserInfo()
//     }, [])
    
//     const fetchUserInfo = async () => {
//         setLoading(true)
//         try {
//             const savedPosts = await getTopTradingGlobal()
//             setUserSaves(savedPosts.data.data)
//         } catch (error) {
//             console.error("Lỗi khi lấy thông tin người dùng:", error)
//         } finally {
//             setLoading(false)
//         }
//     }

//     const renderPostItem = (post) => (
//         <Review post={post} showCommentSection={false} isOwner={true} />
//     )

//     return (
//         <div className="home-page">
//             <Header />
//             <Advertisement />
//             <div className="home-content">
//                 <Sidebar />
//                     <div className="main-content">
//                         <div className="content-container">
//                             {loading ? (
//                               <div className="profile-loading">
//                                 <p>Đang tải nội dung thịnh hành...</p>
//                               </div>
//                             ) : userSaves && userSaves.length > 0 ? (
//                               userSaves.map(saved => renderPostItem(saved))
//                             ) : (
//                               <div className="profile-no-content">
//                                 <p>Không có nội dung nào để hiển thị</p>
//                               </div>
//                             )}
//                         </div>
//                     </div>
//             </div>
//         </div>
//     )
// }

// export default Explore
