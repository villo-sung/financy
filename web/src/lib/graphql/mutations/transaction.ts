import { gql } from "graphql-tag"

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($request: TransactionInput!) {
    createTransaction(request: $request) {
      description
      amountInCents
      date
      type
      categoryId
    }
  }
`

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($transactionId: String!, $request: TransactionInput!) {
    updateTransaction(transactionId: $transactionId, request: $request) {
      description
      amount
      date
      type
      categoryId
    }
  }
`

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($transactionId: String!) {
    deleteTransaction(transactionId: $transactionId) {
      id
    }
  }
`