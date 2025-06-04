// import { useEffect, useState, useRef, useContext } from "react"
// import { Modal, Button, Form, Alert, Row, Col, Badge } from "react-bootstrap"
// import { getHashtags } from "../../serviceAPI/hashtagService"

// import "./PostReview.css"
// import { UserContext } from "../../App"

// const PostReview = ({ show, onClose, onSubmit }) => {
//     const [title, setTitle] = useState("")
//     const [content, setContent] = useState("")
//     const [image, setImage] = useState(null)
//     const [preview, setPreview] = useState("")
//     const [error, setError] = useState("")
//     const [hashtags, setHashtags] = useState([])
//     const [selectedTags, setSelectedTags] = useState([])
//     const [showTagDropdown, setShowTagDropdown] = useState(false)
//     const dropdownRef = useRef(null)

    
//     const { user } = useContext(UserContext);

//     useEffect(() => {
//         const fetchHashtags = async () => {
//             try {
//                 const result = await getHashtags()
//                 setHashtags(result.data.data || [])
//             } catch (error) {
//                 console.error("Lỗi khi lấy danh sách hashtag:", error)
//             }
//         }
//         fetchHashtags()
//     }, [])

//     // Đóng dropdown khi click bên ngoài
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setShowTagDropdown(false)
//             }
//         }
//         document.addEventListener("mousedown", handleClickOutside)
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside)
//         }
//     }, [])

//     const handleImageChange = (e) => {
//         const file = e.target.files[0]
//         if (file) {
//             setImage(file)
//             setPreview(URL.createObjectURL(file))
//         }
//     }

//     const toggleTagDropdown = () => {
//         setShowTagDropdown(!showTagDropdown)
//     }

//     const handleTagSelect = (tag) => {
//         if (!selectedTags.some(t => t.id === tag.id)) {
//             setSelectedTags([...selectedTags, tag])
//         }
//         setShowTagDropdown(false)
//     }

//     const removeTag = (tagId) => {
//         setSelectedTags(selectedTags.filter(tag => tag.id !== tagId))
//     }

//     // const handleSubmit = () => {
//     //     if (!title.trim() || !content.trim()) {
//     //         setError("Tiêu đề và nội dung không được để trống")
//     //         return
//     //     }

//     //     if (content.split(" ").length < 20) {
//     //         setError("Nội dung phải có ít nhất 20 từ")
//     //         return
//     //     }

//     //     if (!image) {
//     //         setError("Vui lòng thêm ít nhất 1 hình ảnh")
//     //         return
//     //     }

//     //     const postData = {
//     //         title,
//     //         content,
//     //         image,
//     //         hashtags: selectedTags.map(tag => tag.id)
//     //     }

//     //     onSubmit(postData)
//     // }

//     const handleSubmit = async () => {
//         if (!title.trim() || !content.trim()) {
//             setError("Tiêu đề và nội dung không được để trống")
//             return
//         }

//         // if (content.split(" ").length < 20) {
//         //     setError("Nội dung phải có ít nhất 20 từ")
//         //     return
//         // }

//         if (!image) {
//             setError("Vui lòng thêm ít nhất 1 hình ảnh")
//             return
//         }

//         const formData = new FormData()

//         const review = {
//             title,
//             content,
//             hashtags: selectedTags.map(tag => tag.id),
//             userId: user.id,
//         }

//         formData.append("review", new Blob([JSON.stringify(review)], { type: "application/json" }))
//         formData.append("mediaFiles", image)

//         onSubmit(formData)
            
//     }

//     return (
//         <Modal show={show} onHide={onClose} size="xl" centered className="post-review-modal">
//             <Modal.Header closeButton>
//                 <Modal.Title>Tạo bài review mới</Modal.Title>
//             </Modal.Header>
//             <Modal.Body className="p-0">
//                 <div className="container-fluid p-0">
//                     <Row className="g-0">
//                         {/* Left Sidebar - Guidelines */}
//                         <Col md={3} className="border-end">
//                             <div className="p-3">
//                                 <h5 className="guideline-title">guideline</h5>
//                                 <div className="guideline-item mt-3">
//                                     <span className="check-icon">✓</span>
//                                     <div className="guideline-text">
//                                         <div>ít nhất 20 từ/</div>
//                                         <div>có hình ảnh.</div>
//                                     </div>
//                                 </div>

