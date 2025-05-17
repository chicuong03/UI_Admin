import axios from 'axios';
import React, { useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        userName: '',
        password: '',
        rememberMe: true,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCredentials({
            ...credentials,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('https://quanlitiendoapi.cadico.vn/api/Auth/login', credentials);
            const token = res.data.token;

            // Lưu token với key 'token' thay vì 'accessToken' để khớp với PrivateRoute
            localStorage.setItem('token', token);

            toast.success('Đăng nhập thành công!');
            navigate('/');
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            toast.error('Sai tên đăng nhập hoặc mật khẩu!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Card style={{ minWidth: '400px' }} className="shadow p-4">
                <h3 className="text-center mb-4">Đăng nhập</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Tên đăng nhập</Form.Label>
                        <Form.Control
                            type="text"
                            name="userName"
                            value={credentials.userName}
                            onChange={handleChange}
                            required
                            placeholder="Nhập tên đăng nhập"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Mật khẩu</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            placeholder="Nhập mật khẩu"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="rememberMe">
                        <Form.Check
                            type="checkbox"
                            label="Ghi nhớ đăng nhập"
                            name="rememberMe"
                            checked={credentials.rememberMe}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={loading} className="w-100">
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </Button>
                </Form>
            </Card>
        </Container>
    );
}