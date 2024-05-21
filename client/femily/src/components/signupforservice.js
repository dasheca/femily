import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import Footer from './Futter';

const SignUpForService = () => {
    const [email, setEmail] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedSpecialist, setSelectedSpecialist] = useState('');
    const [services, setServices] = useState([]);
    const [specialists, setSpecialists] = useState([]);
    const [error, setError] = useState('');

    const decodeToken = (token) => {
        const tokenParts = token.split('.');
        const decodedPayload = JSON.parse(atob(tokenParts[1]));
        return decodedPayload;
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
    
        if (token) {
            const decodedToken = decodeToken(token);
            setEmail(decodedToken.email);
        }
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const serviceResponse = await axios.get('http://localhost:5000/service');
                setServices(serviceResponse.data.rows);
            } catch (error) {
                setError('Ошибка при получении данных о услугах: ' + error.message);
            }
        };

        const fetchSpecialists = async () => {
            try {
                const specialistResponse = await axios.get('http://localhost:5000/specialist');
                const responseData = specialistResponse.data;
                console.log("Response Data:", responseData);
                if (Array.isArray(responseData)) {
                    setSpecialists(responseData);
                } else {
                    setError('Ошибка при получении данных о мастерах: Некорректный формат данных');
                }
            } catch (error) {
                setError('Ошибка при получении данных о мастерах: ' + error.message);
            }
        };

        fetchServices();
        fetchSpecialists();
    }, []);

    const handleServiceChange = (e) => {
        setSelectedService(e.target.value);
    };

    const handleSpecialistChange = (e) => {
        setSelectedSpecialist(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/user/signupforservice', {
                email,
                date,
                time,
                serviceTitle: selectedService,
                specialistName: selectedSpecialist,
            });
            console.log('Response:', response.data);
            alert('Запись на услугу успешно создана!');
        } catch (error) {
            setError('Ошибка при создании записи на услугу: ' + error.message);
            alert('Произошла ошибка при создании записи на услугу. Пожалуйста, попробуйте еще раз.');
        }
    };

    return (
        <div>
            <div className='title_signup' style={{fontWeight: 'regular', fontSize:'2vw', textAlign:'center', fontFamily:'Cormorant sans-serif', margin: '2vw 0 '}}>
                ЗАПИСАТЬСЯ НА УСЛУГУ
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 8vw', marginBottom: '2vw' }}>
                <div style={{ flex: 1, marginRight: '2vw', fontFamily: 'Cormorant sans-serif', backgroundColor: '#DFC19F', fontSize: '1.5vw', padding: '2vw' }}>
                    Выберите удобную для вас дату и время, а также предпочтительную услугу и мастера для записи на наши процедуры красоты. <br /> <br /> Мы готовы предоставить вам высококачественный сервис и индивидуальный подход, чтобы каждое ваше посещение было приятным и комфортным. Давайте вместе создадим ваш неповторимый образ! <br /> <br /> С любовью, FEMily chill&beauty!
                </div>
                <div className="card" style={{ flex: 1, border: '0.2vw solid #DFC19F', borderRadius: '0', padding: '1.5vw', fontFamily: 'Cormorant sans-serif' }}>
                    <Form onSubmit={handleSubmit}>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group controlId="formBasicDate">
    <Form.Label>Дата</Form.Label>
    <Form.Control 
        type="date" 
        value={date} 
        onChange={(e) => setDate(e.target.value)}
        required 
        style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', backgroundColor: 'transparent', fontSize: '1.5vw' }} 
    />
</Form.Group>
<Form.Group controlId="formBasicTime">
    <Form.Label>Время</Form.Label>
    <Form.Control 
        type="time" 
        value={time} 
        onChange={(e) => setTime(e.target.value)} 
        required 
        style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', backgroundColor: 'transparent', fontSize: '1.5vw' }} 
    />
</Form.Group>
<Form.Group controlId="formBasicService">
    <Form.Label>Выберите услугу</Form.Label>
    <Form.Control 
        as="select" 
        value={selectedService} 
        onChange={handleServiceChange} 
        required 
        style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', backgroundColor: 'transparent', fontSize: '1.5vw' }}
    >
        <option value="">Выберите услугу</option>
        {services && services.map(service => (
            <option key={service.id} value={service.title}>{service.title}</option>
        ))}
    </Form.Control>
</Form.Group>
<Form.Group controlId="formBasicSpecialist">
    <Form.Label>Выберите мастера</Form.Label>
    <Form.Control 
        as="select" 
        value={selectedSpecialist} 
        onChange={handleSpecialistChange} 
        required 
        style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', backgroundColor: 'transparent', fontSize: '1.5vw' }}
    >
        <option value="">Выберите мастера</option>
        {specialists && specialists.map(specialist => (
            <option key={specialist.id} value={specialist.FIO}>{specialist.FIO}</option>
        ))}
    </Form.Control>
</Form.Group>

                        <Button 
                            variant="primary" 
                            type="submit" 
                            style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', marginTop: '2vw', backgroundColor: '#DFC19F', color: 'black' }}
                        >
                            ЗАПИСАТЬСЯ
                        </Button>
                    </Form>
                </div>
            </div>
            {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
            <Footer />
        </div>
        
    );
};

export default SignUpForService;
