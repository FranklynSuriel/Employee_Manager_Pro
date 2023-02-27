// Packages needed for this application
const inquirer = require('inquirer');
const mysql = require('mysql2');
const table = require('console.table');
const Font = require('ascii-art-font');

// Display the name of the app
// We are requiring ascii-art-font to create the title using the Doom font
Font.create('Employee', 'Doom', function (err, result) {
  console.log(result);
});
Font.create('Manager Pro', 'Doom', function (err, result) {
  console.log(result);
});

//Create connection to the database
const db = mysql.createConnection(
  {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'House25*+',
    database: 'company_db'
  },
  // Display a message when connected
  console.log(`\nConnected to the company_db database.\n`)
);

// Connect to the database and Start the application
db.connect((err) => {   
  run();

});

// Questions to create the list of available options
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
      'View all departments budget',
      'Exit',
    ],
  },
]

// function that start the program
function run() {
  inquirer
    .prompt(questions)

    // Create a switch to compare the user selection and call the function of that selection
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments(); //Calls the function to view all departments
          break;
        case 'View all roles':
          viewAllRoles(); //Calls the function to view all the roles
          break;
        case 'View all employees':
          viewAllEmployees(); //Calls the function to view all the employees
          break;
        case 'Add a department':
          addDepartment(); //Calls the function to add a department
          break;
        case 'Add a role':
          addRole(); //Calls the function to add a role
          break;
        case 'Add an employee':
          addEmployee(); //Calls the function to add an employee
          break;
        case 'Update an employee role':
          updateEmployeeRole(); //Calls the function to update an employee role
          break;
        case 'View all departments budget':
          viewDepartmentBudget(); //Calls the function to view each department budget
          break;
        case 'Exit':
          console.log('\nThank you for using the Employee Manager Pro!!\n');
          db.end(); // Exit the program
          break;
      }
    })
}

//All the functions below will call again function run() to run the program again until the user select Exit
//we are using promise() to make our query async
//Query the database for all departments and display the results in a table
function viewAllDepartments() {

  // Select all columns from department table and display in the screen. Table should present department id and department name
  db.promise().query('SELECT * FROM department')
    .then(([answer]) => {
      console.log('\n Departments List \n');
      console.table(answer); //Console.table helps us to display our result in a table
      run();
    })
    .catch((err) => { // Manage possible error by showing a message to the user
      console.log('\nAn error has ocurred, please try again latter\n')
      run();
    })
};





// Query the database for all roles and display the results in a table
function viewAllRoles() {
  // Create a const query to select columns from roles ans join department. Table should present id, role title, department and salary of that role 
  const query = `
      SELECT role.id, role.title, department.name AS department, role.salary 
      FROM role 
      JOIN department ON role.department_id = department.id
      `;
  db.promise().query(query)
    .then(([answer]) => {
      console.log('\n Roles List \n');
      console.table(answer); //Console.table helps us to display our result in a table
      run();
    })
    .catch((err) => { // Manage possible error by showing a message to the user
      console.log('\nAn error has ocurred, please try again latter\n')
      run();
    })
};


// Query the database for all employees and display the results in a table
function viewAllEmployees() {
  // Create a const query to select columns from roles ans join department. Table should present department id, first_name, last_name, role title, department and salary of that role, and manager
  // for this table, we are going to join role, department and employee manager to employee
  const query = `
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager 
      FROM employee 
      LEFT JOIN role ON employee.role_id = role.id 
      LEFT JOIN department ON role.department_id = department.id 
      LEFT JOIN employee manager ON employee.manager_id = manager.id
      `;
  db.promise().query(query)
    .then(([answer]) => {
      console.log('\n Employees List \n');
      console.table(answer); //Console.table helps us to display our result in a table
      run();
    })
    .catch((err) => { // Manage possible error by showing a message to the user
      console.log('\nAn error has ocurred, please try again latter\n')
      run();
    })
}


// Prompt for a new department name and add it to the database
function addDepartment() {
  inquirer // use inquirer to ask for the name of the new department
    .prompt({
      name: 'name',
      type: 'input',
      message: 'Enter the name of the new department:',
    })
    .then((answer) => {
      // query to insert the new department name to the department table
      db.promise().query('INSERT INTO department SET ?', { name: answer.name })
        .then(() => {
          console.log(`\nAdded ${answer.name} to departments\n`); //console logs the result
          run();
        }
        );
    })
    .catch((err) => { // Manage possible error by showing a message to the user
      console.log('\nAn error has ocurred, please try again latter\n')
      run();
    })
}


