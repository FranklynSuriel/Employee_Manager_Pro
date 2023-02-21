// Packages needed for this application
const inquirer = require('inquirer');
const mysql = require('mysql2');
const table = require('console.table');
const Font = require('ascii-art-font');

const db = mysql.createConnection(
  {
    host: 'localhost',
    port: 3306,
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
          console.log('\nThank you for using the Employee Manager Pro!!');
          db.end();
          break;
      }
    })
}

// Query the database for all departments and display the results in a table
function viewAllDepartments() {
  db.promise().query('SELECT * FROM department')
    .then(([rows, fields]) => {
      console.table(rows);
      run();
    })
};



// Query the database for all roles and display the results in a table
function viewAllRoles() {
  const query = `
      SELECT role.id, role.title, department.name AS department, role.salary 
      FROM role 
      JOIN department ON role.department_id = department.id
      `;
  db.promise().query(query)
    .then(([rows, fields]) => {
      console.table(rows);
      run();
    })
};


// Query the database for all employees and display the results in a table
function viewAllEmployees() {

  const query = `
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager 
      FROM employee 
      LEFT JOIN role ON employee.role_id = role.id 
      LEFT JOIN department ON role.department_id = department.id 
      LEFT JOIN employee manager ON employee.manager_id = manager.id
      `;
  db.promise().query(query)
    .then(([rows, fields]) => {
      console.table(rows);
      run();
    })
}


// Prompt for a new department name and add it to the database
function addDepartment() {
  inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: 'Enter the name of the new department:',
    })
    .then((answer) => {
      db.promise().query('INSERT INTO department SET ?', { name: answer.name })
        .then(([rows, fields]) => {
          console.log(`\nAdded ${answer.name} to departments\n`);
          run();
        }
        );
    });
}


// Prompt for a new role title, salary,
function addRole() {
  const query = 'SELECT * FROM department';
  db.promise().query(query)
    .then(([rows]) => {
      const departments = rows.map((department) => ({
        name: department.name,
        value: department.id
      }))

      inquirer
        .prompt([
          {
            name: 'title',
            type: 'input',
            message: 'Enter the title of the new role:',
          },
          {
            name: 'salary',
            type: 'input',
            message: 'What is the salary for the new role:',
          },
          {
            name: 'department',
            type: 'list',
            message: 'Select the department for the new role:',
            choices: departments,
          },
        ])

        .then((answer) => {
          db.promise().query(
            'INSERT INTO role SET ?',
            {
              title: answer.title,
              salary: answer.salary,
              department_id: answer.department,
            })
            .then(([rows, fields]) => {
              console.log(`\nAdded ${answer.title} to role\n`);
              run();
            }
            );
        });
    })
}

function addEmployee() {

  const query = `SELECT employee.id, 
  CONCAT(employee.first_name, " ", employee.last_name) AS name 
  FROM employee
  WHERE employee.manager_id IS NULL`;
  db.promise().query(query)
    .then(([rows]) => {
      const managers = rows.map((manager) => ({
        name: manager.name,
        value: manager.id
      }));
      const rolesQuery = `SELECT * FROM role`;
      db.promise().query(rolesQuery)
        .then(([rows]) => {
          const roles = rows.map((role) => ({
            name: role.title,
            value: role.id
          }));

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
                name: 'role',
                type: 'list',
                message: 'Enter the new employee role:',
                choices: roles,
              },
              {
                name: 'manager',
                type: 'list',
                message: 'Enter the new employee manager:',
                choices: managers,
              },
            ])
            .then((answer) => {
              db.promise().query(
                'INSERT INTO employee SET ?',
                {
                  first_name: answer.first_name,
                  last_name: answer.last_name,
                  role_id: answer.role,
                  manager_id: answer.manager,
                })
                .then(([rows, fields]) => {                
                  console.log(`\nAdded ${answer.first_name} ${answer.last_name} to employee\n`);
                  run();
                }
              );
            });
        })
    })
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


