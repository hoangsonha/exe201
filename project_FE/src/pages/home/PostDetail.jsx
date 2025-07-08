import { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { RiArrowGoBackFill } from 'react-icons/ri'
import Header from '@/component/Layout/Header.jsx'
import Sidebar from '@/component/Layout/Sidebar.jsx'
import Advertisement from './Advertisement'
import Review from './Review'
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
    navigate('/')
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
      <div className="post-detail-content">
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
                <Review post={post} showCommentSection={true} />
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