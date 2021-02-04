module.exports = {
  
    test: {
        "username": "postgres",
        "password": "postgres",
        "database": process.env.DATABASE,
        "host": process.env.DB_HOST,
        "dialect": "postgres",
        "logging": false
      },

      development: {
        "username": "postgres",
        "password": "postgres",
        "database": process.env.DATABASE,
        "host": process.env.DB_HOST,
        "dialect": "postgres",
        "logging": false
      }
}
    