import { useContext, useEffect, useState } from "react";
import { Container, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../App';
import { getEmployeeById } from "../serviceAPI/userService";
import { FaArrowLeft } from "react-icons/fa";
import Informations from "../component/Informations";

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
        <Informations employee={userLogin} />
      ) : (
        <p className="text-danger text-center">Not found this employee.</p>
      )}
    </Container>
  );
}

export default InformationUser;
