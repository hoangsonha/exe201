import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container, Navbar, Nav, Dropdown, Button } from "react-bootstrap";
import { UserContext } from "../App";
import { getRolePaths } from "../auth/Paths";
import { DEFAULT_PATHS } from "../auth/Roles";
import "./Header.css"; // Tạo file CSS riêng cho hiệu ứng

const Header = () => {
    const { user, signOut } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <Navbar expand="lg" className="header-navbar">
            <Container fluid>
                <Navbar.Brand as={Link} to={DEFAULT_PATHS[user?.role] || "/"} className="d-flex align-items-center">
                    <div className="logo-container me-2">
                        <img src="/logo-icon.png" alt="Logo" className="logo-icon" />
                    </div>
                    <span className="brand-text">
                        <span className="brand-primary">SYSTEM</span>
                        <span className="brand-secondary">MANAGER</span>
                    </span>
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggle">
                    <span className="navbar-toggle-icon"></span>
                </Navbar.Toggle>
                
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
                    <Nav className="main-nav">
                        {getRolePaths(user?.role || "guest").map((path, index) => (
                            <Nav.Link 
                                key={index} 
                                as={Link} 
                                to={path.path}
                                className={`nav-link ${isActive(path.path) ? 'active' : ''}`}
                            >
                                <i className={`bi ${path.icon} me-2`}></i>
                                {path.label}
                                {isActive(path.path) && <div className="nav-indicator"></div>}
                            </Nav.Link>
                        ))}
                    </Nav>
                    
                    <Nav className="user-nav">
                        {user ? (
                            <Dropdown align="end" className="user-dropdown">
                                <Dropdown.Toggle variant="link" id="dropdown-user" className="user-toggle">
                                    <div className="user-avatar">
                                        <i className="bi bi-person-circle"></i>
                                    </div>
                                    <div className="user-info">
                                        <div className="user-name">{user.fullName}</div>
                                        <div className="user-role">{user.role.replace('ROLE_', '')}</div>
                                    </div>
                                    <i className="bi bi-chevron-down dropdown-arrow"></i>
                                </Dropdown.Toggle>
                                
                                <Dropdown.Menu className="dropdown-menu">
                                    <Dropdown.Item as={Link} to="/profile" className="dropdown-item">
                                        <i className="bi bi-person me-3"></i>
                                        Hồ sơ cá nhân
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item 
                                        onClick={() => {
                                            signOut();
                                            navigate("/");
                                        }}
                                        className="dropdown-item text-danger"
                                    >
                                        <i className="bi bi-box-arrow-right me-3"></i>
                                        Đăng xuất
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <Button 
                                variant="outline-light" 
                                as={Link} 
                                to="/login"
                                className="login-btn"
                            >
                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                Đăng nhập
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;