const request = require('request');
const colors = require('colors');

//help variables
const arg = process.argv;

const logSyntax = ()=>{
    console.log("coucour <argument> <currency-code> <amount-of-money>".green);
    console.log("For more information enter curcour -h".yellow);
}

if (arg.length <= 2) {
    console.log("You  didn't enter arguments. Please use this syntax:".yellow);
    logSyntax();
    process.exit();
}

let table = '';
if (arg[2] === "-m") table = 'a';
else if (arg[2] === "-b" || arg[2] === "-a") table = 'c';
else if (arg[2] === "-e") table = 'c';
else if (arg[2] === "-g") table = 'c';
else if (arg[2] === "-h") {
    console.log("This is instruction of CurCour program".yellow);
    console.log("Use this syntax: ");
    console.log("coucour <argument> <currency-code> <amount-of-money>".green);
    console.log(`Arguments:`);
    console.log(`-m is middle price.`);
    console.log(`-b is bid price price.`);
    console.log(`-a is ask price price.`);
    console.log(`-e is exchange rate.`);
    console.log(`-g when u want to get amount of currency.`);
    console.log(`-h for help`);
    process.exit();
} else {
    console.log("Wrong argument. Enter cucour -h for help".red);
    process.exit();
}
if(arg.length <=3){
    console.log("You need to enter currency".red);
    logSyntax();
    process.exit();
}



let amount = arg[4] || 0;

//check is amount is a number

if (/\D/gmi.test(amount)) {
    console.log(`${amount}`.blue + ` is not a number. Enter integer.`.red);
    console.log("For more information enter curcour -h".yellow);
    process.exit();
} else {
    amount = parseInt(amount);
}

//validation of currency code
const currencyCodes = [
    "THB",
    "USD",
    "AUD",
    "HKD",
    "CAD",
    "NZD",
    "SGD",
    "EUR",
    "HUF",
    "CHF",
    "GBP",
    "UAH",
    "JPY",
    "CZK",
    "DKK",
    "ISK",
    "NOK",
    "SEK",
    "HRK",
    "RON",
    "BGN",
    "TRY",
    "ILS",
    "CLP",
    "MXN",
    "PHP",
    "ZAR",
    "BRL",
    "MYR",
    "RUB",
    "IDR",
    "INR",
    "KRW",
    "CNY",
    "XDR"
];

const code = arg[3].toUpperCase();
const isValidCurrencyCode = currencyCodes.find(currency => currency === code);
if (!isValidCurrencyCode) {
    console.log(`Wrong currency. Here is list of correct currency:\n`.yellow);
    console.log(currencyCodes)
    process.exit();
}

const url = `http://api.nbp.pl/api/exchangerates/rates/${table}/${code}/?format=json`;

request(url, { json: true }, (err, res, body) => {

    if (err) {
        console.log(`Error: \n${err}`.red);
        process.exit();
    }
    if (res.statusCode !== 200) {
        console.log("Status code is diffrent then 200. Check URL adress.".red);
        process.exit();
    }
    let message = '';
    if (arg[2] === '-m') {

        const count = amount / body.rates[0].mid;
        message =
            `Middle price of ${body.currency} (${body.code}) is ${body.rates[0].mid} PLN\n`.green;
        if (amount > 0) message = message + `For ${amount} PLN you will get ${Math.round(count * 100) / 100} ${body.code}`.blue;

    } else if (arg[2] === '-a') {

        const count = amount / body.rates[0].ask;
        message =
            `Ask price of ${body.currency} (${body.code}) is ${body.rates[0].ask} PLN\n`.green;
        if (amount > 0) message = message + `For ${amount} PLN you will get ${Math.round(count * 100) / 100} ${body.code}`.blue;

    } else if (arg[2] === '-b') {

        const count = amount * body.rates[0].bid;
        message =
            `Bid price of ${body.currency} (${body.code}) is ${body.rates[0].bid} PLN\n`.green;
        if (amount > 0) message = message + `For ${amount} ${body.code} you will get ${Math.round(count * 100) / 100} PLN`.blue;

    } else if (arg[2] === '-g') {
        const count = amount * body.rates[0].ask;
        message =
            `Ask price of ${body.currency} (${body.code}) is ${body.rates[0].ask} PLN\n`.green +
            `For get ${amount} ${body.code} you should pay ${Math.round(count * 100) / 100} PLN`.blue;

    } else if (arg[2] === '-e') {

        message = `Exchange rate of ${body.currency} (${body.code}) is:\n` +
            `Buy(bid): ${body.rates[0].bid}\n`.green +
            `Sell(ask): ${body.rates[0].ask}\n`.green +
            `Spread: ${Math.round((body.rates[0].ask - body.rates[0].bid) * 1000000) / 1000000}`.yellow;
    }
    console.log(message);
});