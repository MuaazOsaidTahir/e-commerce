import { gql } from "@apollo/client";

export const historySearch = gql`
query ($date: String!, $id: String!) {
    getHistory(date: $date, id: $id){
      totalPrice
      products{
        id
        title
        image
        price
        quantity
      }
    }
  }
`
export const getloggedinUser = gql`
{
  getloggedinUser{
    id
    name
    email
  }
}
`