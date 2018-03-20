import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import bodyParser from 'body-parser';
import { createServer } from 'http';

import Resolvers from './data/resolvers';
import  Schema  from './data/schema';
import  Mocks  from './data/mocks';

const GRAPHQL_PORT = 8080;

const app = express();

const executableSchema = makeExecutableSchema({
    typeDefs: Schema,
    resolvers: Resolvers,
});

app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress({
        schema: executableSchema,
    })
);
//Middleware to interact in UI , it only renders the UI
app.use(
    '/graphiql',
    graphiqlExpress({
        endpointURL: '/graphql',
    })
);

const graphQLServer = createServer(app);

graphQLServer.listen(GRAPHQL_PORT, () => console.log(`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`));