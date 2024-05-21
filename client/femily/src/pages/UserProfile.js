import React, { useState, useEffect } from 'react';
import { Card, Table, Spinner, Alert, Button} from 'react-bootstrap';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Ensure this import is correct
import Footer from '../components/Futter';

const UserProfile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) {
                setError('Токен не найден');
                setLoading(false);
                return;
            }

            let decoded;
            try {
                decoded = jwtDecode(token);
            } catch (e) {
                setError('Ошибка при декодировании токена');
                setLoading(false);
                return;
            }

            const userEmail = decoded.email;

            try {
                const userResponse = await axios.get(`http://localhost:5000/user/checkByEmail/${userEmail}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserInfo(userResponse.data);

                const registrationsResponse = await axios.get(`http://localhost:5000/user/registrations/${userEmail}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRegistrations(registrationsResponse.data);
                setLoading(false);
            } catch (error) {
                setError('Ошибка при загрузке данных');
                setLoading(false);
                console.error('Ошибка при загрузке данных:', error);
            }
        };

        fetchUserData();
    }, [token]);


    

    const handleDeleteUser = async () => {
        try {
            await axios.delete(`http://localhost:5000/user/${userInfo.email}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            localStorage.removeItem('token');
            window.location.href = '/auth'; // Redirect to login page after deletion
        } catch (error) {
            setError('Ошибка при удалении пользователя');
            console.error('Ошибка при удалении пользователя:', error);
        }
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div className="user-profile">
            <h5 style={{fontFamily: 'Cormorant sans-serif', fontSize: '2vw' , margin: '2vw 0', textAlign: 'center'}}>ЛИЧНЫЙ КАБИНЕТ</h5>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 8vw', marginBottom: '10vw' }}>
                <Card className="user-info-card" style={{ width: '48%', fontFamily: 'Cormorant sans-serif', fontSize: '1.5vw', backgroundColor: 'transparent', border: '0.2vw solid #DFC19F', borderRadius: '0vw' }}>
                    <Card.Body>
                        <Card.Title style={{fontSize: '2vw', textAlign: 'center', marginBottom: '2vw'}}>Личная информация</Card.Title>
                        {userInfo && (
                            <div>
                                <h5 style={{backgroundColor: 'rgba(223, 193, 159, 0.5)'}}>Имя: {userInfo.FIO}</h5>
                                <h5 style={{backgroundColor: 'rgba(223, 193, 159, 0.5)'}}>Email: {userInfo.email}</h5>
                                <h5 style={{backgroundColor: 'rgba(223, 193, 159, 0.5)'}}>Телефон: {userInfo.phone}</h5>
                                <Button variant="danger" onClick={handleDeleteUser} style={{border: '0.2vw solid #DFC19F', borderRadius: '0', marginTop: '2vw', backgroundColor: '#DFC19F', color: 'black'}}>Удалить аккаунт</Button>
                            </div>
                        )}
                    </Card.Body>
                </Card>
                <div style={{ width: '48%' }}>
                    <h5 style={{fontSize: '2vw', textAlign: 'center', marginBottom: '1vw', fontFamily: 'Cormorant sans-serif'}}>МОИ ЗАПИСИ</h5>
                    <Table  striped bordered hover style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', fontFamily: 'Cormorant sans-serif', fontSize: '1vw' }}>
                        <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Время</th>
                                <th>Услуга</th>
                                <th>Мастер</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map(registration => (
                                <tr key={registration.id}>
                                    <td>{new Date(registration.date).toLocaleDateString()}</td>
                                    <td>{registration.time}</td>
                                    <td>{registration.serviceTitle}</td>
                                    <td>{registration.specialistName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UserProfile;
