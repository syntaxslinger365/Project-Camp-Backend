import jwt from "jsonwebtoken";
import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Task Manager",
            link: "http://taskmanagerlink.com",
        },
    });

    const emailTextual = mailGenerator.generatePlaintext(
        options.mailgenContent,
    );
    const emailHtml = mailGenerator.generate(options.mailgenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS,
        },
    });

    const mail = {
        from: "mail.taskmanagerexample.com",
        to: options.email,
        subject: options.subject,
        test: emailTextual,
        html: emailHtml,
    };

    try {
        await transporter.sendMail(mail);
    } catch (error) {
        console.error(
            "Emial servoce failed siliently . Make sure that you have procided your MAILTRAP credentials in the .env file ",
        );
        console.error("Error:", error);
    }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to our App ! we are excited to have on board.",
            action: {
                instructions:
                    "To verify your email please click on following button ",
                button: {
                    color: "#22BC66",
                    text: "Reset password  ",
                    link: verificationUrl,
                },
            },
            outro: "need help?,or have questions? just reply to this email,we'd love to help",
        },
    };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: "We got a request to reset the password of your account",
            action: {
                instructions:
                    "To reset your password click on the following button or link ",
                button: {
                    color: "#22BC66",
                    text: "verify your email ",
                    link: passwordResetUrl,
                },
            },
            outro: "need help?,or have questions? just reply to this email,we'd love to help",
        },
    };
};

export {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail,
};
