import { useContext, useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

import { getHashtags } from "../../serviceAPI/hashtagService";
import { createHashtagUser } from "../../serviceAPI/userService";
import "./Signup.css";
import { UserContext } from "../../App";
import { useNavigate } from "react-router";
import { DEFAULT_PATHS } from "../../auth/Roles";

const SignupStep4 = ({ onComplete }) => {
    const navigate = useNavigate();

    const [selectedTopics, setSelectedTopics] = useState([]);

    const { user } = useContext(UserContext);
    
    const [hashtags, setHashtag] = useState([]);

    useEffect(() => {
        const apiAll = async () => {
    
            try {
                const resultPurposes = await getHashtags();
                setHashtag(resultPurposes.data.data);
            } catch (error) {
                console.error("Có lỗi xảy ra khi gọi api công dụng:", error);
            }
        };
        apiAll();
    }, []);

    const handleTopicSelection = (topicId) => {
        setSelectedTopics(prevTopics => {
            if (prevTopics.includes(topicId)) {
                return prevTopics.filter(id => id !== topicId);
            } else {
                return [...prevTopics, topicId];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const userData = await createHashtagUser({ userId: user.id, hashtagID: selectedTopics });
            
            if (userData.data.code == 'Success') {
                navigate(DEFAULT_PATHS[user.role]);
            }
        } catch (error) {
            console.log(error);
        } finally {
            if (onComplete) {
                onComplete(selectedTopics);
            }
        }
    };

    return (
        <div className="topic-background" style={{ opacity: 1 }}>
            <Container className="topic-container">
                <h2 className="topic-title-custom">bạn hay đọc review topic nào?</h2>
                
                <Form onSubmit={handleSubmit}>
                    
                    <Row className="topic-list">
                        {hashtags.map(topic => (
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