import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { Form, Button, Alert, Container, Row, Col, Spinner } from "react-bootstrap";
import { UserContext } from "../App";
import { DEFAULT_PATHS } from "../auth/Roles";
import { login } from "../serviceAPI/loginApi";
import { jwtDecode } from "jwt-decode";
import "./Login.css";

const Login = () => {
    const [inputUsername, setInputUsername] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signIn } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const userData = await login({ email: inputUsername, password: inputPassword });
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
            <Container className="h-100">
                <Row className="justify-content-center align-items-center h-100">
                    <Col md={8} lg={6} xl={5}>
                        <div className="login-card">
                            <div className="login-brand text-center mb-4">
                                {/* <img 
                                    src="/logo.png" 
                                    alt="Logo" 
                                    className="login-logo"
                                /> */}
                                <h2 className="mt-3 fw-bold text-gradient">ĐĂNG NHẬP HỆ THỐNG</h2>
                            </div>

                            {show && (
                                <Alert 
                                    variant="danger" 
                                    onClose={() => setShow(false)} 
                                    dismissible
                                    className="animate__animated animate__shakeX"
                                >
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    Sai tài khoản hoặc mật khẩu. Vui lòng thử lại!
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit} className="mt-4">
                                <Form.Group className="mb-4 form-floating">
                                    <Form.Control
                                        type="text"
                                        id="username"
                                        value={inputUsername}
                                        placeholder=" "
                                        onChange={(e) => setInputUsername(e.target.value)}
                                        required
                                        className="form-control-lg"
                                    />
                                    <Form.Label htmlFor="username">
                                        <i className="bi bi-person-fill me-2"></i>
                                        Email
                                    </Form.Label>
                                </Form.Group>
                                
                                <Form.Group className="mb-4 form-floating">
                                    <Form.Control
                                        type="password"
                                        id="password"
                                        value={inputPassword}
                                        placeholder=" "
                                        onChange={(e) => setInputPassword(e.target.value)}
                                        required
                                        className="form-control-lg"
                                    />
                                    <Form.Label htmlFor="password">
                                        <i className="bi bi-lock-fill me-2"></i>
                                        Mật khẩu
                                    </Form.Label>
                                </Form.Group>

                                <Button 
                                    variant="primary" 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-100 py-3 login-btn"
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
                                            Đang đăng nhập...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-box-arrow-in-right me-2"></i>
                                            ĐĂNG NHẬP
                                        </>
                                    )}
                                </Button>
                                
                                <div className="text-center mt-4">
                                    <a href="/forgot-password" className="text-decoration-none link-secondary">
                                        <i className="bi bi-question-circle-fill me-2"></i>
                                        Quên mật khẩu?
                                    </a>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;