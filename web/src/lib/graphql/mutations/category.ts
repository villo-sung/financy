import { gql } from "graphql-tag"

export const CREATE_CATEGORY = gql`
	mutation CreateCategory($request: CategoryInput!) {
		createCategory(request: $request) {
			title
			description
			color
			icon
		}
	}
`

export const UPDATE_CATEGORY = gql`
	mutation UpdateCategory($categoryId: String!, $request: CategoryInput!) {
		updateCategory(categoryId: $categoryId, request: $request) {
			title
			description
			color
			icon
		}
	}
`

export const DELETE_CATEGORY = gql`
	mutation DeleteCategory($categoryId: String!) {
		deleteCategory(categoryId: $categoryId) {
			id
		}
	}
`