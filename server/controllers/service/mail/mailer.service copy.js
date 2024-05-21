
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: 'smpt.mail.ru',
    port: '465',
    secure: true,
    auth: {
        user: 'kolmogortseva05@mail.ru',
        pass: 'KwqKG3JiMNyK8xDaTTqR',
    }
}, {
    from: 'FEMily chill&beauty <kolmogortseva05@mail.ru>'
})
sendTestMail = (email) => {
    transporter.sendMail({
        to: email,
        subject: 'FEMily chill&beauty',
        text: 'Приветики',
        html: `<h1>Улыбнитесь</h1>
 <i>Здравствуйте, ${email}</i>
 <p>вы успешно вошли в систему</p>`
    })

        .then(() => console.info("Письмо отправилось", email))
        .catch((err) =>
            console.warn("произошла ошибка", err)
        )
}
const Vxod = {
    sendTestMail: sendTestMail
}
module.exports = Vxod;
