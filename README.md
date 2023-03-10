# Employee Manager Pro

![License](https://img.shields.io/badge/license-MIT-green)
  
## Description

Employee Manager Pro is a command line interface application that uses the command line interface to use information store in data bases. Allowing non-developers managers or HR easily to find, modify, and add new  information related to the company department and personnel.

## Table of Contents

  - [Installation](#Installation)
  - [Usage](#Usage)
  - [License](#License)
  - [Contributions](#Contributions)
  - [Test](#Test)
  - [Questions](#Questions)

## Installation
 
This application requires the following packages:
- [nodejs](https://nodejs.org/en/)
- [MySQL2 package](https://www.npmjs.com/package/mysql2)
- [console.table package](https://www.npmjs.com/package/console.table)
- [ascii-art-font package](https://www.npmjs.com/package/ascii-art-font)

Open Git Bash or Terminal and type: **"node index.js"**.

## Usage


[Walkthrough video](https://drive.google.com/file/d/1J_n1tLwuytSrPyhiFR_X62Mej1VhqLcz/view?usp=sharing)

Welcome to the Employee Manager Pro!

To open the application, use the command line interface. A menu will appear with the following options:

- View all departments
- View all roles
- View all employees
- Add a department
- Add a role
- Add an employee
- Update an employee role

When you choose "View all departments," a formatted table will appear showing the department names and department IDs.

When you choose "View all roles," you will see the job title, role ID, the department that role belongs to, and the salary for that role.

If you choose "View all employees," a formatted table will appear showing employee data, including employee IDs, first names, last names, job titles, departments, salaries, and the names of the managers that the employees report to.

If you choose "Add a department," you will be prompted to enter the name of the department. Once entered, the department will be added to the database.

If you choose "Add a role," you will be prompted to enter the name, salary, and department for the role. Once entered, the role will be added to the database.

If you choose "Add an employee," you will be prompted to enter the employee's first name, last name, role, and manager. Once entered, the employee will be added to the database.

If you choose "Update an employee role," you will be prompted to select the employee you want to update and their new role. Once entered, the employee's role will be updated in the database.

If you choose "View all departments budget", a formatted table will appear showing the department names
and the department budget.

Thank you for using the Employee Manager Pro!

![Employee Manager Pro](./assets/Pictures/Emplotee%20Manager%20Pro.jpg)



## Credits

- Inquirer Documentation
- mysql Documentation
- console.table Documentation
- ascii-art-font Documentation
- Stack Overflow

## License

This project is licensed under the MIT license.

## Contributing

No contributions guidelines.

## Test

No test available.

## Questions

[github.com/FranklynSuriel](https://github.com/FranklynSuriel)

Questions about this project or to report an issue can be sent to:
fsuriel@gmail.com. Please specify the name of the project in the subject of the email.
