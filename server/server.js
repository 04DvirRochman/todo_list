const express = require('express');
const cors = require('cors');
const Joi = require('joi');
const path = require('path');
const app = express();
app.use(express.json());
const dataBase = require("./database.js");

app.use(cors());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
/*
app.use(express.static('C:/dev/TasksCenter/client'));

task.get('/', (req, res) => {
    res.sendFile('C:/dev/TasksCenter/client/views/mainPage.html');
});
*/
app.get("/api/tasks", async (req, res) => {
    let toSend = await dataBase.getAll();
    res.send(toSend);
});

app.get("/api/search/:filter", async (req, res) => {
    let toSend = await dataBase.searchByName(req.params.name);
    res.send(toSend);
});

app.get('/api/tasks/:id', async (req, res) => {
    const task = await dataBase.getById(req.params.id);
    if (!task) {
        res.status(404).send('the tasks with the given id was not found');
        return;
    }
    res.send(task);

});

app.put('/api/tasks', async (req, res) => {
    let task = req.body;
    console.log("got task:", task);
    const validatErrors = validateTask(task).error;
    if (validatErrors) {
        console.log("error:", validatErrors.details[0].message);
        res.status(400).send(validatErrors.details[0].message);
        return;
    }
    await dataBase.edit(task);
    console.log("edited task:", task);
    res.send(`editd task: ${task}`);
});

app.delete('/api/tasks/:id', async (req, res) => {
    console.log("trying to delete:", req.params.id);
    await dataBase.deleteById(req.params.id);

    console.log("deleted:", req.params.id);
    res.send(`deleted task: ${req.params.id}`);

});


app.post('/api/tasks', async (req, res) => {
    const task = req.body;
    console.log("got task:", task);
    const validatErrors = validateTask(task).error;
    if (validatErrors) {
        console.log("error:", validatErrors.details[0].message);
        res.status(400).send(validatErrors.details[0].message);
        return;
    }
    await dataBase.add(task);
    console.log("added task:", task);
    res.send(`added task: ${task}`);
});

function validateTask(task) {
    const schema = Joi.object({
        id: Joi.number(),
        name: Joi.string().allow(''),
    });
    return schema.validate(task);
}

const port = 4000;
app.listen(port);
console.log('listening... port:', port);