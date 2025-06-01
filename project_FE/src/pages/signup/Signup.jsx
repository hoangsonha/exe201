import { useState } from "react";
import { useNavigate } from "react-router";

import SignupStep1And2 from "./SignupStep1And2";
import SignupStep3 from "./SignupStep3";
import SignupStep4 from "./SignupStep4";
import "./Signup.css";

const SignUp = () => {
    const [currentScreen, setCurrentScreen] = useState(1);
    const [userData, setUserData] = useState({
        phone: "",
        password: "",
        selectedTopics: []
    });
    const navigate = useNavigate();
    
    const handleVerificationComplete = (data) => {
        setUserData(prev => ({
            ...prev,
            phone: data.phone,
            password: data.password
        }));
        setCurrentScreen(3);
    };
    
    const handleAvatarComplete = () => {
        setCurrentScreen(4);
    };
    
    const handleTopicComplete = (selectedTopics) => {
        setUserData(prev => ({
            ...prev,
            selectedTopics
        }));
        
        console.log("Complete user data:", {
            ...userData,
            selectedTopics
        });
        
        navigate("/");
    };
    
    const handlePhoneChange = (phone) => {
        setUserData(prev => ({
            ...prev,
            phone
        }));
    };
    
    const handlePasswordChange = (password) => {
        setUserData(prev => ({
            ...prev,
            password
        }));
    };
    
    if (currentScreen === 1 || currentScreen === 2) {
        return (
            <SignupStep1And2 
                onVerificationComplete={handleVerificationComplete}
                onPhoneChange={handlePhoneChange}
                onPasswordChange={handlePasswordChange}
                initialPhone={userData.phone}
                initialPassword={userData.password}
            />
        );
    } else if (currentScreen === 3) {
        return (
            <SignupStep3 
                onComplete={handleAvatarComplete}
            />
        );
    } else if (currentScreen === 4) {
        return (
            <SignupStep4 
                onComplete={handleTopicComplete}
            />
        );
    }
    
    return null;
};

export default SignUp;