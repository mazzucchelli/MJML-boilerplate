const auth = require('./auth.json');
const config = require('./config.json');
const nodemailer = require('nodemailer');
const ora = require('ora');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

let counter = 0;

const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: auth.user,
        pass: auth.pass,
    },
});

function getHtml(path) {
    return fs.readFileAsync(path, "utf8");
};

function uniqueSubject (subject) {
    return subject + '_' + Math.random().toString(36).substr(2, 9);
};

function sendEmail(emailPath) {
    const subject = emailPath;

    const spinner = ora(subject);
    spinner.color = 'yellow';
    spinner.start()


    getHtml(emailPath).then((data) => {
        const uSubject = uniqueSubject(subject);
        config.send.destinations.forEach(destination => {
            const mailOptions = {
                from: auth.user,
                to: destination,
                subject: uSubject,
                html: data,
            };
            transport.sendMail(mailOptions, (error) => {
                if (error) {
                    console.log(error);
                }
            });
        });
    }).then(() => {
        spinner.succeed(subject);
        counter += 1;
        if (counter < config.send.templates.length) {
            sendEmail(config.send.templates[counter]);
        } else {
            spinner.stop();
        }
    });
};

sendEmail(config.send.templates[counter]);
