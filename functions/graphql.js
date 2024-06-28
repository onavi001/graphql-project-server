const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schema/schema');
const mongoose = require('mongoose');

const app = express();

const connectToDatabase = async () => {
  await mongoose.connect(`mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@cluster0.iiyve1i.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority&appName=Cluster0`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

let isConnected;

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!isConnected) {
    await connectToDatabase();
    isConnected = mongoose.connection.readyState;
  }

  app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema
  }));

  return new Promise((resolve, reject) => {
    app.handle(event, context, (err, response) => {
      if (err) reject(err);
      else resolve(response);
    });
  });
};

exports.handler = handler;
