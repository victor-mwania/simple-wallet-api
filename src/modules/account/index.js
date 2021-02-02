const { gql } = require('apollo-server');
const typeDefs =  gql`
    type Account {
        id: ID!
        available_balance: Int!
        user_id: String!
        active: Boolean!
    }

    type Transaction {
        id: ID!
        amount: Int!
        new_balance: Int!
        prev_balance: Int!
        status: String!
        type: String!
        updatedAt: String!
    }
    
    extend type Query {
        balance: Account,
        statements: [ Transaction ]
    }

    extend type Mutation {
        deposit(amount: Int!): Transaction
        withdrawal(amount: Int!): Transaction
    }
`

module.exports = typeDefs

