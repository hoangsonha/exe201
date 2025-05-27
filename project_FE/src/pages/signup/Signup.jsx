import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Form, Button, Alert, Container, Row, Col, Spinner } from "react-bootstrap";
import { UserContext } from "../../App";
import Typed from 'typed.js';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import "./Signup.css";

const SignUp = () => {
    const [inputPhonenumber, setInputPhonenumber] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentScreen, setCurrentScreen] = useState(1);
    const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
    const codeInputRefs = useRef([]);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const el = useRef(null);
    const timerRef = useRef(null);
    const [timer, setTimer] = useState(180);

    const handlePhoneChange = (value) => {
        setInputPhonenumber(value || "");
        if (show) setShow(false);
    };

    const handlePasswordChange = (e) => {
        setInputPassword(e.target.value);
        if (show) setShow(false);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    useEffect(() => {
        if (!show && el.current && currentScreen === 1) {
            const typed = new Typed(el.current, {
                strings: ['xin chào tỏi mới !!'],
                typeSpeed: 50,
                loop: true,
                backSpeed: 30,
                startDelay: 500,
                showCursor: false
            });

            return () => {
                typed.destroy();
            };
        }
    }, [show, currentScreen]);

    useEffect(() => {
        if (currentScreen === 2 && timer > 0) {
            timerRef.current = setInterval(() => {
                setTimer((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timer === 0) {
            clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentScreen, timer]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        
        try {
            setTimeout(() => {
                if (inputPhonenumber && inputPassword) {
                    setCurrentScreen(2);
                    setTimer(180);
                    setShow(false);
                } else {
                    setShow(true);
                }
                setLoading(false);
            }, 1500);
        } catch (error) {
            console.log(error);
            setShow(true);
            setLoading(false);
        }
    };

    const handleVerifySubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        
        try {
            setTimeout(() => {
                setCurrentScreen(3);
                setLoading(false);
            }, 1500);
        } catch (error) {
            console.log(error);
            setShow(true);
            setLoading(false);
        }
    };

    const handleCodeChange = (index, value) => {
        if (value.length <= 1) {
            const newVerificationCode = [...verificationCode];
            newVerificationCode[index] = value;
            setVerificationCode(newVerificationCode);
            
            if (value && index < 5) {
                codeInputRefs.current[index + 1].focus();
            }
        }
    };

    const handleCodeKeyDown = (index, e) => {
        if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
            codeInputRefs.current[index - 1].focus();
        }
    };

    const handleResendCode = () => {
        setTimer(180);
        setShow(false);
    };

    const handleSaveAvatar = () => {
        navigate("/");
    };

    if (currentScreen === 1) {
        return (
            <div className="sign-up-background">
                <div className="sign-up-container">
                    <div className="sign-up-form">
                        {!show && (
                            <div className="App">
                                <span ref={el} />
                            </div>
                        )}

                        <div className="alert-wrapper">
                            {show && (
                                <Alert 
                                    variant="danger" 
                                    onClose={() => setShow(false)} 
                                    dismissible
                                    className="animate__animated animate__shakeX custom-alert"
                                >
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    Sai định dạng số điện thoại. Vui lòng thử lại!
                                </Alert>
                            )}
                        </div>

                        <Form onSubmit={handleSubmit} className="mt-4 submit-form">
                            <Form.Group className="mb-4">
                                <Form.Label htmlFor="phonenumber">
                                    <i className="bi bi-telephone-fill me-2"></i>
                                    số điện thoại
                                </Form.Label>
                                <PhoneInput
                                    international
                                    countryCallingCodeEditable={false}
                                    defaultCountry="VN"
                                    value={inputPhonenumber}
                                    onChange={handlePhoneChange}
                                    className="phone-input-custom"
                                    required
                                />
                            </Form.Group>
                            
                            <Form.Group className="mb-4 password-group">
                                <Form.Label htmlFor="password">
                                    <i className="bi bi-lock-fill me-2"></i>
                                    mật khẩu
                                </Form.Label>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={inputPassword}
                                    required
                                    className="form-control-lg"
                                    onChange={handlePasswordChange}
                                />
                                <span onClick={togglePasswordVisibility} style={{ cursor: "pointer" }} >
                                    <i className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"} eye-icon`} />
                                </span>
                            </Form.Group>

                            <div className="terms">
                                <span>tôi đồng ý với mọi <strong>điều khoản sử dụng</strong></span>
                            </div>

                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={loading}
                                className="py-3 login-btn"
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        tiếp tục
                                    </>
                                )}
                            </Button>
                            
                            <div className="mt-3 already-have-account">
                                <a href="/login" className="link-secondary">
                                    bạn đã có tài khoản?
                                </a>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        );
    } else if (currentScreen === 2) {
        return (
            <div className="sign-up-background">
                <div className="sign-up-container">
                    <div className="sign-up-form">
                        <h2 className="verification-title-custom">xác minh tài khoản</h2>
                        
                        <div className="verification-description-custom">
                            nhập mã otp được gửi tới số +84*******23:
                        </div>
                        
                        <div className="alert-wrapper">
                            {show && (
                                <Alert 
                                    variant="danger" 
                                    onClose={() => setShow(false)} 
                                    dismissible
                                    className="animate__animated animate__shakeX custom-alert"
                                >
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    Mã xác thực không hợp lệ. Vui lòng thử lại!
                                </Alert>
                            )}
                        </div>
                        
                        <Form onSubmit={handleVerifySubmit} className="verification-form-custom">
                            <div className="verification-inputs-container">
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength={1}
                                        value={verificationCode[index]}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                                        ref={(el) => (codeInputRefs.current[index] = el)}
                                        className="verification-input"
                                    />
                                ))}
                            </div>
                            
                            <div className="verification-timer-custom">
                                mã hết hiệu lực sau <span className="timer-text">{formatTime(timer)}</span>
                            </div>
                            
                            <div className="verification-resend-container">
                                bạn không nhận được mã? 
                                <span 
                                    onClick={handleResendCode} 
                                    className="resend-link-custom"
                                >
                                    gửi lại mã
                                </span>
                            </div>
                            
                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={loading}
                                className="login-btn"
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        xác minh
                                    </>
                                )}
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        );
    } else if (currentScreen === 3) {
        return (
            <div className="avatar-background-custom">
                
            </div>
        );
    }

    return null;
};

export default SignUp;