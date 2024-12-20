import Login from './paginas/Login_m/Login'
import Cadastro from './paginas/Cadastro/Cadastro'
import { BrowserRouter, Routes, Route } from 'react-router'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='login' element={<Login />}/>
          <Route path= 'cadastro' element={<Cadastro />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App