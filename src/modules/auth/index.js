const { gql } = require('apollo-server');
const typeDefs =  gql`
    type User {
        id: ID!
        username: String!
        email: String!
        active: Boolean
    }

    type AuthPayload {
        token: String!
        user: User
    }

   type Query {
    user: User
    }

    type Mutation {
        signup(
            username: String!
            email: String!
            password: String!
        ): User

        login(
            email: String!
            password: String!
        ): AuthPayload
    }
`
module.exports = typeDefs