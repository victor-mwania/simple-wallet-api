module.exports = function(sequelize, DataTypes){
  const Transaction = sequelize.define('Transaction', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: DataTypes.INTEGER,
    account_id: DataTypes.INTEGER,
    amount: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0.00
    },
    prev_balance: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0.00
    },
    new_balance: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0.00
    },
    type: DataTypes.STRING,
    status: DataTypes.STRING,
  });

  return Transaction;
};
