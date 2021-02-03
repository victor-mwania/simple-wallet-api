const { gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');
const resolver = require('../modules/resolvers');
const typeDefs = require('../modules/typedefs');
const getUser = require('../utils/getUser');

const server  = require('../index');

const { query, mutate } = createTestClient(server);

const testUser = {
    email: 'test-user222@gmail.com',
    password: 'test1234',
    username: 'testusername22',
}

const auth = async () => {
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

    return login

}

  
describe('Account ', () => {

    beforeAll( async (done) => {
        const user = await auth();
        const req = {
            headers : {
                authorization: `Bearer ${user.token}`
            }}


        server.context = () => {
            const user = getUser(req)
            return { user }
        };

        done()
    });

    afterAll(() => {
        return server.stop();
    });

    describe('Balance', () => {
        it('Should return account details with balance', async () => {

            const BALANCE = gql `
            query {
                balance{
                    available_balance,
                    id,
                    user_id,
                    active           
                }
            }
            `;
            const
                { data: {balance} }= await query({
                query: BALANCE,
            });
    
            expect(balance).toHaveProperty('available_balance');
            expect(balance).toHaveProperty('id');
            expect(balance).toHaveProperty('user_id');
            expect(balance).toHaveProperty('active');
    
        });
    });

    describe('Statements', () => {
        it('Should return account transaction statements', async () => {

            const STATEMENTS = gql `
            query {
                statements{
                    id,
                    amount,
                    new_balance,
                    prev_balance,
                    status,
                    type           
                }
            }
            `;
            const
                { data: {statements} }= await query({
                query: STATEMENTS,
            });
    
            expect(statements).toBeTruthy();
        });    
    });

    describe('Deposit', () => {
        it('Should deposit amount to account', async () => {

            const DEPOSIT = gql `
            mutation ($amount: Int!)  {
                deposit (amount: $amount ){
                    id,
                    amount,
                    new_balance,
                    prev_balance,
                    status,
                    type           
                }
            }
            `;
            const
                { data: {deposit} }= await query({
                mutation: DEPOSIT,
                variables: {
                    amount: 1000
                }
            });
    
            expect(deposit).toBeTruthy();
            expect(deposit).toHaveProperty('id');
            expect(deposit).toHaveProperty('amount');
            expect(deposit).toHaveProperty('new_balance');
            expect(deposit).toHaveProperty('prev_balance');
            expect(deposit).toHaveProperty('status');
            expect(deposit).toHaveProperty('type');
        }); 
    });

    describe('Withdraw', () => {
        it('Should withdraw if there is balance', async () => {

            const WITHDRAWAL= gql `
            mutation ($amount: Int!)  {
                withdrawal (amount: $amount ){
                    id,
                    amount,
                    new_balance,
                    prev_balance,
                    status,
                    type           
                }
            }
            `;
            const
                { data: {withdrawal} }= await query({
                mutation: WITHDRAWAL,
                variables: {
                    amount: 100
                }
            });
    
            expect(withdrawal).toBeTruthy();
            expect(withdrawal).toHaveProperty('id');
            expect(withdrawal).toHaveProperty('amount');
            expect(withdrawal).toHaveProperty('new_balance');
            expect(withdrawal).toHaveProperty('prev_balance');
            expect(withdrawal).toHaveProperty('status');
            expect(withdrawal).toHaveProperty('type');
        }); 
        it('Should fail to withdraw if there is no enough balance', async () => {

            const WITHDRAW = gql `
            mutation ($amount: Int!)  {
                withdrawal(amount: $amount ){
                    id,
                    amount,
                    new_balance,
                    prev_balance,
                    status,
                    type           
                }
            }
            `;
            const response = await query({
                mutation: WITHDRAW,
                variables: {
                    amount: 10000000
                }
            });
    
            expect(response.errors).toBeTruthy()
            expect(response.data.withdrawal).toBe(null)
        });
    })
    

});

