let nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 25,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: "32746906cdded8",
        pass: "d6639ee95ee2fa",
    },
});
module.exports = {
    sendMail: async function (to, url) {
        await transporter.sendMail({
            from: '"admin@" <hieupham13012004@gmail.com>',
            to: to,
            subject: "mail reset passwrod",
            text: "lick vo day de doi passs", // Plain-text version of the message
            html: "lick vo <a href=" + url + ">day</a> de doi passs", // HTML version of the message
        });
    },
    sendPasswordMail: async function (to, username, password) {
        await transporter.sendMail({
            from: '"admin@" <hieupham13012004@gmail.com>',
            to: to,
            subject: "Thong tin tai khoan cua ban",
            text: "Username: " + username + " - Password: " + password,
            html: "<h3>Thong tin tai khoan</h3>"
                + "<p><b>Username:</b> " + username + "</p>"
                + "<p><b>Password:</b> " + password + "</p>"
                + "<p>Vui long doi mat khau sau khi dang nhap.</p>",
        });
    }
}