//                                 <div className="guideline-item">
//                                     <span className="check-icon">✓</span>
//                                     <div className="guideline-text">
//                                         <div>không sử dụng</div>
//                                         <div>những từ ngữ</div>
//                                         <div>không đẹp x</div>
//                                     </div>
//                                 </div>

//                                 <div className="warning-text">
//                                     <strong>*nếu bị phát hiện sử dụng hình ảnh AI, bạn sẽ bị đánh dấu và sẽ bị giảm độ tương tác!</strong>
//                                 </div>
//                             </div>
//                         </Col>

//                         {/* Main Content */}
//                         <Col md={6} className="border-end">
//                             <div className="p-4">
//                                 {error && (
//                                     <Alert variant="danger" className="mb-4">
//                                         {error}
//                                     </Alert>
//                                 )}

//                                 <div className="post-form">
//                                     {/* Selected Tags Display */}
//                                     <div className="mb-3 d-flex flex-wrap gap-2">
//                                         {selectedTags.map(tag => (
//                                             <Badge 
//                                                 key={tag.id} 
//                                                 bg="secondary" 
//                                                 className="d-flex align-items-center"
//                                             >
//                                                 #{tag.name}
//                                                 <button 
//                                                     onClick={() => removeTag(tag.id)} 
//                                                     className="ms-2 bg-transparent border-0 text-white"
//                                                     style={{ fontSize: '0.75rem' }}
//                                                 >
//                                                     ×
//                                                 </button>
//                                             </Badge>
//                                         ))}
//                                     </div>

//                                     {/* Tag Review Dropdown */}
//                                     <div className="mb-4 position-relative" ref={dropdownRef}>
//                                         <Button 
//                                             variant="outline-secondary" 
//                                             className="tag-review-btn"
//                                             onClick={toggleTagDropdown}
//                                         >
//                                             <span className="tag-text">tag review</span>
//                                             <span className="plus-icon">+</span>
//                                         </Button>

//                                         {showTagDropdown && (
//                                             <div className="tag-dropdown-menu">
//                                                 {hashtags.map(tag => (
//                                                     <div 
//                                                         key={tag.id}
//                                                         className="tag-dropdown-item"
//                                                         onClick={() => handleTagSelect(tag)}
//                                                     >
//                                                         #{tag.name}
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* Title Input */}
//                                     <div className="mb-4">
//                                         <Form.Control
//                                             type="text"
//                                             placeholder="tiêu đề..."
//                                             value={title}
//                                             onChange={(e) => setTitle(e.target.value)}
//                                             className="title-input"
//                                         />
//                                     </div>

//                                     {/* Content Textarea */}
//                                     <div className="mb-4">
//                                         <Form.Control
//                                             as="textarea"
//                                             rows={6}
//                                             placeholder="nội dung review..."
//                                             value={content}
//                                             onChange={(e) => setContent(e.target.value)}
//                                             className="content-textarea"
//                                         />
//                                     </div>

//                                     {/* Image Upload */}
//                                     <div className="image-upload-area mb-4">
//                                         {preview ? (
//                                             <div className="image-preview">
//                                                 <img src={preview || "/placeholder.svg"} alt="Preview" className="preview-image" />
//                                                 <Form.Control
//                                                     type="file"
//                                                     accept="image/*"
//                                                     onChange={handleImageChange}
//                                                     className="d-none"
//                                                     id="image-upload"
//                                                 />
//                                                 <label htmlFor="image-upload" className="change-image-btn">
//                                                     Thay đổi hình ảnh
//                                                 </label>
//                                             </div>
//                                         ) : (
//                                             <div className="upload-placeholder">
//                                                 <div className="image-icon">📷</div>
//                                                 <Form.Control
//                                                     type="file"
//                                                     accept="image/*"
//                                                     onChange={handleImageChange}
//                                                     className="d-none"
//                                                     id="image-upload"
//                                                 />
//                                                 <label htmlFor="image-upload" className="upload-label">
//                                                     Thêm hình ảnh
//                                                 </label>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </Col>

//                         {/* Right Sidebar - Credibility Score */}
//                         <Col md={3}>
//                             <div className="p-3">
//                                 <h5 className="credibility-title">
//                                     điểm tin cậy
//                                     <Badge bg="secondary" className="ms-2 beta-badge">
//                                         beta
//                                     </Badge>
//                                 </h5>
//                                 <div className="credibility-score mt-3">
//                                     <span className="star-icon">⭐</span>
//                                     <span className="score-text">--%</span>
//                                 </div>

