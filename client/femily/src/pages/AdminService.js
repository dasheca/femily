import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const decodeToken = (token) => {
    const tokenParts = token.split('.');
    const decodedPayload = JSON.parse(atob(tokenParts[1]));
    return decodedPayload;
};

const AddServiceForm = () => {
    const [serviceData, setServiceData] = useState({
        title: '',
        description: '',
        price: '',
        FIO: '',
        type: ''
    });
    const [photo, setPhoto] = useState(null);
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [error, setError] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const decodedToken = decodeToken(token);
            setRole(decodedToken.role);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServiceData({ ...serviceData, [name]: value });
    };

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!role || role !== 'ADMIN') {
            setError('Только администраторы могут добавлять услуги');
            setShowMessage(true);
            return;
        }

        if (!serviceData.title || !serviceData.description || !serviceData.price) {
            setError('Все поля, кроме фото, обязательны для заполнения');
            setShowMessage(true);
            return;
        }

        const formData = new FormData();
        formData.append('title', serviceData.title);
        formData.append('description', serviceData.description);
        formData.append('price', serviceData.price);
        formData.append('photo', photo);
        formData.append('FIO', serviceData.FIO);
        formData.append('type', serviceData.type);

        try {
            const response = await axios.post(`http://localhost:5000/service`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage('Услуга успешно добавлена!');
            setShowMessage(true);
            setServiceData({
                title: '',
                description: '',
                price: '',
                FIO: '',
                type: ''
            });
            setPhoto(null);
        } catch (error) {
            setError('Ошибка при добавлении услуги');
            setShowMessage(true);
            console.error('Ошибка при добавлении услуги:', error);
        }
    };

    return (
        <div style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', padding: '2vw', fontFamily: 'Cormorant sans-serif', width: '84vw', margin: '2vw 8vw' }}>
            <h2 style={{textAlign: 'center'}}>ДОБАВИТЬ НОВУЮ УСЛУГУ</h2>
            <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                {showMessage && <Alert variant="success">{message}</Alert>}
                <Form.Group controlId="formBasicTitle">
                    <Form.Label>Услуга:</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Введите название услуги" 
                        name="title" 
                        value={serviceData.title} 
                        onChange={handleChange} 
                        style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', backgroundColor: 'transparent', fontSize: '1.2vw' }}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicDescription">
                    <Form.Label>Описание:</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Введите описание услуги" 
                        name="description" 
                        value={serviceData.description} 
                        onChange={handleChange} 
                        style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', backgroundColor: 'transparent', fontSize: '1.2vw' }}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPrice">
                    <Form.Label>Цена:</Form.Label>
                    <Form.Control 
                        type="number" 
                        placeholder="Введите цену услуги" 
                        name="price" 
                        value={serviceData.price} 
                        onChange={handleChange} 
                        style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', backgroundColor: 'transparent', fontSize: '1.2vw' }}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPhoto">
                    <Form.Label>Фото:</Form.Label>
                    <Form.Control 
                        type="file" 
                        name="photo" 
                        onChange={handlePhotoChange} 
                        style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', backgroundColor: 'transparent', fontSize: '1.2vw' }}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicFIO">
                    <Form.Label>Мастер:</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Введите ФИО" 
                        name="FIO" 
                        value={serviceData.FIO} 
                        onChange={handleChange} 
                        style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', backgroundColor: 'transparent', fontSize: '1.2vw' }}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicType">
                    <Form.Label>Тип:</Form.Label>
                    <Form.Control 
                        type="number" 
                        placeholder="Введите тип услуги" 
                        name="type" 
                        value={serviceData.type} 
                        onChange={handleChange} 
                        style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', backgroundColor: 'transparent', fontSize: '1.2vw' }}
                    />
                </Form.Group>

                <Button 
                    variant="primary" 
                    type="submit" 
                    style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', marginTop: '2vw', backgroundColor: '#DFC19F', color: 'black', fontSize: '1.2vw' }}
                >
                    ДОБАВИТЬ УСЛУГУ
                </Button>
            </Form>
        </div>
    );
};

export default AddServiceForm;
