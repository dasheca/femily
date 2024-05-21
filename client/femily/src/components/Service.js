import React, { useState, useEffect } from 'react';
import { Button, Card, Modal } from 'react-bootstrap';
import axios from 'axios';
import './service.css'; // Подключаем файл стилей
import Footer from './Futter';

const Service = () => {
    const [services, setServices] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false);
    const isAuthenticated = localStorage.getItem('token') !== null;
    const [showLoginAlert, setShowLoginAlert] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/service?page=${currentPage}&limit=3`);
                if (Array.isArray(response.data.rows)) {
                    setServices(response.data.rows);
                    setIsLastPage(response.data.rows.length < 3); // Проверка на последнюю страницу
                } else {
                    console.error('Ошибка: данные не являются массивом:', response.data);
                }
            } catch (error) {
                console.error('Ошибка при загрузке услуг:', error);
            }
        };

        fetchServices();
    }, [currentPage]);

    const handleModalShow = (service) => {
        setSelectedService(service);
        setModalShow(true);
    };

    const handleModalClose = () => {
        setModalShow(false);
        setSelectedService(null);
    };

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    const handleSignUpForService = () => {
        if (isAuthenticated) {
            window.location.href = 'http://localhost:3000/signuprofservice';
        } else {
            setShowLoginAlert(true);
        }
    };

    return (
        <>
            <div>
                <div className="title_service">НАШИ УСЛУГИ</div>
                <div className="card-container">
                    {services.map(service => (
                        <div key={service.id} className="service-card" style={{fontFamily: 'Cormorant sans-serif'}}>
                            <Card.Img variant="top" src={`static/${service.photo}`} alt='Фото услуги' style={{maxHeight: '20vw'}} />
                            <Card.Body>
                                <Card.Title style={{fontWeight: 'bold', fontSize: '1.5vw'}}>{service.title}</Card.Title>
                                <Card.Text style={{fontSize:'1.1vw'}}>{service.description}</Card.Text>
                                <Card.Text style={{fontSize:'1.1vw', textDecoration:'underline'}}>Цена: {service.price}</Card.Text>
                                <Button variant="primary" onClick={() => handleModalShow(service)} style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', marginBottom: '0.5vw', backgroundColor: '#DFC19F', color: 'black', fontSize: '1.2vw', fontFamily: 'Cormorant sans-serif' }}>
                                    Подробнее
                                </Button> 
                                <br />
                                <Button variant="primary" onClick={() => handleSignUpForService()} style={{ border: '0.2vw solid #DFC19F', borderRadius: '0',  backgroundColor: '#DFC19F', color: 'black', fontSize: '1.2vw', fontFamily: 'Cormorant sans-serif' }}>
                                    Записаться на услугу
                                </Button>
                            </Card.Body>
                        </div>
                    ))}
                </div>
                <div className="pagination-buttons" style={{marginBottom: '2vw'}}>
                    <Button variant="warning" onClick={handlePrevPage} disabled={currentPage === 1}>
                        Предыдущая страница
                    </Button>
                    <Button variant="warning" onClick={handleNextPage} disabled={isLastPage}>
                        Следующая страница
                    </Button>
                </div>
                <Modal show={modalShow} onHide={handleModalClose} style={{fontSize: '1.2vw', fontFamily: 'Cormorant sans-serif'}}>
                    <Modal.Header closeButton >
                        <Modal.Title>Подробнее об услуге</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedService && (
                            <>
                                <p>Наслаждайтесь исключительным обслуживанием в "Family Chill & Beauty". Наша команда профессионалов готова предложить вам лучшие услуги для вашего комфорта и красоты.</p>
                                <p><strong>Название:</strong> {selectedService.title}</p>
                                <p><strong>Описание:</strong> {selectedService.description}</p>
                                <p><strong>Цена:</strong> {selectedService.price}</p>
                                <p><strong>Мастер:</strong> {selectedService.FIO}</p>
                                {selectedService.photo && <img src={`static/${selectedService.photo}`} alt="Фото услуги" style={{ maxWidth: '100%' }} />}
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose} style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', marginTop: '2vw', backgroundColor: '#DFC19F', color: 'black', fontSize: '1.2vw' }}>
                            Закрыть
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showLoginAlert} onHide={() => setShowLoginAlert(false)} style={{fontSize: '1.2vw', fontFamily: 'Cormorant sans-serif'}}>
    <Modal.Header closeButton>
        <Modal.Title>Войдите в систему</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        Для записи на услугу необходимо войти в систему. Пожалуйста, авторизуйтесь или зарегистрируйтесь.
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowLoginAlert(false)} style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', marginTop: '2vw', backgroundColor: '#DFC19F', color: 'black', fontSize: '1.2vw' }}>
            Закрыть
        </Button>
        <Button variant="primary" href="/auth" style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', marginTop: '2vw', backgroundColor: '#DFC19F', color: 'black', fontSize: '1.2vw' }}>
            Войти
        </Button>
    </Modal.Footer>
</Modal>
                <Footer />
            </div>
        </>
    );
};

export default Service;
