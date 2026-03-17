import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Layout from './components/layout/Layout'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Layout children={undefined} setActiveVM={function (vm: string): void {
        throw new Error('Function not implemented.')
      }} />
    </>
  )
}

export default App
