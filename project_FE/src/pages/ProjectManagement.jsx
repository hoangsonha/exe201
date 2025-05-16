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
import {
  getEmployees,
  deleteEmployee,
  createEmployee,
  updateEmployee,
  getRoles,
  restoreEmployee,
} from "../serviceAPI/employeeService";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

function ProjectManagement() {
  return (
    <Container className="mt-4">
      <h3 className="text-center fw-bold mb-4">This feature is not available</h3>
    </Container>
  );
}

export default ProjectManagement;
