// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different mainQuestions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```


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

// Main mainQuestions 
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

// Manager mainQuestions
const mgrQuestions = [
    {
        type: 'input',
        message: 'What is you office number',
        name: 'officeNumber',
    }
]

// Intern mainQuestions
const internQuestions = [
    {
        type: 'input',
        message: 'What school did you go to?',
        name: 'school',
    }
]

// Engineer mainQuestions
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
        let role = await sendToNextPrompt(mainAnswers);

        // get the role specific mainQuestions
        let roleAnswers = await inquirer.prompt(role);

        //compile employee info into an object
        let employeeData = await { ...mainAnswers, ...roleAnswers };

        //assigning employee data to a variable
        let employee = await createEmployee(employeeData);

       //pushing the created employee to the team array
        team.push(employee);

        //once first employee is complete, ask if you would like to create a new employee
        let employeeAdd = await inquirer.prompt(addEmployee);

        // validate response for the next action
        addMoreOrCreateEmployee(employeeAdd.confirm);
    }
    catch (err) {
        console.log(`theres was an error somewhere in the async ${err}`);
    }

}

// builds a the new Employee with the specific constructor
function createEmployee(employee) {
    let name = employee.name;
    let id = employee.id;
    let email = employee.email;
    let role = employee.role; 

    // checking to see the correct keys and values 
    // console.log('inside the build employee function',employee);

    switch (role) {
        case 'Manager': return new Manager(name, id, email, employee.officeNumber);
        case 'Intern': return new Intern(name, id, email, employee.school);
        case 'Engineer': return new Engineer(name, id, email, employee.gitHub);
        default: return 'something went really wrong in building an employee';
    }
}

// this function returns the specific role mainQuestions needed for the next prompt 
function sendToNextPrompt(employee) {
    // let role;

    // testing the color ui
    // console.log('this is inside the next prompt',employee);

    // testing output
    // console.log(employee); 

    switch (employee.role) {
        case 'Manager': return mgrQuestions
s
    ;
        case 'Intern': return internQuestions
    ;
        case 'Engineer': return engineerQuestions
    ;
        default: return `Something went really wrong! did you pick a role?`;
    }
}

// restarts the whole thing again or returns for the next step 
function addMoreOrCreateEmployee(confirm) {
    if (confirm) {
        // return back to the top of the mainQuestionsare add in another employee 
        return Question();
    }

    //// checking to see if this directory exist 
    fs.access(OUTPUT_DIR, (err) => {
        if (err) {

            // if it doesn't exist we make it and then create the file 
            console.log(`This directory does not exist, Creating now!!!`);
            fs.mkdir(OUTPUT_DIR, (err) => (err) ? console.log(err) : writeHTML());
        } else {

            //// else we just create the html 
            writeHTML();
        }
    })
}

// function writes the html for the website 
function writeHTML() {
    let html = render(team)

    fs.writeFile(outputPath, html, (err) => {
        (err) ? console.log(err) : console.log('The file has been written succesfully!');
    });
}


Question();
