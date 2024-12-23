import Login from './paginas/Login/Login'
import Cadastro from './paginas/CadastroUsuario/Cadastro'
import CadastroEvento from './paginas/CadastroEvento/CadastroEvento'
import { BrowserRouter, Routes, Route } from 'react-router'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='login' element={<Login />}/>
          <Route path= 'cadastro' element={<Cadastro />}/>
          <Route path='criar-evento' element={<CadastroEvento />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App