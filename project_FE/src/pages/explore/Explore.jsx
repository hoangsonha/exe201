import { useEffect, useRef, useState } from "react";
import Header from '@/component/Layout/Header';
import Sidebar from '@/component/Layout/Sidebar';
import Advertisement from '@/pages/home/Advertisement';
import Review from "../home/Review";
import { getTopTradingGlobal } from "../../serviceAPI/reviewService";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Explore.module.scss";
import classNames from 'classnames/bind';
import { RiArrowGoBackFill } from "react-icons/ri";
import Typed from "typed.js";
import { UserContext } from "../../App";
import { use } from "react";

const cx = classNames.bind(styles);

const Explore = () => {
  const [userSaves, setUserSaves] = useState([])
  const el = useRef(null)
  const [loading, setLoading] = useState(false)
  const [selectedHashtag, setSelectedHashtag] = useState(null)
  const [hashtags, setHashtags] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchUserInfo()
  }, [])

  useEffect(() => {
    if (el.current) {
      const typed = new Typed(el.current, {
        strings: ['Khám phá các chủ đề hot nhất được cộng đồng quan tâm'],
        typeSpeed: 50,
        loop: true,
        backSpeed: 30,
        startDelay: 500,
        showCursor: false
      });

      return () => {
        typed.destroy();
      };
    }
  }, [hashtags])

  const fetchUserInfo = async () => {
    setLoading(true)
    try {
      const savedPosts = await getTopTradingGlobal()
      setUserSaves(savedPosts.data.data)

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
    const badgeClasses = [
      'hashtag-badge-red',
      'hashtag-badge-blue',
      'hashtag-badge-green',
      'hashtag-badge-yellow',
      'hashtag-badge-purple'
    ]
    return badgeClasses[index % badgeClasses.length]
  }

  return (
    <div className={cx('home-page')}>
      <Header />
      <Advertisement />
      <div className={cx('home-content')}>
        <Sidebar />
        <div className={cx('main-content')}>
          <div className={cx('content-container')}>
            {loading ? (
              <div className={cx('profile-loading')}>
                <p>Đang tải nội dung thịnh hành...</p>
              </div>
            ) : selectedHashtag ? (
              <div className={cx('hashtag-detail-view')}>
                <div className={cx('back-button-container')}>
                  <button className={cx('back-button1')} onClick={handleBackToHashtags}>
                    <RiArrowGoBackFill />
                  </button>
                </div>
                <div className={cx('selected-hashtag-header')}>
                  <h2>Bài viết với hashtag: #{selectedHashtag.name}</h2>
                  <span className={cx('post-count')}>({selectedHashtag.reviews.length} bài viết)</span>
                </div>
                <div className={cx('posts-container')}>
                  {selectedHashtag.reviews.length > 0 ? (
                    selectedHashtag.reviews.map(review => renderPostItem(review))
                  ) : (
                    <div className={cx('profile-no-content')}>
                      <p>Không có bài viết nào với hashtag này</p>
                    </div>
                  )}
                </div>
              </div>
            ) : hashtags.length > 0 ? (
              <div className={cx('hashtag-grid-view')}>
                <div className={cx('hashtag-header')}>
                  <h2>🔥 Hashtag Thịnh Hành</h2>
                  <div className={cx('hashtag-span')}>
                    <span ref={el} />
                  </div>
                </div>
                
                <div className={cx('hashtag-grid')}>
                  {hashtags.map((hashtag, index) => (
                    <div 
                      key={hashtag.id} 
                      className={cx('hashtag-card')}
                      onClick={() => handleHashtagClick(hashtag)}
                    >
                      <div className={cx('hashtag-card-header')}>
                        <div className={cx('hashtag-info')}>
                          <span className={cx('hashtag-symbol')}>#</span>
                          <span className={cx('hashtag-name')}>{hashtag.name}</span>
                        </div>
                        {index < 3 && (
                          <span className={cx('top-badge')}>TOP {index + 1}</span>
                        )}
                      </div>
                      
                      <div className={cx('hashtag-stats')}>
                        <span className={cx('post-count-icon')}>👥</span>
                        <span>{hashtag.reviews.length} bài viết</span>
                      </div>
                      
                      {/* <div className={cx('hashtag-badge-container')}>
                        <span className={cx('hashtag-badge', getHashtagBadgeClass(index))}>
                          #{hashtag.name}
                        </span>
                      </div> */}
                    </div>
                  ))}
                </div>

                {/* <div className={cx('statistics-section')}>
                  <div className={cx('stats-header')}>
                    <span className={cx('stats-icon')}>📊</span>
                    <h3>Thống kê</h3>
                  </div>
                  <div className={cx('stats-grid')}>
                    <div className={cx('stat-item')}>
                      <div className={cx('stat-number', 'blue')}>{hashtags.length}</div>
                      <div className={cx('stat-label')}>Hashtag</div>
                    </div>
                    <div className={cx('stat-item')}>
                      <div className={cx('stat-number', 'green')}>{userSaves.length}</div>
                      <div className={cx('stat-label')}>Tổng bài viết</div>
                    </div>
                  </div>
                </div> */}
              </div>
            ) : (
              <div className={cx('profile-no-content')}>
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