//                                 <div className="credibility-metrics">
//                                     <div className="metric-item">
//                                         <div className="metric-label">góc nhìn của bài viết:</div>
//                                         <div className="metric-value">--</div>
//                                     </div>

//                                     <div className="metric-item">
//                                         <div className="metric-label">người hay máy:</div>
//                                         <div className="metric-value">--</div>
//                                     </div>

//                                     <div className="metric-item">
//                                         <div className="metric-label">độ liên quan:</div>
//                                         <div className="metric-value">--</div>
//                                     </div>

//                                     <div className="metric-item">
//                                         <div className="metric-label">tính khách quan:</div>
//                                         <div className="metric-value">--</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </Col>
//                     </Row>
//                 </div>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={onClose}>
//                     Hủy
//                 </Button>
//                 <Button onClick={handleSubmit} className="submit-btn">
//                     Đăng bài
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     )
// }

// export default PostReview

import { useEffect, useState, useRef, useContext } from "react"
import { Modal, Button, Form, Alert, Row, Col, Badge, FloatingLabel } from "react-bootstrap"
import { getHashtags } from "../../serviceAPI/hashtagService"
import "./PostReview.css"
import { UserContext } from "../../App"
import { FaTimes, FaPlus, FaImage, FaVideo } from "react-icons/fa"

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

        if (hasVideo) {
            // Nếu có video thì chỉ lấy 1 video đầu tiên
            const videoFile = files.find(file => file.type.startsWith("video/"))
            setMediaFiles([videoFile])
            setPreviewUrls([URL.createObjectURL(videoFile)])
        } else if (allImages) {
            // Có thể chọn nhiều ảnh (tối đa 10 ảnh)
            const maxImages = 10
            const selectedImages = files.slice(0, maxImages)
            setMediaFiles(selectedImages)
            setPreviewUrls(selectedImages.map(file => URL.createObjectURL(file)))
        } else {
            setError("Vui lòng chỉ chọn ảnh hoặc một video")
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
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold">Tạo bài review mới</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
                <div className="container-fluid p-0">
                    <Row className="g-0">
                        {/* Left Sidebar - Guidelines */}
                        <Col md={3} className="border-end">
                            <div className="p-4">
                                <h5 className="guideline-title fw-bold mb-4">Hướng dẫn đăng bài</h5>
                                <div className="guideline-item d-flex align-items-start mb-3">
                                    <div className="check-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '24px', height: '24px', fontSize: '12px' }}>
                                        ✓
                                    </div>
                                    <div className="guideline-text">
                                        <div className="fw-medium">Ít nhất 20 từ</div>
                                        <div className="text-muted small">Có hình ảnh hoặc video</div>
                                    </div>
                                </div>

                                <div className="guideline-item d-flex align-items-start mb-3">
                                    <div className="check-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '24px', height: '24px', fontSize: '12px' }}>
                                        ✓
                                    </div>
                                    <div className="guideline-text">
                                        <div className="fw-medium">Không sử dụng</div>
                                        <div className="text-muted small">Những từ ngữ không phù hợp</div>
                                    </div>
                                </div>

                                <div className="alert alert-warning mt-4 p-3 small">
                                    <strong>Lưu ý:</strong> Nếu bị phát hiện sử dụng hình ảnh AI, bạn sẽ bị đánh dấu và giảm độ tương tác!
                                </div>
                            </div>
                        </Col>

                        {/* Main Content */}
                        <Col md={6} className="border-end">
                            <div className="p-4">
                                {error && (
                                    <Alert variant="danger" className="mb-4" onClose={() => setError("")} dismissible>
                                        {error}
                                    </Alert>
                                )}

                                <div className="post-form">
                                    {/* Selected Tags */}
                                    <div className="mb-3 d-flex flex-wrap gap-2">
                                        {selectedTags.map(tag => (
                                            <Badge
                                                key={tag.id}
                                                bg="primary"
                                                className="d-flex align-items-center px-3 py-2 rounded-pill"
                                                style={{ fontSize: '0.875rem' }}
                                            >
                                                #{tag.name}
                                                <button
                                                    onClick={() => removeTag(tag.id)}
                                                    className="ms-2 bg-transparent border-0 text-white p-0"
                                                    style={{ fontSize: '0.75rem' }}
                                                >
                                                    <FaTimes />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>

                                    {/* Tag Dropdown */}
                                    <div className="mb-4 position-relative" ref={dropdownRef}>
                                        <Button
                                            variant="outline-primary"
                                            className="d-flex align-items-center rounded-pill px-3 py-2"
                                            onClick={toggleTagDropdown}
                                            style={{ fontSize: '0.875rem' }}
                                        >
                                            <FaPlus className="me-2" />
                                            Thêm tag
                                        </Button>

                                        {showTagDropdown && (
                                            <div className="tag-dropdown-menu shadow-sm rounded-3 border-0">
                                                <div className="p-2">
                                                    <div className="fw-medium small px-2 py-1">Gợi ý tag</div>
                                                    <div className="dropdown-divider my-1"></div>
                                                    {hashtags.map(tag => (
                                                        <button
                                                            key={tag.id}
                                                            className="tag-dropdown-item d-block w-100 text-start px-3 py-2 small"
                                                            onClick={() => handleTagSelect(tag)}
                                                        >
                                                            #{tag.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Title Input */}
                                    <FloatingLabel controlId="titleInput" label="Tiêu đề" className="mb-4">
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập tiêu đề..."
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="border-0 border-bottom rounded-0 px-0"
                                            style={{ boxShadow: 'none' }}
                                        />
                                    </FloatingLabel>

                                    {/* Content Textarea */}
                                    <FloatingLabel controlId="contentTextarea" label="Nội dung review (ít nhất 20 từ)">
                                        <Form.Control
                                            as="textarea"
                                            rows={6}
                                            placeholder="Viết nội dung review của bạn..."
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="border-0 border-bottom rounded-0 px-0"
                                            style={{ boxShadow: 'none', resize: 'none' }}
                                        />
                                    </FloatingLabel>

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
                                                            <div key={idx} className="position-relative" style={{ width: '120px', height: '120px' }}>
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
                                                                    className="position-absolute top-0 end-0 translate-middle bg-danger text-white border-0 rounded-circle p-1"
                                                                    style={{ width: '24px', height: '24px' }}
                                                                >
                                                                    <FaTimes size={12} />
                                                                </button>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <Button
                                                    variant="outline-primary"
                                                    onClick={triggerFileInput}
                                                    className="rounded-pill"
                                                >
                                                    {mediaFiles.some(f => f.type.startsWith("video/")) ? (
                                                        <>Thay đổi video</>
                                                    ) : (
                                                        <>Thêm ảnh khác</>
                                                    )}
                                                </Button>
                                            </div>
                                        ) : (
                                            <div 
                                                className="media-upload-placeholder border rounded-3 p-5 text-center cursor-pointer"
                                                onClick={triggerFileInput}
                                                style={{ borderStyle: 'dashed' }}
                                            >
                                                <div className="mb-3">
                                                    <FaImage className="fs-1 text-muted" />
                                                    <FaVideo className="fs-1 text-muted ms-3" />
                                                </div>
                                                <div className="fw-medium">Thêm ảnh hoặc video</div>
                                                <div className="small text-muted">
                                                    {mediaFiles.some(f => f.type.startsWith("video/")) ? 
                                                        "Chỉ được chọn 1 video" : 
                                                        "Có thể chọn nhiều ảnh"}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Col>

                        {/* Right Sidebar - Credibility Score */}
                        <Col md={3}>
                            <div className="p-4">
                                <h5 className="credibility-title fw-bold mb-4 d-flex align-items-center">
                                    Điểm tin cậy
                                    <Badge bg="secondary" className="ms-2" pill>beta</Badge>
                                </h5>
                                
                                <div className="credibility-score d-flex align-items-center justify-content-center mb-4 p-3 bg-light rounded-3">
                                    <span className="star-icon fs-3 me-2">⭐</span>
                                    <span className="score-text fw-bold fs-4">--%</span>
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
                </div>
            </Modal.Body>
            <Modal.Footer className="border-0">
                <Button variant="outline-secondary" onClick={onClose} className="rounded-pill px-4">Đóng</Button>
                <Button variant="primary" onClick={handleSubmit} className="rounded-pill px-4">Đăng bài</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default PostReview
