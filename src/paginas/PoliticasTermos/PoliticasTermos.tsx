import { Helmet } from 'react-helmet-async'
import CabecalhoUsuario from '../../componentes/CabecalhoUsuario/CabecalhoUsuario'
import './PoliticasTermos.css'

const PoliticasTermos = () => {
  return (
    <>
        <Helmet>
          <title>Políticas e Termos | EventHub</title>
        </Helmet>
    <div className='politicas-termos__pagina'>
        <div>
            <CabecalhoUsuario/>
            <div className="politicas-termos__topo">
                <div className="politicas-termos">
                    POLÍTICAS E TERMOS DA PLATAFORMA
                </div>
            </div>
        </div>
        <div className="politicas-termos__conteudo">
            <div className='politicas-termos__container'>
                <div className="politicas-termos__cabecalho">
                    <div className="politicas-termos__atualizacoes">
                        Última atualização: 09 de junho de 2025
                    </div>
                    <div className="politicas-termos__titulo">
                        Termo de Consentimento Livre e Esclarecido (TCLE)
                    </div>
                </div>
                <div className="politicas-termos__topicos">
                    <div className="politicas-termos__textos">
                    {'Você está sendo convidado(a) a utilizar a plataforma EventHub, que tem como objetivo facilitar a organização de eventos e a contratação de serviços para esses eventos.\n\nA sua participação é voluntária, e sua privacidade e segurança são prioridades para nós.\n\nAo aceitar este termo, você declara estar ciente de que:\n\n'}
                    </div>
                    <div className="politicas-termos__topico">
                        <div className="politicas-termos__topico-titulo">1. Finalidade da Coleta de Dados:</div>
                        <div className="politicas-termos__textos">
                            Seus dados pessoais (como nome, e-mail, CPF, telefone, entre outros) serão coletados para fins de autenticação, personalização de serviços, gestão de convites, contratos de serviço e geração de relatórios para os organizadores dos eventos.
                        </div>
                    </div>
                    <div className="politicas-termos__topico">
                        <div className="politicas-termos__topico-titulo">2. Uso e Compartilhamento:</div>
                        <div className="politicas-termos__textos">
                            Os dados fornecidos poderão ser acessados apenas pelos administradores da plataforma. Nenhum dado será comercializado ou compartilhado com terceiros.
                        </div>
                    </div>
                    <div className="politicas-termos__topico">
                        <div className="politicas-termos__topico-titulo">3. Segurança da Informação:</div>
                        <div className="politicas-termos__textos">
                            As senhas serão protegidas por meio de criptografia e autenticação segura.                </div>
                    </div>
                    <div className="politicas-termos__topico">
                        <div className="politicas-termos__topico-titulo">4. Sigilo e Confidencialidade:</div>
                        <div className="politicas-termos__textos">
                            Todos os dados serão mantidos sob sigilo, sendo utilizados apenas para os fins descritos neste termo.                </div>
                    </div>
                    <div className="politicas-termos__topico">
                        <div className="politicas-termos__topico-titulo">5. Direito de Revogação:</div>
                        <div className="politicas-termos__textos">
                            Você pode, a qualquer momento, solicitar a exclusão física de seus dados da plataforma ou revogar este consentimento, bastando entrar em contato com o suporte técnico da EventHub.                </div>
                    </div>
                </div>
            </div>
            <div className='politicas-termos__container'>
                <div className="politicas-termos__cabecalho">
                    <div className="politicas-termos__atualizacoes">
                        Última atualização: 09 de junho de 2025
                    </div>
                    <div className="politicas-termos__titulo">
                        POLITICAS DE PRIVACIDADE
                    </div>
                </div>
                <div className="politicas-termos__topicos">
                    <div className="politicas-termos__textos">
                        Na EventHub, levamos sua privacidade a sério.                
                    </div>
                    <div className="politicas-termos__topico">
                        <div className="politicas-termos__topico-titulo">1. Coleta de Dados:</div>
                        <div className="politicas-termos__textos">
                            Coletamos apenas os dados estritamente necessários para oferecer os serviços da plataforma, como nome, e-mail, CPF, telefone e informações de eventos.                    </div>
                    </div>
                    <div className="politicas-termos__topico">
                        <div className="politicas-termos__topico-titulo">2. Uso dos Dados:</div>
                        <div className="politicas-termos__textos">
                            Seus dados são utilizados única e exclusivamente para a operação do sistema, envio de comunicações, confirmação de participação em eventos e geração de relatórios.                    </div>
                    </div>
                    <div className="politicas-termos__topico">
                        <div className="politicas-termos__topico-titulo">3. Armazenamento e Segurança:</div>
                        <div className="politicas-termos__textos">
                            Utilizamos métodos seguros de autenticação para garantir que apenas pessoas autorizadas tenham acesso às informações. Suas dados estão protegidos com práticas modernas de segurança digital, preservando sua privacidade e confidencialidade.                </div>
                    </div>
                    <div className="politicas-termos__topico">
                        <div className="politicas-termos__topico-titulo">4. Alterações:</div>
                        <div className="politicas-termos__textos">
                            Esta política poderá ser atualizada periodicamente para refletir alterações em nossas práticas ou em conformidade com requisitos legais. Quando modificações relevantes forem realizadas, o usuário será notificado por e-mail, e a versão mais recente estará sempre disponível na plataforma para consulta.               </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default PoliticasTermos