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
    const { signUp } = useContext(UserContext);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const el = useRef(null);

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
        if (!show && el.current) {
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
    }, [show]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setShow(true);
        try {
            
        } catch (error) {
            console.log(error);
            setShow(true);
        } finally {
            setLoading(false);
        }
    };

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
                            <a href="/" className="link-secondary">
                                bạn đã có tài khoản?
                            </a>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;