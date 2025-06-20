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
import { useNavigate } from 'react-router'
import { useToast } from "../../component/Toast"
import { SearchContext } from "../../component/SearchContext"

const Home = () => {
  const { user } = useContext(UserContext)
  const el = useRef(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPostReview, setShowPostReview] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [hashtags, setHashtags] = useState([])
  const navigate = useNavigate()

  const { searchTerm, searchResults, loadingSearch, isSearch, categories } = useContext(SearchContext);

  const { addToast } = useToast();
  
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

    if (!user) {
      setShowLoginPrompt(true)
      return
    }
    setShowPostReview(true)
  }

  const handleLogin = () => {
    setShowLoginPrompt(false)
    navigate ("/login")
  }

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false)
  }
  
  const handleCloseModal = () => {
    setShowPostReview(false)
  }

  const handleSubmitPost = (formData) => {
    console.log("Post data:", formData)

    createReviewAPI(formData)

  }

  const createReviewAPI = async (formData) => {
      try {
        // setLoading(true)
        const resultPurposes = await createReview(formData)

        if (resultPurposes.status == "Success") {
          addToast(`Bạn đã tạo bài thành công. Vui lòng đợi đánh giá bài trước khi bài được đăng`, true, false);
        } else {
          addToast(`Dã có lỗi, Vui lòng chờ duyệt`, false, true);
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
      <Advertisement />
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

            {user && (
              <PostReview
                show={showPostReview}
                onClose={handleCloseModal}
                onSubmit={handleSubmitPost}
              />
            )}

            {showLoginPrompt && (
              <div className="home-login-popup-overlay" onClick={handleCloseLoginPrompt}>
                <div className="home-login-popup-modal" onClick={(e) => e.stopPropagation()}>
                  <h3 className="home-login-popup-title">
                    Đăng nhập để tiếp tục
                  </h3>
                  
                  <div className="home-login-popup-buttons">
                    <button 
                      onClick={handleCloseLoginPrompt}
                      className="home-login-popup-btn home-login-popup-btn-close"
                    >
                      Đóng
                    </button>
                    <button 
                      onClick={handleLogin}
                      className="home-login-popup-btn home-login-popup-btn-login"
                    >
                      Đăng nhập
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="ads-container">
              <img src={adsGif || "/placeholder.svg"} alt="Advertisement" className="ads-banner" />
            </div>

            <div>
              {isSearch ? (
                <>
                  {isSearch && <h2 className="mb-5">Kết quả tìm kiếm cho {searchTerm ? "tiêu đề " + searchTerm : ""} {searchTerm && categories ? "và" : ""} {categories ? " danh mục: " + categories.join(' và ') : ""}</h2>}
                  <div className="review-posts">
                    {loadingSearch ? (
                      <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                        <p>Đang tải reviews...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((post) => (
                        <ReviewPost key={post.reviewID} post={post} />
                      ))
                    ) : (
                      <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                        <p>Không tìm thấy review phù hợp</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="review-posts">
                  {loading ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                      <p>Đang tải reviews...</p>
                    </div>
                  ) : posts.length > 0 ? (
                    posts.map((post) => (
                      <ReviewPost key={post.reviewID} post={post} />
                    ))
                  ) : (
                    <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                      <p>Chưa có review nào</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home