import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { QueryClient, QueryClientProvider } from 'react-query'

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql?',
  cache: new InMemoryCache(),
  credentials: 'include'
});

const queryClient = new QueryClient();

const store = createStore(reducers, compose(applyMiddleware(thunk)))

ReactDOM.render(
  <QueryClientProvider client={queryClient} >
    <Provider store={store} >
      <ApolloProvider client={client} >
        <App />
      </ApolloProvider>
    </Provider>
  </QueryClientProvider>,
  document.getElementById('root')
);
