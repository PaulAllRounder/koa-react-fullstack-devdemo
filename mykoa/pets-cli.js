#!/usr/bin/env node
const faker = require('faker');
const dbTable = 'pet';
const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const { hideBin } = require('yargs/helpers');
const argv = require('yargs/yargs')(hideBin(process.argv))
	.option('y',{
		alias: 'yes',
		describe: 'Use default value to skip inquiry',
		boolean: true,
	})
	.check(argv => {
		const validArgs = ['_', 'y', 'yes', '$0'];
		const keys = Object.keys(argv);
		keys.forEach( n => {
			if(!validArgs.includes(n)){
				throw new Error('Plz check help to use the correct options.');
			}
		});
		return true;
	})
	.usage('Usage: pets [options]')
	.alias('h', 'help')
	.alias('v', 'version')
	.epilog('Author: Paul Li')
	.argv;

let [PETNUM, IFRESET] = [30, true];

const greeting = () => {
	console.log(
		chalk.green(
			figlet.textSync('Pets CLI', {font: 'Ghost'})
		)
	)
};

const query = () => {
	return inquirer.prompt([
		{
			type: 'number',
			name: 'PETNUM',
			message: 'How many pet records do you wanna insert?',
			validate(input) {
				if(isNaN(input)) return 'Please input number!'
				if(input > 100) return 'As a demo, I think the max 100 records is enough :->';
				return true;
			},
			default: 30,
		},
		{
			type: 'confirm',
			name: 'IFRESET',
			message: 'Do you like to RESET database?',
			default: true,
		}
	])
};

const writeDB = async (petNum, ifReset) => {
	const db = require('./db');
	const dbItem = [];
	const type = ['dog', 'cat', 'dove', 'fish', 'frog', 'spider', 'horse'];

	for(let i=0; i<petNum; i++){
		dbItem.push({
			type: type[faker.random.number(type.length - 1)],
			petname: faker.name.findName(),
			age: faker.random.number(10),
			describe: faker.company.bs(),
		});
	}
	if(ifReset){
		await db.delete().from(dbTable);
		await db.delete().from('sqlite_sequence').where('name', dbTable);
	}
	await db.insert(dbItem).into(dbTable);
	const {sum} = (await db.count('* as sum').from(dbTable))[0];
	await db.destroy();
	console.log(
		chalk.bgGreen.bold(
			chalk.red(`${ifReset ? " DataBase reset!" : ""}`) +
			chalk.blue(` ${petNum} `) +
			chalk.white('records insert into database!  \n Total records: ') +
			chalk.blue(` ${sum}   `)
		)
	);
}

(async () => {
	greeting();
	if(!argv.y){
		({PETNUM, IFRESET} = await query());
	}
	await writeDB(PETNUM, IFRESET);
})();
