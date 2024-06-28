const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 4000;
app.use('/graphql',graphqlHTTP({
    graphiql: true,
    schema
}));

mongoose.connect(`mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@cluster0.iiyve1i.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority&appName=Cluster0`,
    {useNewUrlParser: true, useUnifiedTopology:true}
).then(()=>{
    app.listen({port:port}, () => {
        console.log('Listening for request on my awesome port ' + port);
    })
}).catch((e)=>{
    console.log("Error : "+e)
})