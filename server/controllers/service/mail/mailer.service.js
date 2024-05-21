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
 html: `<h1>УРА</h1>
 <i>Здравствуйте, ${email}</i>
 <p>Вы зарегистрировались</p>`
 })

 .then(() => console.info("Письмо отправилось", email))
 .catch((err) =>
    console.warn("произошла ошибка", err)
)
}
const MailService = {
 sendTestMail: sendTestMail
}
module.exports = MailService;