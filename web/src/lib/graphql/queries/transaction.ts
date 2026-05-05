import { gql } from "@apollo/client";

export const GET_ALL_TRANSACTIONS = gql`
  query GetAllTransactions($page: Int, $pageSize: Int, $search: String, $type: TransactionType, $categoryId: String) {
    transactions(page: $page, pageSize: $pageSize, search: $search, type: $type, categoryId: $categoryId) {
      items {
        id
        description
        amount
        date
        type
        category {
          id
          title
          icon
          color
        }
      }
      totalCount
    }
  }
`

export const GET_TRANSACTION_BY_ID = gql`
  query GetTransactionById($transactionId: String!) {
    transaction(transactionId: $transactionId) {
      id
      description
      amount
      date
      type
      categoryId
    }
  }
`