const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) Crear un transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASS

        }
    })


    // 2) Definir las opciones del email
    const mailOptions = {
        from: 'jomoral2013@gmail.com',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    // 3) Enviar el mail
    await transporter.sendMail(mailOptions);
};


module.exports = sendEmail;