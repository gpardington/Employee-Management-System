//DEPENDENCIES
const mysql = require("mysql");
const inquirer = require("inquirer");
const console_table = require("console.table");
const clear = require("console-clear");
const util = require("util");
const log = console.log;

const employeesSQL = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name, concat(manager.first_name," ", manager.last_name) as manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee as manager on employee.manager_id = manager.id';

//Establish connection to mySQL database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employees_DB",
});

//Async/Await concept connection
connection.query = util.promisify(connection.query);

//Connect to mySQL server and database
connection.connect(function(err) {
    if (err) throw err;
    start();
});

//Start application
function start() {
    clear();
    mainMenu();
}

function mainMenu() {
    inquirer.prompt({
        name: "userSelection",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View By Department",
            "View By Role",
            "View By Manager",
            "Add Employee",
            "Add Role",
            "Add Department",
            "Remove Employee",
            "Remove Department",
            "Remove Role",
            "Update Employee Role",
            "Update Employee Manager",
            "Exit",
        ],
    })
    .then((answer) => {
        switch (answer.userSelection) {
            case "View All Employees":
                viewEmployees();
                break;
            case "View By Department":
                viewByDepartment();
                break;
            case "View By Manager":
                viewByManager();
                break;
            case "View By Role":
                viewByRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            case "Remove Role":
                removeRole();
                break;
            case "Remove Department":
                removeDepartment();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "Update Employee Manager":
                updateEmployeeManager();
                break;
            
            default:
                connection.end();
                break;
        };
    });
};

//View all employees
async function viewEmployees() {
    clear();
    const employees = await connection.query(employeesSQL + ";");

    log("\n");
    log(inverse("Viewing All Employees"));
    console.table(employees);
    mainMenu();
};

//View employees by department
async function viewByDepartment() {
    clear();
    const departments = await connection.query("SELECT * FROM department");
    const departmentOptions = departments.map(({ id, department_name }) => ({
        name: department_name,
        value: id,
    }));
    
    const { userDepartmentId } = await inquirer.prompt([
        {
            type: "list",
            message: "Which department would you like to view?",
            name: "userDepartmentId",
            choices: departmentOptions,
        },
    ]);

    const employees = await connection.query(employeesSQL + " WHERE department.id = ?;", userDepartmentId);

    log("\n");
    console.table(employees);
    mainMenu();
};

//View employees by role
async function viewByRole() {
    clear();
    log("Viewing Employees By Role");

    const roles = await connection.query("SELECT * FROM role");
    const roleOptions = roles.map(({ id, title }) => ({
        name: title,
        value: id,
    }));

    const { userRoleId } = await inquirer.prompt([
        {
            type: "list",
            message: "Which role would you like to view?",
            name: "userRoleId",
            choices: roleOptions,
        },
    ]);

    const employees = await connection.query(
        employeesSQL + " WHERE role.id = ?;", userRoleId
    );

    log("\n");
    console.table(employees);
    mainMenu();
};

//View employees by manager
async function viewByManager() {
    clear();
    const managers = await connection.query("SELECT * FROM employee");
    const managerOptions = managers.map(({ id, first_name, last_name }) => ({
        name: first_name.concat(" ", last_name),
        value: id,
    }));

    const { userManagerId } = await inquirer.prompt([
        {
            type: "list",
            message: "Which manager's employees would you like to view?",
            name: "userManagerId",
            choices: managerOptions,
        },
    ]);

    const employees = await connection.query(
        employeesSQL + " WHERE manager.id = ?;", userManagerId
    );

    log("\n");
    console.table(employees);
    mainMenu();
};

//Add employee functionality 
async function addEmployee() {
    clear();
    const roles = await connection.query("SELECT * FROM role");
    const roleOptions = roles.map(({ id, title }) => ({
        name: first_name.concat(" ", last_name),
        value: id,
    }));

    inquirer.prompt([
        {
            name: "first_name",
            message: "What is the employee's first name?",
        },
        {
            name: "last_name",
            message: "What is the employee's last name?",
        },
        {
            type: "list",
            message: "What is the employee's role?",
            name: "role_id",
            choices: roleOptions,
        },
        {
            type: "list",
            message: "Who is the employee's manager?",
            name: "manager_id",
            choices: managerOptions,
        },
    ])
    .then((answer) => {
        return connection.query("INSERT INTO employee SET ?", answer);
    })
    .then(() => {
        return connection.query(employeesSQL + ";");
    })
    .then((employees) => {
        log("Employee added!");
        log("\n");
        log(inverse("All Employees"));
        console.table(employees);
        mainMenu();
    });
}

//Add role functionality
async function addRole() {
    clear();
    const departments = await connection.query("SELECT * FROM department");
    const departmentOptions = departments.map(({ id, department_name }) => ({
        name: department_name,
        value: id,
    }));

    inquirer.prompt([
        {
            name: "title",
            message: "What is the name of the role you would like to add?",
        },
        {
            name: "salary",
            message: "What is this role's salary?",
        },
        {
            type: "list",
            message: "Which department is this role under?",
            name: "department_id",
            choices: departmentOptions,
        },
    ])
    .then((answer) => {
        return connection.query("INSERT INTO role SET ?", answer);
    })
    .then(() => {
        return connection.query("SELECT * FROM role");
    })
    .then((roles) => {
        log("Role added!");
        log("\n");
        log(inverse("All Roles"));
        console.table(roles);
        mainMenu();
    });
}

//Add department functionality 
async function addDepartment() {
    clear();
    inquirer.prompt(
        {
            name: "department_name",
            message: "What is the name of the department you would like to add?",
        })
    .then((department) => {
        return connection.query("INSERT INTO department SET ?", department);
    })
    .then(() => {
        return connection.query("SELECT * FROM department");
    })
    .then((departments) => {
        log("Department added!");
        log("\n");
        log(inverse("All Departments"));
        console.table(departments);
        mainMenu();
    });
}

//Remove employee functionality
async function removeEmployee() {
    clear();
    const employees = await connection.query("SELECT * FROM employee");
    const employeeOptions = employees.map(({ id, first_name, last_name }) => ({
        name: first_name + " " + last_name,
        value: id,
    }));

    inquirer.prompt([
        {
            type: "list",
            name: "userEmployee",
            message: "Which employee would you like to remove?",
            choices: employeeOptions,

        },
        ])
    .then(({ userEmployee }) => {
        return connection.query("DELETE FROM employee WHERE ?", {
            id: userEmployee,
        });
    })

    .then(() => {
        return connection.query(employeesSQL + ";");
    })
    .then((employees) => {
        log("Employee removed!");
        log("\n");
        log(inverse("All Employees"));
        console.table(employees);
        mainMenu();
    });
}

//Remove role functionality
async function removeRole() {
    clear();
    const roles = await connection.query("SELECT * FROM role");
    const roleOptions = roles.map(({ id, title }) => ({
        name: title,
        value: id,
    }));

    inquirer.prompt([
        {
            type: "list",
            name: "userRoleId",
            message: "Which role would you like to remove?",
            choices: roleOptions,
        },
        ])
    .then(({ userRoleId }) => {
        return connection.query("DELETE FROM role WHERE ?", {
            id: userRoleId,
        });
    })
    .then(() => {
        return connection.query(employeesSQL + ";");
    })
    .then((roles) => {
        log("Role removed!");
        log("\n");
        log(inverse("All Roles"));
        console.table(roles);
        mainMenu();
    });
}
