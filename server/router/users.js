'use strict';
const db            = require('../database')('inventory');
const Users         = require('../controller/Users')(db);
const Router        = require('express').Router;

const router = new Router();
module.exports = router;

router.post('/', async (req, res) => {
    const body = req.body;
    if (!body || !body.username || !body.password) {
        res.status(400).send('Invalid body');
    } else {
        const created = await Users.create(body.username, body.password);
        if (created) {
            res.status(200).send('User created');
        } else {
            res.status(500).send("I don't know what happened but it didn't create the user");
        }
    }
})