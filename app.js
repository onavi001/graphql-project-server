const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const type_chema = require('./schema/types_schema')
const app = express();

app.use('/graphql',graphqlHTTP({
    graphiql: true,
    schema:type_chema,
    
}))

app.listen(4000, () => {
    console.log('Listening for request on my awesome port 4000');
})