import { createContext } from 'react'

const userContext = createContext({
  scopes: {},
  name: '',
  email: ''
});

export default userContext;