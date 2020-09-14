USE employees_DB;

INSERT INTO department (department_name)
VALUES
    ("Management"),
    ("Engineering"),
    ("Quality Assurance"),
    ("Sales"),
    ("Tech Support");

INSERT INTO role (title, salary, department_id)
VALUES 
    ("CEO", 300000, 1),
    ("General Manager", 200000, 1),
    ("Lead Engineer", 150000, 2),
    ("Software Engineer", 100000, 2),
    ("UI/UX Director", 90000, 3),
    ("Software Tester", 60000, 3),
    ("Sales Lead", 75000, 4),
    ("Sales Agent", 65000, 4),
    ("Support Specialist", 60000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Neil", "Peart", 1, 1),
    ("John", "Bonham", 2, 1),
    ("Phil", "Collins", 3, 1),
    ("Ash", "Soan", 4, 3),
    ("Travis", "Barker", 5, 2),
    ("Tony", "Royster Jr", 6, 2),
    ("Quest", "Love", 7, 6),
    ("Meg", "White", 9, 2),
    ("Phil", "Rudd", 8, 6),
    ("Carter", "Beauford", 8, 6);

SELECT * FROM employees_db.employee;