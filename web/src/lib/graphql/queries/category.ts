import { gql } from "@apollo/client";

export const GET_CATEGORY_BY_ID = gql`
  query GetCategoryById($categoryId: String!) {
    category(categoryId: $categoryId) {
      id
      title
      description
      icon
      color
    }
  }
`

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    categories {
      items {
        id
        title
        description
        icon
        color
        transactionsCount
      }
      totalCategoriesCount
      totalTransactionsCount
      mostUsedCategory {
        id
        title
        icon
        color
      }
    }
  }
`;