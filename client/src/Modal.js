import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from "./Loading"
import { AES } from 'crypto-js';


function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function ModalComponent({ toggle, toggling }) {
    const classes = useStyles();
    const history = useHistory();
    const [modalStyle] = React.useState(getModalStyle);
    const user = useSelector(store => store.user)
    const products = useSelector(store => store.products)
    const [loader, setloader] = useState(false)

    useEffect(() => {
        if (!user && toggle) {
            history.push("/login")
        }
    }, [toggle])

    const handleClose = () => {
        toggling(false);
    };

    const stripeCheckOut = async () => {
        setloader(true)
        const decodedCode = encodeURIComponent((AES.encrypt(JSON.stringify(true), "muaazosaidtahir")).toString())
        const res = await fetch("/create-checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                products,
                decodedCode
            })
        })

        const data = await res.json();
        setloader(false)
        window.location = data.url
    }

    return (
        <div>
            <Modal
                open={toggle}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div style={modalStyle} className={classes.paper}>
                    {
                        !loader ?
                            <><h3>Select Your Payment Method</h3>
                                <div className="checkouts_btns" >
                                    <button
                                        onClick={stripeCheckOut}
                                        className="stripe__btn" > Pay With Stripe </button>
                                </div>
                            </>
                            :
                            <Loading />
                    }
                </div>
            </Modal >
        </div >
    )
}

export default ModalComponent
