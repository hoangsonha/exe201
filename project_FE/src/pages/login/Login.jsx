import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { UserContext } from "../../App";
import { DEFAULT_PATHS } from "../../auth/Roles";
import { login } from "../../serviceAPI/authenticationService";
import { jwtDecode } from "jwt-decode";
import Typed from 'typed.js';
import "./Login.css";

const Login = () => {
    const [inputUsername, setInputUsername] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signIn } = useContext(UserContext);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const el = useRef(null);
    const [errorType, setErrorType] = useState("");

    const handleUsernameChange = (e) => {
        setInputUsername(e.target.value);
        if (show) setShow(false);
    };

    const handlePasswordChange = (e) => {
        setInputPassword(e.target.value);
        if (show) setShow(false);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const validateForm = () => {
        if (!inputUsername) {
            setErrorType("username_empty");
            return false;
        }

        if (!inputPassword) {
            setErrorType("password_empty");
            return false;
        }
        return true;
    };

    const getErrorMessage = () => {
        switch (errorType) {
            case "username_empty":
                return "Vui lòng nhập tên tài khoản!";
            case "password_empty":
                return "Vui lòng nhập mật khẩu!";
            case "general":
                return "Sai tài khoản hoặc mật khẩu. Vui lòng thử lại!";
        }
    };

    useEffect(() => {
        if (!show && el.current) {
            const typed = new Typed(el.current, {
                strings: ['quay lại rồi hả !!'],
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

        try {
            if (!validateForm()) {
                setShow(true);
                setLoading(false);
                return;
            }
            const userData = await login({ email: inputUsername, password: inputPassword });
            const userFetch = userData.data;
            if (userFetch) {
                const decodedToken = jwtDecode(userFetch['token']);
                const role = decodedToken.role?.[0]?.authority;

                const user = {
                    accessToken: userFetch['token'],
                    refreshToken: userFetch['refreshToken'],
                    email: userFetch['email'],
                    id: userFetch['userId'],
                    role: role,
                    avatar: userFetch['avatar'],
                    subscriptionTypeId: userFetch['subscriptionTypeId'],
                    title: userFetch['title']
                }

                signIn(user);
                setShow(false);
                navigate(DEFAULT_PATHS[role]);
            }
            else {
                setErrorType("general");
                setShow(true);
            }
        } catch (error) {
            console.log(error);
            setErrorType("general");
            setShow(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-background">
            <div className="login-container">
                <div className="login-form">
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
                        <Form.Group className="mb-4 position-relative">
                            <Form.Label htmlFor="username">
                                <i className="bi bi-person-fill me-2"></i>
                                email
                            </Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type="text"
                                    id="username"
                                    value={inputUsername}
                                    placeholder=""
                                    className="form-control-lg login-input"
                                    onChange={handleUsernameChange}
                                />
                            </div>
                        </Form.Group>
                        
                        <Form.Group className="mb-4 password-group position-relative">
                            <Form.Label htmlFor="password">
                                <i className="bi bi-lock-fill me-2"></i>
                                mật khẩu
                            </Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={inputPassword}
                                    placeholder=""
                                    className="form-control-lg login-input"
                                    onChange={handlePasswordChange}
                                />
                                <span onClick={togglePasswordVisibility} style={{ cursor: "pointer", position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" }}>
                                    <i className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"} eye-icon`} />
                                </span>
                            </div>
                        </Form.Group>

                        <div className="forgot-password">
                            <a href="/" className="link-secondary">
                                quên mật khẩu?
                            </a>
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
                                    đang đăng nhập...
                                </>
                            ) : (
                                <>
                                    đăng nhập
                                </>
                            )}
                        </Button>

                        <div className="text-center mt-2 link-secondary or-text">
                            hoặc là
                        </div>

                        <Button className="py-3 signup-btn">
                            <a href="/signup" className="text-decoration-none">
                                tạo tài khoản mới
                            </a>
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;