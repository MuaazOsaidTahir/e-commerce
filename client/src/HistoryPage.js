import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { useParams } from 'react-router'
import { historySearch } from './GraphQL/gqlquery'
import moment from "moment"
import "./HistoryPage.css"
import Loading from './Loading'
import HistoryProducts from './HistoryProducts'

function HistoryPage() {
    const [date, setdate] = useState("");
    const [formattedDate, setformattedDate] = useState("")
    const { userId } = useParams();

    const { data, loading, error } = useQuery(historySearch, {
        variables: {
            date: formattedDate,
            id: userId
        }
    })

    const settingdate = (e) => {
        const { value } = e.target
        let a = moment(value).format("MMM Do YY")

        setdate(value);

        setformattedDate(a);
    }

    return (
        <div className="HistoryPage" >
            <div className="historypage__top" >
                <h3>User Shopping History</h3>
                <input type="date" value={date} onChange={settingdate} />
            </div>
            {
                loading ?
                    <Loading /> :
                    <div>
                        <p> Orders for: {formattedDate} </p>
                        {
                            data.getHistory.length ?
                                data.getHistory.map((eachObj, i) => {
                                    return <HistoryProducts key={i} products={eachObj.products} ttamount={eachObj.totalPrice} />
                                }) :
                                formattedDate && data.getHistory.length === 0 ?
                                    <h1>No Orders for {formattedDate}</h1> :
                                    <h1>Select Date to see the order for</h1>
                        }
                    </div>
            }
        </div>
    )
}

export default HistoryPage
