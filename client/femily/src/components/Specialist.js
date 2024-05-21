import React, { useState, useEffect } from 'react';
import { Button, Card, Modal } from 'react-bootstrap';
import axios from 'axios';
import './styles.css'; // Подключаем CSS для стилизации
import Footer from './Futter';

const Specialist = () => {
    const [specialists, setSpecialists] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [selectedSpecialist, setSelectedSpecialist] = useState(null);

    useEffect(() => {
        const fetchSpecialists = async () => {
            try {
                const response = await axios.get('http://localhost:5000/specialist');
                setSpecialists(response.data);
            } catch (error) {
                console.error('Error fetching specialists:', error);
            }
        };

        fetchSpecialists();
    }, []);

    const handleModalShow = (specialist) => {
        setSelectedSpecialist(specialist);
        setModalShow(true);
    };

    const handleModalClose = () => {
        setModalShow(false);
        setSelectedSpecialist(null);
    };

    return (
        <div>
           
            <div className="card-container">
                {specialists.map(item => (
                    <div key={item.id} className="service-card">
                        <Card
                            className="h-100"
                            style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', marginBottom: '1vw' }}>
                            <Card.Img variant="top" src={`static/${item.photo}`} style={{ borderRadius: '0', maxHeight: '20vw' }} alt='Фотка' />
                            <Card.Body>
                                <Card.Title className="cormorant" style={{ fontWeight: 'bold', fontSize: '1.5vw' }}>{item.FIO}</Card.Title>
                                <Card.Text className="cormorant" style={{ fontSize: '1.2vw' }}>{item.description}</Card.Text>
                                <Button variant="primary" onClick={() => handleModalShow(item)} style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', marginBottom: '0.5vw', backgroundColor: '#DFC19F', color: 'black', fontSize: '1.2vw', fontFamily: 'Cormorant sans-serif' }}>
                                    Подробнее
                                </Button>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>
            {selectedSpecialist && (
                <Modal show={modalShow} onHide={handleModalClose} size="md" centered style={{fontSize: '1.2vw', fontFamily: 'Cormorant sans-serif'}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Подробная информация</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>В нашем салоне красоты каждый мастер - это опытный профессионал, стремящийся к совершенству в своем деле. Мы гордимся нашей командой, состоящей из талантливых специалистов, каждый из которых обладает уникальными навыками и индивидуальным подходом к работе.</p>
                        <h2>{selectedSpecialist.FIO}</h2>
                        <p><strong>Описание:</strong> {selectedSpecialist.description}</p>
                        <p><strong>Опыт:</strong> {selectedSpecialist.experience}</p>
                        {/* Добавьте дополнительную информацию о специалисте, если необходимо */}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModalClose} style={{ border: '0.2vw solid #DFC19F', borderRadius: '0', marginBottom: '0.5vw', backgroundColor: '#DFC19F', color: 'black', fontSize: '1.2vw', fontFamily: 'Cormorant sans-serif' }}>
                            Закрыть
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
            
        </div>
    );
};

export default Specialist;
