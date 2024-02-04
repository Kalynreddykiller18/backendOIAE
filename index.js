const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send({ hii: "Kalyan Reddy Bejjanki" });
});

app.post("/send-mail", (req, res) => {
    const { to, subject, text } = req.body;

    const mailTransporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: "accounts@oiaes.com",
            pass: "8Tutbury@8",
        },
    });

    const mailOptions = {
        from: "accounts@oiaes.com",
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
