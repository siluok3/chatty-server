import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { ApolloProvider } from 'react-apollo';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createHttpLink } from 'apollo-link-http';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { ReduxCache, apolloReducer } from 'apollo-cache-redux';
import ReduxLink from 'apollo-link-redux';

import AppWithNavigationState, {
  navigationReducer,
  navigationMiddleware,
} from "./src/navigation";

const URL = 'localhost:8080';
//Create a Redux store that holds the complete tree of my app
//There should be only a single store in my app
//Use of combineReducers to create a single root reducer out of many
const store = createStore(
  combineReducers({
      apollo: apolloReducer,
      nav: navigationReducer,
  }),
  {}, //initial state
  composeWithDevTools(
      applyMiddleware(navigationMiddleware),
  ),
);
//Set apollo's client data store(cache) to Redux
const cache = new ReduxCache({store});

const reduxLink = new ReduxLink(store);
//Connect Apollo client to our GraphQL endpoint
const httpLink = createHttpLink({ uri: `http://${URL}/graphql` });
//Connect Redux to our Apollo workflow(let us track Apollo events as Redux actions)
const link = ApolloLink.from([
    reduxLink,
    httpLink,
]);

export const client = new ApolloClient({
    link,
    cache,
});

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

//type Props = {};
export default class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Provider store={store}>
          <AppWithNavigationState />
        </Provider>
      </ApolloProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
