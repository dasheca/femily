import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const decodeToken = (token) => {
    const tokenParts = token.split('.');
    const decodedPayload = JSON.parse(atob(tokenParts[1]));
    return decodedPayload;
};

const AddSpecialistForm = () => {
    const [specialistData, setSpecialistData] = useState({
        FIO: '',
        phone: '',
        description: '',
        experience: '',
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
        setSpecialistData({ ...specialistData, [name]: value });
    };

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!role || role !== 'ADMIN') {
            setError('Только администраторы могут добавлять специалистов');
            setShowMessage(true);
            return;
        }

        if (!specialistData.FIO || !specialistData.phone || !specialistData.description || !specialistData.experience) {
            setError('Все поля, кроме фото, обязательны для заполнения');
            setShowMessage(true);
            return;
        }

        const formData = new FormData();
        formData.append('FIO', specialistData.FIO);
        formData.append('phone', specialistData.phone);
        formData.append('description', specialistData.description);
        formData.append('experience', specialistData.experience);
        formData.append('photo', photo);

        try {
            const response = await axios.post('http://localhost:5000/specialist', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage('Специалист успешно добавлен!');
            setShowMessage(true);
            setSpecialistData({
                FIO: '',
                phone: '',
                description: '',
                experience: '',
            });
            setPhoto(null);
        } catch (error) {
            setError('Ошибка при добавлении специалиста');
            setShowMessage(true);
            console.error('Ошибка при добавлении специалиста:', error);
        }
    };

    return (
        <div style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', padding: '2vw', fontFamily: 'Cormorant sans-serif', width: '84vw', margin: '2vw 8vw' }}>
            <h2 style={{textAlign: 'center'}}>ДОБАВИТЬ НОВОГО СПЕЦИАЛИСТА</h2>
            <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                {showMessage && <Alert variant="success">{message}</Alert>}
                <Form.Group controlId="formBasicFIO">
                    <Form.Label>ФИО:</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Введите ФИО специалиста" 
                        name="FIO" 
                        value={specialistData.FIO} 
                        onChange={handleChange} 
                        style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', backgroundColor: 'transparent', fontSize: '1.2vw' }}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPhone">
                    <Form.Label>Телефон:</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Введите телефон специалиста" 
                        name="phone" 
                        value={specialistData.phone} 
                        onChange={handleChange} 
                        style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', backgroundColor: 'transparent', fontSize: '1.2vw' }}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicDescription">
                    <Form.Label>Описание:</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Введите описание специалиста" 
                        name="description" 
                        value={specialistData.description} 
                        onChange={handleChange} 
                        style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', backgroundColor: 'transparent', fontSize: '1.2vw' }}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicExperience">
                    <Form.Label>Опыт:</Form.Label>
                    <Form.Control 
                        type="number" 
                        placeholder="Введите опыт работы специалиста" 
                        name="experience" 
                        value={specialistData.experience} 
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

                <Button 
                    variant="primary" 
                    type="submit" 
                    style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', marginTop: '2vw', backgroundColor: '#DFC19F', color: 'black', fontSize: '1.2vw' }}
                >
                    ДОБАВИТЬ СПЕЦИАЛИСТА
                </Button>
            </Form>
        </div>
    );
};

export default AddSpecialistForm;
