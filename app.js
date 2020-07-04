const Manager = require("./Develop/lib/Manager");
const Engineer = require("./Develop/lib/Engineer");
const Intern = require("./Develop/lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./Develop/lib/htmlRenderer");

const team = [];

// main questions (applicable for all employees) 
const mainQuestions = [
    {
        type: 'input',
        message: 'what is your name?',
        name: 'name',
    },
    {
        type: 'input',
        message: 'what is your id number?',
        name: 'id',
    },
    {
        type: 'input',
        message: 'what is your email?',
        name: 'email',
    },
    {
        type: 'list',
        message: 'What is your role in the company?',
        choices: [
            'Manager',
            'Intern',
            'Engineer',
        ],
        name: 'role'
    },
]

// manager questions
const mgrQuestions = [
    {
        type: 'input',
        message: 'What is you office number',
        name: 'officeNumber',
    }
]

// intern questions
const internQuestions = [
    {
        type: 'input',
        message: 'What school did you go to?',
        name: 'school',
    }
]

// engineer questions
const engineerQuestions = [
    {
        type: 'input',
        message: 'Please enter your github user name',
        name: 'gitHub',
    }
]

// confirm more employee 
const addEmployee = [
    {
        type: 'confirm',
        message: 'Would you like to add more team members?',
        name: 'confirm',
        default: false
    }
]

async function Question() {

    try {
        //prompt main questions
        let mainAnswers = await inquirer.prompt(mainQuestions);

        //figures out role and then chooses next question
        let role = await nextQuestion(mainAnswers);

        // get the role specific mainQuestions
        let roleAnswers = await inquirer.prompt(role);

        //compile employee info into an object
        let employeeData = await { ...mainAnswers, ...roleAnswers };

        //assigning employee data to a variable
        let employee = await createEmployee(employeeData);

       //pushing the created employee to the team array
        team.push(employee);

        //ask if another employee needs to be created
        let employeeAdd = await inquirer.prompt(addEmployee);

        //determines if new employee needs to be created or if the file needs to be written based on user response
        addMoreOrCreateEmployee(employeeAdd.confirm);
    }
    catch (err) {
        console.log(`whoopsie! there has been an error: ${err}`);
    }
}

// creates the new employee
function createEmployee(employee) {
    let name = employee.name;
    let id = employee.id;
    let email = employee.email;
    let role = employee.role; 

    switch (role) {
        case 'Manager': return new Manager(name, id, email, employee.officeNumber);
        case 'Intern': return new Intern(name, id, email, employee.school);
        case 'Engineer': return new Engineer(name, id, email, employee.gitHub);
        default: return `Uh oh, this employee couldn't be created.`;
    }
}

//sends user too next question after receiving role designation
function nextQuestion(employee) {

    switch (employee.role) {
        case 'Manager': return mgrQuestions
    ;
        case 'Intern': return internQuestions
    ;
        case 'Engineer': return engineerQuestions
    ;
        default: return `hmmm, did you selet a role?`;
    }
}

// starts from the beginning if you select to add new employee, if not it writes the HTML file 
function addMoreOrCreateEmployee(confirm) {
    if (confirm) {
        return Question();
    }

    //does the output directory exist?
    fs.access(OUTPUT_DIR, (err) => {
        if (err) {
            // if the output DIR doesn't exist, create it & then add the HTML
            fs.mkdir(OUTPUT_DIR, (err) => (err) ? console.log(err) : writeHTML());
        } else {

            //if directory does exist, just write the HTML
            writeHTML();
        }
    })
}

// writes HTML
function writeHTML() {
    let html = render(team)

    fs.writeFile(outputPath, html, (err) => {
        (err) ? console.log(err) : console.log('Congrats! Enjoy your employee page.');
    });
}


Question();
