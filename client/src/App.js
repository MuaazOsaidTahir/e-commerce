import './App.css';
import HomePage from './HomePage';
import NavBar from './NavBar';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import CheckoutPage from './CheckoutPage';
import ProductDetails from './ProductDetails';
import CategoryPage from './CategoryPage';
import LogIn from './LogIn';
import { useDispatch, useSelector } from 'react-redux';
import HistoryPage from './HistoryPage';
import { useEffect } from 'react';
import Loading from './Loading';
import Success from './Success';
import io from "socket.io-client";
import { useQuery } from '@apollo/client';
import { getloggedinUser } from './GraphQL/gqlquery';

let socket;

function App() {
  const dispatch = useDispatch()
  const user = useSelector(store => store.user)
  const { data, loading, error } = useQuery(getloggedinUser)

  useEffect(() => {
    if (data) {
      dispatch({ type: "ADD_USER", payload: data.getloggedinUser })
    }
  }, [data])

  useEffect(() => {
    if (user) {
      socket = io("http://localhost:8000");

      dispatch({ type: "ADD_SOCKET", payload: socket })
    }
  }, [user])

  if (loading) return <Loading />

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/checkout" >
            <NavBar />
            <CheckoutPage />
          </Route>
          <Route exact path="/product/:productid" >
            <NavBar />
            <ProductDetails />
          </Route>
          <Route exact path="/category/:category" >
            <NavBar />
            <CategoryPage />
          </Route>
          <Route exact path="/login" >
            <LogIn toggle={true} />
          </Route>
          <Route exact path="/register" >
            <LogIn />
          </Route>
          <Route exact path="/history/:userId" >
            <NavBar />
            <HistoryPage />
          </Route>
          <Route exact path="/success/:sessionId" >
            <NavBar />
            <Success />
          </Route>
          <Route exact path="/" >
            <NavBar />
            <HomePage />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
