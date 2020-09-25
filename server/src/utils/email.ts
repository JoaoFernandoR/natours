import nodemailer from 'nodemailer'

const sendEmail = async (options:any) => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
        // Activate in gmail "less secure app" option 
    } ) 
    // 2) Define the email options
    const mailOptions = {
        from: 'John Hernandez <john@gmail.io>',
        to: options.email,
        subject: options.subject,
        text: options.message, 
        // html: 
    }
    // 3) Send the e-mail
    await transporter.sendMail(mailOptions)
}

export default sendEmail