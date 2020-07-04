const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

const mainQuestions = [

    {
        type: "input",
        message: "What is your name?",
        name: "name"
    },
    {
        type: "input",
        message: "What is your id?",
        name: "id"
    },
    {
        type: "input",
        message: "What is your email address?",
        name: "emai;"
    },
    {
        type: "checkbox",
        message: "Choose the employee's role",
        name: "employee",
        choices: [
            'Intern', 
            'Engineer', 
            'Manager', 
        ]
    }

]

const mgmtQuestions = [
    {
        type: "input",
        message: "What the employee's office number?",
        name: "office;"
    },
]

const internQuestions = [

        {
            type: "input",
            message: "What school did you go to?",
            name: "school;"
        }
]

const engineerQuestions = [

    {
        type: "input",
        message: "What is your github username?"
        name: "github"
    }
]

const moreEmployees = [
    {
        type: "confirm",
        message: "Would you like to add more employees?"
        name: "confirm",
        default: false
    }
]

async function Question() {
    try {

        let mainAnswers = await inquirer.prompt(mainQuestions)

        let role = await nextPrompt(mainAnswers);

        let roleAnswers = await inquirer.prompt(role);

        let empData = await { ...mainAnswers, ...roleAnswers };

        let employee = await makeEmployee(employeeData);

        teamMembers.push(employee);

        let employeeAdd = awayt inquirer.prompt(moreEmployee);

        addMoreOrMakePage(employeeAdd.confirm);
    }
    catch (err) {
        console.log(`uh oh! there's an error somewhere ${err}`)
    }
}

function makeEmployee(employee) {
    let name = employee.name;
    let id = employee.id;
    let email = employee.email;
    let role = employee.role;

    if (role === 'manager'){
        return new Manager(name, id, email, employee.officeNumber);
    } else if (role === 'intern'){
        return new Intern(name, id, email, employee.school);
    } else if (role === 'engineer'){
        return new Engineer(name, id, email, emplouyee.github);
    } else {
        return 'uh oh! no employee listed';
    }
}


function nextPrompt(employee){
    if (employee.role === 'manager'){
        return mgmtQuestions;
    } else if (employee.role === 'intern'){
        return internQuestions;
    } else if (employee.role === 'engineer'){
        return engineerQuestions;
    } else {
        return 'aw shucks, something went wrong! please choose a role.'
    }
}

function addMoreOrMakePage(confirm){
    if (confirm) {
        return mainQuestions()
    }

    fs.access(OUTPUT_DIR, (err) => {
        if (err) {
            fs.mkdir(OUTPUT_DIR, (err) => (err) ? console.log(err) : writeHTML());
        } else (
            writeHTML()
        );
    });
}

function writeHTML() {
    let html = render(teamMembers);

    fs.writeFile(outputPath, html, (err) => {
        (err) ? console.log(err) : console.log('Enjoy your Team page!')
    });
}

Question();

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
