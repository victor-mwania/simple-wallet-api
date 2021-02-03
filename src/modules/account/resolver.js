const models = require('../../models');
const accountResolvers = {
    Query:{
        async balance(parent, args, context){
            const auth = context.user.data
            if(!auth){
                throw new Error('Not authenticated');
            }

            const account = await models.Account.findOne({
                where: {
                    user_id: auth.user_id
                }
            })
            
            return account
        },
        
        async statements(parent, args, context){
            const auth = context.user.data
            if(!auth){
                throw new Error('Not authenticated');
            }

            const statements = await models.Transaction.findAll({
                where:{
                    user_id: auth.user_id
                },
                limit: 20, 
                order: [ ['updatedAt', 'DESC'] ], 
                raw: true 
            });
            return statements
        }
    },

    Mutation: {
        async deposit(_, { amount }, context){
            const auth = context.user.data
            if(!auth){
                throw new Error('Not authenticated');
            }

            const account = await models.Account.findOne({
                where: {
                    user_id: auth.user_id
                }
            })

            if(!account){
                throw new Error('User does not have an account');
            }
            const balance = Number(account.available_balance);
            const deposit_account = await account.update({
                available_balance: Number(account.available_balance) + Number(amount)
            });
            
            const transaction = await models.Transaction.create({
                user_id: auth.user_id,
                account_id: account.id,
                amount: amount,
                prev_balance: balance,
                new_balance: deposit_account.available_balance,
                type: "DEPOSIT",
                status: 'SUCCESS'
            })

            return transaction
        },

        async withdrawal(_, { amount }, context) {
            const auth = context.user.data
            if(!auth){
                throw new Error('Not authenticated');
            }
            
            const account = await models.Account.findOne({
                where: {
                    user_id: auth.user_id
                }
            })

            if(!account){
                throw new Error('User does not have an account');
            }
            const balance = Number(account.available_balance);

            if((balance - amount) < 0){
                throw new Error('Insufficient balance');

            }

            const deposit_account = await account.update({
                available_balance: Number(account.available_balance) - Number(amount)
            });

            const transaction = await models.Transaction.create({
                user_id: auth.user_id,
                account_id: account.id,
                amount: amount,
                prev_balance: balance,
                new_balance: deposit_account.available_balance,
                type: "WITHDRAWAL",
                status: 'SUCCESS'
            });

            return transaction

        }
    }
}

module.exports = accountResolvers