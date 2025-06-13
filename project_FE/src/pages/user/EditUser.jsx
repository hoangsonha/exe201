import { useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import './UserProfile.css'

const EditUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    gender: '',
    interests: []
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    navigate('/profile')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Container className="mt-4">
      <Button 
        variant="secondary" 
        className="mb-3" 
        onClick={() => navigate('/profile')}
      >
        <FaArrowLeft className="me-2" />
        Quay lại
      </Button>

      <div className="edit-profile-container">
        <h2 className="text-center mb-4">Chỉnh sửa thông tin</h2>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Tên người dùng</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập tên người dùng"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Giới tính</Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Chọn giới tính</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="Other">Khác</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Sở thích</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập sở thích (phân cách bằng dấu phẩy)"
              value={formData.interests.join(', ')}
              onChange={(e) => {
                const interests = e.target.value.split(',').map(i => i.trim());
                setFormData(prev => ({
                  ...prev,
                  interests
                }));
              }}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit">
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  )
}

export default EditUser