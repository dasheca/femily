import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import logo from './assets/logo.svg'; // Путь к изображению логотипа
import './styles.css'; // Подключаем CSS-файл для стилизации
import LogoutButton from './logOutButton'; // Импортируем компонент LogoutButton

const decodeToken = (token) => {
    const tokenParts = token.split('.');
    const decodedPayload = JSON.parse(atob(tokenParts[1]));
    return decodedPayload;
};

function BasicExample() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [showNav, setShowNav] = useState(false);
    const [refresh, setRefresh] = useState(false); // Состояние для обновления страницы
    const token = localStorage.getItem('token'); // Определение переменной token

    // Функция для обновления страницы
    const handleRefresh = () => {
        setRefresh(!refresh);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Удаление токена из localStorage
        // Дополнительные действия при выходе
        console.log('Выход выполнен');
        handleRefresh(); // Обновление страницы после выхода
    };

    useEffect(() => {
        if (token) {
            const decodedToken = decodeToken(token);
            setIsAdmin(decodedToken.role === 'ADMIN'); // Проверка роли пользователя
        }
    }, [token]);

    return (
        <Navbar expand="lg" className="navbar" variant='light'>
            <Navbar.Brand href="/" className="logo">
                <img src={logo} style={{ width: '15vw' }} alt="Логотип" className="logo-image" /> {/* Изображение логотипа */}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setShowNav(!showNav)} className="custom-toggle" />
            <Navbar.Collapse id="basic-navbar-nav" className={`custom-collapse ${showNav ? 'show' : ''}`}>
                <Nav className="ml-auto">
                    {!token && (
                        <>
                            <Nav.Item>
                                <Nav.Link href="/service" className="animated-link">КАТАЛОГ</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="/specialist" className="animated-link">НАШИ МАСТЕРА</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="/auth" className="animated-link">ВХОД В ЛИЧНЫЙ КАБИНЕТ</Nav.Link>
                            </Nav.Item>
                        </>
                    )}
                    {token && (
                        <>
                            <Nav.Item>
                                <Nav.Link href="/service" className="animated-link">КАТАЛОГ</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="/specialist" className="animated-link">НАШИ МАСТЕРА</Nav.Link>
                            </Nav.Item>
                            {isAdmin ? (
                                <>
                                    <NavDropdown title="ДОБАВИТЬ" id="basic-nav-dropdown" className="animated-link">
                                        <NavDropdown.Item href="/adminservice">УСЛУГУ</NavDropdown.Item>
                                        <NavDropdown.Item href="/adminspecialist">МАСТЕРА</NavDropdown.Item>
                                    </NavDropdown>
                                    <Nav.Item>
                                        <Nav.Link href="/adminsignup" className="animated-link">ЗАПИСИ</Nav.Link>
                                    </Nav.Item>
                                </>
                            ) : (
                                <Nav.Item>
                                    <Nav.Link href="/signuprofservice" className="animated-link">ЗАПИСАТЬСЯ НА УСЛУГУ</Nav.Link>
                                </Nav.Item>
                            )}
                            {/* Добавляем кнопку выхода */}
                            <Nav.Item>
                                <Nav.Link href='/userprofile' className='animated-link'>ЛИЧНЫЙ КАБИНЕТ</Nav.Link>
                            </Nav.Item>
                            <Nav.Item style={{ marginTop: '0.3vw', animation: 'blink-animation 3s infinite', marginLeft: '2vw' }}>
                                <LogoutButton onLogout={handleLogout} />
                            </Nav.Item>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default BasicExample;
