import { useEffect, useState, useRef, useContext } from "react"
import { Modal, Button, Form, Alert, Row, Col, Badge, FloatingLabel } from "react-bootstrap"
import { getHashtags } from "@/serviceAPI/hashtagService"
import "./PostReview.css"
import { UserContext } from "../../App"
import { FaTimes, FaTag, FaImage, FaVideo } from "react-icons/fa"
import { FaCircleArrowRight, FaRegStar } from "react-icons/fa6"

const PostReview = ({ show, onClose, onSubmit }) => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [mediaFiles, setMediaFiles] = useState([])
    const [previewUrls, setPreviewUrls] = useState([])
    const [error, setError] = useState("")
    const [hashtags, setHashtags] = useState([])
    const [selectedTags, setSelectedTags] = useState([])
    const [showTagDropdown, setShowTagDropdown] = useState(false)
    const dropdownRef = useRef(null)
    const fileInputRef = useRef(null)

    const { user } = useContext(UserContext)

    useEffect(() => {
        const fetchHashtags = async () => {
            try {
                const result = await getHashtags()
                setHashtags(result.data.data || [])
            } catch (error) {
                console.error("Lỗi khi lấy danh sách hashtag:", error)
            }
        }
        fetchHashtags()
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowTagDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files)
        if (files.length === 0) return

        const hasVideo = files.some(file => file.type.startsWith("video/"))
        const allImages = files.every(file => file.type.startsWith("image/"))

        const currentHasVideo = mediaFiles.some(f => f.type.startsWith("video/"))

        if (currentHasVideo) {
            setError("Bạn chỉ có thể chọn 1 video hoặc nhiều ảnh, không thể kết hợp")
            return
        }

        if (hasVideo) {
            const videoFile = files.find(file => file.type.startsWith("video/"))
            setMediaFiles([videoFile])
            setPreviewUrls([URL.createObjectURL(videoFile)])
        } else if (allImages) {
            const combinedFiles = [...mediaFiles, ...files].slice(0, 10)
            setMediaFiles(combinedFiles)
            setPreviewUrls(combinedFiles.map(file => URL.createObjectURL(file)))
        } else {
            setError("Vui lòng chỉ chọn ảnh hoặc một video");
        }
    }

    const removeMedia = (index) => {
        const newMediaFiles = [...mediaFiles]
        const newPreviewUrls = [...previewUrls]
        
        newMediaFiles.splice(index, 1)
        newPreviewUrls.splice(index, 1)
        
        setMediaFiles(newMediaFiles)
        setPreviewUrls(newPreviewUrls)
    }

    const toggleTagDropdown = () => {
        setShowTagDropdown(!showTagDropdown)
    }

    const handleTagSelect = (tag) => {
        if (!selectedTags.some(t => t.id === tag.id)) {
            setSelectedTags([...selectedTags, tag])
        }
        setShowTagDropdown(false)
    }

    const removeTag = (tagId) => {
        setSelectedTags(selectedTags.filter(tag => tag.id !== tagId))
    }

    const triggerFileInput = () => {
        fileInputRef.current.click()
    }

    const handleSubmit = () => {
        if (!title.trim() || !content.trim()) {
            setError("Tiêu đề và nội dung không được để trống")
            return
        }

        if (content.length < 20 && mediaFiles.length === 0) {
            setError("Nội dung phải có ít nhất 20 ký tự hoặc 1 hình ảnh/video")
            return
        }

        if (mediaFiles.length === 0) {
            setError("Vui lòng thêm ít nhất 1 hình ảnh hoặc 1 video")
            return
        }

        const formData = new FormData()
        const review = {
            title,
            content,
            hashtags: selectedTags.map(tag => tag.id),
            userId: user.id,
        }

        formData.append("review", new Blob([JSON.stringify(review)], { type: "application/json" }))
        mediaFiles.forEach((file) => {
            formData.append("mediaFiles", file)
        })

        onSubmit(formData)
    }

    return (
        <Modal show={show} onHide={onClose} size="xl" centered className="post-review-modal">
            <Modal.Body className="p-3">
                <Row className="g-2">
                    {/* Left Sidebar - Guidelines */}
                    <Col md={3}>
                        <div className="guideline-column p-4">
                            <h5 className="guideline-title">guideline</h5>
                            <div className="guideline-item">
                                <div className="check-icon">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10" r="9" stroke="#333" strokeWidth="2"/>
                                        <path d="M6 10L9 13L14 7" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="guideline-text-primary">ít nhất</div>
                                    <div className="guideline-text-secondary">20 từ/có hình ảnh.</div>
                                </div>
                            </div>

                            <div className="guideline-item">
                                <div className="check-icon">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10" r="9" stroke="#333" strokeWidth="2"/>
                                        <path d="M6 10L9 13L14 7" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="guideline-text-primary">không sử dụng</div>
                                    <div className="guideline-text-secondary">những từ ngữ không đẹp</div>
                                </div>
                            </div>

                            <div className="guideline-warning">
                                ** nếu bị phát hiện sử dụng hình ảnh AI, bạn sẽ bị đánh dấu và sẽ bị giảm đi lượt tương tác!
                            </div>
                        </div>
                    </Col>

                    {/* Main Content */}
                    <Col md={6}>
                        <div className="post-review-column p-4">
                            {error && (
                                <Alert variant="danger" className="mb-4" onClose={() => setError("")} dismissible>
                                    {error}
                                </Alert>
                            )}

                            <div className="content-form">
                                {/* Tag Dropdown */}
                                <div className="tag-dropdown-wrapper" ref={dropdownRef}>
                                    <div className="tag-review-container" onClick={toggleTagDropdown}>
                                        <span className="tag-review-text">tag review</span>
                                        <FaTag className="tag-review-icon" />
                                    </div>

                                    {showTagDropdown && (
                                        <div className="tag-dropdown-menu">
                                            <div className="tag-dropdown-content">
                                                <div className="tag-dropdown-header">Gợi ý tag</div>
                                                <div className="tag-dropdown-divider"></div>
                                                {hashtags.map(tag => (
                                                    <button
                                                        key={tag.id}
                                                        className="tag-dropdown-item"
                                                        onClick={() => handleTagSelect(tag)}
                                                    >
                                                        #{tag.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Selected Tags */}
                                <div className="selected-tags-container">
                                    {selectedTags.map(tag => (
                                        <div
                                            key={tag.id}
                                            className="tag-badge"
                                        >
                                            #{tag.name}
                                            <button
                                                onClick={() => removeTag(tag.id)}
                                                className="tag-remove-button"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Title Input */}
                                <Form.Control
                                    type="text"
                                    placeholder="tiêu đề..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="title-input"
                                />

                                <div className="title-separator"></div>

                                {/* Content Textarea */}
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="nội dung review..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="content-textarea"
                                />

                                {/* Media Upload */}
                                <div className="mt-4">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*,video/*"
                                        multiple={!mediaFiles.some(f => f.type.startsWith("video/"))}
                                        onChange={handleMediaChange}
                                        className="d-none"
                                    />

                                    {previewUrls.length > 0 ? (
                                        <div className="media-preview-container">
                                            <div className="d-flex flex-wrap gap-3 mb-3">
                                                {previewUrls.map((url, idx) => {
                                                    const file = mediaFiles[idx]
                                                    const isVideo = file.type.startsWith("video/")
                                                    
                                                    return (
                                                        <div key={idx} className="media-item-wrapper" style={{ width: '140px', height: '140px' }}>
                                                            {isVideo ? (
                                                                <div className="h-100 w-100 bg-dark rounded d-flex align-items-center justify-content-center">
                                                                    <FaVideo className="text-white fs-4" />
                                                                </div>
                                                            ) : (
                                                                <img
                                                                    src={url}
                                                                    alt={`preview-${idx}`}
                                                                    className="h-100 w-100 object-fit-cover rounded"
                                                                />
                                                            )}
                                                            <button
                                                                onClick={() => removeMedia(idx)}
                                                                className="media-remove-btn"
                                                            >
                                                                <FaTimes />
                                                            </button>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            <div className="d-flex justify-content-center">
                                                <button
                                                    onClick={triggerFileInput}
                                                    className="add-more-media-btn"
                                                >
                                                    {mediaFiles.some(f => f.type.startsWith("video/")) ? (
                                                        <>Thay đổi video</>
                                                    ) : (
                                                        <>Thêm ảnh khác</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="media-upload-container" onClick={triggerFileInput}>
                                            <div className="media-icons">
                                                <FaImage className="media-icon" />
                                                <FaVideo className="media-icon" />
                                            </div>
                                            <div className="media-text">
                                                <div>Thêm ảnh hoặc video</div>
                                                <div className="media-subtext">Có thể chọn nhiều ảnh</div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 d-flex justify-content-end">
                                    <Button 
                                        onClick={handleSubmit} 
                                        className="post-review-btn"
                                    >
                                        đăng bài! <FaCircleArrowRight className="ms-2" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Right Sidebar - Credibility Score */}
                    <Col md={3}>
                        <div className="credibility-column p-4">
                            <div className="credibility-header">
                                <h5 className="credibility-title">điểm tin cậy</h5>
                                <span className="beta-badge">(beta)</span>
                            </div>
                            
                            <div className="credibility-score">
                                <FaRegStar className="credibility-header-star" />
                                <span className="score-text">--%</span>
                            </div>

                            <div className="credibility-metrics">
                                {[
                                    "Góc nhìn của bài viết",
                                    "Người hay máy viết",
                                    "Có dùng AI",
                                    "Không vi phạm chính sách",
                                    "Dễ đọc, không lỗi chính tả"
                                ].map((label, idx) => (
                                    <div key={idx} className="metric-item d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                                        <div className="metric-label small text-muted">{label}</div>
                                        <div className="metric-value fw-medium small">--</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
}

export default PostReview