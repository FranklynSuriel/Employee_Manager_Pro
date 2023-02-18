// Packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs/promises');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'House25*+',
        database: 'movies_db'
    },
    console.log(`Connected to the movies_db database.`)
);

const questions = [
    {
        type: 'list',
        name: 'options',
        message: 'Choose an option to view edit or add data to the database:',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
        ],
    },
]

function run() {
    inquirer
    .prompt(questions)

    .then((answer) => {
        console.log(answer)
    })
}

run();
