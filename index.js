const request = require('request');
const colors = require('colors');

if(process.argv.length === 2){
    console.log("You  didn't enter arguments. Please use this syntax:".yellow);
    console.log("coucour <currency-code> <amout-of-money>".green);
    console.log("For more information enter curcour -h".yellow);
    process.exit();
}


const validCodes = [
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

if (process.argv[2] === "-h") { //help section
    console.log("This is instruction of CurCour program".yellow);
    console.log(``);
    process.exit();
}

const code = process.argv[2].toUpperCase();
let amount = process.argv[3];

//check is amount is number

if(amount == undefined){
    amount = 1; //set default value to calc
}else if(/\D/gmi.test(amount)){
    console.log(`${amount} is not a number. Enter integer.`.red);
    process.exit();
}else{
    amount = parseInt(amount);
}

//validation of currency code
const isValid = validCodes.find(currency => currency === code) ? true : false;
if (!isValid) {
    console.log(`Wrong currency. Here is list of correct currency:\n`.yellow);
    console.log(validCodes)
    process.exit();
}

const url = `http://api.nbp.pl/api/exchangerates/rates/a/${code}/?format=json`;

request(url, { json: true }, (err, res, body) => {
    if (err) {
        return console.log(`Error: \n${err}`);
    }
    if (res.statusCode !== 200) {
        return console.log("Status code is diffrent then 200. Check URL adress.");
    }

    const count = amount / body.rates[0].mid;
    const message =
        `Middle price of ${body.code} is ${body.rates[0].mid} PLN\n`.green +
        `For ${amount} PLN you will get ${Math.round(count * 100) / 100} ${body.code}`.blue;
    console.log(message);
})