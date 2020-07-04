// TODO: Write code to define and export the Manager class. HINT: This class should inherit from Employee.

const Employee = require('../lib/Employee');

class Manager extends Employee {
    constructor(name, id, email, office){
        super(name, id, email)
        this.name = name;
        this.id = id;
        this.email = email;
        this.role = 'Manager';
        this.officeNumber = office;
    }
}

Manager.prototype.getRole = function() {
    return this.role; 
}

Manager.prototype.getOfficeNumber = function() {
    return this.officeNumber;
}

module.exports = Manager;