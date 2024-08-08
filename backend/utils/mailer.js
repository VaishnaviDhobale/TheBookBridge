const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // use your email service
  auth: {
    user: "thebookbridge54@gmail.com", // your email
    pass: "zssi slvb edig mzsu"  // need to pass app password

  }
});

const sendVerificationEmail = (user, token) => {
    console.log("coming here utils")
  const mailOptions = {
    from: "thebookbridge54@gmail.com",
    to: user.email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: ${process.env.BASE_URL}/verify/${token}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = {sendVerificationEmail};
 