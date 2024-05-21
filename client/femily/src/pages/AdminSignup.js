import React, { useState, useEffect } from 'react';
import { Table, Alert, Spinner, Button } from 'react-bootstrap';
import axios from 'axios';
import Footer from '../components/Futter';

const RegistrationList = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user/allsignupforservice', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setRegistrations(response.data);
        setLoading(false);
      } catch (error) {
        setError('Ошибка при получении списка записей');
        setLoading(false);
        console.error('Ошибка при получении списка записей:', error);
      }
    };

    fetchRegistrations();
  }, []);

  const handleDelete = async (email) => {
    try {
      const response = await axios.delete(`http://localhost:5000/user/registrations/${email}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessage('Запись на услугу успешно удалена');
      setRegistrations(registrations.filter(registration => registration.email !== email));
    } catch (error) {
      setError('Ошибка при удалении записи');
      console.error('Ошибка при удалении записи:', error);
      if (error.response) {
        // Сервер вернул ответ с ошибкой
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // Запрос был сделан, но ответ не получен
        console.error('Request data:', error.request);
      } else {
        // Произошла ошибка при настройке запроса
        console.error('Error message:', error.message);
      }
    }
  };

  return (
    <div>
      <p style={{fontSize: '2vw', textAlign: 'center', margin: '2vw 0', fontFamily: 'Cormorant sans-serif'}}>СПИСОК ЗАПИСЕЙ НА УСЛУГУ КЛИЕНТОВ</p>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Spinner animation="border" role="status" style={{display: 'block', margin: '2vw auto'}}>
          <span className="sr-only">Загрузка...</span>
        </Spinner>
      ) : (
        <Table striped bordered hover style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', fontFamily: 'Cormorant sans-serif', fontSize: '1.5vw', margin:'0 8vw', width: '84vw', marginBottom: '5vw' }}>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Время</th>
              <th>Название услуги</th>
              <th>Имя специалиста</th>
              <th>Email</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map(registration => (
              <tr key={registration.id}>
                <td>{registration.date}</td>
                <td>{registration.time}</td>
                <td>{registration.serviceTitle}</td>
                <td>{registration.specialistName}</td>
                <td>{registration.email}</td>
                <td>
                  <Button variant="danger" onClick={() => handleDelete(registration.email)}>Удалить</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Footer />
    </div>
  );
};

export default RegistrationList;
