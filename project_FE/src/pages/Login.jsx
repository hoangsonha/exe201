import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Form, Button, Alert, Container, Row, Col, Spinner } from "react-bootstrap";
import { UserContext } from "../App";
import { DEFAULT_PATHS } from "../auth/Roles";
import { login } from "../serviceAPI/loginApi";
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
            const userData = await login({ username: inputUsername, password: inputPassword });
            const userFetch = userData.data;
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
            setShow(false);
            navigate(DEFAULT_PATHS[role]);
        } catch (error) {
            console.log(error);
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
                                Sai tài khoản hoặc mật khẩu. Vui lòng thử lại!
                            </Alert>
                        )}
                    </div>

                    <Form onSubmit={handleSubmit} className="mt-4 submit-form">
                        <Form.Group className="mb-4">
                            <Form.Label htmlFor="username">
                                <i className="bi bi-person-fill me-2"></i>
                                tên tài khoản
                            </Form.Label>
                            <Form.Control
                                type="text"
                                id="username"
                                value={inputUsername}
                                placeholder=" "
                                required
                                className="form-control-lg"
                                onChange={handleUsernameChange}
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
                                placeholder=" "
                                required
                                className="form-control-lg"
                                onChange={handlePasswordChange}
                            />
                            <span onClick={togglePasswordVisibility} style={{ cursor: "pointer" }} >
                                <i className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"} eye-icon`} />
                            </span>
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