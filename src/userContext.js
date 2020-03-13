import { createContext } from 'react'

const userContext = createContext({
  name: '',
  email: ''
});

export default userContext;