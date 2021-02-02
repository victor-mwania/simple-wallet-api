
const Sequelize = require('sequelize');

const UserModel = require('./user');
const AccountModel = require('./account');
const TransactionModel = require('./transaction');
const dotenv = require('dotenv');
dotenv.config({path: __dirname + '/../../.env'});

const config = require(__dirname + '/../config/config.json')[process.env.NODE_ENV];

const sequelize = new Sequelize(config);

const db = {
  User: UserModel(sequelize, Sequelize),
  Account: AccountModel(sequelize, Sequelize),
  Transaction: TransactionModel(sequelize, Sequelize)
};

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
