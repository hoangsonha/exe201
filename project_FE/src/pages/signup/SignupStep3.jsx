import { Button } from "react-bootstrap";
import logo from '../../assets/logo3.png';
import "./Signup.css";

const SignupStep3 = ({ onComplete }) => {
    const handleSave = () => {
        if (onComplete) {
            onComplete();
        }
    };

    return (
        <div className="avatar-page">
            <div className="avatar-header">
                <img src={logo} alt="Logo" className="signup-logo-img" />
            </div>
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
        </div>
    );
};

export default SignupStep3; 