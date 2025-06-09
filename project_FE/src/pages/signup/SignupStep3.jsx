import { Button } from "react-bootstrap";
import { useState, useContext, useEffect, useRef } from "react";
import logo from '../../assets/logo3.png';
import imageURL from '../../constants/imageURL';
import { UserContext } from "../../App";
import "./Signup.css";

const SignupStep3 = ({ onComplete }) => {
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const { user, updateUser } = useContext(UserContext);
    const animationRef = useRef(null);
    const avatarKeys = Object.keys(imageURL);

    const handleAvatarSelect = (avatarKey) => {
        setSelectedAvatar(avatarKey);
    };

    const handleSave = async () => {
        if (!selectedAvatar) return;
        
        setLoading(true);
        try {
            const avatarUrl = imageURL[selectedAvatar];
            
            if (user && user.id) {
                
            }
            
            if (onComplete) {
                onComplete(selectedAvatar);
            }
        } catch (error) {
            console.error("Error updating avatar:", error);
        } finally {
            setLoading(false);
        }
    };

    const startGachaAnimation = () => {
        if (isAnimating) return;
        
        setIsAnimating(true);
        let duration = 3000;
        const startTime = Date.now();
        const initialSpeed = 50;
        const finalSpeed = 300;

        if (animationRef.current) {
            clearInterval(animationRef.current);
        }
        
        let lastIndex = -1;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const speed = initialSpeed + (finalSpeed - initialSpeed) * Math.pow(progress, 2);
            
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * avatarKeys.length);
            } while (randomIndex === lastIndex);
            
            lastIndex = randomIndex;
            const randomKey = avatarKeys[randomIndex];
            setSelectedAvatar(randomKey);
            
            if (progress >= 1) {
                clearInterval(animationRef.current);
                setIsAnimating(false);
                return;
            }
            animationRef.current = setTimeout(animate, speed);
        };
        animate();
    };

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                clearTimeout(animationRef.current);
            }
        };
    }, []);

    return (
        <div className="avatar-page">
            <div className="avatar-header">
                <img src={logo} alt="Logo" className="signup-logo-img" />
            </div>
            <div className="d-flex flex-column align-items-center avatar-background">
                <div className="avatar-grid-container">
                    <div className="avatar-grid">
                        {Object.entries(imageURL).map(([key, url], index) => (
                            <div 
                                key={key}
                                className={`avatar-grid-item ${selectedAvatar === key ? 'avatar-selected' : ''}`}
                                onClick={() => handleAvatarSelect(key)}
                            >
                                <img 
                                    src={url} 
                                    alt={`Avatar ${index + 1}`} 
                                    className="avatar-grid-image"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="text-center mt-3 d-flex flex-column align-items-center">
                    {selectedAvatar ? (
                        <Button 
                            variant="primary" 
                            type="button"
                            className="avatar-save-btn"
                            onClick={handleSave}
                            disabled={loading || isAnimating}
                        >
                            {loading ? 'Đang lưu...' : 'tiếp tục'}
                        </Button>
                    ) : (
                        <Button 
                            variant="primary"
                            type="button"
                            className="avatar-save-btn"
                            onClick={startGachaAnimation}
                            disabled={isAnimating}
                        >
                            {isAnimating ? 'Đang chọn...' : 'Chọn ngẫu nhiên'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignupStep3; 