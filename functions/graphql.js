const { ApolloServer, gql } = require('apollo-server-lambda');
const mongoose = require('mongoose');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schema/schema');

const connectToDatabase = () => {
  return mongoose.connect(`mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@cluster0.iiyve1i.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority&appName=Cluster0`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

const server = new ApolloServer({
  schema,
  graphiql: true
});

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (!mongoose.connection.readyState) {
    await connectToDatabase();
  }
  const expressApp = express();
  expressApp.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
  }));
  return server.createHandler()(event, context);
};

exports.handler = handler;
