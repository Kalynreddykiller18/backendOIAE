const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const mongo = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;
const uri = process.env.MONGODB_URI;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send({ hii: "Kalyan Reddy Bejjanki" });
});

app.use("/querie", require("./routes/queries"));

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(uri);
        console.log(
            `DB connection succesfull to ${connection.connection.host}`
        );
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

connectDB();

app.post("/send-mail", (req, res) => {
    const { to, subject, text } = req.body;

    const mailTransporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
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
