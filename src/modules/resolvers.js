const authResolver = require('./auth/resolvers');
const accountResolver = require('./account/resolver');

module.exports = [ authResolver, accountResolver ]