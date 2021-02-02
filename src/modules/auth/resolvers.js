// const signup = require('./signup');
// const me  = require('./me')
const { ApolloError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const models = require('../../models');
const { APP_SECRET, SALT_ROUNDS }  = require('../../utils/config');

const resolvers = {
    Query: {
    },

    Mutation: {
        async signup(_, {
            email,
            username,
            password
        }){

            const user = await models.User.findOne({
                where: {
                    username: username,
                    email: email
                }
            });

            if(user){
                throw new ApolloError(
                    "User already exits"
                )
            }
            
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS )
            const create_user = await models.User.create({
                email,
                username,
                password: hashedPassword,
                active: true
            });

            await models.Account.create({user_id: create_user.id, active: true});
            
            return create_user
        },

        async login( _, {
            email,
            password
        }) {
            
            const user = await models.User.findOne({
                where: {
                    email: email
                }
            })

            const validPassword = await bcrypt.compare(password, user.password)

            if(!validPassword){
                throw new Error('Invalid password')
            }

            const token = jwt.sign({
                data : { user_id: user.id },
                exp:Math.floor(Date.now() / 1000) + (60 * 60)
            }, APP_SECRET )

            return { user, token }

        }
    }
}

module.exports = resolvers;