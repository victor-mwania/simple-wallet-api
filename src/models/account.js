module.exports = function(sequelize, DataTypes){
  const Account = sequelize.define('Account', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: DataTypes.STRING,
    available_balance: {
      type: DataTypes.DECIMAL(18, 2),
      defaultValue: 0.00
    },
    active: DataTypes.BOOLEAN
  });

  return Account;
};
