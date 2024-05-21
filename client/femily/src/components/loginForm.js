import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import PORT from './config';

function LoginForm({ onLogin, redirect }) {
    const [loginFormData, setLoginFormData] = useState({
        email: '',
        password: ''
    });
    const [userData, setUserData] = useState(null);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:${PORT}/user/login`, loginFormData);
            const { token } = response.data;
            localStorage.setItem('token', token);

            const userDataResponse = await axios.get(`http://localhost:${PORT}/user/auth`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const { user } = userDataResponse.data;

            setUserData(user);
            onLogin(token);
            redirect();
            window.location.reload(); // Обновляем страницу
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginFormData({ ...loginFormData, [name]: value });
    };

    return (
        <div>
            <h2>Вход</h2>
            <Form onSubmit={handleLoginSubmit} style={{padding:'2vw'}}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Логин</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите логин"
                        name="email"
                        value={loginFormData.email}
                        onChange={handleChange}
                        style={{border: '0.2vw solid #DFC19F', borderRadius: '0', backgroundColor:'transparent'}}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Введите пароль"
                        name="password"
                        value={loginFormData.password}
                        onChange={handleChange}
                        style={{border: '0.2vw solid #DFC19F', borderRadius: '0', backgroundColor:'transparent'}}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" style={{border: '0.2vw solid #DFC19F', borderRadius: '0', marginTop: '2vw', backgroundColor: '#DFC19F', color: 'black' }}>
                    Войти
                </Button>
            </Form>

            {userData && (
                <div>
                    <h2>Данные пользователя:</h2>
                    <p>Email: {userData.email}</p>
                    <p>Роль: {userData.role}</p>
                </div>
            )}
        </div>
    );
}

export default LoginForm;
