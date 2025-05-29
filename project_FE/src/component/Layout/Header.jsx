import React, { useState } from 'react';
import { Container, Row, Col, InputGroup, FormControl, Button } from 'react-bootstrap';
import './Header.css';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <header className="home-header">
      <Container fluid>
        <Row className="align-items-center">
          <Col xs={2} md={3} className="logo-container">
            <div className="logo-wrapper">
              <span className="logo-icon">🕶️</span>
              <span className="logo-text">REVIEW</span>
            </div>
          </Col>
          <Col xs={5} md={5}>
            <InputGroup className="search-bar">
              <FormControl
                placeholder="bạn muốn tìm review về cái gì?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </InputGroup>
          </Col>
          <Col xs={5} md={4} className="d-flex justify-content-end align-items-center">
            <div className="filter-button">
              <Button variant="light" className="filter-btn">
                <i className="filter-icon">⚙️</i> chủ đề
              </Button>
            </div>
            <Button variant="warning" className="upgrade-btn">
              Nâng cấp gói
            </Button>
            <div className="user-avatar">
              <img src="@/assets/toi.png" alt="User Avatar" className="avatar-img" />
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header; 