import { BrowserRouter, Routes, Route } from 'react-router'
import Login from './paginas/Login/Login'
import CadastroUsuario from './paginas/CadastroUsuario/CadastroUsuario'
import CadastroEvento from './paginas/CadastroEvento/CadastroEvento'
import UsuarioLayout from './componentes/UsuarioLayout/UsuarioLayout'
import EsqueciSenha from './paginas/EsqueciSenha/EsqueciSenha'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UsuarioLayout />}>
          <Route path='login' element={<Login />}/>
          <Route path='cadastro' element={<CadastroUsuario />}/>
          <Route path='esqueci-senha' element={<EsqueciSenha />}/>
        </Route>
        <Route path='criar-evento' element={<CadastroEvento />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App