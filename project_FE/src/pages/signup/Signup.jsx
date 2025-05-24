import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { Form, Button, Alert, Container, Row, Col, Spinner } from "react-bootstrap";
import { UserContext } from "../../App";
import "./Signup.css";

const SignUp = () => {
    const [inputPhonenumber, setInputPhonenumber] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signUp } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            
        } catch (error) {
            console.log(error);
            setShow(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-background">
            <div className="sign-up-container">
                <div className="sign-up-form">
                    <Form onSubmit={handleSubmit} className="mt-4">
                        <Form.Group className="mb-4">
                            <Form.Label htmlFor="phonenumber">
                                <i className="bi bi-telephone-fill me-2"></i>
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