
const TRANSACTION_TYPE  = {
    DEPOSIT : "DEPOSIT",
    WITHDRAWAL : "WITHDRAWAL"
}

const APP_SECRET = process.env.APP_SECRET;

const SALT_ROUNDS = 12;

module.exports = {
    TRANSACTION_TYPE,
    APP_SECRET,
    SALT_ROUNDS
}