import { Button } from "react-bootstrap";
import "./Signup.css";

const SignupStep3 = ({ onComplete }) => {
    const handleSave = () => {
        if (onComplete) {
            onComplete();
        }
    };

    return (
        <div className="avatar-background">
            <Button 
                variant="primary" 
                type="button"
                className="avatar-save-btn"
                onClick={handleSave}
            >
                lưu
            </Button>
        </div>
    );
};

export default SignupStep3; 