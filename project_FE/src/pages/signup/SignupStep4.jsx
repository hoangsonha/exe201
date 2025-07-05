import { useContext, useEffect, useState } from "react"
import { Form, Button, Container, Row, Col, InputGroup, FormControl } from "react-bootstrap"
import { getHashtags } from "../../serviceAPI/hashtagService"
import { createHashtagUser } from "../../serviceAPI/userService"
import "./Signup.css"
import { UserContext } from "../../App"
import { useNavigate } from "react-router"
import { DEFAULT_PATHS } from "../../auth/Roles"

const SignupStep4 = ({ onComplete }) => {
    const navigate = useNavigate()
    const [selectedTopics, setSelectedTopics] = useState([])
    const { user } = useContext(UserContext)
    const [hashtags, setHashtags] = useState([])
    const [filteredHashtags, setFilteredHashtags] = useState([])
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const apiAll = async () => {
            try {
                const resultPurposes = await getHashtags()
                const allHashtags = resultPurposes.data.data || []
                setHashtags(allHashtags)
                setFilteredHashtags(allHashtags.slice(0, 12))
            } catch (error) {
                console.error("Có lỗi xảy ra khi gọi api công dụng:", error)
            }
        }
        apiAll()
    }, [])

    useEffect(() => {
        // Sắp xếp để các topic đã chọn lên đầu
        const sortedHashtags = [...hashtags].sort((a, b) => {
            const aSelected = selectedTopics.includes(a.id)
            const bSelected = selectedTopics.includes(b.id)
            
            if (aSelected && !bSelected) return -1
            if (!aSelected && bSelected) return 1
            return 0
        })

        // Lọc theo search term nếu có
        if (searchTerm) {
            const filtered = sortedHashtags.filter(topic => 
                topic.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredHashtags(filtered)
        } else {
            setFilteredHashtags(sortedHashtags.slice(0, 12))
        }
    }, [searchTerm, hashtags, selectedTopics])

    const handleTopicSelection = (topicId) => {
        setSelectedTopics(prevTopics => {
            if (prevTopics.includes(topicId)) {
                return prevTopics.filter(id => id !== topicId)
            } else {
                return [...prevTopics, topicId]
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const userData = await createHashtagUser({ userId: user.id, hashtagID: selectedTopics })
            
            if (userData.data.code == 'Success') {
                navigate(DEFAULT_PATHS[user.role])
            }
        } catch (error) {
            console.log(error)
        } finally {
            if (onComplete) {
                onComplete(selectedTopics)
            }
        }
    }

    return (
        <div className="topic-background" style={{ opacity: 1 }}>
            <Container className="topic-container">
                <h2 className="topic-title-custom">bạn hay đọc review topic nào?</h2>
                
                <Form onSubmit={handleSubmit}>
                    {/* Thêm thanh search */}
                    <div className="topic-search-container mb-4" style={{ display: 'flex', justifyContent: 'center' }}>
                        <InputGroup style={{ width: '80%' }}> {/* Điều chỉnh width theo ý muốn */}
                            <FormControl
                                placeholder="Tìm kiếm chủ đề..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="topic-search-input"
                            />
                            <InputGroup.Text>
                                <i className="bi bi-search"></i>
                            </InputGroup.Text>
                        </InputGroup>
                    </div>

                    <Row className="topic-list fixed-four-per-row">
                        {filteredHashtags.map((topic, index) => {
                            const isLastRow = Math.floor(index / 4) === Math.floor((filteredHashtags.length - 1) / 4)
                            const itemsInLastRow = filteredHashtags.length % 4 || 4
                            const isFirstInLastRow = isLastRow && index % 4 === 0
                            const shouldCenter = isFirstInLastRow && itemsInLastRow < 4

                            return (
                                <div
                                    key={topic.id}
                                    className="topic-item-wrapper"
                                    style={shouldCenter ? { marginLeft: `calc((100% - ${itemsInLastRow * 25}%) / 2)` } : {}}
                                    onClick={() => handleTopicSelection(topic.id)}
                                >
                                    <div className={`topic-item ${selectedTopics.includes(topic.id) ? 'selected' : ''}`}>
                                        {topic.name}
                                        {selectedTopics.includes(topic.id) && (
                                            <div className="topic-checkmark">
                                                <i className="bi bi-check-circle-fill"></i>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                        {filteredHashtags.length === 0 && (
                            <div className="topic-no-results">
                                Không tìm thấy chủ đề phù hợp
                            </div>
                        )}
                    </Row>

                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="topic-continue-btn"
                        disabled={selectedTopics.length === 0}
                    >
                        Lưu
                    </Button>
                </Form>
            </Container>
        </div>
    )
}

export default SignupStep4