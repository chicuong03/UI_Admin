
import React from 'react';
import { Button, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
export default function SidebarNav() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <div
            style={{
                width: '240px',
                backgroundColor: '#f8f9fa',
                borderRight: '1px solid #dee2e6',
                minHeight: '100vh',
                fontSize: '20px',
            }}
            className="p-3"
        >
            <h5 className="mb-4 font-bold text-center text-primary">Quản trị</h5>
            <Nav className="flex-column">
                <Nav.Link as={Link} to="/" className="d-flex align-items-center mb-2">
                    <i className="fas fa-home me-2"></i> Dashboard
                </Nav.Link>
                {/* <Nav.Link href="#" className="d-flex align-items-center mb-2">
                    <i className="fas fa-users me-2"></i> Người dùng
                </Nav.Link>
                <Nav.Link href="#" className="d-flex align-items-center mb-2">
                    <i className="fas fa-user-shield me-2"></i> Vai trò
                </Nav.Link> */}
                {/* <Nav.Link as={Link} to="/blabla" className="d-flex align-items-center mb-2">
                    <i className="fas fa-user-shield me-2"></i> blabla
                </Nav.Link> */}
                <Button
                    variant="outline-danger"
                    className="d-flex align-items-center mt-4"
                    onClick={handleLogout}
                >
                    <i className="fas fa-sign-out-alt me-2"></i> Đăng xuất
                </Button>
            </Nav>
        </div>
    );
}
