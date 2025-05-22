import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { Form, Button, Alert, Container, Row, Col, Spinner } from "react-bootstrap";
import { UserContext } from "../App";
import { DEFAULT_PATHS } from "../auth/Roles";
import { login } from "../serviceAPI/loginApi";
import { jwtDecode } from "jwt-decode";
import "./Login.css";

const Login = () => {
    const [inputPhonenumber, setInputPhonenumber] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signIn } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const userData = await login({ phone: inputPhonenumber, password: inputPassword });
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
                    <h1>xin chào tỏi mới !!</h1>

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
                        <Form.Group className="mb-4">
                            <Form.Label htmlFor="phonenumber">
                                <i className="bi bi-person-fill me-2"></i>
                                số điện thoại
                            </Form.Label>
                            <Form.Control
                                type="text"
                                id="phonenumber"
                                value={inputPhonenumber}
                                placeholder=" "
                                onChange={(e) => setInputPhonenumber(e.target.value)}
                                required
                                className="form-control-lg"
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-4">
                            <Form.Label htmlFor="password">
                                <i className="bi bi-lock-fill me-2"></i>
                                mật khẩu
                            </Form.Label>
                            <Form.Control
                                type="password"
                                id="password"
                                value={inputPassword}
                                placeholder=" "
                                onChange={(e) => setInputPassword(e.target.value)}
                                required
                                className="form-control-lg"
                            />
                        </Form.Group>

                        <div className="terms">
                            <span>tôi đồng ý với mọi <strong>điều khoản sử dụng</strong></span>
                        </div>

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
                                    loading...
                                </>
                            ) : (
                                <>
                                    tiếp tục
                                </>
                            )}
                        </Button>
                        
                        <div className="text-center mt-4">
                            <a href="/" className="text-decoration-none link-secondary">
                                bạn đã có tài khoản?
                            </a>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Login;