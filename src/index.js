
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./modules/typedefs');
const resolvers= require('./modules/resolvers');
const getUser = require('./utils/getUser');

  const server = new ApolloServer({

    typeDefs: typeDefs,
    resolvers: resolvers,
    context: ({ req }) => {
      const user = getUser(req);
      return { user }
    }

  });

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });