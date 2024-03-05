const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const mongo = require("mongodb");
require("dotenv").config();
const { AppConfigurationClient } = require("@azure/app-configuration");

const connectionString =
    "Endpoint=https://weappconfig.azconfig.io;Id=iPvS;Secret=mt28hZcPXOtaom9cVohvleypJYOyQ4LnGpgqwH6qOWc=";

const client = new AppConfigurationClient(connectionString);

// Define an array of keys you want to fetch
// const keys = ["EMAIL", "PASSWORD"];
// Function to fetch all key-value pairs and feature flags
async function fetchAllConfigurations() {
    const configurations = {};
    const settings = client.listConfigurationSettings();
    for await (const setting of settings) {
        configurations[setting.key] = setting.value;
    }
    return configurations;
}

// Call the function to fetch all configurations

var email = "";
var password = "";
var featur = {};
var ft = false;
fetchAllConfigurations()
    .then((configurations) => {
        email = configurations["EMAIL"];
        password = configurations["PASSWORD"];
        featur = configurations[".appconfig.featureflag/MyFeatureFlag"];
        const nonjson = JSON.parse(featur);
        ft = nonjson["enabled"];
    })
    .catch((error) => {
        console.error("Error fetching configurations:", error);
    });

console.log(featur);

const app = express();
const port = process.env.PORT || 3001;
const uri = process.env.MONGODB_URI;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send({ hii: "Kalyan Reddy Bejjanki" });
});

app.get("/new", (req, res) => {
    if (ft) {
        res.send({ Hello: "New" });
    } else {
        res.send({ Hello: "Old" });
    }
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
            user: email,
            pass: password,
        },
    });

    const mailOptions = {
        from: email,
        to,
        subject,
        text,
    };

    mailTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }

        console.log("Mail sent successfully");

        res.status(200).send("Email sent: " + info.response);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