// Prompt for a new role title, salary,
function addRole() {
  // To add a new role we need a list of department
  // Query the department table 
  const query = 'SELECT * FROM department';
  db.promise().query(query)
    .then(([answer]) => { // create a const and map the answer to get department names
      const departments = answer.map((department) => ({
        name: department.name,
        value: department.id
      }))
      // use inquirer to ask for the name of the new role and show a list of department to assign that role 
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
            choices: departments, // use the const department that we created above
          },
        ])

        .then((answer) => { // query to insert the new role into the selected department
          db.promise().query(
            'INSERT INTO role SET ?',
            {
              title: answer.title,
              salary: answer.salary,
              department_id: answer.department,
            })
            .then(() => { // console log results
              console.log(`\nAdded ${answer.title} to role\n`);
              run();
            })
            .catch((err) => { // Manage possible error by showing a message to the user
              console.log('\nAn error has ocurred, please try again latter\n')
              run();
            })
        });
    })
};

// Prompt for a new employee name, role and manager and add it to the database
function addEmployee() {
  // To add a new employee we need a list of manager and a list of roles
  // Query the employee table
  const query = `SELECT employee.id, 
  CONCAT(employee.first_name, " ", employee.last_name) AS name 
  FROM employee
  WHERE employee.manager_id IS NULL`;
  db.promise().query(query)
    .then(([answer]) => { // create a const and map the answer to get the manager list
      const managers = answer.map((manager) => ({
        name: manager.name,
        value: manager.id
      }));

      // query the role table 
      const rolesQuery = `SELECT * FROM role`;
      db.promise().query(rolesQuery)
        .then(([answer]) => { // create a const and map the answer to get role list
          const roles = answer.map((role) => ({
            name: role.title,
            value: role.id
          }));

          // use inquirer to ask for the first name and last name of the new employee and show a list of roles and manager to assign to the new employee
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
                choices: roles, // use the const roles that we created above
              },
              {
                name: 'manager',
                type: 'list',
                message: 'Enter the new employee manager:',
                choices: managers, // use the const managers that we created above
              },
            ])
            .then((answer) => {
              db.promise().query( // query to insert the new employee into the employee table
                'INSERT INTO employee SET ?',
                {
                  first_name: answer.first_name,
                  last_name: answer.last_name,
                  role_id: answer.role,
                  manager_id: answer.manager,
                })
                .then(() => { // Console logs the results
                  console.log(`\nAdded ${answer.first_name} ${answer.last_name} to employee\n`);
                  run();
                })
                .catch((err) => { // Manage possible error by showing a message to the user
                  console.log('\nAn error has ocurred, please try again latter\n')
                  run();
                })
            });
        })
    })
}

// Prompt for update an employee role and update it to the database
function updateEmployeeRole() {
  // To update an employee we need list of employees and a list of roles
  // query the employee table to get employees names. CONCAT first name and last name into name
  const query = `SELECT employee.id, 
  CONCAT(employee.first_name, " ", employee.last_name) AS name 
  FROM employee
  `;
  db.promise().query(query)
    .then(([answer]) => {
      const employees = answer.map((employee) => ({ // create a const and map employee for the name and id 
        name: employee.name,
        value: employee.id
      }));
      const rolesQuery = `SELECT * FROM role`; //query the role table 
      db.promise().query(rolesQuery)
        .then(([answer]) => {
          const roles = answer.map((role) => ({ //create a const and map role for the role title and id
            name: role.title,
            value: role.id
          }));

          // use inquirer to show the employee name (first_name and last_name) list and role list to update the employee
          inquirer
            .prompt([
              {
                name: 'employee',
                type: 'list',
                message: 'Select an employee to update:',
                choices: employees, // use the const employees that we created above
              },
              {
                name: 'role',
                type: 'list',
                message: 'What is the employee new role:',
                choices: roles, // use the const roles that we created above
              },
            ])

            .then((answer) => { // query to update the role od the selected employee with the selected role
              const query = `UPDATE employee 
              SET role_id = ? 
              WHERE id = ?`;
              db.promise().query(query, [answer.role, answer.employee])

                .then(() => { //console log the results
                  console.log(`\nEmployee role updated\n`);
                  run();
                })
                .catch((err) => { // Manage possible error by showing a message to the user
                  console.log('\nAn error has ocurred, please try again latter\n')
                  run();
                })
            })
        })
    })

}

// Bonus: Application allows users to view the total utilized budget of a department
// Prompt to get the budget of all departments
function viewDepartmentBudget() {
  // Create a const query to select columns from employee ans join role and department. Table should present department name and budget ( sum of all employee of that department)  
  const query = `
    SELECT department.name AS department, SUM(role.salary) as budget
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id 
    GROUP BY department
    `;
  db.promise().query(query)
    .then(([answer]) => { //console log a message and the table with the results
      console.log('\nBudget by departments \n');
      console.table(answer);
      run();
    })
    .catch((err) => { // Manage possible error by showing a message to the user
      console.log('\nAn error has ocurred, please try again latter\n') 
      run();
    })
};
