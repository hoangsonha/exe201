import { useContext, useEffect, useState } from "react";
import { Container, Card, Row, Col, Button, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../App';
import { getEmployeeById } from "../serviceAPI/employeeService";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";

function InformationUser() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [userLogin, setUserLogin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const result = await getEmployeeById(user.id);
      setUserLogin(result.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Button variant="secondary" className="mb-3" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-2" />
        Close
      </Button>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading...</p>
        </div>
      ) : userLogin ? (
        <Card className="shadow">
          <Card.Header className="bg-primary text-white d-flex align-items-center">
            <FaUserCircle size={24} className="me-2" />
            <h5 className="mb-0">Information</h5>
          </Card.Header>
          <Card.Body>
            <Row className="mb-3">
              <Col md={6}><strong>User name:</strong> {userLogin.userName}</Col>
              <Col md={6}><strong>Full name:</strong> {userLogin.fullName}</Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}><strong>Email:</strong> {userLogin.email}</Col>
              <Col md={6}><strong>Phone:</strong> {userLogin.phone}</Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}><strong>Code:</strong> {userLogin.code}</Col>
              <Col md={6}>
                <strong>Role:</strong> <Badge bg="info">{userLogin.roleName}</Badge>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <strong>Status:</strong>{" "}
                <Badge bg={userLogin.enabled ? "success" : "secondary"}>
                  {userLogin.enabled ? "Actived" : "Inactived"}
                </Badge>
              </Col>
              <Col md={6}>
                <strong>Locked:</strong>{" "}
                <Badge bg={userLogin.nonLocked ? "success" : "danger"}>
                  {userLogin.nonLocked ? "Non locked" : "Locked"}
                </Badge>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ) : (
        <p className="text-danger text-center">Not found this employee.</p>
      )}
    </Container>
  );
}

export default InformationUser;
