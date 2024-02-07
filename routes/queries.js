const router = require("express").Router();
const mongo = require("mongodb");

const Querie = require("../models/queries");

router.get("/", async (req, res) => {
    try {
        const que = await Querie.find();
        res.json(que);
    } catch (err) {
        console.log(err);
    }
});

router.get("/get", (req, res) => {
    res.json({ name: "Kalyan" });
});

router.get("/:token", async (req, res) => {
    try {
        const q = await Querie.findOne({ ticket: req.params.token });
        res.json(q);
    } catch (err) {
        console.log(err);
    }
});

const generateTicket = async (length) => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;

    const t = Math.floor(Math.random() * (max - min + 1)) + min;
    const c = await Querie.findOne({ ticket: t }, {});

    if (c == null) return t;
    return generateTicket(length);
};

router.post("/add", async (req, res) => {
    try {
        const tick = await generateTicket(6);

        const newQurie = new Querie({
            ticket: tick,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            company: req.body.company,
            email: req.body.email,
            message: req.body.message,
        });

        await newQurie.save();
        res.json({ message: "Successs", ticket: tick });
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

module.exports = router;
