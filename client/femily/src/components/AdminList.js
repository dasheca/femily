import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegistrationsList = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/user/admin');
        setRegistrations(response.data.rows);
        console.log('Регистрации:', response.data.rows); // Вывод регистраций в консоль
      } catch (error) {
        console.error('Ошибка при загрузке регистраций:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h2>Список регистраций</h2>
      <ul>
        {registrations.map(registration => (
          <li key={registration.id}>
            <p>Дата: {registration.date}</p>
            <p>Время: {registration.time}</p>
            <p>Услуга: {registration.serviceTitle}</p> {/* Используется serviceTitle */}
            <p>Специалист: {registration.specialistName}</p> {/* Используется specialistName */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegistrationsList;