const ApiError = require('../error/ApiError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Registration } = require('../models/models');
const MailService = require("./service/mail/mailer.service")
const Vxod = require("./service/mail/mailer.service copy")

const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    );
}

class UserController {
    async registration(req, res, next) {
        const { email, password, role, FIO, phone } = req.body;
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'));
        }
        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'));
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({ email, role, password: hashPassword, FIO, phone });
        const registration = await Registration.create({ userId: user.id });
        const token = generateJwt(user.id, user.email, user.role);
        
        MailService.sendTestMail(email);

        return res.json({ token });
    }

    async login(req, res, next) {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'));
        }
        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.internal('Указан неверный пароль'));
        }
        
        Vxod.sendTestMail(email);
        const token = generateJwt(user.id, user.email, user.role);
        return res.json({ token });
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role);

       

        return res.json({ token });
    }

   // Серверная часть (Express)

    async SignUpForService   (req, res, next) {
    try {
        const { email, date, time, serviceTitle, specialistName } = req.body;

        // Создаем запись на услугу
        const registration = new Registration({
            email,
            date,
            time,
            serviceTitle,
            specialistName,
        });

        // Сохраняем запись в базу данных
        const savedRegistration = await registration.save();

        res.json({ registration: savedRegistration });
    } catch (error) {
        next(ApiError.internal(error.message));
    }
};


    async getAllRegistrations(req, res, next) {
        try {
            const registrations = await Registration.findAll();
            return res.json(registrations);
        } catch (e) {
            next(ApiError.internal('Internal server error'));
        }
    }
    
    async getUserRegistrations(req, res, next) {
        try {
            const { email } = req.params;
            if (!email) {
                return res.status(400).json({ message: 'User email is required' });
            }
    
            const userRegistrations = await Registration.findAll({ where: { email } });
    
            if (!userRegistrations) {
                return res.status(404).json({ message: 'No registrations found for this user' });
            }
    
            return res.json(userRegistrations);
        } catch (error) {
            console.error('Error fetching user registrations:', error);
            next(ApiError.internal('Internal server error'));
        }
    }
    async deleteRegistration(req, res, next) {
        // Метод удаления записи на услугу по email
        try {
          const { email } = req.params;
          const registration = await Registration.findOne({ where: { email } });
          if (!registration) {
            return next(ApiError.notFound('Запись на услугу не найдена'));
          }
          await registration.destroy();
          return res.json({ message: 'Запись на услугу успешно удалена' });
        } catch (e) {
          console.error('Ошибка при удалении записи на услугу:', e);
          next(ApiError.internal('Внутренняя ошибка сервера'));
        }
      }
    async getUser(req, res, next) {
        try {
            const { userId } = req.params;
            const user = await User.findByPk(userId);
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'));
            }
            return res.json(user);
        } catch (e) {
            next(ApiError.internal('Внутренняя ошибка сервера'));
        }
    }
    async checkByEmail (req, res)  {
        const { email } = req.params;

try {
  // Ищем пользователя по email в базе данных
  const user = await User.findOne({ where: { email } });

  // Если пользователь найден, отправляем информацию о нем
  if (user) {
    res.json(user.toJSON());
  } else {
    // Если пользователь не найден, отправляем соответствующее сообщение
    res.status(404).json({ message: 'Пользователь с указанным email не найден' });
  }
} catch (error) {
  console.error('Ошибка при поиске пользователя по email:', error);
  res.status(500).json({ message: 'Произошла ошибка при поиске пользователя по email' });
}
      }

      async updateUser(req, res, next) {
        try {
            const { userId } = req.params;
            const { email, password, phone, FIO, role } = req.body;
            const user = await User.findByPk(userId);
    
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'));
            }
    
            // Обновление данных пользователя
            if (email) user.email = email;
            if (password) {
                const hashPassword = await bcrypt.hash(password, 5);
                user.password = hashPassword;
            }
            if (phone) user.phone = phone;
            if (FIO) user.FIO = FIO;
            if (role) user.role = role;
    
            await user.save();
            return res.json(user);
        } catch (e) {
            console.error(e); // Выводим ошибку в консоль для отладки
            next(ApiError.internal('Внутренняя ошибка сервера'));
        }
    }
    

    async deleteUser(req, res, next) {
        try {
            const { email } = req.params;
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return next(ApiError.notFound('Пользователь не найден'));
            }
            await user.destroy();
            return res.json({ message: 'Пользователь успешно удален' });
        } catch (e) {
            next(ApiError.internal('Внутренняя ошибка сервера'));
        }
    }
}

module.exports = new UserController();
