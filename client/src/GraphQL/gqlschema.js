import { gql } from "@apollo/client";

const signupuser = gql`
mutation signupUser($name: String!, $email: String!, $password: String!) {
    signupUser(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`

const loginuserin = gql`
mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password){
      name
      email
      id
    }
  }
`


export { signupuser, loginuserin }