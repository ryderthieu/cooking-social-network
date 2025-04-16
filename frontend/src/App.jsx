import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Register from './pages/Auth/Register'
import Login from './pages/Auth/Login'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Register /> */}
      <Login />
    </>
  )
}

export default App
