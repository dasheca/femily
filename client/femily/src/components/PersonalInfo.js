import React, { useState, useEffect } from "react";
import axios from "axios";

const PersonalInfo = ({ id }) => { // Принимаем идентификатор пользователя в качестве пропса
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Запрос к серверу для получения данных пользователя по указанному идентификатору
                const response = await axios.get(`http://localhost:5000/user/getUser/${id}`);
                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка при загрузке личных данных пользователя:', error);
            }
        };

        fetchUserData();
    }, [id]); // Добавляем id в зависимости, чтобы запрос обновлялся при изменении id

    

    return (
        <div>
            <h2>Личные данные пользователя</h2>
            <p>Email: {userData?.email}</p>
            <p>Phone: {userData?.phone}</p>
            <p>FIO: {userData?.FIO}</p>
        </div>
    );
}

export default PersonalInfo;
