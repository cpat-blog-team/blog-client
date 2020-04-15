import { createContext } from 'react'

const userContext = createContext({
  roles: {},
  name: '',
  email: ''
});

export default userContext;