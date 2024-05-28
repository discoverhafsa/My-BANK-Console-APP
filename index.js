import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";
//class coustmer
class Customer {
    firstName;
    lastName;
    age;
    gender;
    mobNumber;
    accNo;
    constructor(fName, lName, age, gender, mob, acc) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNo = acc;
    }
}
//class bank
class Bank {
    customer = [];
    account = [];
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addAccountNumber(obj) {
        this.account.push(obj);
    }
    transiction(accObj) {
        let NewAccount = this.account.filter((acc) => acc.accNumber !== accObj.accNumber);
        this.account = [...NewAccount, accObj];
    }
}
let myBank = new Bank();
//coustmer create
for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName('male');
    let lName = faker.person.lastName();
    let num = parseInt(faker.phone.number("3##########"));
    const cus = new Customer(fName, lName, 25 * i, "male", num, 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccountNumber({ accNumber: cus.accNo, balance: 100 * i });
}
//bank functionality
async function bankService(bank) {
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "please select the service",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposite", "Exit"]
        });
        //view balace
        if (service.select == "View Balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "please entre your account number:",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid Account Number"));
            }
            if (account) {
                let name = myBank.customer.find((item) => item.accNo == account?.accNumber);
                console.log(`Dear ${chalk.green.italic(name?.firstName)} ${chalk.green.italic(name?.lastName)} 
            Your Accoun Balance is ${chalk.bold.blueBright(`$ ${account.balance}`)}`);
            }
        }
        //cash withdraw
        if (service.select == "Cash Withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "please entre your account number:",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "please entre your amount:",
                    name: "rupee"
                });
                if (ans.rupee > account.balance) {
                    console.log(chalk.red.bold("insufficient balance..."));
                }
                let newBalance = account.balance - ans.rupee;
                //transiction method call
                bank.transiction({ accNumber: account.accNumber, balance: newBalance });
            }
        }
        //cash deposite
        if (service.select == "Cash Deposite") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "please entre your account number:",
            });
            let account = myBank.account.find((acc) => acc.accNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid Account Number"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "please entre your amount:",
                    name: "rupee"
                });
                let newBalance = account.balance + ans.rupee;
                //transiction method call
                bank.transiction({ accNumber: account.accNumber, balance: newBalance });
            }
        }
        if (service.select == "Exit") {
            return;
        }
    } while (true);
}
bankService(myBank);
