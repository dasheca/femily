import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import PORT from './config';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    FIO: '',
    phone: ''
  });
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.email || !formData.password) {
        setError('Введите email и пароль');
        setShowMessage(true);
        return;
      }

      const response = await axios.post(`http://localhost:${PORT}/user/registration`, formData);
      
      // Отправка сообщения на почту при успешной регистрации
     

      setMessage('Регистрация успешна!');
      setShowMessage(true);
    } catch (error) {
      setError('Пользователь с таким email уже существует');
      setShowMessage(true);
      console.error('Ошибка при регистрации:', error);
    }
  };

  return (
    <div>
      <h2>Регистрация</h2>
      <Form onSubmit={handleSubmit} style={{padding:'2vw'}}>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group controlId="formBasicEmail">
          <Form.Label></Form.Label>
          <Form.Control 
            type="email" 
            placeholder="Введите email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            style={{border: '0.2vw solid #DFC19F', borderRadius: '0', backgroundColor:'transparent'}}
          />
          
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label></Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Введите пароль" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            style={{border: '0.2vw solid #DFC19F', borderRadius: '0', backgroundColor:'transparent'}}
          />
        </Form.Group>

        <Form.Group controlId="formBasicFio">
          <Form.Label></Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Введите ФИО" 
            name="FIO" // Исправлено на "FIO"
            value={formData.FIO} 
            onChange={handleChange} 
            style={{border: '0.2vw solid #DFC19F', borderRadius: '0', backgroundColor:'transparent'}}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPhone">
          <Form.Label></Form.Label>
          <Form.Control 
            type="tel" 
            placeholder="Введите телефон" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            style={{border: '0.2vw solid #DFC19F', borderRadius: '0', backgroundColor:'transparent'}}
          />
        </Form.Group>

        <Button variant="primary" type="submit" style={{border: '0.2vw solid #DFC19F', borderRadius: '0', marginTop: '2vw', backgroundColor: '#DFC19F', color: 'black' }}>
          Зарегистрироваться
        </Button>
      </Form>

      {showMessage && (
        <p>{message}</p>
      )}
    </div>
  );
};

export default RegisterForm;
