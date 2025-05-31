import { Card, Row, Col, Badge } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";

function Informations({ employee }) {
  if (!employee) return null;

  return (
    <Card className="shadow">
      <Card.Header className="bg-primary text-white d-flex align-items-center">
        <FaUserCircle size={24} className="me-2" />
        <h5 className="mb-0">Information</h5>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col md={6}><strong>User name:</strong> {employee.userName}</Col>
          <Col md={6}><strong>Full name:</strong> {employee.fullName}</Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}><strong>Email:</strong> {employee.email}</Col>
          <Col md={6}><strong>Phone:</strong> {employee.phone}</Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}><strong>Code:</strong> {employee.code}</Col>
          <Col md={6}>
            <strong>Role:</strong> <Badge bg="info">{employee.roleName}</Badge>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <strong>Status:</strong>{" "}
            <Badge bg={employee.enabled ? "success" : "secondary"}>
              {employee.enabled ? "Actived" : "Inactived"}
            </Badge>
          </Col>
          <Col md={6}>
            <strong>Locked:</strong>{" "}
            <Badge bg={employee.nonLocked ? "success" : "danger"}>
              {employee.nonLocked ? "Non locked" : "Locked"}
            </Badge>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default Informations;