import { ApolloClient, ApolloLink, CombinedGraphQLErrors, HttpLink, InMemoryCache, Observable } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ErrorLink, } from "@apollo/client/link/error";

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_BACKEND_URL}/graphql`
})

const errorLink = new ErrorLink((params) => {
  const { error, operation, forward } = params as any;

  if (CombinedGraphQLErrors.is(error)) {
    for (const err of error.errors) {
      if (err.message === 'Unauthorized') {
        const authStorage = localStorage.getItem('auth-storage')
        const parsed = authStorage ? JSON.parse(authStorage) : null
        const refreshToken = parsed?.state?.refreshToken

        if (refreshToken) {
          return new Observable((observer) => {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/graphql`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                query: 'mutation($token:String!){refreshToken(token:$token){token,refreshToken}}',
                variables: { token: refreshToken },
              }),
            })
              .then(res => res.json())
              .then(res => {
                const { token, refreshToken: newRefresh } = res.data.refreshToken

                parsed.state.token = token
                parsed.state.refreshToken = newRefresh
                localStorage.setItem('auth-storage', JSON.stringify(parsed))

                operation.setContext(({ headers = {} }: any) => ({
                  headers: { ...headers, Authorization: `Bearer ${token}` }
                }))

                forward(operation).subscribe(observer)
              })
              .catch(() => {
                localStorage.removeItem('auth-storage')
                window.location.href = '/login'
              })
          })
        }

        localStorage.removeItem('auth-storage')
        window.location.href = '/login'
      }
    }
  }
})

const authLink = setContext((_, { headers }) => {
  const authStorage = localStorage.getItem('auth-storage')
  let token = null

  if (authStorage) {
    const parsedStorage = JSON.parse(authStorage)
    token = parsedStorage.state?.token
  }

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    }
  }
})

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache()
})