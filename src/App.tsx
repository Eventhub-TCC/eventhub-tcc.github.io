import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Routes, Route } from 'react-router'
import Login from './paginas/Login/Login'
import CadastroUsuario from './paginas/CadastroUsuario/CadastroUsuario'
import CadastroEvento from './paginas/CadastroEvento/CadastroEvento'
import UsuarioLayout from './componentes/UsuarioLayout/UsuarioLayout'
import EsqueciSenha from './paginas/EsqueciSenha/EsqueciSenha'
import RedefinirSenha from './paginas/RedefinirSenha/RedefinirSenha'
import Erro404 from './paginas/Erro404/Erro404'
import MeuPerfil from './paginas/MeuPerfil/MeuPerfil'
import OrganizadorLayout from './componentes/OrganizadorLayout/OrganizadorLayout'
import ProtecaoDeRota from './paginas/ProtecaoDeRota'
import MeusEventos from './paginas/MeusEventos/MeusEventos'
import InformacoesMeusEventos from './paginas/InformacoesMeusEventos/InformacoesMeusEventos'
import ConfirmarPresenca from './paginas/ConfirmarPresenca/ConfirmarPresenca'
import Convidados from './paginas/Convidados/Convidados'
import Convites from './paginas/Convites/Convites'
import PrestadorLayout from './componentes/PrestadorLayout/PrestadorLayout'
import MeusServicos from './paginas/MeusServicos/MeusServicos'
import CadastroServico from './paginas/CadastroServico/CadastroServico'
import InformacoesServico from './paginas/InformacoesServico/InformacoesServico'
import CarrinhoDeCompras from './paginas/CarrinhoDeCompras/CarrinhoDeCompras'
import Pedidos from './paginas/Pedidos/Pedidos'
import Marketplace from './paginas/Marketplace/Marketplace'
import InformacoesPedido from './paginas/InformacoesPedido/InformacoesPedido'
import ServicoMarketplace from './paginas/ServicoMarketplace/ServicoMarketplace'
import PoliticasTermos from './paginas/PoliticasTermos/PoliticasTermos'

const App = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<UsuarioLayout />}>
            <Route path='login' element={<Login />}/>
            <Route path='cadastro' element={<CadastroUsuario />}/>
            <Route path='esqueci-senha' element={<EsqueciSenha />}/>
            <Route path='redefinir-senha' element={<RedefinirSenha />}/>
            <Route path='*' element={<Erro404 />}/>
          </Route>
          <Route path='politicas-e-termos' element={<PoliticasTermos/>}/>
          <Route element={<ProtecaoDeRota />}>
            <Route path='organizador' element={<OrganizadorLayout />}>
              <Route path='criar-evento' element={<CadastroEvento />}/>
              <Route path='meu-perfil' element={<MeuPerfil />}/>
              <Route path="meus-eventos" element={<MeusEventos />} />
              <Route path='meus-eventos/:idEvento/informacoes-meus-eventos' element={<InformacoesMeusEventos />}/>
              <Route path="meus-eventos/:idEvento/convidados" element={<Convidados/>} />
              <Route path="meus-eventos/:idEvento/convites" element={<Convites/>} />
              <Route path='pedidos' element={<Pedidos tipo='organizador' />}/>
              <Route path='pedidos/:idPedido/informacoes-pedido' element={<InformacoesPedido />}/>
            </Route>
            <Route path='marketplace' element={<OrganizadorLayout />}>
              <Route index element={<Marketplace />}/>
              <Route path='servico/:idServico' element={<ServicoMarketplace />}/>
              <Route path='carrinho' element={<CarrinhoDeCompras />}/>
            </Route>
            <Route path='prestador' element={<PrestadorLayout />}>
              <Route path='meu-perfil' element={<MeuPerfil />}/>
              <Route path='meus-servicos' element={<MeusServicos />}/>
              <Route path='criar-servico' element={<CadastroServico />}/>
              <Route path='meus-servicos/:idServico/informacoes-meus-servicos' element={<InformacoesServico />}/>
            </Route>
          </Route>
          <Route path='Confirmar-presenca/:idConvite' element={<ConfirmarPresenca/>}/>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App