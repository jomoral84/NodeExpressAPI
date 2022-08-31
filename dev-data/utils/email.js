/* eslint-disable */

const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');
const path = require('path');


module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Natours Support <${process.env.EMAIL_FROM}>`;

    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
        }

        return nodemailer.createTransport({

            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD

            }
        });
    }

    async send(template, subject) { // Envia el mail actual

        // 1) Render pug
        const html = pug.renderFile(
            `C:/Users/Administrador/Desktop/Programming/NodeJs Udemy/4-natours/NodeExpressAPI/views/email/${template}.pug`, {
                firstName: this.firstName,
                url: this.url,
                subject,
            }
        );

        // 2) Definir las opciones del email
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText(html),
        };

        await this.newTransport().sendMail(mailOptions);

    }

    async sendWelcome() {
        await this.send('welcome', 'Bienvenido a la aplicacion Natour!');
    }


    async sendPasswordReset() {
        await this.send('passwordReset', 'Reseteo de Password');
    }

};