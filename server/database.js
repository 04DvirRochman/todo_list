const express = require('express');
const app = express();
const Joi = require('joi');
const cors = require('cors');
app.use(express.json());

const fs = require('fs');

let tasks = [
    {
        id: 'dfdfri45565m?Fggfyt', //use nanoid
        name: 'Bruke Almighry',
        completed: false
    },
    {
        id: 'dfd5656i45565m?Fggfyt', //use nanoid
        name: 'Zion King',
        completed: false
    },
];



app.use(cors());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const { Pool } = require('pg');

function createNewPool() {
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'Aa123456',
        port: 5432,
    });
    return pool;
}

const pool = createNewPool();

onStart();



async function getStarters() {
    await clear();
    let rows = await getAll();
    let starters = [...tasks];
    for (element in starters) {
        add(starters[element]);
    }
}

async function isTableExists() {
    let ret = false;
    try {
        await pool.query('SELECT * FROM todo_list.tasks');
        ret = true;
    }
    catch (e) {
        ret = false;
    }
    finally {
        return ret;
    }
}

async function onStart() {
    console.log("checking if table exists...");
    let needTable = await isTableExists();
    console.log(needTable);
    needTable = !needTable;
    if (needTable) {
        await createTable();
    }
    let needStarters = await getAll();
    if (needStarters.length == 0) {
        await getStarters();
    }
}


async function createTable() {
    console.log("creating new table...");
    try {
        let queryRes = await pool.query('CREATE TABLE todo_list.tasks(id varchar(255),  name varchar(255));');
        console.log("table created");
    }
    catch (e) {
        console.log(e.message);
    }
}



async function getAll() {
    try {
        const data = await pool.query('SELECT * FROM todo_list.tasks');
        return data.rows;
    }
    catch (e) {
        console.log(e.message);
        return e.message;
    }
}

async function getById(id) {
    try {
        const data = await pool.query(`SELECT * FROM todo_list.tasks WHERE id=${id}`);
        return data.rows[0];
    }
    catch (e) {
        console.log(e.message);
        return e.message;
    }
}

async function deleteById(id) {
    try {
        const data = await pool.query(`DELETE FROM todo_list.tasks WHERE id=${id}`);
        return data.rows[0];
    }
    catch (e) {
        console.log(e.message);
        return e.message;
    }
}

async function clear() {
    try {
        const data = await pool.query(`DELETE FROM todo_list.tasks`);
        return data.rows[0];
    }
    catch (e) {
        console.log(e.message);
        return e.message;
    }
}

async function add(task) {
    try {
        let data = await pool.query('INSERT INTO  todo_list.tasks VALUES ($1, $2);', [task['id'],task['name']]);
        return data;
    }
    catch (e) {
        console.log(e.message);
        return e.message;
    }
}

async function edit(task) {
    try {
        let data = await pool.query('UPDATE todo_list.tasks SET id=$1, name=$2 WHERE (id = $1);', [task['id'], task['name']]);
        return data;
    }
    catch (e) {
        console.log(e.message);
        return e.message;
    }
}

async function searchByName(name) {
    try {
        const data = await pool.query(`SELECT * FROM todo_list.tasks WHERE UPPER(name) LIKE UPPER('%${name}%') LIMIT 1000;`);
        return data.rows;
    }
    catch (e) {
        console.log(e.message);
        return e.message;
    }
}


module.exports = { searchByName, getAll, edit, getById, deleteById, add, clear };