import React from "react";
import LoginForm from "../components/loginForm";
import RegisterForm from "../components/registerForm";
import Footer from "../components/Futter";
import '../components/styles.css'; // Импортируем файл со стилями

const Auth = () => {
    return (
        <div>
            <div className="title_auth">
                <div style={{fontWeight: 'bold', fontSize:'2vw'}}> Добро пожаловать в мир салона красоты Femily Chill&Beauty!</div>
                Зарегистрируйтесь или войдите в систему, чтобы получить доступ к нашим услугам. Присоединяйтесь к сообществу Femily Chill&Beauty и наслаждайтесь заботой о себе каждый день. Мы ждем вас!
            </div>
            <div className="auth-container">
                <div className="form-container">
                    <div className="loginform">
                        <LoginForm />
                    </div>
                    <div className="registerform">
                        <RegisterForm />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Auth;
