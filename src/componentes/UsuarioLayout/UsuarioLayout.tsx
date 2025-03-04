import { Outlet } from "react-router"
import CabecalhoUsuario from "../CabecalhoUsuario/CabecalhoUsuario"
import "./UsuarioLayout.css"

const UsuarioLayout = () => {
  return (
    <div className="usuario-layout">
      <CabecalhoUsuario />
      <main className="usuario-layout__conteudo">
        <Outlet />
      </main>
    </div>
  )
}

export default UsuarioLayout