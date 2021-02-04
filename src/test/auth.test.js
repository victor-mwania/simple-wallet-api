const { gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');

const server  = require('../index')
const { query, mutate } = createTestClient(server);

const db = require('../models/index');
const testUser = {
    email: 'test-user@gmail.com',
    password: 'test1234',
    username: 'testusername',
  }
  
describe('Auth ', () => {

    beforeAll(async () => {
        await db.User.destroy({
            where: {},
            truncate: true,
            cascade: true,
            force: true,
          });
    })

    afterAll(async () => {
      
        return server.stop();
    });

    describe('Signup', () => {
        it('Should create a new user', async () => {
            const SIGN_UP = gql `
            mutation($email: String!, $password: String!, $username: String!) {
                signup(email: $email, password: $password, username: $username ) {
                    id,
                    email,
                    username,
                    active
                }
            }
            `;
            const {
                data: {
                    signup
                }
            } = await mutate({
                mutation: SIGN_UP,
                variables: {
                    ...testUser
                }
            });

            expect(signup).toBeTruthy();

        });

        it('Should throw an error when the user already exists', async () => {
            const SIGN_UP = gql `
            mutation($email: String!, $password: String!, $username: String!) {
                signup(email: $email, password: $password, username: $username ) {
                    id,
                    email,
                    username,
                    active
                }
            }
        `;

            const {
                data: {
                    signup
                }
            } = await mutate({
                mutation: SIGN_UP,
                variables: {
                    ...testUser
                }
            });

            expect(signup).toBeFalsy();
        });
    });

    describe('Login', () => {
        it('Should return a token and user object', async () => {
            const LOGIN = gql `
            mutation($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                    token,
                    user{
                        email,
                        id,
                    }              
                }
            }
            `;
            const{ 
                data: {login} } = await mutate({
                mutation: LOGIN,
                variables: {
                    email: testUser.email,
                    password: testUser.password
                }
            });

            expect(login).toHaveProperty('token');
            expect(login).toHaveProperty('user.email');
            expect(login).toHaveProperty('user.id');
        });

        it('Should throw an error if password is wrong', async () => {
            const LOGIN = gql `
            mutation($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                    token,
                    user{
                        email,
                        id,
                    }              
                }
            }
            `;
            const{ 
                data: {login} } = await mutate({
                mutation: LOGIN,
                variables: {
                    email: testUser.email,
                    password: '123'
                }
            });

            expect(login).toBeFalsy()
        });

        it('Should throw an error if user does not exists', async () => {
            const LOGIN = gql `
            mutation($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                    token,
                    user{
                        email,
                        id,
                    }              
                }
            }
            `;
            const{ 
                data: {login} } = await mutate({
                mutation: LOGIN,
                variables: {
                    email: "newuser@gmail.com",
                    password: '123'
                }
            });
            
            expect(login).toBeFalsy()
        });
    });
})
