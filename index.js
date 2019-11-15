const request = require('request');
const colors = require('colors');

if (process.argv.length === 2) {
    console.log("You  didn't enter arguments. Please use this syntax:".yellow);
    console.log("coucour <currency-code> <amount-of-money>".green);
    console.log("For more information enter curcour -h".yellow);
    process.exit();
}


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
//help section
if (process.argv[2] === "-h") {
    console.log("This is instruction of CurCour program".yellow);
    process.exit();
}

const code = process.argv[2].toUpperCase();
let amount = process.argv[3] || 1;

//check is amount is number

if (/\D/gmi.test(amount)) {
    console.log(`${amount} is not a number. Enter integer.`.red);
    process.exit();
} else {
    amount = parseInt(amount);
}

//validation of currency code
const isValidCurrencyCode = currencyCodes.find(currency => currency === code);
if (!isValidCurrencyCode) {
    console.log(`Wrong currency. Here is list of correct currency:\n`.yellow);
    console.log(currencyCodes)
    process.exit();
}

const url = `http://api.nbp.pl/api/exchangerates/rates/a/${code}/?format=json`;

request(url, { json: true }, (err, res, body) => {
    if (err) {
        console.log(`Error: \n${err}`.red);
        process.exit();
    }
    if (res.statusCode !== 200) {
        console.log("Status code is diffrent then 200. Check URL adress.".red);
        process.exit();
    }

    const count = amount / body.rates[0].mid;
    const message =
        `Middle price of ${body.code} is ${body.rates[0].mid} PLN\n`.green +
        `For ${amount} PLN you will get ${Math.round(count * 100) / 100} ${body.code}`.blue;
    console.log(message);
})