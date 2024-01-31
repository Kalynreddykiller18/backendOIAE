const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

app.post("/send-mail", (req, res) => {
    const { to, subject, text } = req.body;

    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "praveen123kalyan@gmail.com",
            pass: "ezin suif bwye uxrt",
        },
    });

    const mailOptions = {
        from: "praveen123kalyan@gmail.com",
        to,
        subject,
        text,
    };

    mailTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }

        res.status(200).send("Email sent: " + info.response);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
