import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "./Signup.css";

const SignupStep4 = ({ onComplete }) => {
    const [selectedTopics, setSelectedTopics] = useState([]);
    
    const topics = [
        { id: 1, name: "nghệ thuật" },
        { id: 2, name: "sức khỏe" },
        { id: 3, name: "giáo dục" },
        { id: 4, name: "giáo dục" },
        { id: 5, name: "talk" },
        { id: 6, name: "mỹ phẩm" },
        { id: 7, name: "lối sống" },
        { id: 8, name: "phim ảnh" },
        { id: 9, name: "minecraft" },
        { id: 10, name: "rap" },
        { id: 11, name: "công việc" },
        { id: 12, name: "công nghệ" },
        { id: 13, name: "khoa học" },
        { id: 14, name: "game" },
        { id: 15, name: "thiết kế" }
    ];

    const handleTopicSelection = (topicId) => {
        setSelectedTopics(prevTopics => {
            if (prevTopics.includes(topicId)) {
                return prevTopics.filter(id => id !== topicId);
            } else {
                return [...prevTopics, topicId];
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onComplete) {
            onComplete(selectedTopics);
        }
    };

    return (
        <div className="topic-background" style={{ opacity: 1 }}>
            <Container className="topic-container">
                <h2 className="topic-title-custom">bạn hay đọc review topic nào?</h2>
                
                <Form onSubmit={handleSubmit}>
                    <Row className="topic-list">
                        {topics.slice(0, 5).map(topic => (
                            <Col xs={6} sm={4} lg={2} key={topic.id} className="topic-item-wrapper">
                                <div 
                                    className={`topic-item ${selectedTopics.includes(topic.id) ? 'selected' : ''}`}
                                    onClick={() => handleTopicSelection(topic.id)}
                                >
                                    {topic.name}
                                </div>
                            </Col>
                        ))}
                    </Row>
                    <Row className="topic-list">
                        {topics.slice(5, 10).map(topic => (
                            <Col xs={6} sm={4} lg={2} key={topic.id} className="topic-item-wrapper">
                                <div 
                                    className={`topic-item ${selectedTopics.includes(topic.id) ? 'selected' : ''}`}
                                    onClick={() => handleTopicSelection(topic.id)}
                                >
                                    {topic.name}
                                </div>
                            </Col>
                        ))}
                    </Row>
                    <Row className="topic-list">
                        {topics.slice(10, 15).map(topic => (
                            <Col xs={6} sm={4} lg={2} key={topic.id} className="topic-item-wrapper">
                                <div 
                                    className={`topic-item ${selectedTopics.includes(topic.id) ? 'selected' : ''}`}
                                    onClick={() => handleTopicSelection(topic.id)}
                                >
                                    {topic.name}
                                </div>
                            </Col>
                        ))}
                    </Row>
                    
                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="topic-continue-btn"
                    >
                        tiếp tục
                    </Button>
                </Form>
            </Container>
        </div>
    );
};

export default SignupStep4; 