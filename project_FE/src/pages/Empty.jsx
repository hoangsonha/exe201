import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Container,
  Row,
  Table,
  InputGroup,
  Col,
  Modal,
  Badge,
} from "react-bootstrap";

function Empty() {


  return (
    <Container className="mt-4">
      <h3 className="text-center fw-bold mb-4">Hiện chưa có tính năng cho tài khoản</h3>
    </Container>
  );
}

export default Empty;