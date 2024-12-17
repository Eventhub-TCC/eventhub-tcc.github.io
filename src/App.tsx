import Login from './paginas/Login/Login'
import { BrowserRouter, Routes, Route } from 'react-router'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='login' element={<Login />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App