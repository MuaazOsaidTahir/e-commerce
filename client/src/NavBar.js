import React, { useEffect, useRef, useState } from "react";
import "./NavBar.css";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import { useQuery } from "react-query";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

function NavBar() {
  const classes = useStyles();
  const selector = useSelector((store) => store.products);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [toggle, settoggle] = useState(false);
  const header = useRef(null)
  const [categoriestoggle, setcategoriestoggle] = useState(false)
  const { data } = useQuery("categories", async () => {
    const res = await fetch("https://fakestoreapi.com/products/categories");
    return await res.json()
  })

  const signOut = async () => {
    const res = await fetch("/signout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    dispatch({ type: "SIGN_OUT", payload: data.data });
  };

  const togglefunction = () => {
    header.current.focus();
    settoggle(true)
  }

  return (
    <div ref={header} className="header">
      <button onClick={togglefunction} className="sidebar-toggle">
        <MenuIcon />
      </button>
      <aside onBlur={() => settoggle(false)} onFocus={() => {
        settoggle(true)
      }} className={toggle ? "sidebar show-sidebar" : "sidebar"}>
        <div className="sidebar-header">
          <Link to="/" >
            <img
              src="http://pngimg.com/uploads/amazon/amazon_PNG11.png"
              className="logo"
              alt="logo"
            />
          </Link>
          <button onClick={() => settoggle(false)} className="close-btn">
            <CloseIcon />
          </button>
        </div>
        <div className="basket_container" >
          {user ? (
            <div className={classes.root}>
              <Avatar> {user.name.charAt(0)} </Avatar> <h3>Hello {user.name}</h3>
            </div>
          ) : (
            <h3>No User SignedIn </h3>
          )}
          <Link to="/checkout">
            <div className="basket__number" >
              <strong> {selector.length} </strong> <ShoppingCartIcon />
            </div>
          </Link>
        </div>
        {user ?
          <>
            <ul className="links">
              <>
                <li>
                  <Link to="/"> home </Link>
                </li>
                <li>
                  <Link to={`/history/${user.id || user._id}`} >History</Link>
                </li>
                <li className="category__btn" >
                  <button onClick={() => setcategoriestoggle(!categoriestoggle)} >Catogories  {categoriestoggle ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}</button>
                </li>
                <ul className={categoriestoggle ? "categories_bar__toggle categories_bar" : "categories_bar"} >
                  {
                    data?.map(ctg => {
                      return <li className="categories__link" key={ctg} >
                        <Link to={`/category/${ctg}`} > {ctg} </Link>
                      </li>
                    })
                  }
                </ul>
              </>
            </ul>
            <button className="sidebar__loginbtn" > SignOut </button>
          </>
          :
          <Link to="/login" >
            <button className="sidebar__loginbtn" > LogIn </button>
          </Link>
        }
      </aside>
    </div >
  );
}

export default NavBar;
