// Packages needed for this application
const inquirer = require('inquirer');
const mysql = require('mysql2');
const table = require('console.table');
const Font = require('ascii-art-font');

const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'House25*+',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
);

Font.create('Employee', 'Doom', function (err, result) {
  console.log(result);
});
Font.create('Manager', 'Doom', function (err, result) {
  console.log(result);
});

// Connect to the database and start the application
db.connect((err) => {
  if (err) throw err;
  // console.log(`Connected as id ${db.threadId}`);
  run();
});

const questions = [
  {
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit',
    ],
  },
]

function run() {
  inquirer
    .prompt(questions)

    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          connection.end();
          break;
      }

    })
}

// Query the database for all departments and display the results in a table
function viewAllDepartments() {
  db.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
    run();
  });
}

// Query the database for all roles and display the results in a table
function viewAllRoles() {
  db.query(
    'SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id',
    (err, res) => {
      if (err) throw err;
      console.table(res);
      run();
    }
  );
}

// Query the database for all employees and display the results in a table
function viewAllEmployees() {
  db.query(
    'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id',
    (err, res) => {
      if (err) throw err;
      console.table(res);
      run();
    }
  );
}

// Prompt for a new department name and add it to the database
function addDepartment() {
  inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: 'What is the name of the department?',
    })
    .then((answer) => {
      db.query(
        'INSERT INTO department SET ?',
        { name: answer.name },
        (err, res) => {
          if (err) throw err;
          console.log(`Added ${answer.name} to departments`);
          run();
        }
      );
    });
}

// Prompt for a new role title, salary,
function addRole() {
  inquirer
    .prompt([
      {
        name: 'title',
        type: 'input',
        message: 'What is the role name?',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary for the role?',
      },
      {
        name: 'department_id',
        type: 'input',
        message: 'What is the department id for the role?',
      },
    ])
    .then((answer) => {
      db.query(
        'INSERT INTO role SET ?',
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department_id,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`Added ${answer.title} to role`);
          run();
        }
      );
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: 'first_name',
        type: 'input',
        message: 'New employee first name?',
      },
      {
        name: 'last_name',
        type: 'input',
        message: 'New employee last name?',
      },
      {
        name: 'role_id',
        type: 'input',
        message: 'What is the new employe role id?',
      },
      {
        name: 'manager_id',
        type: 'input',
        message: 'What is the new employee manager id?',
      },
    ])
    .then((answer) => {
      db.query(
        'INSERT INTO employee SET ?',
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role_id,
          manager_id: answer.manager_id,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`Added ${answer.first_name} ${answer.last_name} to employee`);
          run();
        }
      );
    });
}

function updateEmployeeRole() {
  inquirer
  .prompt([
    {
      name: 'first_name',
      type: 'list',    
      message: 'Update an employee role?',
      choices: [
        db.query('SELECT first_name, last_name FROM employee', (err, res) => {
          if (err) throw err;
          console.table(res);
        }) 
      ],
    },
  ])
}


