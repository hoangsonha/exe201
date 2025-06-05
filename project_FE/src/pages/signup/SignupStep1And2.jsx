import { useState, useEffect, useRef, useContext } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import Typed from "typed.js";
import "react-phone-number-input/style.css";
import { FiSmile } from "react-icons/fi";
import { UserContext } from "../../App";

import { DEFAULT_PATHS } from "../../auth/Roles";
import { jwtDecode } from "jwt-decode";
import { register, verificationCodeAPi } from "../../serviceAPI/authenticationService";
import "./Signup.css";
import { useNavigate } from "react-router";

const SignupStep1And2 = ({ 
    onVerificationComplete, 
    onemailChange, 
    onPasswordChange,
    initialemail = "",
    initialPassword = "" 
}) => {
    const [email, setemail] = useState(initialemail);
    const [inputPassword, setInputPassword] = useState(initialPassword);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentScreen, setCurrentScreen] = useState(1);
    const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
    const codeInputRefs = useRef([]);
    const [showPassword, setShowPassword] = useState(false);
    const el = useRef(null);
    const timerRef = useRef(null);
    const [timer, setTimer] = useState(180);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [errorType, setErrorType] = useState("");

    const { signIn } = useContext(UserContext);
    const navigate = useNavigate();

    const handleEmailChange = (e) => {

        console.log(e.target.value);

        setemail(e.target.value || "");
        if (show) setShow(false);
        if (onemailChange) onemailChange(e.target.value || "");
    };

    const handlePasswordChange = (e) => {
        setInputPassword(e.target.value);
        if (show) setShow(false);
        if (onPasswordChange) onPasswordChange(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const validateForm = () => {
        if (!email) {
            setErrorType("email_empty");
            return false;
        }

        // if (email.length < 10 || email.length > 11) {
        //     setErrorType("email_invalid");
        //     return false;
        // }

        if (!inputPassword) {
            setErrorType("password_empty");
            return false;
        }

        if (inputPassword.length < 6) {
            setErrorType("password_short");
            return false;
        }

        if (inputPassword.length > 50) {
            setErrorType("password_long");
            return false;
        }

        if (!isTermsAccepted) {
            setErrorType("terms");
            return false;
        }
        return true;
    };

    const getErrorMessage = () => {
        switch (errorType) {
            case "terms":
                return "Vui lòng đồng ý với điều khoản sử dụng!";
            case "email_empty":
                return "Vui lòng nhập địa chỉ email!";
            // case "email_invalid":
            //     return "Số điện thoại không hợp lệ. Vui lòng nhập 8-9 số!";
            case "password_empty":
                return "Vui lòng nhập mật khẩu!";
            case "password_short":
                return "Mật khẩu phải có ít nhất 6 ký tự!";
            case "password_long":
                return "Mật khẩu không được quá 50 ký tự!";
            case "verification_invalid":
                return "Mã xác thực không hợp lệ. Vui lòng thử lại!";
            case "general":
                return "Vui lòng thử lại!";
        }
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

    // const handleRegisterAccount = async (event) => {
    //     event.preventDefault();
    //     setLoading(true);

    //     try {
    //         const userData = await register({ email: email, password: inputPassword });

    //         if (userData.data.data) {
    //             setLoading(false)
    //             setCurrentScreen(2);
    //         } else {
    //             setErrorType("general");
    //             setShow(true);
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         setErrorType("general");
    //         setShow(true);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    const handleVerificationCode = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            let verification = verificationCode.join('')

            console.log(verification)

            const userData = await verificationCodeAPi({ email: email, verificationCode: verification });

            console.log(userData)

            const userFetch = userData.data;
                if (userFetch.code == 'Success') {
                    const decodedToken = jwtDecode(userFetch['token']);
                    const role = decodedToken.role?.[0]?.authority;
        
                    const user = {
                        accessToken: userFetch['token'],
                        refreshToken: userFetch['refreshToken'],
                        email: userFetch['email'],
                        id: userFetch['userId'],
                        role: role
                    }
        
                    signIn(user);
                    
                    if (onVerificationComplete) {
                        onVerificationComplete({
                            email: email,
                            password: inputPassword
                        });
                    }
                    setShow(false);

                    setLoading(false);
                } else {
                    setErrorType('verification_invalid');
                }    
        } catch (error) {
            console.log(error);
            setErrorType('verification_invalid');
            setShow(true);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        
        try {
            // setCurrentScreen(2);
            if (!validateForm()) {
                setShow(true);
                setLoading(false);
                return;
            }
            const userData = await register({ email: email, password: inputPassword });

            if (userData.data.data) {
                setLoading(false);
                setShow(false);
                setCurrentScreen(2);
            } else {
                setErrorType("general");
                setShow(true);
            }
        } catch (error) {
            console.log(error);
            setErrorType("general");
            setShow(true);
            setLoading(false);
        }
    };

    const handleVerifySubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        
        try {
            setTimeout(() => {
                const isVerificationComplete = verificationCode.every(code => code !== "");
                
                if (isVerificationComplete) {
                    if (onVerificationComplete) {
                        onVerificationComplete({
                            email: email,
                            password: inputPassword
                        });
                    }
                    setShow(false);
                } else {
                    setErrorType("verification_invalid");
                    setShow(true);
                }
                setLoading(false);
            }, 1500);
        } catch (error) {
            console.log(error);
            setErrorType("verification_invalid");
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
        setErrorType("");
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
                                    {getErrorMessage()}
                                </Alert>
                            )}
                        </div>

                        <Form onSubmit={handleSubmit} className="mt-4 submit-form">
                            <Form.Group className="mb-4">
                                <Form.Label htmlFor="email">
                                    <i className="bi bi-envelope-fill me-2"></i>
                                    email
                                </Form.Label>
                                <div className="email-input-wrapper">
                                    <Form.Control
                                        type="text"
                                        id="email"
                                        value={email}
                                        placeholder=""
                                        className="email-input-custom"
                                        onChange={handleEmailChange}
                                    />
                                </div>
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
                                    className="form-control-lg"
                                    onChange={handlePasswordChange}
                                />
                                <span onClick={togglePasswordVisibility} style={{ cursor: "pointer" }} >
                                    <i className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"} eye-icon`} />
                                </span>
                            </Form.Group>

                            <div className="terms">
                                <span 
                                    className={`terms-checkbox ${isTermsAccepted ? 'checked' : ''}`}
                                    onClick={() => setIsTermsAccepted(!isTermsAccepted)}
                                >
                                    <FiSmile />
                                </span>
                                <span className={`terms-text ${isTermsAccepted ? 'accepted' : ''}`}>
                                    tôi đồng ý với mọi <strong>điều khoản sử dụng</strong>
                                </span>
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
                        <div className="alert-wrapper">
                            {show && (
                                <Alert 
                                    variant="danger" 
                                    onClose={() => setShow(false)} 
                                    dismissible
                                    className="animate__animated animate__shakeX custom-alert"
                                >
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {getErrorMessage()}
                                </Alert>
                            )}
                        </div>

                        <h2 className="verification-title-custom">xác minh tài khoản</h2>
                        <div className="verification-description-custom">
                            nhập mã otp được gửi tới email: {email}
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
                                onClick={handleVerificationCode}
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
    }
};

export default SignupStep1And2; 