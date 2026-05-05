import { gql } from "@apollo/client";

export const GET_SUMMARY = gql`
  query Dashboard {
    dashboard {
      totalAmount
      monthExpensesAmount
      monthRevenuesAmount
      categories {
        id
        title
        icon
        color
        transactionsCount
        transactionsAmount
      }
      recentTransactions {
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
    }
  }
`